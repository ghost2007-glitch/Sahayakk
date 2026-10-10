import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, Plus } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import ThinkingIndicator from '../../components/loading/ThinkingIndicator';
import { initialMessages, suggestedPrompts } from '../../data/mockMessages';
import type { Message } from '../../types';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import VoiceRecordingScreen from '../../components/voice/VoiceRecordingScreen';
import AudioPlayer from '../../components/voice/AudioPlayer';
import LatticeLoader from '../../components/loading/LatticeLoader';
import LanguageSelector from '../../components/voice/LanguageSelector';
import { SUPPORTED_LANGUAGES } from '../../lib/speech/languages';
import { supabase } from '../../lib/supabase';

type AssistantStatus = 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking' | 'error';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [assistantStatus, setAssistantStatus] = useState<AssistantStatus>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    isRecording,
    transcript,
    finalTranscript,
    interimTranscript,
    error: voiceError,
    recordingTime,
    isSupported,
    mediaStream,
    selectedLanguage,
    setSelectedLanguage,
    startRecording,
    stopRecording,
    cancelRecording,
    setTranscript
  } = useVoiceInput();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantStatus]);

  // Sync transcript to input or vice-versa
  // The simplest is to just use `input` state and update it when `transcript` changes.
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (isRecording) {
      setAssistantStatus('listening');
    } else if (assistantStatus === 'listening') {
      setAssistantStatus('idle');
    }
  }, [isRecording]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || assistantStatus === 'thinking') return;
    
    // Stop recording if active before sending
    if (isRecording) {
      stopRecording();
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setTranscript('');
    setAssistantStatus('thinking');

    try {
      const historyForApi = messages.slice(-10).map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      
      const { data, error } = await supabase.functions.invoke('sahayak-chat', {
        body: { 
          message: text.trim(),
          history: historyForApi
        }
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data?.reply || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date().toISOString(),
      };

      setAssistantStatus('speaking'); // Prepare for audio playback if supported later
      setMessages(prev => [...prev, assistantMsg]);
      
      setTimeout(() => {
        setAssistantStatus('idle');
      }, 2000);
    } catch (err) {
      console.error("Chat API error:", err);
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm having trouble connecting to my service right now. Please check your connection or try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
      setAssistantStatus('idle');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-ish formatting
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i}>{line.slice(2, -2)}</strong>;
      }
      if (line.startsWith('• ')) {
        return <div key={i} style={{ paddingLeft: '4px' }}>• {line.slice(2)}</div>;
      }
      if (line === '') return <div key={i} style={{ height: '8px' }} />;

      // Inline bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      if (parts.length > 1) {
        return (
          <div key={i}>
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </div>
        );
      }
      return <div key={i}>{line}</div>;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {isRecording && (
        <VoiceRecordingScreen 
          time={recordingTime}
          mediaStream={mediaStream}
          finalTranscript={finalTranscript}
          interimTranscript={interimTranscript}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onCancel={() => {
            cancelRecording();
            setInput('');
            setAssistantStatus('idle');
          }}
          onFinish={async () => {
            setAssistantStatus('transcribing');
            try {
              await stopRecording();
              setAssistantStatus('idle');
            } catch (e) {
              setAssistantStatus('error');
              setTimeout(() => setAssistantStatus('idle'), 3000);
            }
          }}
          error={voiceError}
          isSupported={isSupported}
        />
      )}

      {/* Header */}
      <MobileHeader
        title="AI Assistant"
        showNotifications={false}
        rightAction={
          <button
            onClick={() => setMessages(initialMessages)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '13px', color: 'var(--color-text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
              borderRadius: '6px',
            }}
            aria-label="Start new conversation"
          >
            <Plus size={16} />
            New
          </button>
        }
      />

      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          paddingTop: 'calc(var(--nav-height-mobile) + 16px)',
          paddingBottom: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {/* Suggested prompts (show only at start) */}
        {messages.length === 1 && (
          <div style={{ marginTop: '8px' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px', fontWeight: 500 }}>
              SUGGESTIONS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease, border-color 150ms ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                    e.currentTarget.style.borderColor = 'var(--color-primary-border)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              gap: '4px',
            }}
          >
            <div
              className={msg.role === 'user' ? 'message-bubble message-user' : 'message-bubble message-assistant'}
              style={{ lineHeight: 1.55 }}
            >
              {formatContent(msg.content)}
              {msg.role === 'assistant' && msg.audioUrl && (
                <AudioPlayer audioUrl={msg.audioUrl} />
              )}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', padding: '0 4px' }}>
              {formatTime(msg.timestamp)}
            </span>
          </div>
        ))}

        {/* Loader Statuses */}
        {assistantStatus !== 'idle' && (
          <div style={{ padding: '0 12px' }}>
            <LatticeLoader 
              status={assistantStatus === 'error' ? 'error' : 'working'} 
              label={assistantStatus.charAt(0).toUpperCase() + assistantStatus.slice(1)} 
              showTimer={false}
              gap={4}
              cellSize={8}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '12px 16px',
          background: 'var(--color-surface)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '8px 12px',
            transition: 'border-color 150ms ease',
          }}
            onFocusCapture={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--color-primary)';
              el.style.boxShadow = '0 0 0 3px var(--color-primary-light)';
            }}
            onBlurCapture={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--color-border)';
              el.style.boxShadow = 'none';
            }}
          >
            {isRecording ? null : (
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  setTranscript(e.target.value); // keep them in sync
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sahayak anything..."
                rows={1}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  resize: 'none',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.5,
                  outline: 'none',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
                aria-label="Message input"
              />
            )}
            
            {/* Input Error for voice */}
            {voiceError && !isRecording && (
              <div style={{ position: 'absolute', bottom: '100%', left: '16px', marginBottom: '8px', fontSize: '12px', color: 'var(--color-error-text)', background: 'var(--color-error-bg)', padding: '4px 8px', borderRadius: '4px' }}>
                {voiceError} {!isSupported && 'Speech recognition not supported in this browser.'}
              </div>
            )}
            
            {/* Language Selector */}
            {!isRecording && (
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            )}

            {/* Mic button */}
            <button
              type="button"
              onClick={() => {
                if (isRecording) {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: isRecording ? 'var(--color-error-bg)' : 'transparent',
                color: isRecording ? 'var(--color-error-text)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background-color 150ms ease, color 150ms ease',
              }}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || assistantStatus === 'thinking' || isRecording}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                background: input.trim() && assistantStatus !== 'thinking' && !isRecording ? 'var(--color-primary)' : 'var(--color-bg)',
                color: input.trim() && assistantStatus !== 'thinking' && !isRecording ? 'white' : 'var(--color-text-tertiary)',
                cursor: input.trim() && assistantStatus !== 'thinking' && !isRecording ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background-color 150ms ease, color 150ms ease',
              }}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: '8px' }}>
            Sahayak may produce inaccurate information. Verify with official sources.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
