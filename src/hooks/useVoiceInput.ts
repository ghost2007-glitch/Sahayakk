import { useState, useRef, useEffect, useCallback } from 'react';
import { webSpeechProvider } from '../lib/speech/WebSpeechProvider';
import { Capacitor } from '@capacitor/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { supabase } from '../lib/supabase';

export interface UseVoiceInputResult {
  isRecording: boolean;
  transcript: string;
  finalTranscript: string;
  interimTranscript: string;
  error: string | null;
  recordingTime: number;
  isSupported: boolean;
  mediaStream: MediaStream | null;
  audioBlob: Blob | null;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => void;
  setTranscript: (val: string) => void;
}

export function useVoiceInput(): UseVoiceInputResult {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mimeType, setMimeType] = useState<string>('audio/webm');

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef('');
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  const isNative = Capacitor.isNativePlatform();
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = isNative || !!SpeechRecognition || typeof MediaRecorder !== 'undefined';

  const cleanup = useCallback(() => {
    setIsRecording(false);
    
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (!isNative && webSpeechProvider.isLiveSupported) {
      webSpeechProvider.stopLiveTranscription?.();
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      setActiveStream(null);
    }
  }, [isNative]);

  const transcribeWithBackend = async (base64Audio: string, mime: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sahayak-transcribe', {
        body: { audioBase64: base64Audio, mimeType: mime, language: selectedLanguage }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.transcript) {
        const txt = data.transcript;
        finalTranscriptRef.current += txt + ' ';
        setFinalTranscript(finalTranscriptRef.current.trim());
        setTranscript(finalTranscriptRef.current.trim());
      } else {
        setError('Empty recording or transcription failed.');
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio.');
    }
  };

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript('');
    setFinalTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    setRecordingTime(0);
    audioChunksRef.current = [];
    setAudioBlob(null);

    try {
      if (isNative) {
        // Native Voice Recorder
        const hasPerm = await VoiceRecorder.hasAudioRecordingPermission();
        if (!hasPerm.value) {
          const perm = await VoiceRecorder.requestAudioRecordingPermission();
          if (!perm.value) {
            setError('Microphone permission denied. Please enable in Settings.');
            cleanup();
            return;
          }
        }
        await VoiceRecorder.startRecording();
      } else {
        // Web MediaRecorder
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        setActiveStream(stream);

        let options = {};
        let selectedMimeType = '';
        if (typeof MediaRecorder !== 'undefined') {
          const types = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'];
          for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
              options = { mimeType: type };
              selectedMimeType = type;
              break;
            }
          }
        }
        if (selectedMimeType) setMimeType(selectedMimeType);

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorder.start(1000);

        if (webSpeechProvider.isLiveSupported) {
          webSpeechProvider.startLiveTranscription?.(
            { language: selectedLanguage },
            (text, isFinal) => {
              if (isFinal) {
                finalTranscriptRef.current += text + ' ';
                setFinalTranscript(finalTranscriptRef.current.trim());
                setInterimTranscript('');
                setTranscript(finalTranscriptRef.current.trim());
              } else {
                setInterimTranscript(text);
                setTranscript((finalTranscriptRef.current + text).trim());
              }
            },
            (err) => {
              console.warn('Live transcription warning/error:', err);
              if (err === 'permission-denied') {
                setError('Microphone permission denied.');
                cleanup();
              }
            }
          );
        }
      }

      setIsRecording(true);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Error starting recording', err);
      setError('Microphone permission denied or not available.');
      cleanup();
    }
  }, [cleanup, isNative, selectedLanguage]);

  const stopRecording = useCallback(async () => {
    cleanup();
    
    try {
      if (isNative) {
        const result = await VoiceRecorder.stopRecording();
        if (result.value && result.value.recordDataBase64) {
          await transcribeWithBackend(result.value.recordDataBase64, result.value.mimeType || 'audio/aac');
        } else {
          setError("Empty recording.");
        }
      } else {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          setAudioBlob(blob);
          
          if (!finalTranscriptRef.current.trim()) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
              const base64data = reader.result?.toString().split(',')[1];
              if (base64data) {
                await transcribeWithBackend(base64data, mimeType);
              }
            };
          }
        } else if (!finalTranscriptRef.current.trim()) {
          setError("Empty recording.");
        }
      }
    } catch (err: any) {
      console.error('Stop recording error:', err);
    }
  }, [cleanup, isNative, mimeType, selectedLanguage]);

  const cancelRecording = useCallback(async () => {
    if (isNative) {
      try {
        await VoiceRecorder.stopRecording();
      } catch (e) {
        // Ignore
      }
    }
    cleanup();
    setTranscript('');
    setFinalTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    audioChunksRef.current = [];
    setAudioBlob(null);
  }, [cleanup, isNative]);

  useEffect(() => {
    return () => {
      cancelRecording();
    };
  }, [cancelRecording]);

  return {
    isRecording,
    transcript,
    finalTranscript,
    interimTranscript,
    error,
    recordingTime,
    isSupported,
    mediaStream: activeStream,
    audioBlob,
    selectedLanguage,
    setSelectedLanguage,
    startRecording,
    stopRecording,
    cancelRecording,
    setTranscript: (val: string) => {
      setTranscript(val);
      setFinalTranscript(val);
      setInterimTranscript('');
      finalTranscriptRef.current = val + (val.endsWith(' ') || val === '' ? '' : ' ');
    }
  };
}

