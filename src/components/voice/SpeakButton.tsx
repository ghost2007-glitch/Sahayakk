import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Square } from 'lucide-react';

interface SpeakButtonProps {
  text: string;
  lang?: string;
  autoPlay?: boolean;
}

// Module-level tracking so only one utterance speaks at a time
let currentUtterance: SpeechSynthesisUtterance | null = null;

const SpeakButton: React.FC<SpeakButtonProps> = ({ text, lang, autoPlay }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current && currentUtterance === utteranceRef.current) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (!isSupported || !text) return;

    // Stop any currently playing speech (from this or other buttons)
    window.speechSynthesis.cancel();
    currentUtterance = null;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Try to pick a voice matching the language
    if (lang) {
      utterance.lang = lang;
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.startsWith(lang));
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtterance = null;
    };
    utterance.onerror = (e) => {
      // 'interrupted' is normal when user stops manually
      if (e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e.error);
      }
      setIsSpeaking(false);
      currentUtterance = null;
    };

    utteranceRef.current = utterance;
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, text, lang]);

  useEffect(() => {
    if (autoPlay && isSupported && text && !hasAutoPlayedRef.current) {
      hasAutoPlayedRef.current = true;
      // Slight delay to ensure DOM is ready and interaction is registered
      setTimeout(() => {
        speak();
      }, 100);
    }
  }, [autoPlay, isSupported, text, speak]);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={isSpeaking ? stop : speak}
      title={isSpeaking ? 'Stop speaking' : 'Listen to response'}
      aria-label={isSpeaking ? 'Stop speaking' : 'Listen to response'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 6px',
        borderRadius: '4px',
        marginTop: '6px',
        fontSize: '11px',
        color: isSpeaking ? 'var(--color-error-text)' : 'var(--color-text-tertiary)',
        transition: 'color 150ms ease, background-color 150ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg)';
        e.currentTarget.style.color = isSpeaking ? 'var(--color-error-text)' : 'var(--color-primary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = isSpeaking ? 'var(--color-error-text)' : 'var(--color-text-tertiary)';
      }}
    >
      {isSpeaking ? (
        <>
          <Square size={12} fill="currentColor" />
          Stop
        </>
      ) : (
        <>
          <Volume2 size={13} />
          Listen
        </>
      )}
    </button>
  );
};

export default SpeakButton;
