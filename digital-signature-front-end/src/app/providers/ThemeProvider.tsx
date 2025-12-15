import type { ReactNode } from 'react';
import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ConfigProvider, App, theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '@/app/config/constants';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // TEMPORARILY DISABLED: Force light mode only
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  const [primaryColor, setPrimaryColor] = useState<string>('#1890ff');
  useTranslation();

  useEffect(() => {
    // Save theme to localStorage when it changes
    localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Memoize theme config to prevent unnecessary re-renders
  const themeConfig: ThemeConfig = useMemo(() => ({
    algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      borderRadius: 6,
      fontSize: 14,
    },
    // components: {
    //   Layout: {
    //     headerBg: themeMode === 'dark' ? '#141414' : '#ffffff',
    //     headerHeight: 64,
    //     headerPadding: '0 24px',
    //   },
    //   Button: {
    //     borderRadius: 6,
    //   },
    //   Input: {
    //     borderRadius: 6,
    //   },
    //   Card: {
    //     borderRadius: 8,
    //   },
    // },
  }), [themeMode, primaryColor]);

  const contextValue = useMemo(() => ({
    themeMode,
    toggleTheme,
    primaryColor,
    setPrimaryColor,
  }), [themeMode, primaryColor]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>
        <App>
          {children}
        </App>
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
