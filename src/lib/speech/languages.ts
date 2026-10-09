export interface SpeechLanguage {
  id: string;
  name: string;
  nativeName: string;
  bcp47: string;
}

export const SUPPORTED_LANGUAGES: SpeechLanguage[] = [
  { id: 'auto', name: 'Auto-detect', nativeName: 'Auto-detect', bcp47: 'auto' },
  { id: 'en', name: 'English', nativeName: 'English', bcp47: 'en-IN' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN' },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bcp47: 'gu-IN' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN' },
  { id: 'ur', name: 'Urdu', nativeName: 'اردو', bcp47: 'ur-IN' },
  { id: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', bcp47: 'or-IN' },
  { id: 'as', name: 'Assamese', nativeName: 'অসমীয়া', bcp47: 'as-IN' },
  { id: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', bcp47: 'sa-IN' },
];
