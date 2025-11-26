import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

type SettingsItem = {
  icon: string;
  label: string;
  onPress?: () => void;
  toggle?: boolean;
  value?: string | boolean;
  onToggle?: (value: boolean) => void;
  badge?: string;
};

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

export default function SettingsScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          label: 'Personal Information',
          onPress: () => router.push('/edit-profile'),
        },
        {
          icon: 'card-outline',
          label: 'KYC Verification',
          onPress: () => router.push('/phone-login'),
          badge: 'Pending',
        },
        {
          icon: 'wallet-outline',
          label: 'Linked Bank Accounts',
          onPress: () => Alert.alert('Linked Accounts', 'Coming soon'),
        },
         {
          icon: 'key-outline',
          label: 'Security',
          onPress: () => router.push('/security'),
        },
      ],
    },

    //{
    //  title: 'Security',
    //  items: [
    //  {
    //       icon: 'key-outline',
    //       label: 'Security',
    //       onPress: () => router.push('/security'),
    //   },
    // ],
    //},

    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Notifications',
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: 'language-outline',
          label: 'Language',
          value: 'English',
          onPress: () => Alert.alert('Language', 'Coming soon'),
        },
        {
          icon: 'cash-outline',
          label: 'Default Currency',
          value: 'INR',
          onPress: () => Alert.alert('Currency', 'Coming soon'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          label: 'Help & Support',
          onPress: () => router.push('/help-support'),
        },
        {
          icon: 'document-text-outline',
          label: 'Terms & Conditions',
          onPress: () => Alert.alert('Terms', 'Coming soon'),
        },
        {
          icon: 'shield-outline',
          label: 'Privacy Policy',
          onPress: () => Alert.alert('Privacy', 'Coming soon'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          label: 'App Version',
          value: '1.0.0',
        },
        {
          icon: 'star-outline',
          label: 'Rate Us',
          onPress: () => Alert.alert('Rate Us', 'Thank you!'),
        },
        {
          icon: 'share-social-outline',
          label: 'Share App',
          onPress: () => Alert.alert('Share', 'Coming soon'),
        },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout
            Alert.alert('Logged Out', 'You have been logged out');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              {section.title}
            </Text>

            <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={item.onPress}
                    disabled={!item.onPress && !('toggle' in item && item.toggle)}
                    activeOpacity={item.onPress ? 0.7 : 1}
                  >
                    <View style={styles.settingLeft}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' },
                        ]}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={20}
                          color={theme.primary}
                        />
                      </View>

                      <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, { color: theme.text }]}>
                          {item.label}
                        </Text>
                        {item.badge && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.settingRight}>
                      {item.toggle ? (
                        <Switch
                          value={item.value as boolean}
                          onValueChange={item.onToggle}
                          trackColor={{
                            false: theme.border,
                            true: theme.primary,
                          }}
                          thumbColor="#FFFFFF"
                        />
                      ) : item.value ? (
                        <Text
                          style={[
                            styles.settingValue,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {item.value}
                        </Text>
                      ) : (
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={theme.textSecondary}
                        />
                      )}
                    </View>
                  </TouchableOpacity>

                  {itemIndex < section.items.length - 1 && (
                    <View
                      style={[styles.divider, { backgroundColor: theme.border }]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>
          KoshPay v1.0.0 • Made with ❤️ in India
        </Text>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  settingLabel: {
    fontSize: scaleFont(15),
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(10),
  },
  badgeText: {
    fontSize: scaleFont(11),
    fontWeight: '600',
    color: '#FFF',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(12),
  },
  settingValue: {
    fontSize: scaleFont(14),
    marginRight: scale(8),
  },
  divider: {
    height: 1,
    marginLeft: scale(68),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    gap: scale(8),
  },
  logoutButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#FFF',
  },
  versionText: {
    fontSize: scaleFont(12),
    textAlign: 'center',
    marginTop: verticalScale(24),
  },
});
