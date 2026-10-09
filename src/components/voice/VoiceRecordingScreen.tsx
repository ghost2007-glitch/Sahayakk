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
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 20px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827', letterSpacing: '-0.5px' }}>
          Sahayak
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#EF4444',
            animation: 'pulse 1.5s infinite'
          }} />
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#4B5563' }}>Listening...</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF', marginLeft: '4px', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(time)}
          </span>
        </div>
      </div>

      {/* Main Transcript Area */}
      <div 
        ref={transcriptScrollRef}
        style={{
          flex: 1,
          padding: '32px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          scrollBehavior: 'smooth'
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', letterSpacing: '0.5px', marginBottom: '16px' }}>
          LIVE TRANSCRIPTION
        </div>
        
        {(!finalTranscript && !interimTranscript) ? (
          <div style={{ fontSize: '24px', color: '#9CA3AF', fontWeight: 400, marginTop: '20px', lineHeight: 1.4 }}>
            Start speaking and your words will appear here...
          </div>
        ) : (
          <div style={{ fontSize: '28px', color: '#111827', fontWeight: 400, lineHeight: 1.4 }}>
            <span>{finalTranscript}</span>
            {interimTranscript && (
              <span style={{ color: '#6B7280' }}> {interimTranscript}</span>
            )}
            <span style={{ display: 'inline-block', width: '3px', height: '28px', backgroundColor: '#3B82F6', marginLeft: '4px', animation: 'blink 1s step-end infinite', verticalAlign: 'middle' }} />
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

      {/* Visualizer and Controls */}
      <div style={{ padding: '24px', backgroundColor: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Waveform Visualization */}
        <div style={{ height: '60px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <canvas 
            ref={canvasRef} 
            style={{ width: '100%', height: '100%', maxWidth: '400px' }}
          />
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              backgroundColor: '#F3F4F6',
              border: 'none',
              borderRadius: '16px',
              color: '#4B5563',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <X size={20} /> Cancel
          </button>

          {/* Central Mic Button (Decorative) */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="mic-ring" style={{ animationDelay: '0s' }} />
            <div className="mic-ring" style={{ animationDelay: '0.6s' }} />
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              zIndex: 10,
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
            }}>
              <Mic size={32} />
            </div>
          </div>

          <button
            onClick={onFinish}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '16px',
              color: '#1D4ED8',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <Check size={20} /> Finish
          </button>

        </div>
        
        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
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
          @keyframes ringExpand {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
          .mic-ring {
            position: absolute;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            border: 2px solid #3B82F6;
            animation: ringExpand 2s infinite cubic-bezier(0.25, 1, 0.5, 1);
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default VoiceRecordingScreen;
