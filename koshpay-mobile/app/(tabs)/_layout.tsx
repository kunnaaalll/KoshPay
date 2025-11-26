import React from 'react';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { AnimatedBottomNavRounded } from '../../components/navigation/AnimatedBottomNav';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  
  // Get active tab from current route
  const activeTab = segments[1] === undefined ? 'home' : segments[1];
  
  const handleTabPress = (tabId: string) => {
    if (tabId === 'home') {
      router.push('/(tabs)');
    } else {
      router.push(`/(tabs)/${tabId}` as any);
    }
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen 
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen 
          name="wallet"
          options={{
            title: 'Wallet',
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>

      {/* Custom Animated Bottom Nav */}
      <AnimatedBottomNavRounded
        activeTab={activeTab}
        onTabPress={handleTabPress}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});