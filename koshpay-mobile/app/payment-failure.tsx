import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PaymentFailureScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const amount = params.amount as string || '0';
  const crypto = params.crypto as string || 'SOL';
  const errorMessage = params.errorMessage as string || 'Transaction failed';

  const handleRetry = () => {
    router.back();
  };

  const handleHome = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Failure Icon */}
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
          <Ionicons name="close-circle" size={80} color="#FF3B30" />
        </View>

        {/* Failure Message */}
        <Text style={[styles.failureTitle, { color: theme.text }]}>
          Payment Failed
        </Text>

        <Text style={[styles.failureSubtitle, { color: theme.textSecondary }]}>
          {errorMessage}
        </Text>

        {/* Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Amount
            </Text>
            <View style={styles.amountContainer}>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {amount}
              </Text>
              <Text style={[styles.cryptoSymbol, { color: theme.textSecondary }]}>
                {crypto}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Status
            </Text>
            <View style={styles.statusBadge}>
              <Ionicons name="close-circle" size={16} color="#FF3B30" />
              <Text style={styles.statusText}>Failed</Text>
            </View>
          </View>
        </View>

        {/* Error Info */}
        <View style={[styles.infoBox, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
          <Ionicons name="information-circle" size={20} color="#FF3B30" />
          <Text style={[styles.infoText, { color: theme.text }]}>
            Please check your PIN and try again or contact support
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.homeButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={handleHome}
        >
          <Text style={[styles.homeButtonText, { color: theme.text }]}>
            Go to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: '#FF3B30' }]}
          onPress={handleRetry}
        >
          <Ionicons name="refresh" size={18} color="#FFF" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(24),
  },
  failureTitle: {
    fontSize: scaleFont(24),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  failureSubtitle: {
    fontSize: scaleFont(14),
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  detailsCard: {
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(16),
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  detailLabel: {
    fontSize: scaleFont(13),
    fontWeight: '500',
  },
  detailValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  cryptoSymbol: {
    fontSize: scaleFont(11),
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#FF3B30',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: scaleFont(13),
    fontWeight: '500',
    lineHeight: scaleFont(18),
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    gap: scale(12),
    paddingTop: verticalScale(12),
  },
  homeButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    borderWidth: 1,
  },
  homeButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  retryButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(8),
  },
  retryButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#FFF',
  },
});
