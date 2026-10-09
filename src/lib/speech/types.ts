export interface SpeechRecognitionOptions {
  language?: string;
}

export interface SpeechRecognitionProvider {
  name: string;
  isLiveSupported: boolean;
  supportedLanguages(): string[];
  
  // Future backend translation / transcription
  transcribe(audioBlob: Blob, options?: SpeechRecognitionOptions): Promise<string>;
  
  // Live browser recognition if available
  startLiveTranscription?(
    options: SpeechRecognitionOptions,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): void;
  stopLiveTranscription?(): void;
}
