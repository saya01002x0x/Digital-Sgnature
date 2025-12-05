import type React from 'react';
import { Button, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';

type ThemeSwitcherProps = {
  className?: string;
  showText?: boolean;
}

/**
 * Theme switcher component following Ant Design best practices
 * Toggles between light and dark themes
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className,
  showText = false 
}) => {
  const { themeMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = themeMode === 'dark';
  const tooltipTitle = isDark 
    ? t('theme.light', 'Chuyển sang sáng') 
    : t('theme.dark', 'Chuyển sang tối');

  return (
    <Tooltip title={tooltipTitle}>
      <Button
        type="text"
        icon={isDark ? <BulbFilled /> : <BulbOutlined />}
        onClick={toggleTheme}
        className={className}
        aria-label={t('theme.toggle', 'Chuyển đổi theme')}
      >
        {showText && (isDark ? 'Dark' : 'Light')}
      </Button>
    </Tooltip>
  );
};
