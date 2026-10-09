import React, { useEffect, useRef, useState } from 'react';
import { Mic, X, Check } from 'lucide-react';

interface VoiceRecordingIndicatorProps {
  time: number;
  mediaStream: MediaStream | null;
  statusText?: string;
  onCancel: () => void;
  onFinish: () => void;
}

const VoiceRecordingIndicator: React.FC<VoiceRecordingIndicatorProps> = ({ 
  time, 
  mediaStream, 
  statusText = 'Listening...',
  onCancel, 
  onFinish 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Formatting time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (!mediaStream) return;

    // Initialize Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64; // 32 frequency bins
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
        const renderFrame = () => {
          if (!analyserRef.current || !dataArrayRef.current || !ctx || !canvas) return;
          
          analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = 4;
          const gap = 4;
          const totalBars = Math.floor(canvas.width / (barWidth + gap));
          
          // Use center as baseline and mirror vertically
          const centerY = canvas.height / 2;
          
          for (let i = 0; i < totalBars; i++) {
            // Map the bar index to frequency data index
            // We use the lower frequencies more as human voice is concentrated there
            const dataIndex = Math.floor((i / totalBars) * (bufferLength / 1.5));
            const value = dataArrayRef.current[dataIndex] || 0;
            
            // Normalize value (0 to 255) to bar height
            const percent = value / 255;
            const height = Math.max(2, percent * (canvas.height - 4));
            
            const x = i * (barWidth + gap);
            const y = centerY - (height / 2);
            
            ctx.fillStyle = '#2563EB'; // Primary blue
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, 2);
            ctx.fill();
          }

          requestRef.current = requestAnimationFrame(renderFrame);
        };
        
        requestRef.current = requestAnimationFrame(renderFrame);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [mediaStream]);

  // Derive animation scale based on audio to make the mic button pulse slightly
  // A simple way without reacting states on every frame is CSS animation for the rings,
  // we'll rely purely on CSS for the mic pulse to avoid React renders.

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      padding: '16px',
      background: 'var(--color-surface)',
      borderRadius: '16px',
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
      gap: '16px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#EF4444',
            animation: 'pulse 1.5s infinite'
          }} />
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{statusText}</span>
        </div>
        <span style={{ color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {formatTime(time)}
        </span>
      </div>

      {/* Visualizer & Mic */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '16px 0',
        position: 'relative',
        height: '80px'
      }}>
        {/* Waveform Canvas */}
        <canvas 
          ref={canvasRef} 
          width={180} 
          height={60} 
          style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.8 }}
        />

        {/* Central Mic Button (Decorative) */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Expanding rings */}
          <div className="mic-ring" style={{ animationDelay: '0s' }} />
          <div className="mic-ring" style={{ animationDelay: '0.5s' }} />
          <div className="mic-ring" style={{ animationDelay: '1s' }} />
          
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#2563EB', // Primary blue
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <Mic size={24} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '8px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            color: 'var(--color-text-secondary)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          aria-label="Cancel recording"
        >
          <X size={16} /> Cancel
        </button>
        <button
          onClick={onFinish}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            color: '#1D4ED8',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          aria-label="Finish recording"
        >
          <Check size={16} /> Finish
        </button>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes ringExpand {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .mic-ring {
            position: absolute;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid #2563EB;
            animation: ringExpand 2s infinite cubic-bezier(0.25, 1, 0.5, 1);
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default VoiceRecordingIndicator;
