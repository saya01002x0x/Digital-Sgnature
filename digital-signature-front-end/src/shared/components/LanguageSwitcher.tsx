import type React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { LOCALES, STORAGE_KEYS } from '@/app/config/constants';
import { GlobalOutlined } from '@ant-design/icons';

type LanguageSwitcherProps = {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
  };

  const languageOptions = [
    { value: LOCALES.EN, label: t('language.en') },
    { value: LOCALES.VI, label: t('language.vi') },
  ];

  return (
    <Select
      defaultValue={i18n.language}
      onChange={changeLanguage}
      options={languageOptions}
      className={className}
      bordered={false}
      suffixIcon={<GlobalOutlined />}
      aria-label="Change language"
      dropdownMatchSelectWidth={false}
    />
  );
};
