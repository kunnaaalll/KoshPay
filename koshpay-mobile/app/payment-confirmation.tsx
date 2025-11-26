import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PaymentConfirmationScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);

  const slideAnim = useSharedValue(SCREEN_HEIGHT);

  // Payment details from params
  const amount = (params.amount as string) || "0";
  const crypto = (params.crypto as string) || "SOL";
  const recipientName = (params.recipientName as string) || "User";
  const walletAddress = (params.walletAddress as string) || "0x...";
  const cryptoPrice = parseFloat(params.cryptoPrice as string) || 0;

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  useEffect(() => {
  if (showPinInput) {
    slideAnim.value = withSpring(0, { 
      damping: 38,      // ← Higher = less bouncy (try 25-40)
      stiffness: 500,   // ← Higher = faster (try 200-400)
    });
  } else {
    slideAnim.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
  }
}, [showPinInput]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (error) {
      setBiometricAvailable(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      setIsVerifying(true);
      const result = await LocalAuthentication.authenticateAsync({
        reason: "Verify your identity to confirm payment",
        fallbackLabel: "Use PIN instead",
        disableDeviceFallback: false,
      });

      if (result.success) {
        router.push({
          pathname: "/payment-success",
          params: {
            amount,
            crypto,
            recipientName,
            walletAddress,
          },
        });
      }
    } catch (error) {
      Alert.alert("Biometric Auth Failed", "Please try again or use PIN");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNumberPress = (num: string) => {
    if (num === "backspace") {
      setPin(pin.slice(0, -1));
    } else if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      // Auto-verify when 4 digits entered
      if (newPin.length === 4) {
        setTimeout(() => handlePinVerify(newPin), 300);
      }
    }
  };

  const handlePinVerify = (pinToVerify: string = pin) => {
    if (pinToVerify.length !== 4) {
      Alert.alert("Invalid PIN", "PIN must be 4 digits");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      router.push({
        pathname: "/payment-success",
        params: {
          amount,
          crypto,
          recipientName,
          walletAddress,
        },
      });
      setIsVerifying(false);
    }, 1000);
  };

  const inrAmount = (parseFloat(amount) * cryptoPrice).toFixed(2);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Confirm Payment
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              To
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {recipientName}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Amount (INR)
            </Text>
            <Text style={[styles.inrValue, { color: theme.primary }]}>
              ₹{inrAmount}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Crypto Amount
            </Text>
            <View style={styles.amountContainer}>
              <Text style={[styles.amountValue, { color: theme.text }]}>
                {parseFloat(amount).toFixed(8)}
              </Text>
              <Text style={[styles.cryptoSymbol, { color: theme.textSecondary }]}>
                {crypto}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <View>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Network Fee
              </Text>
              <Text style={[styles.feeNote, { color: theme.textSecondary }]}>
                1% Platform Commission + Gas
              </Text>
            </View>
            <Text style={[styles.feeValue, { color: theme.textSecondary }]}>
              {(parseFloat(amount) * 0.01 + 0.00005).toFixed(8)} {crypto}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={[styles.detailRow, { paddingTop: 12, paddingBottom: 8 }]}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>
              Total to Pay
            </Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.totalValue, { color: theme.primary }]}>
                {(parseFloat(amount) + parseFloat(amount) * 0.01 + 0.00005).toFixed(8)}
              </Text>
              <Text style={[styles.totalSymbol, { color: theme.textSecondary }]}>
                {crypto}
              </Text>
            </View>
          </View>
        </View>

        {/* Authentication Section */}
        <View style={styles.authSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Verify Payment
          </Text>

          {/* Biometric Button */}
          {biometricAvailable && (
            <TouchableOpacity
              style={[styles.biometricButton, { backgroundColor: theme.primary }]}
              onPress={handleBiometricAuth}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="finger-print" size={32} color="#FFF" />
                  <Text style={styles.biometricButtonText}>
                    Verify with Biometric
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* PIN Button */}
          <TouchableOpacity
            style={[
              styles.pinButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setShowPinInput(true)}
          >
            <Ionicons name="lock-closed" size={24} color={theme.text} />
            <Text style={[styles.pinButtonText, { color: theme.text }]}>
              Use PIN
            </Text>
          </TouchableOpacity>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Your transaction is secure and encrypted
          </Text>
        </View>
      </ScrollView>

      {/* PIN Bottom Sheet */}
      {showPinInput && (
        <>
          {/* Backdrop */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => {
              setShowPinInput(false);
              setPin("");
            }}
          />

          {/* Bottom Sheet */}
          <Animated.View
            style={[
              styles.bottomSheet,
              { backgroundColor: theme.background, paddingBottom: insets.bottom },
              animatedStyle,
            ]}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar}>
              <View style={[styles.handle, { backgroundColor: theme.textSecondary }]} />
            </View>

            <Text style={[styles.pinTitle, { color: theme.text }]}>
              Enter your 4-digit PIN
            </Text>

            {/* PIN Dots */}
            <View style={styles.pinDotsContainer}>
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    {
                      backgroundColor:
                        index < pin.length ? theme.primary : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                />
              ))}
            </View>

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
                <View style={[styles.numpadButton, { opacity: 0 }]} />

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

            {/* Loading indicator when verifying */}
            {isVerifying && (
              <View style={styles.verifyingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.verifyingText, { color: theme.text }]}>
                  Verifying...
                </Text>
              </View>
            )}
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(100),
  },
  detailsCard: {
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(24),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(12),
  },
  detailLabel: {
    fontSize: scaleFont(14),
    fontWeight: "500",
  },
  detailValue: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  divider: {
    height: 1,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  amountValue: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  cryptoSymbol: {
    fontSize: scaleFont(12),
    fontWeight: "500",
  },
  inrValue: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  feeNote: {
    fontSize: scaleFont(11),
    marginTop: verticalScale(2),
    fontWeight: '400',
  },
  feeValue: {
    fontSize: scaleFont(13),
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: scaleFont(16),
    fontWeight: '700',
  },
  totalValue: {
    fontSize: scaleFont(16),
    fontWeight: '700',
  },
  totalSymbol: {
    fontSize: scaleFont(12),
    marginTop: verticalScale(2),
  },
  authSection: {
    gap: verticalScale(12),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginBottom: verticalScale(12),
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    gap: scale(12),
  },
  biometricButtonText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    color: "#FFF",
  },
  pinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    gap: scale(12),
  },
  pinButtonText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
  infoText: {
    fontSize: scaleFont(12),
    textAlign: "center",
    marginTop: verticalScale(12),
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingTop: verticalScale(8),
    paddingHorizontal: scale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  handle: {
    width: scale(40),
    height: verticalScale(4),
    borderRadius: moderateScale(2),
    opacity: 0.3,
  },
  pinTitle: {
    fontSize: scaleFont(18),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: verticalScale(24),
    marginTop: verticalScale(8),
  },
  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    gap: scale(16),
    marginBottom: verticalScale(32),
  },
  pinDot: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    borderWidth: 2,
  },
  numpad: {
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(16),
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
  verifyingContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  verifyingText: {
    marginTop: verticalScale(12),
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
});
