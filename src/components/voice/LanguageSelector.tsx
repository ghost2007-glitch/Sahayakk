import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../lib/speech/languages';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (bcp47: string) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLanguage, 
  onLanguageChange,
  disabled 
}) => {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => onLanguageChange(e.target.value)}
      disabled={disabled}
      style={{
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        fontSize: '13px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        outline: 'none'
      }}
      aria-label="Select language"
    >
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang.id} value={lang.bcp47}>
          {lang.nativeName} {lang.name !== lang.nativeName ? `(${lang.name})` : ''}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
