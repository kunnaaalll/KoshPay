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

export default function SecurityScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [transactionPINEnabled, setTransactionPINEnabled] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const handleChangePIN = () => {
    Alert.alert(
      'Change PIN',
      'You will be redirected to change your PIN',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Change PIN') },
      ]
    );
  };

//   const handleChangePassword = () => {
//     Alert.alert(
//       'Change Password',
//       'You will be redirected to change your password',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Continue', onPress: () => console.log('Change Password') },
//       ]
//     );
//   };

  const handleKYC = () => {
    Alert.alert(
      'KYC Verification',
      'Complete KYC to unlock higher transaction limits',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Verify Now', onPress: () => console.log('Start KYC') },
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
          Security
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* KYC Status */}
        <TouchableOpacity
          style={[styles.kycBanner, { backgroundColor: '#FFF3CD' }]}
          onPress={handleKYC}
        >
          <View style={styles.kycLeft}>
            <Ionicons name="warning" size={24} color="#856404" />
            <View style={styles.kycInfo}>
              <Text style={[styles.kycTitle, { color: '#856404' }]}>
                KYC Not Verified
              </Text>
              <Text style={[styles.kycSubtitle, { color: '#856404' }]}>
                Verify to unlock full features
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#856404" />
        </TouchableOpacity>

        {/* Authentication */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Authentication
        </Text>

        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="finger-print" size={24} color={theme.text} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Biometric Login
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                Use fingerprint or Face ID
              </Text>
            </View>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: '#767577', true: theme.primary + '80' }}
            thumbColor={biometricEnabled ? theme.primary : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield-checkmark" size={24} color={theme.text} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Two-Factor Authentication
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                Extra security with 2FA
              </Text>
            </View>
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={setTwoFactorEnabled}
            trackColor={{ false: '#767577', true: theme.primary + '80' }}
            thumbColor={twoFactorEnabled ? theme.primary : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: theme.card }]}
          onPress={handleChangePIN}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="keypad" size={24} color={theme.text} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Change PIN
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                Update your 6-digit PIN
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: theme.card }]}
          onPress={handleChangePassword}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed" size={24} color={theme.text} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Change Password
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                Update your account password
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity> */}

        {/* Transaction Security */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Transaction Security
        </Text>

        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-open" size={24} color={theme.text} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Transaction PIN
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                Require PIN for all transactions
              </Text>
            </View>
          </View>
          <Switch
            value={transactionPINEnabled}
            onValueChange={setTransactionPINEnabled}
            trackColor={{ false: '#767577', true: theme.primary + '80' }}
            thumbColor={transactionPINEnabled ? theme.primary : '#f4f3f4'}
          />
        </View>

        {/* Activity Alerts */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Activity Alerts
        </Text>

        <View style={[styles.settingCard, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={theme.text} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Login Notifications
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                Alert on new device login
              </Text>
            </View>
          </View>
          <Switch
            value={loginNotifications}
            onValueChange={setLoginNotifications}
            trackColor={{ false: '#767577', true: theme.primary + '80' }}
            thumbColor={loginNotifications ? theme.primary : '#f4f3f4'}
          />
        </View>

        {/* Active Sessions */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Active Sessions
        </Text>

        <View style={[styles.sessionCard, { backgroundColor: theme.card }]}>
          <Ionicons name="phone-portrait" size={24} color={theme.text} />
          <View style={styles.sessionInfo}>
            <Text style={[styles.sessionDevice, { color: theme.text }]}>
              iPhone 15 Pro
            </Text>
            <Text style={[styles.sessionLocation, { color: theme.textSecondary }]}>
              Mumbai, India • Current Device
            </Text>
          </View>
          <View style={[styles.activeDot, { backgroundColor: '#4CAF50' }]} />
        </View>

        <View style={[styles.sessionCard, { backgroundColor: theme.card }]}>
          <Ionicons name="desktop" size={24} color={theme.text} />
          <View style={styles.sessionInfo}>
            <Text style={[styles.sessionDevice, { color: theme.text }]}>
              Chrome on Windows
            </Text>
            <Text style={[styles.sessionLocation, { color: theme.textSecondary }]}>
              Mumbai, India • 2 days ago
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={{ color: '#FF3B30', fontSize: 14, fontWeight: '600' }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

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
  },
  kycBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(24),
  },
  kycLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(12),
  },
  kycInfo: {
    flex: 1,
  },
  kycTitle: {
    fontSize: scaleFont(15),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  kycSubtitle: {
    fontSize: scaleFont(13),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(12),
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  settingSubtitle: {
    fontSize: scaleFont(13),
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
    gap: scale(12),
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  sessionLocation: {
    fontSize: scaleFont(13),
  },
  activeDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
});
