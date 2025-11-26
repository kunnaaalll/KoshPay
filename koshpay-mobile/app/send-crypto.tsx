import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

type CryptoOption = {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  priceInr: number;
  icon: any;
};

export default function SendCryptoScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const cryptoOptions: CryptoOption[] = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      balance: 0.0234,
      priceInr: 9135000,
      icon: require('../assets/images/crypto/btc.png'),
    },
    {
      id: '2',
      name: 'Solana',
      symbol: 'SOL',
      balance: 12.5,
      priceInr: 15420,
      icon: require('../assets/images/crypto/sol.png'),
    },
    {
      id: '3',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: 0.85,
      priceInr: 318500,
      icon: require('../assets/images/crypto/eth.png'),
    },
  ];

  const calculateInrValue = () => {
    if (!selectedCrypto || !amount) return 0;
    return parseFloat(amount) * selectedCrypto.priceInr;
  };

  const handleSend = () => {
    if (!selectedCrypto) {
      Alert.alert('Error', 'Please select a cryptocurrency');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!recipientAddress) {
      Alert.alert('Error', 'Please enter recipient address');
      return;
    }
    if (parseFloat(amount) > selectedCrypto.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    // Navigate to confirmation
    router.push({
      pathname: '/payment',
      params: {
        crypto: selectedCrypto.symbol,
        amount: amount,
        recipient: recipientName || recipientAddress,
      },
    });
  };

  const handleScanQR = () => {
    Alert.alert('QR Scanner', 'QR code scanner will open here');
    // TODO: Implement QR scanner
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
          Send Crypto
        </Text>
        <TouchableOpacity onPress={handleScanQR}>
          <Ionicons name="qr-code-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Select Cryptocurrency */}
        <Text style={[styles.label, { color: theme.text }]}>
          Select Cryptocurrency
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cryptoScroll}
          contentContainerStyle={styles.cryptoScrollContent}
        >
          {cryptoOptions.map((crypto) => (
            <TouchableOpacity
              key={crypto.id}
              style={[
                styles.cryptoOption,
                {
                  backgroundColor:
                    selectedCrypto?.id === crypto.id
                      ? theme.primary + '20'
                      : theme.card,
                  borderColor:
                    selectedCrypto?.id === crypto.id
                      ? theme.primary
                      : 'transparent',
                },
              ]}
              onPress={() => setSelectedCrypto(crypto)}
            >
              <Image source={crypto.icon} style={styles.cryptoOptionIcon} />
              <Text style={[styles.cryptoOptionSymbol, { color: theme.text }]}>
                {crypto.symbol}
              </Text>
              <Text
                style={[styles.cryptoOptionBalance, { color: theme.textSecondary }]}
              >
                {crypto.balance}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedCrypto && (
          <>
            {/* Recipient */}
            <Text style={[styles.label, { color: theme.text }]}>
              Recipient
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Name (optional)"
                placeholderTextColor={theme.textSecondary}
                value={recipientName}
                onChangeText={setRecipientName}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
              <Ionicons name="wallet-outline" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={`${selectedCrypto.symbol} address`}
                placeholderTextColor={theme.textSecondary}
                value={recipientAddress}
                onChangeText={setRecipientAddress}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={handleScanQR}>
                <Ionicons name="qr-code-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <Text style={[styles.label, { color: theme.text }]}>
              Amount
            </Text>
            <View style={[styles.amountCard, { backgroundColor: theme.card }]}>
              <View style={styles.amountInputRow}>
                <TextInput
                  style={[styles.amountInput, { color: theme.text }]}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
                <Text style={[styles.amountSymbol, { color: theme.text }]}>
                  {selectedCrypto.symbol}
                </Text>
              </View>
              <Text style={[styles.amountInr, { color: theme.textSecondary }]}>
                ≈ ₹{calculateInrValue().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              <TouchableOpacity
                style={[styles.quickButton, { backgroundColor: theme.card }]}
                onPress={() => setAmount((selectedCrypto.balance * 0.25).toString())}
              >
                <Text style={[styles.quickButtonText, { color: theme.text }]}>
                  25%
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickButton, { backgroundColor: theme.card }]}
                onPress={() => setAmount((selectedCrypto.balance * 0.5).toString())}
              >
                <Text style={[styles.quickButtonText, { color: theme.text }]}>
                  50%
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickButton, { backgroundColor: theme.card }]}
                onPress={() => setAmount((selectedCrypto.balance * 0.75).toString())}
              >
                <Text style={[styles.quickButtonText, { color: theme.text }]}>
                  75%
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickButton, { backgroundColor: theme.card }]}
                onPress={() => setAmount(selectedCrypto.balance.toString())}
              >
                <Text style={[styles.quickButtonText, { color: theme.text }]}>
                  MAX
                </Text>
              </TouchableOpacity>
            </View>

            {/* Balance Info */}
            <View style={[styles.balanceInfo, { backgroundColor: theme.card }]}>
              <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>
                Available Balance
              </Text>
              <Text style={[styles.balanceAmount, { color: theme.text }]}>
                {selectedCrypto.balance} {selectedCrypto.symbol}
              </Text>
              <Text style={[styles.balanceInr, { color: theme.textSecondary }]}>
                ≈ ₹{(selectedCrypto.balance * selectedCrypto.priceInr).toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Fee Info */}
            <View style={[styles.feeCard, { backgroundColor: '#FFF3CD' }]}>
              <Ionicons name="information-circle" size={20} color="#856404" />
              <View style={styles.feeContent}>
                <Text style={[styles.feeText, { color: '#856404' }]}>
                  Network Fee: ~1% + Gas Fee
                  {'\n'}Fee will be calculated at confirmation
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Send Button */}
      {selectedCrypto && (
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: theme.primary,
                opacity:
                  !amount || !recipientAddress || parseFloat(amount) <= 0
                    ? 0.5
                    : 1,
              },
            ]}
            onPress={handleSend}
            disabled={!amount || !recipientAddress || parseFloat(amount) <= 0}
          >
            <Text style={styles.sendButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
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
  label: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    marginBottom: verticalScale(12),
    marginTop: verticalScale(20),
  },
  cryptoScroll: {
    marginBottom: verticalScale(8),
  },
  cryptoScrollContent: {
    gap: scale(12),
  },
  cryptoOption: {
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    minWidth: scale(100),
  },
  cryptoOptionIcon: {
    width: scale(40),
    height: scale(40),
    marginBottom: verticalScale(8),
  },
  cryptoOptionSymbol: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  cryptoOptionBalance: {
    fontSize: scaleFont(12),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
    gap: scale(12),
  },
  input: {
    flex: 1,
    fontSize: scaleFont(15),
  },
  amountCard: {
    padding: scale(20),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  amountInput: {
    flex: 1,
    fontSize: scaleFont(32),
    fontWeight: '700',
  },
  amountSymbol: {
    fontSize: scaleFont(20),
    fontWeight: '600',
  },
  amountInr: {
    fontSize: scaleFont(16),
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  quickButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  balanceInfo: {
    padding: scale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  balanceLabel: {
    fontSize: scaleFont(13),
    marginBottom: verticalScale(8),
  },
  balanceAmount: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  balanceInr: {
    fontSize: scaleFont(14),
  },
  feeCard: {
    flexDirection: 'row',
    padding: scale(16),
    borderRadius: moderateScale(12),
    gap: scale(12),
  },
  feeContent: {
    flex: 1,
  },
  feeText: {
    fontSize: scaleFont(13),
    lineHeight: scaleFont(18),
  },
  footer: {
    padding: scale(16),
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  sendButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#FFF',
  },
});
