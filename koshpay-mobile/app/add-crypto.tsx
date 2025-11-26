import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Share,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
type CryptoOption = {
  id: string;
  name: string;
  symbol: string;
  network: string;
  icon: ImageSourcePropType;
  color: string;
};
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

export default function AddCryptoScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const cryptoOptions: CryptoOption[] = [
    {
      id: "1",
      name: "Solana",
      symbol: "SOL",
      network: "Solana Mainnet",
      icon: require("../assets/images/crypto/sol.png"),
      color: "#14F195",
    },
    {
      id: "2",
      name: "Bitcoin",
      symbol: "BTC",
      network: "Bitcoin Network",
      icon: require("../assets/images/crypto/btc.png"),
      color: "#F7931A",
    },
    {
      id: "3",
      name: "Ethereum",
      symbol: "ETH",
      network: "Ethereum Mainnet",
      icon: require("../assets/images/crypto/eth.png"),
      color: "#627EEA",
    },
  ];

  // Mock wallet address - replace with actual from backend
  const walletAddress = selectedCrypto
    ? `${selectedCrypto.symbol.toLowerCase()}1qpzry9x8gf2tvdw0s3jn54khce6mua7l`
    : "";

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareAddress = async () => {
    try {
      await Share.share({
        message: `My ${selectedCrypto?.name} wallet address: ${walletAddress}`,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share");
    }
  };

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
          Add Crypto
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!selectedCrypto ? (
          <>
            {/* Instructions */}
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
              <Ionicons
                name="information-circle"
                size={24}
                color={theme.primary}
              />
              <Text style={[styles.infoText, { color: theme.text }]}>
                Select a cryptocurrency to get your deposit address and QR code
              </Text>
            </View>

            {/* Crypto Options */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Select Cryptocurrency
            </Text>

            {cryptoOptions.map((crypto) => (
              <TouchableOpacity
                key={crypto.id}
                style={[styles.cryptoCard, { backgroundColor: theme.card }]}
                onPress={() => setSelectedCrypto(crypto)}
              >
                <View style={styles.cryptoLeft}>
                  <View
                    style={[
                      styles.cryptoIcon,
                      { backgroundColor: crypto.color + "20" },
                    ]}
                  >
                    <Image
                      source={crypto.icon}
                      style={styles.cryptoIconImage}
                    />
                  </View>

                  <View>
                    <Text style={[styles.cryptoName, { color: theme.text }]}>
                      {crypto.name}
                    </Text>
                    <Text
                      style={[
                        styles.cryptoNetwork,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {crypto.network}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {/* Selected Crypto Header */}
            <TouchableOpacity
              style={[styles.selectedCrypto, { backgroundColor: theme.card }]}
              onPress={() => setSelectedCrypto(null)}
            >
              <View style={styles.selectedLeft}>
                <View
                  style={[
                    styles.selectedIcon,
                    { backgroundColor: selectedCrypto.color + "20" },
                  ]}
                >
                  <Image
                    source={selectedCrypto.icon}
                    style={styles.selectedIconImage}
                  />
                </View>

                <View>
                  <Text style={[styles.selectedName, { color: theme.text }]}>
                    {selectedCrypto.name} ({selectedCrypto.symbol})
                  </Text>
                  <Text
                    style={[
                      styles.selectedNetwork,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {selectedCrypto.network}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color={theme.text} />
            </TouchableOpacity>

            {/* QR Code */}
            <View style={[styles.qrSection, { backgroundColor: theme.card }]}>
              <Text style={[styles.qrTitle, { color: theme.text }]}>
                Scan QR Code
              </Text>
              <View style={styles.qrContainer}>
                <QRCode
                  value={walletAddress}
                  size={200}
                  backgroundColor="#FFFFFF"
                  color="#000000"
                />
              </View>
              <Text style={[styles.qrSubtext, { color: theme.textSecondary }]}>
                Scan this QR code to deposit {selectedCrypto.symbol}
              </Text>
            </View>

            {/* Wallet Address */}
            <View
              style={[styles.addressSection, { backgroundColor: theme.card }]}
            >
              <Text style={[styles.addressTitle, { color: theme.text }]}>
                Wallet Address
              </Text>
              <View
                style={[
                  styles.addressBox,
                  { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                ]}
              >
                <Text
                  style={[styles.addressText, { color: theme.text }]}
                  numberOfLines={2}
                  selectable
                >
                  {walletAddress}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={handleCopyAddress}
                >
                  <Ionicons
                    name={copied ? "checkmark" : "copy-outline"}
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.actionButtonText}>
                    {copied ? "Copied!" : "Copy Address"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: "transparent",
                      borderWidth: 1,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={handleShareAddress}
                >
                  <Ionicons name="share-outline" size={18} color={theme.text} />
                  <Text
                    style={[
                      styles.actionButtonTextSecondary,
                      { color: theme.text },
                    ]}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Important Notes */}
            <View style={[styles.warningCard, { backgroundColor: "#FFF3CD" }]}>
              <Ionicons name="warning" size={20} color="#FF9500" />
              <View style={styles.warningContent}>
                <Text style={[styles.warningTitle, { color: "#856404" }]}>
                  Important Notes
                </Text>
                <Text style={[styles.warningText, { color: "#856404" }]}>
                  • Only send {selectedCrypto.symbol} to this address
                  {"\n"}• Sending other crypto may result in permanent loss
                  {"\n"}• Minimum deposit: 0.001 {selectedCrypto.symbol}
                  {"\n"}• Funds will appear after network confirmation
                </Text>
              </View>
            </View>
          </>
        )}

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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(24),
    gap: scale(12),
  },
  infoText: {
    flex: 1,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginBottom: verticalScale(16),
  },
  cryptoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  cryptoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  cryptoIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  cryptoName: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  cryptoNetwork: {
    fontSize: scaleFont(13),
  },
  selectedCrypto: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  selectedLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  selectedIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  selectedName: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  selectedNetwork: {
    fontSize: scaleFont(12),
  },
  qrSection: {
    alignItems: "center",
    padding: scale(24),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  qrTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginBottom: verticalScale(20),
  },
  qrContainer: {
    padding: scale(16),
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  qrSubtext: {
    fontSize: scaleFont(13),
    textAlign: "center",
  },
  addressSection: {
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  addressTitle: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    marginBottom: verticalScale(12),
  },
  addressBox: {
    padding: scale(16),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  addressText: {
    fontSize: scaleFont(13),
    fontFamily: "Menlo",
    lineHeight: scaleFont(20),
  },
  actionButtons: {
    flexDirection: "row",
    gap: scale(12),
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    gap: scale(8),
  },
  actionButtonText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#FFF",
  },
  actionButtonTextSecondary: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  warningCard: {
    flexDirection: "row",
    padding: scale(16),
    borderRadius: moderateScale(12),
    gap: scale(12),
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    marginBottom: verticalScale(8),
  },
  warningText: {
    fontSize: scaleFont(13),
    lineHeight: scaleFont(20),
  },
  cryptoIconImage: {
    width: scale(32),
    height: scale(32),
    resizeMode: "contain",
  },

  selectedIconImage: {
    width: scale(28),
    height: scale(28),
    resizeMode: "contain",
  },
});
