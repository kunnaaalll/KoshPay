import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/constants';
import { Theme } from '../types';

interface ThemeContextType {
  isDarkMode: boolean;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Automatically detect device theme preference
  const deviceColorScheme = useColorScheme();
  const isDarkMode = deviceColorScheme === 'dark';

  const theme: Theme = useMemo(() => ({
    background: isDarkMode ? COLORS.dark.background : COLORS.light.background,
    card: isDarkMode ? COLORS.dark.card : COLORS.light.card,
    text: isDarkMode ? COLORS.dark.text : COLORS.light.text,
    textSecondary: isDarkMode ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    border: isDarkMode ? COLORS.dark.border : COLORS.light.border,
    searchBar: isDarkMode ? COLORS.dark.searchBar : COLORS.light.searchBar,
    primary: COLORS.primary,
    navBar: isDarkMode ? COLORS.dark.navBar : COLORS.light.navBar,
    illustration: isDarkMode ? COLORS.dark.illustration : COLORS.light.illustration,
  }), [isDarkMode]);

  const value = {
    isDarkMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
