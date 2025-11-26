import { useState } from 'react';
import { COLORS } from '../constants/constants';
import { Theme } from '../types';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme: Theme = {
    background: isDarkMode ? COLORS.dark.background : COLORS.light.background,
    card: isDarkMode ? COLORS.dark.card : COLORS.light.card,
    text: isDarkMode ? COLORS.dark.text : COLORS.light.text,
    textSecondary: isDarkMode ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    border: isDarkMode ? COLORS.dark.border : COLORS.light.border,
    searchBar: isDarkMode ? COLORS.dark.searchBar : COLORS.light.searchBar,
    primary: COLORS.primary,
    navBar: isDarkMode ? COLORS.dark.navBar : COLORS.light.navBar,
    illustration: isDarkMode ? COLORS.dark.illustration : COLORS.light.illustration,
  };

  return { isDarkMode, setIsDarkMode, theme };
};