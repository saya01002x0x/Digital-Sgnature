/**
 * LanguageSwitcherButton Component
 * Ghost button style language switcher theo template Ant Design 2.x
 */

import type React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { LOCALES, STORAGE_KEYS } from '@/app/config/constants';

type LanguageSwitcherButtonProps = {
  className?: string;
}

export const LanguageSwitcherButton: React.FC<LanguageSwitcherButtonProps> = ({ className }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === LOCALES.VI ? LOCALES.EN : LOCALES.VI;
    i18n.changeLanguage(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
  };

  const displayText = i18n.language === LOCALES.VI ? 'Tiếng Việt' : 'English';

  return (
    <Button
      className={`header-lang-button ${className || ''}`}
      ghost
      size="small"
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '80px'
      }}
    >
      {displayText}
    </Button>
  );
};

