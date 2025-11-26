import React, { createContext, useContext, useState, useMemo } from "react";
import { COLORS } from "./constants";
import { Theme } from "../types/index";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceTheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === "dark");

  const theme = useMemo<Theme>(() => {
    const baseTheme = isDarkMode ? COLORS.dark : COLORS.light;
    return {
      ...baseTheme,
      primary: COLORS.primary,
    };
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    setIsDarkMode,
    theme,
  };

  return (<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
