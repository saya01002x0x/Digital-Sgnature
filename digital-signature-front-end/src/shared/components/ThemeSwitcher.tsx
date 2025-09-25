import React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const { themeMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tooltip title={themeMode === 'light' ? t('theme.dark') : t('theme.light')}>
      <Button
        type="text"
        icon={themeMode === 'light' ? <BulbOutlined /> : <BulbFilled />}
        onClick={toggleTheme}
        className={className}
        aria-label={t('theme.toggle')}
      />
    </Tooltip>
  );
};
