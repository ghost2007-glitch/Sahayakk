import { SpeechRecognitionOptions, SpeechRecognitionProvider } from './types';
import { SUPPORTED_LANGUAGES } from './languages';

export class WebSpeechProvider implements SpeechRecognitionProvider {
  name = 'Browser Web Speech API';
  isLiveSupported = true;
  private recognition: any = null;

  supportedLanguages(): string[] {
    return SUPPORTED_LANGUAGES.map(l => l.bcp47);
  }

  async transcribe(audioBlob: Blob, options?: SpeechRecognitionOptions): Promise<string> {
    // Web Speech API does not support post-processing audio blobs natively.
    // In a real implementation, this would call a backend service.
    throw new Error('Transcription unavailable for this language. Future speech-to-text API required.');
  }

  startLiveTranscription(
    options: SpeechRecognitionOptions,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('not-supported');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      
      if (options.language && options.language !== 'auto') {
        this.recognition.lang = options.language;
      }

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          onResult(finalTranscript, true);
        }
        if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          onError('permission-denied');
        } else if (event.error !== 'no-speech') {
          onError(event.error);
        }
      };

      this.recognition.start();
    } catch (e) {
      console.error('Error starting speech recognition:', e);
    }
  }

  stopLiveTranscription(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
  }
}

export const webSpeechProvider = new WebSpeechProvider();
