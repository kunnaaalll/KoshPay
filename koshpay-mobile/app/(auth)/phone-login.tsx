import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import {
  scale,
  verticalScale,
  moderateScale,
  scaleFont,
  isSmallDevice,
} from "../../utils/responsive";
import { API_URL } from "../../constants/config";

export default function PhoneLoginScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `+91${phoneNumber}` }),
      });

      if (response.ok) {
        const data = await response.json();
        // process data if needed

        setIsLoading(false);
        router.push({
          pathname: "/(auth)/otp-verification",
          params: { phone: `+91${phoneNumber}` },
        });
      } else {
        const errortext = await response.text(); // read as plain text
        setIsLoading(false);
        alert("Error: " + errortext);
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        alert("Network error: " + error.message);
      } else {
        alert("Network error: " + String(error));
      }
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, "");
    // Limit to 10 digits
    return cleaned.slice(0, 10);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={theme.background}
          />

          <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
            {/* Header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.logoContainer,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Ionicons name="wallet" size={48} color={theme.primary} />
              </View>
              <Text style={[styles.appName, { color: theme.text }]}>KoshPay</Text>
              <Text style={[styles.tagline, { color: theme.textSecondary }]}>
                Secure Crypto Payments
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={[styles.title, { color: theme.text }]}>
                Enter your phone number
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                We'll send you a verification code
              </Text>

              {/* Phone Input */}
              <View
                style={[
                  styles.phoneInputContainer,
                  { backgroundColor: theme.card },
                ]}
              >
                <View style={styles.countryCode}>
                  <Text style={[styles.countryCodeText, { color: theme.text }]}>
                    🇮🇳
                  </Text>
                  <Text style={[styles.countryCodeText, { color: theme.text }]}>
                    +91
                  </Text>
                </View>
                <TextInput
                  style={[styles.phoneInput, { color: theme.text }]}
                  placeholder="9876543210"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                  maxLength={10}
                  autoFocus
                />
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  {
                    backgroundColor:
                      phoneNumber.length === 10 ? theme.primary : theme.card,
                    marginTop: 'auto', // Push to bottom of form container
                    marginBottom: 20
                  },
                ]}
                onPress={handleSendOTP}
                disabled={phoneNumber.length !== 10 || isLoading}
              >
                  {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                  ) : (
                  <Text
                      style={[
                      styles.continueButtonText,
                      {
                          color:
                          phoneNumber.length === 10 ? "#FFF" : theme.textSecondary,
                      },
                      ]}
                  >
                      Send OTP
                  </Text>
                  )}
              </TouchableOpacity>

              {/* Terms */}
              <Text style={[styles.termsText, { color: theme.textSecondary }]}>
                By continuing, you agree to our{" "}
                <Text style={{ color: theme.primary }}>Terms of Service</Text> and{" "}
                <Text style={{ color: theme.primary }}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Footer - Only show if keyboard is hidden or handle with KeyboardAvoidingView automatically */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                Need help?{" "}
                <Text
                  style={{ color: theme.primary, fontWeight: "600" }}
                  onPress={() => router.push("/help-support")}
                >
                  Contact Support
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
  },
  header: {
    alignItems: "center",
    marginTop: verticalScale(isSmallDevice ? 20 : 40),
    marginBottom: verticalScale(isSmallDevice ? 40 : 60),
  },
  logoContainer: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(20),
  },
  appName: {
    fontSize: scaleFont(32),
    fontWeight: "700",
    marginBottom: verticalScale(8),
  },
  tagline: {
    fontSize: scaleFont(16),
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: scaleFont(24),
    fontWeight: "700",
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: scaleFont(16),
    marginBottom: verticalScale(isSmallDevice ? 24 : 32),
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(24),
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    paddingRight: scale(12),
    borderRightWidth: 1,
    borderRightColor: "rgba(128,128,128,0.2)",
    marginRight: scale(12),
  },
  countryCodeText: {
    fontSize: scaleFont(18),
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    fontSize: scaleFont(18),
    paddingVertical: verticalScale(16),
  },
  continueButton: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  continueButtonText: {
    fontSize: scaleFont(16),
    fontWeight: "700",
  },
  termsText: {
    fontSize: scaleFont(13),
    textAlign: "center",
    lineHeight: scaleFont(20),
  },
  footer: {
    paddingBottom: verticalScale(32),
    alignItems: "center",
  },
  footerText: {
    fontSize: scaleFont(14),
  },
});
