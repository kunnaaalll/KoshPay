import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../context/AuthContext";

const AnimatedOTPInput = ({ digit, isActive, isFilled }: any) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 10 })
      );
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.6, { duration: 200 })
      );
    } else if (isFilled) {
      glowOpacity.value = withTiming(0.3, { duration: 200 });
    } else {
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isActive, isFilled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.otpInputWrapper, animatedStyle]}>
      {(isActive || isFilled) && (
        <Animated.View
          style={[styles.glowBorder, { borderColor: theme.primary }, glowStyle]}
        />
      )}
      <View
        style={[
          styles.otpInputBox,
          {
            backgroundColor: theme.card,
            borderColor: isFilled || isActive ? theme.primary : "transparent",
          },
        ]}
      >
        <Text style={[styles.otpDigit, { color: theme.text }]}>{digit}</Text>
      </View>
      {isActive && (
        <View
          style={[styles.activeIndicator, { backgroundColor: theme.primary }]}
        />
      )}
    </Animated.View>
  );
};

export default function OTPVerificationScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { login } = useAuth();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const hiddenInputRef = useRef<TextInput>(null);
  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
  };

  const handleFullOtpChange = (value: string) => {
    const digits = value.slice(0, 6).split("");
    const newOtp = [...digits];
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);

    // Auto-verify when full code entered
    if (digits.length === 6) {
      handleVerifyOtp(digits.join(""));
    }
  };
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) {
      Alert.alert("Enter a 6-digit code");
      return;
    }
    setIsLoading(true);
    try {
      await login(String(phone), code);
      setIsLoading(false);

      // Check for Demo User to skip KYC navigation
      const normalizedPhone = String(phone).replace(/\s/g, '').replace(/^\+91/, '');
      if (normalizedPhone === '9999999999') {
          router.replace("/(tabs)");
      } else {
          router.replace("/kyc-basic-info");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", String(error));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      focusInput();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Ionicons name="lock-closed" size={40} color={theme.primary} />
          </View>
        </View>

        {/* Text */}
        <Text style={[styles.title, { color: theme.text }]}>
          Enter verification code
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          We've sent a 6-digit code to {phone}
        </Text>

        {/* OTP Input area */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={focusHiddenInput}
          style={styles.otpContainer}
        >
          {otp.map((digit, index) => (
            <AnimatedOTPInput
              key={index}
              digit={digit}
              isActive={activeIndex === index}
              isFilled={digit !== ""}
            />
          ))}

          <TextInput
            ref={hiddenInputRef}
            value={otp.join("")}
            onChangeText={handleFullOtpChange}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            textContentType="oneTimeCode"
            caretHidden={true}
            underlineColorAndroid="transparent"
            style={styles.hiddenInput}
          />
        </TouchableOpacity>
        {/* Resend Timer */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity
              onPress={() => {
                setTimer(60);
                setCanResend(false);
                alert("OTP sent!"); /* trigger resend API here */
              }}
            >
              <Text style={[styles.resendText, { color: theme.primary }]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.timerText, { color: theme.textSecondary }]}>
              Resend in {timer}s
            </Text>
          )}
        </View>

        {/* Change number */}
        <TouchableOpacity
          style={styles.changeNumberButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.changeNumberText, { color: theme.text }]}>
            Change phone number?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: { alignItems: "center", marginVertical: 20 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
  },
  subtitle: { textAlign: "center", fontSize: 16, marginBottom: 20 },
  otpContainer: { flexDirection: "row", justifyContent: "center", gap: 12 },
  otpInputWrapper: { position: "relative" },
  glowBorder: {
    position: "absolute",
    inset: -2,
    borderWidth: 2,
    borderRadius: 14,
  },
  otpInputBox: {
    width: 50,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
  },
  otpDigit: { fontSize: 24, fontWeight: "700" },
  activeIndicator: {
    position: "absolute",
    bottom: 8, // Or verticalScale(8)
    left: "15%", // Use percentage to adapt to box width
    right: "15%",
    height: 3, // Or verticalScale(3)
    borderRadius: 2, // Or moderateScale(2)
    backgroundColor: "#356AE6", // Your theme.primary or desired color
  },

  resendContainer: { alignItems: "center", marginVertical: 20 },
  resendText: { fontSize: 16, fontWeight: "600" },
  timerText: { fontSize: 14 },
  changeNumberButton: { alignItems: "center", marginVertical: 10 },
  changeNumberText: { fontSize: 14, textDecorationLine: "underline" },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
});
