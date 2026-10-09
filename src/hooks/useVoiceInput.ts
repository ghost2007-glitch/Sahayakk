import { useState, useRef, useEffect, useCallback } from 'react';
import { webSpeechProvider } from '../lib/speech/WebSpeechProvider';
import { SUPPORTED_LANGUAGES } from '../lib/speech/languages';

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

  // Check Web Speech API Support
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const cleanup = useCallback(() => {
    setIsRecording(false);
    
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (webSpeechProvider.isLiveSupported) {
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
  }, []);

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setActiveStream(stream);

      // Start MediaRecorder for capturing audio independently
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
      console.log('Selected MediaRecorder MIME type:', selectedMimeType || 'default');

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // chunk every second

      // Start live transcription if available
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
            } else if (err === 'not-supported') {
              // Ignore, rely on offline transcription later
            }
          }
        );
      }

      setIsRecording(true);
      
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Error accessing microphone', err);
      setError('Microphone permission denied or not available.');
      cleanup();
    }
  }, [cleanup, selectedLanguage]);

  const stopRecording = useCallback(async () => {
    cleanup();
    
    // Process audio blob
    if (audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      setAudioBlob(blob);
      console.log(`Recorded Blob size: ${blob.size}, MIME type: ${mimeType}`);

      // If we didn't get any live transcript, try post-transcription
      if (!finalTranscriptRef.current.trim() && webSpeechProvider.transcribe) {
        try {
          const text = await webSpeechProvider.transcribe(blob, { language: selectedLanguage });
          setTranscript(text);
        } catch (err: any) {
          setError(err.message || "Transcription unavailable. Future speech-to-text API required.");
        }
      }
    } else if (!finalTranscriptRef.current.trim()) {
      setError("Empty recording.");
    }

  }, [cleanup, selectedLanguage]);

  const cancelRecording = useCallback(() => {
    cleanup();
    setTranscript('');
    setFinalTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    audioChunksRef.current = [];
    setAudioBlob(null);
  }, [cleanup]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

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
