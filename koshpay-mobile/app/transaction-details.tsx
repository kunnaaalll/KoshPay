import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

export default function TransactionDetailsScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [copied, setCopied] = useState<string | null>(null);

  const txHash = params.txHash as string || 'TXH123456789';
  const amount = params.amount as string || '0';
  const crypto = params.crypto as string || 'SOL';
  const recipientName = params.recipientName as string || 'User';
  const walletAddress = params.walletAddress as string || '0x...';
  const inrAmount = params.inrAmount as string || '0.00';
  const timestamp = params.timestamp as string || new Date().toLocaleTimeString();

  const blockExplorerUrl = `https://solscan.io/tx/${txHash}`;

  const copyToClipboard = (text: string, label: string) => {
    // TODO: Implement actual clipboard copy
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const handleOpenBlockExplorer = () => {
    // TODO: Open in-app browser or external link
    Alert.alert('Block Explorer', `Opening ${blockExplorerUrl}`);
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
          Transaction Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: theme.card }]}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#34C759" />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusTitle, { color: theme.text }]}>
                Completed
              </Text>
              <Text style={[styles.statusTime, { color: theme.textSecondary }]}>
                {timestamp}
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction Info */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Transaction Information
          </Text>

          {/* From */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              From
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              You (KoshPay Wallet)
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* To */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              To
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {recipientName}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Amount */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Amount
            </Text>
            <View style={styles.amountRow}>
              <Text style={[styles.cryptoAmount, { color: theme.text }]}>
                {amount} {crypto}
              </Text>
              <Text style={[styles.inrAmount, { color: theme.textSecondary }]}>
                ≈ ₹{inrAmount}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Network Fee */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Network Fee
            </Text>
            <Text style={[styles.feeValue, { color: theme.textSecondary }]}>
              ~₹0.50
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Total */}
          <View style={styles.infoRow}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>
              ₹{(parseFloat(inrAmount) + 0.50).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Blockchain Details */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Blockchain Details
          </Text>

          {/* Network */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Network
            </Text>
            <View style={styles.networkBadge}>
              <Ionicons name="radio-button-on" size={12} color="#34C759" />
              <Text style={styles.networkText}>Solana</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Transaction Hash */}
          <View style={styles.hashSection}>
            <View style={styles.hashHeader}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Transaction Hash
              </Text>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  {
                    backgroundColor:
                      copied === 'hash'
                        ? 'rgba(52, 199, 89, 0.1)'
                        : 'transparent',
                  },
                ]}
                onPress={() => copyToClipboard(txHash, 'hash')}
              >
                <Ionicons
                  name="copy"
                  size={14}
                  color={copied === 'hash' ? '#34C759' : theme.primary}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.hashValue, { color: theme.text }]}
              selectable
            >
              {txHash}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Recipient Address */}
          <View style={styles.hashSection}>
            <View style={styles.hashHeader}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Recipient Address
              </Text>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  {
                    backgroundColor:
                      copied === 'address'
                        ? 'rgba(52, 199, 89, 0.1)'
                        : 'transparent',
                  },
                ]}
                onPress={() => copyToClipboard(walletAddress, 'address')}
              >
                <Ionicons
                  name="copy"
                  size={14}
                  color={copied === 'address' ? '#34C759' : theme.primary}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.addressValue, { color: theme.text }]}
              numberOfLines={2}
              selectable
            >
              {walletAddress}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Confirmation */}
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Confirmations
            </Text>
            <Text style={[styles.confirmationValue, { color: '#34C759' }]}>
              32 confirmed
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={handleOpenBlockExplorer}
          >
            <Ionicons name="open-outline" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>View on Block Explorer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: 'transparent',
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => {
              Alert.alert('Downloaded', 'Receipt saved to your device');
            }}
          >
            <Ionicons name="download-outline" size={18} color={theme.text} />
            <Text style={[styles.actionButtonTextSecondary, { color: theme.text }]}>
              Download Receipt
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
    paddingVertical: verticalScale(16),
  },
  statusCard: {
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  statusIconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  statusTime: {
    fontSize: scaleFont(13),
  },
  section: {
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  infoLabel: {
    fontSize: scaleFont(13),
    fontWeight: '500',
  },
  infoValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  amountRow: {
    alignItems: 'flex-end',
  },
  cryptoAmount: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  inrAmount: {
    fontSize: scaleFont(12),
  },
  feeValue: {
    fontSize: scaleFont(13),
  },
  totalLabel: {
    fontSize: scaleFont(14),
    fontWeight: '700',
  },
  totalValue: {
    fontSize: scaleFont(14),
    fontWeight: '700',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  networkText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#34C759',
  },
  hashSection: {
    paddingVertical: verticalScale(12),
  },
  hashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  copyButton: {
    padding: scale(6),
    borderRadius: moderateScale(6),
  },
  hashValue: {
    fontSize: scaleFont(12),
    fontFamily: 'Menlo',
    letterSpacing: 0.5,
    lineHeight: scaleFont(16),
  },
  addressValue: {
    fontSize: scaleFont(12),
    fontFamily: 'Menlo',
    lineHeight: scaleFont(16),
  },
  confirmationValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  actionSection: {
    gap: verticalScale(12),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  actionButtonText: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    color: '#FFF',
  },
  actionButtonTextSecondary: {
    fontSize: scaleFont(15),
    fontWeight: '600',
  },
});
