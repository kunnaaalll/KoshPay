import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';


export default function UserQRScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [amount, setAmount] = useState('0');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Mock user data
  const userData = {
    name: 'Kunal Parmar',
    koshpayId: 'kparmar2911@koshpay',
    walletName: 'Main Wallet',
  };

  const handleSetAmount = (value: string) => {
    setAmount(value);
    setShowAmountModal(false);
  };

  const handleShareQR = async () => {
    try {
      await Share.share({
        message: `Pay me on KoshPay!\nKoshPay ID: ${userData.koshpayId}\nName: ${userData.name}`,
      });
    } catch (error) {
      console.error(error);
    }
    setShowMenu(false);
  };

  const handleCopyKoshPayId = () => {
    Clipboard.setString(userData.koshpayId);
    Alert.alert('Copied!', 'KoshPay ID copied to clipboard');
    setShowMenu(false);
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
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Menu Dropdown */}
      {showMenu && (
        <View style={[styles.menuDropdown, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowAmountModal(true);
              setShowMenu(false);
            }}
          >
            <Text style={[styles.menuText, { color: theme.text }]}>Set Amount</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              setShowMenu(false);
              // Navigate to help screen
              router.push('/help-support');
            }}
          >
            <Text style={[styles.menuText, { color: theme.text }]}>Get help</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              setShowMenu(false);
              Alert.alert('Send Feedback', 'Feedback feature coming soon!');
            }}
          >
            <Text style={[styles.menuText, { color: theme.text }]}>Send feedback</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.primary + '20' },
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {userData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {userData.name}
          </Text>
        </View>

        {/* QR Code */}
        <View style={[styles.qrContainer, { backgroundColor: theme.card }]}>
          <View style={styles.qrCode}>
            <Ionicons name="qr-code" size={220} color={theme.text} />
          </View>
          <Text style={[styles.scanText, { color: theme.textSecondary }]}>
            Scan to pay with KoshPay
          </Text>
        </View>

        {/* Wallet Info */}
        <TouchableOpacity
          style={[styles.walletCard, { backgroundColor: theme.card }]}
        >
          <View style={[styles.walletIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="wallet-outline" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.walletName, { color: theme.text }]}>
            {userData.walletName}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* KoshPay ID */}
        <View style={styles.koshpayContainer}>
          <Text style={[styles.koshpayLabel, { color: theme.textSecondary }]}>
            KoshPay ID: {userData.koshpayId}
          </Text>
          <TouchableOpacity onPress={handleCopyKoshPayId}>
            <Ionicons name="copy-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View
        style={[
          styles.bottomButtons,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.scannerButton,
            { backgroundColor: theme.card },
          ]}
          onPress={() => router.push('/qr-scanner')}
        >
          <Ionicons name="qr-code-outline" size={20} color={theme.text} />
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Open scanner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.shareButton,
            { backgroundColor: theme.primary + '30' },
          ]}
          onPress={handleShareQR}
        >
          <Ionicons name="share-social" size={20} color={theme.primary} />
          <Text style={[styles.buttonText, { color: theme.primary }]}>
            Share QR code
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Modal */}
      <Modal
        visible={showAmountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAmountModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAmountModal(false)}
        >
          <View
            style={[styles.amountModal, { backgroundColor: theme.card }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Enter amount
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>
                ₹
              </Text>
              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                autoFocus
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowAmountModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleSetAmount(amount)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: theme.textSecondary },
                  ]}
                >
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  menuDropdown: {
    position: 'absolute',
    top: verticalScale(60),
    right: scale(16),
    borderRadius: moderateScale(12),
    padding: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    minWidth: scale(160),
  },
  menuItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
  },
  menuText: {
    fontSize: scaleFont(15),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  userSection: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  avatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  avatarText: {
    fontSize: scaleFont(24),
    fontWeight: '700',
  },
  userName: {
    fontSize: scaleFont(20),
    fontWeight: '600',
  },
  qrContainer: {
    width: '100%',
    borderRadius: moderateScale(16),
    padding: scale(24),
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  qrCode: {
    width: scale(isSmallDevice ? 200 : 240),
    height: scale(isSmallDevice ? 200 : 240),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  scanText: {
    fontSize: scaleFont(14),
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
    gap: scale(12),
  },
  walletIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletName: {
    flex: 1,
    fontSize: scaleFont(15),
    fontWeight: '500',
  },
  koshpayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  koshpayLabel: {
    fontSize: scaleFont(14),
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    gap: scale(12),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  scannerButton: {},
  shareButton: {},
  buttonText: {
    fontSize: scaleFont(15),
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountModal: {
    width: '80%',
    borderRadius: moderateScale(16),
    padding: scale(24),
  },
  modalTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    marginBottom: verticalScale(24),
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(32),
  },
  currencySymbol: {
    fontSize: scaleFont(32),
    fontWeight: '300',
    marginRight: scale(8),
  },
  amountInput: {
    fontSize: scaleFont(48),
    fontWeight: '300',
    minWidth: scale(100),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: scale(24),
  },
  modalButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  modalButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
});
