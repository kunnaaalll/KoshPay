import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text, // ← ADD THIS
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import { SearchBar } from '../../components/common/SearchBar';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { QuickActions } from '../../components/home/QuickActions';
import { QUICK_ACTIONS } from '../../constants/data';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../../utils/responsive';
import { useNotification } from '../../context/NotificationContext';

export default function HomeScreen() {
  const { isDarkMode, setIsDarkMode, theme } = useTheme();
  const { showNotification } = useNotification();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <SearchBar theme={theme} />
          
          {/* TEST BUTTON - Better placed here
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: theme.primary }]}
            onPress={() => 
              showNotification({
                type: 'payment',
                title: 'Payment Received!',
                message: 'You received 0.5 SOL from Priya',
              })
            }
          >
            <Ionicons name="notifications" size={20} color="#FFF" />
          </TouchableOpacity> */}
          
          <TouchableOpacity style={[styles.profileIcon, { backgroundColor: theme.card }]}>
            <Ionicons name="person" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Theme Toggle */}
        <ThemeToggle 
          isDarkMode={isDarkMode} 
          onToggle={setIsDarkMode} 
          theme={theme} 
        />

        {/* Quick Actions */}
        {/* <QuickActions actions={QUICK_ACTIONS} theme={theme} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
    gap: scale(12),
  },
  testButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
