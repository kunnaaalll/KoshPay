import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../types';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: (value: boolean) => void;
  theme: Theme;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle, theme }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#E5E5EA' }]}>
        <Ionicons 
          name={isDarkMode ? "moon" : "sunny"} 
          size={16} 
          color={isDarkMode ? '#FFFFFF' : '#1565C0'} 
        />
      </View>
      <Switch
        value={isDarkMode}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E5EA', true: '#2C2C2E' }}
        thumbColor={isDarkMode ? '#1565C0' : '#FFFFFF'}
        ios_backgroundColor="#E5E5EA"
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});