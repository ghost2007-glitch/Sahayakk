import React, { useEffect, useRef } from 'react';
import { Mic, X, Check } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { SUPPORTED_LANGUAGES } from '../../lib/speech/languages';

interface VoiceRecordingScreenProps {
  time: number;
  mediaStream: MediaStream | null;
  finalTranscript: string;
  interimTranscript: string;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onCancel: () => void;
  onFinish: () => void;
  error?: string | null;
  isSupported: boolean;
}

const VoiceRecordingScreen: React.FC<VoiceRecordingScreenProps> = ({
  time,
  mediaStream,
  finalTranscript,
  interimTranscript,
  selectedLanguage,
  onLanguageChange,
  onCancel,
  onFinish,
  error,
  isSupported
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const transcriptScrollRef = useRef<HTMLDivElement>(null);

  // Formatting time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [finalTranscript, interimTranscript]);

  useEffect(() => {
    if (!mediaStream) return;

    // Initialize Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64; 
    analyser.smoothingTimeConstant = 0.8;
    analyserRef.current = analyser;

    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Adjust for device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const renderFrame = () => {
          if (!analyserRef.current || !dataArrayRef.current || !ctx || !canvas) return;
          
          analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
          
          ctx.clearRect(0, 0, rect.width, rect.height);
          
          const barWidth = 6;
          const gap = 4;
          const totalBars = Math.floor(rect.width / (barWidth + gap));
          
          const centerY = rect.height / 2;
          
          for (let i = 0; i < totalBars; i++) {
            const dataIndex = Math.floor((i / totalBars) * (bufferLength / 1.5));
            const value = dataArrayRef.current[dataIndex] || 0;
            
            const percent = value / 255;
            const height = Math.max(4, percent * (rect.height - 8));
            
            const x = i * (barWidth + gap);
            const y = centerY - (height / 2);
            
            ctx.fillStyle = '#2563EB'; // Primary blue
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, 3);
            ctx.fill();
          }

          requestRef.current = requestAnimationFrame(renderFrame);
        };
        
        requestRef.current = requestAnimationFrame(renderFrame);
      }
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [mediaStream]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FAFAFA',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100dvh',
      boxSizing: 'border-box',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 20px', 
        minHeight: '48px',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mic size={20} color="#3B82F6" /> Sahayak
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#4B5563', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(time)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '16px 20px', 
        gap: '24px', 
        maxWidth: '600px', 
        margin: '0 auto', 
        width: '100%', 
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Recording Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px', flexShrink: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#3B82F6', letterSpacing: '1px', marginBottom: '16px' }}>
            LISTENING TO YOU
          </div>
          <div style={{ height: '80px', width: '100%', maxWidth: '300px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <canvas 
              ref={canvasRef} 
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div style={{ fontSize: '15px', color: '#6B7280', marginTop: '16px' }}>
            Speak naturally...
          </div>
        </div>

        {/* Live transcription area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #BFDBFE',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #EFF6FF', 
            backgroundColor: '#F8FAFC', 
            fontSize: '12px', 
            fontWeight: 600, 
            color: '#64748B', 
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            LIVE TRANSCRIPTION · {SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage)?.name || 'ENGLISH'}
          </div>
          
          <div 
            ref={transcriptScrollRef}
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              scrollBehavior: 'smooth'
            }}
          >
            {(!finalTranscript && !interimTranscript) ? (
              <div style={{ fontSize: '20px', color: '#9CA3AF', fontWeight: 400, lineHeight: 1.5 }}>
                Start speaking. Your words will appear here.
              </div>
            ) : (
              <div style={{ fontSize: '20px', color: '#111827', fontWeight: 400, lineHeight: 1.5 }}>
                <span>{finalTranscript}</span>
                {interimTranscript && (
                  <span style={{ color: '#6B7280' }}> {interimTranscript}</span>
                )}
                <span style={{ display: 'inline-block', width: '2px', height: '20px', backgroundColor: '#3B82F6', marginLeft: '4px', animation: 'blink 1s step-end infinite', verticalAlign: 'middle' }} />
              </div>
            )}

            {error && (
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                <p style={{ margin: 0, color: '#991B1B', fontSize: '14px', fontWeight: 500 }}>
                  {error}
                </p>
                {!isSupported && (
                  <p style={{ margin: '4px 0 0', color: '#B91C1C', fontSize: '13px' }}>
                    Live transcription is unavailable. You can still record audio.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recording Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '40px', 
          padding: '8px 0 24px 0', 
          flexShrink: 0 
        }}>
          <button
            onClick={onCancel}
            aria-label="Cancel"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              border: 'none',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
          >
            <X size={28} />
          </button>

          <button
            onClick={onFinish}
            aria-label="Finish"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
          >
            <Check size={28} />
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default VoiceRecordingScreen;
