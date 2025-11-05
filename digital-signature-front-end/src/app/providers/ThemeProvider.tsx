import type { ReactNode } from 'react';
import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '@/app/config/constants';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  useTranslation();

  useEffect(() => {
    // Get theme from localStorage or use system preference
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
    
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeMode('dark');
    }
    
    // Update body attribute for non-AntD styling
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  // Define Ant Design theme settings
  const antdTheme = {
    algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff', // Brand color
      borderRadius: 4,
    },
    components: {
      Layout: {
        headerBg: themeMode === 'dark' ? '#141414' : '#ffffff',
        headerColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
        headerHeight: 64,
        headerPadding: '0 24px',
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ConfigProvider theme={antdTheme} locale={{ locale: 'en-US' }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
