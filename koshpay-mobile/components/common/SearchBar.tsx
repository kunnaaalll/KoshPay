import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchBarProps {
  theme: any;
}

export const SearchBar = ({ theme }: SearchBarProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={() => router.push('/search')}
      activeOpacity={0.7}
    >
      <Ionicons name="search" size={20} color={theme.textSecondary} />
      <View style={styles.input} pointerEvents="none">
        <TextInput
          style={[styles.text, { color: theme.textSecondary }]}
          placeholder="Search people, transactions..."
          placeholderTextColor={theme.textSecondary}
          editable={false}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  input: {
    flex: 1,
  },
  text: {
    fontSize: 15,
  },
});
