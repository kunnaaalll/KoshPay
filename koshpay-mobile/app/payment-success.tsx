import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

export default function PaymentSuccessScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const scaleAnim = new Animated.Value(0);

  const amount = params.amount as string || '0';
  const crypto = params.crypto as string || 'SOL';
  const recipientName = params.recipientName as string || 'User';
  const walletAddress = params.walletAddress as string || '0x...';
  const cryptoPrice = parseFloat(params.cryptoPrice as string) || 0;

  const inrAmount = (parseFloat(amount) * cryptoPrice).toFixed(2);
  const txHash = 'TXH' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const timestamp = new Date().toLocaleTimeString();

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
      bounciness: 10,
    }).start();
  }, []);

  const handleDone = () => {
    router.push('/(tabs)');
  };

  const handleViewDetails = () => {
    router.push({
      pathname: '/transaction-details',
      params: {
        txHash,
        amount,
        crypto,
        recipientName,
        walletAddress,
        inrAmount,
        timestamp,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Background blur effect */}
      <View style={[styles.background, { backgroundColor: theme.background }]} />

      {/* Content */}
      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.checkmarkCircle, { backgroundColor: theme.primary }]}>
            <Ionicons name="checkmark" size={60} color="#FFF" />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Text style={[styles.successTitle, { color: theme.text }]}>
          Payment Successful!
        </Text>

        <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
          Your payment has been processed
        </Text>

        {/* Transaction Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Sent to
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {recipientName}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Amount
            </Text>
            <View style={styles.amountContainer}>
              <Text style={[styles.amountValue, { color: theme.text }]}>
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
              In INR
            </Text>
            <Text style={[styles.inrValue, { color: theme.primary }]}>
              ₹{inrAmount}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Time
            </Text>
            <Text style={[styles.timeValue, { color: theme.text }]}>
              {timestamp}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Status
            </Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        </View>

        {/* Hash and Address */}
        <View style={[styles.hashCard, { backgroundColor: theme.card }]}>
          <View style={styles.hashRow}>
            <Text style={[styles.hashLabel, { color: theme.textSecondary }]}>
              Transaction Hash
            </Text>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy" size={14} color={theme.primary} />
              <Text style={[styles.copyText, { color: theme.primary }]}>
                Copy
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.hashValue, { color: theme.text }]}>
            {txHash}
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: 12 }]} />

          <View style={styles.hashRow}>
            <Text style={[styles.hashLabel, { color: theme.textSecondary }]}>
              Recipient Address
            </Text>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy" size={14} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <Text
            style={[styles.addressValue, { color: theme.text }]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {walletAddress}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.detailsButton, { borderColor: theme.primary }]}
          onPress={handleViewDetails}
        >
          <Text style={[styles.detailsButtonText, { color: theme.primary }]}>
            View Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: theme.primary }]}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(40),
    justifyContent: 'center',
  },
  checkmarkContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  checkmarkCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  successTitle: {
    fontSize: scaleFont(24),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  successSubtitle: {
    fontSize: scaleFont(14),
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  detailsCard: {
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  amountValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  cryptoSymbol: {
    fontSize: scaleFont(11),
    fontWeight: '500',
  },
  inrValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  timeValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  statusText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#34C759',
  },
  hashCard: {
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(24),
  },
  hashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  hashLabel: {
    fontSize: scaleFont(12),
    fontWeight: '500',
  },
  hashValue: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    fontFamily: 'Menlo',
    letterSpacing: 0.5,
  },
  addressValue: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    fontFamily: 'Menlo',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
  },
  copyText: {
    fontSize: scaleFont(11),
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    gap: scale(12),
    paddingTop: verticalScale(12),
  },
  detailsButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    borderWidth: 1.5,
  },
  detailsButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  doneButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#FFF',
  },
});
