import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  ScrollView,
  Image,
  ImageSourcePropType,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';
import { useRouter, useLocalSearchParams } from "expo-router";

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  icon: ImageSourcePropType;
  iconColor: string;
  priceInr: number;
}

interface WalletOption {
  id: string;
  name: string;
  type: "koshpay" | "external";
  balance?: number;
  icon: string;
}

export default function PaymentScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const recipient = {
    name: (params.name as string) || "SANGEETA ARVIND PARMAR",
    bankingName: (params.bankingName as string) || "SANGEETA ARVIND PAR...",
    phone: (params.phone as string) || "+91 86898 13378",
    koshpayId: (params.koshpayId as string) || "kparmar2911",
  };

  const [amount, setAmount] = useState("");
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);

  const cryptoOptions: CryptoOption[] = [
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      icon: require("../assets/images/crypto/btc.png"),
      iconColor: "#F7931A",
      priceInr: 9135000,
    },
    {
      id: "2",
      name: "Solana",
      symbol: "SOL",
      icon: require("../assets/images/crypto/sol.png"),
      iconColor: "#14F195",
      priceInr: 15420,
    },
    {
      id: "3",
      name: "Ethereum",
      symbol: "ETH",
      icon: require("../assets/images/crypto/eth.png"),
      iconColor: "#627EEA",
      priceInr: 318500,
    },
  ];

  const walletOptions: WalletOption[] = [
    {
      id: "1",
      name: "KoshPay Wallet",
      type: "koshpay",
      balance: 0.0234,
      icon: "wallet",
    },
    { id: "2", name: "Phantom", type: "external", icon: "apps" },
    { id: "3", name: "Trust Wallet", type: "external", icon: "apps" },
    { id: "4", name: "MetaMask", type: "external", icon: "apps" },
  ];

  // Blinking Cursor Component
  const BlinkingCursor = () => {
    const opacity = useSharedValue(1);

    useEffect(() => {
      opacity.value = withRepeat(
        withTiming(0, { duration: 530 }),
        -1,
        true
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        style={[
          styles.cursor,
          { backgroundColor: theme.text },
          animatedStyle,
        ]}
      />
    );
  };

  const handleNumberPress = (num: string) => {
    if (num === "backspace") {
      setAmount(amount.slice(0, -1));
    } else if (num === ".") {
      if (!amount.includes(".")) {
        setAmount(amount + ".");
      }
    } else {
      // Prevent leading zeros
      if (amount === "0" && num !== ".") {
        setAmount(num);
      } else {
        setAmount(amount + num);
      }
    }
  };

  const calculateCryptoAmount = () => {
    if (!amount || !selectedCrypto) return "0";
    const amountInr = parseFloat(amount);
    if (isNaN(amountInr)) return "0";
    const cryptoAmount = amountInr / selectedCrypto.priceInr;
    return cryptoAmount.toFixed(8);
  };

  const handleClose = () => {
    router.back();
  };

  const handleProceedToPay = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelectionAndPay = (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setShowWalletModal(false);

    if (!selectedCrypto || !amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter amount");
      return;
    }

    const cryptoAmount = calculateCryptoAmount();

    router.push({
      pathname: "/payment-confirmation",
      params: {
        amount: cryptoAmount,
        inrAmount: amount,
        crypto: selectedCrypto.symbol,
        recipientName: recipient.name,
        walletAddress: "0x" + Math.random().toString(36).substr(2, 9),
        cryptoPrice: selectedCrypto.priceInr.toString(),
        wallet: wallet.name,
        walletType: wallet.type,
      },
    });
  };

  const canProceed = amount && parseFloat(amount) > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={{ paddingTop: insets.top }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Recipient Info */}
        <View style={styles.recipientSection}>
          <View style={[styles.recipientAvatar, { backgroundColor: theme.card }]}>
            <Ionicons name="person" size={40} color={theme.textSecondary} />
          </View>
          <Text style={[styles.recipientName, { color: theme.text }]}>
            Paying {recipient.name}
          </Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={[styles.bankingName, { color: theme.textSecondary }]}>
              Banking name: {recipient.bankingName}
            </Text>
          </View>
          <Text style={[styles.phone, { color: theme.textSecondary }]}>
            {recipient.phone}
          </Text>
        </View>

        {/* Choose Crypto Button */}
        <TouchableOpacity
          style={[styles.chooseCryptoButton, { backgroundColor: theme.card }]}
          onPress={() => setShowCryptoModal(true)}
        >
          {selectedCrypto ? (
            <View style={styles.selectedCryptoContent}>
              <Image source={selectedCrypto.icon} style={styles.cryptoIcon} />
              <Text style={[styles.selectedCryptoText, { color: theme.text }]}>
                Pay with {selectedCrypto.name}
              </Text>
            </View>
          ) : (
            <Text style={[styles.chooseCryptoText, { color: theme.text }]}>
              Choose Cryptocurrency
            </Text>
          )}
          <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Amount Display */}
        {selectedCrypto && (
          <View style={styles.amountSection}>
            <View style={styles.amountDisplay}>
              <Text style={[styles.rupeeSymbol, { color: theme.text }]}>₹</Text>
              {amount ? (
                <>
                  <Text style={[styles.amountText, { color: theme.text }]}>
                    {amount}
                  </Text>
                  <BlinkingCursor />
                </>
              ) : (
                <>
                  <BlinkingCursor />
                  <Text style={[styles.amountPlaceholder, { color: theme.textSecondary }]}>
                    0
                  </Text>
                </>
              )}
            </View>
            {amount && parseFloat(amount) > 0 && (
              <Text style={[styles.cryptoAmount, { color: theme.textSecondary }]}>
                ≈ {calculateCryptoAmount()} {selectedCrypto.symbol}
              </Text>
            )}
          </View>
        )}

        {/* Add Note */}
        {selectedCrypto && (
          <TouchableOpacity style={styles.addNoteButton}>
            <Text style={[styles.addNoteText, { color: theme.textSecondary }]}>
              Add note
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Custom Numpad + Pay Button */}
      {selectedCrypto && (
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom }]}>
          {/* Custom Numpad */}
          <View style={styles.numpad}>
            {/* Row 1 */}
            <View style={styles.numpadRow}>
              {["1", "2", "3"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numpadButton, { backgroundColor: theme.card }]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View style={styles.numpadRow}>
              {["4", "5", "6"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numpadButton, { backgroundColor: theme.card }]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 3 */}
            <View style={styles.numpadRow}>
              {["7", "8", "9"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numpadButton, { backgroundColor: theme.card }]}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 4 */}
            <View style={styles.numpadRow}>
              <TouchableOpacity
                style={[styles.numpadButton, { backgroundColor: theme.card }]}
                onPress={() => handleNumberPress(".")}
                activeOpacity={0.7}
              >
                <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                  .
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.numpadButton, { backgroundColor: theme.card }]}
                onPress={() => handleNumberPress("0")}
                activeOpacity={0.7}
              >
                <Text style={[styles.numpadButtonText, { color: theme.text }]}>
                  0
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.numpadButton, { backgroundColor: theme.card }]}
                onPress={() => handleNumberPress("backspace")}
                activeOpacity={0.7}
              >
                <Ionicons name="backspace-outline" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pay Button */}
          <View style={styles.payButtonContainer}>
            <TouchableOpacity
              style={[
                styles.payButton,
                {
                  backgroundColor: canProceed ? theme.primary : theme.card,
                },
              ]}
              onPress={handleProceedToPay}
              disabled={!canProceed}
            >
              <Text
                style={[
                  styles.payButtonText,
                  {
                    color: canProceed ? "#FFFFFF" : theme.textSecondary,
                  },
                ]}
              >
                Proceed to Pay
              </Text>
            </TouchableOpacity>
            <View style={styles.poweredBy}>
              <Text style={[styles.poweredByText, { color: theme.textSecondary }]}>
                POWERED BY
              </Text>
              <Text style={[styles.koshpayText, { color: theme.text }]}>
                KOSHPAY
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Crypto Modal */}
      <Modal
        visible={showCryptoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCryptoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => setShowCryptoModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Choose Crypto Currency
            </Text>
            {cryptoOptions.map((crypto) => (
              <TouchableOpacity
                key={crypto.id}
                style={styles.cryptoOption}
                onPress={() => {
                  setSelectedCrypto(crypto);
                  setShowCryptoModal(false);
                }}
              >
                <View style={styles.cryptoOptionLeft}>
                  <Image source={crypto.icon} style={styles.cryptoIcon} />
                  <View>
                    <Text style={[styles.cryptoName, { color: theme.text }]}>
                      {crypto.name}
                    </Text>
                    <Text style={[styles.cryptoSymbol, { color: theme.textSecondary }]}>
                      {crypto.symbol}
                    </Text>
                  </View>
                </View>
                {selectedCrypto?.id === crypto.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        visible={showWalletModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWalletModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => setShowWalletModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Choose wallet to pay with
            </Text>
            {walletOptions.map((wallet) => (
              <TouchableOpacity
                key={wallet.id}
                style={styles.walletOption}
                onPress={() => handleWalletSelectionAndPay(wallet)}
              >
                <View style={styles.walletOptionLeft}>
                  <View
                    style={[
                      styles.walletIconContainer,
                      {
                        backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5",
                        borderStyle: wallet.type === "koshpay" ? "solid" : "dashed",
                        borderWidth: wallet.type === "koshpay" ? 0 : 2,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Ionicons name={wallet.icon as any} size={28} color={theme.primary} />
                  </View>
                  <View>
                    <Text style={[styles.walletName, { color: theme.text }]}>
                      {wallet.name}
                    </Text>
                    {wallet.type === "koshpay" ? (
                      <Text style={[styles.walletType, { color: theme.textSecondary }]}>
                        Balance: {wallet.balance} {selectedCrypto?.symbol}
                      </Text>
                    ) : (
                      <Text style={[styles.walletType, { color: theme.textSecondary }]}>
                        External wallet
                      </Text>
                    )}
                  </View>
                </View>
                {selectedWallet?.id === wallet.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
  },
  closeButton: { padding: scale(4) },
  moreButton: { padding: scale(4) },
  recipientSection: {
    alignItems: "center",
    paddingBottom: isSmallDevice ? verticalScale(12) : verticalScale(24),
  },
  recipientAvatar: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
  },
  recipientName: {
    fontSize: scaleFont(18),
    fontWeight: "600",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: verticalScale(4),
  },
  bankingName: { fontSize: scaleFont(13) },
  phone: { fontSize: scaleFont(14), marginTop: verticalScale(4) },
  amountSection: {
    alignItems: "center",
    paddingVertical: isSmallDevice ? verticalScale(12) : verticalScale(24),
  },
  amountDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rupeeSymbol: { 
    fontSize: scaleFont(40), 
    fontWeight: "600", 
    marginRight: scale(8) 
  },
  amountText: { 
    fontSize: scaleFont(56), 
    fontWeight: "600",
  },
  amountPlaceholder: {
    fontSize: scaleFont(56), 
    fontWeight: "600",
  },
  cursor: {
    width: scale(3),
    height: scaleFont(50),
    marginLeft: scale(4),
    borderRadius: moderateScale(2),
  },
  cryptoAmount: { 
    fontSize: scaleFont(16), 
    marginTop: verticalScale(8), 
    fontWeight: "600" 
  },
  addNoteButton: { 
    alignItems: "center", 
    paddingVertical: verticalScale(16) 
  },
  addNoteText: { fontSize: scaleFont(16) },
  chooseCryptoButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: scale(20),
    padding: scale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  selectedCryptoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  selectedCryptoText: { 
    fontSize: scaleFont(16), 
    fontWeight: "600" 
  },
  chooseCryptoText: { fontSize: scaleFont(16) },
  bottomContainer: {},
  numpad: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  numpadRow: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  numpadButton: {
    flex: 1,
    aspectRatio: isSmallDevice ? 3 : 2.5,
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  numpadButtonText: {
    fontSize: scaleFont(28),
    fontWeight: "600",
  },
  payButtonContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(20),
  },
  payButton: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(28),
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  payButtonText: { 
    fontSize: scaleFont(18), 
    fontWeight: "700" 
  },
  poweredBy: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(6),
  },
  poweredByText: { fontSize: scaleFont(11) },
  koshpayText: { 
    fontSize: scaleFont(11), 
    fontWeight: "700" 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalOverlayTouch: { flex: 1 },
  modalContent: {
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    padding: scale(20),
    maxHeight: "70%",
  },
  modalTitle: { 
    fontSize: scaleFont(20), 
    fontWeight: "600", 
    marginBottom: verticalScale(20) 
  },
  cryptoOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  cryptoOptionLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: scale(16) 
  },
  cryptoIcon: {
    width: scale(32),
    height: scale(32),
  },
  cryptoName: { 
    fontSize: scaleFont(16), 
    fontWeight: "600" 
  },
  cryptoSymbol: { 
    fontSize: scaleFont(13), 
    marginTop: verticalScale(2) 
  },
  walletOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  walletOptionLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: scale(16) 
  },
  walletIconContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  walletName: { 
    fontSize: scaleFont(16), 
    fontWeight: "600" 
  },
  walletType: { 
    fontSize: scaleFont(13), 
    marginTop: verticalScale(2) 
  },
});
