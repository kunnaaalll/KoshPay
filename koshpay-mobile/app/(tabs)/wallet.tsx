import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../../utils/responsive';
import { useWallet } from "../../context/WalletContext";



interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  priceInr: number;
  icon: ImageSourcePropType;
  change24h: number;
}

interface Transaction {
  id: string;
  type: "send" | "receive";
  crypto: string;
  amount: number;
  priceInr: number;
  date: string;
  time: string;
  address: string;
  recipient?: string;
  sender?: string;
}

export default function WalletScreen() {
  const { isDarkMode, theme } = useTheme();
  const { assets, totalBalanceInr, transactions } = useWallet();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Filter for "Payments Made" (Sent) only, as requested
  const recentPayments = transactions
    .filter(tx => tx.type === 'PAYMENT')
    .slice(0, 3); // Show top 3



  // const getCryptoIcon = (symbol: string) => {
  //   const iconMap: { [key: string]: any } = {
  //     BTC: 'logo-bitcoin',
  //     SOL: 'triangle',
  //     ETH: 'logo-ethereum',
  //   };
  //   return <Ionicons name={iconMap[symbol] || 'ellipse'} size={32} />;
  // };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={{ paddingTop: insets.top }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.walletLabel, { color: theme.textSecondary }]}>
              Total Balance
            </Text>
            <Text style={[styles.totalBalance, { color: theme.text }]}>
              ₹
              {totalBalanceInr.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="settings-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push("/add-crypto")}
          >
            <View
              style={[styles.quickActionButton, { backgroundColor: "#1565C0" }]}
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>
            <Text style={[styles.quickActionLabel, { color: theme.text }]}>
              Add Crypto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}
          onPress={() => router.push("/send-crypto")}>
            <View
              style={[styles.quickActionButton, { backgroundColor: "#7B1FA2" }]}
            >
              <Ionicons name="arrow-up" size={28} color="#FFFFFF" />
            </View>
            <Text style={[styles.quickActionLabel, { color: theme.text }]}>
              Send Crypto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Crypto Assets */}
        <View style={styles.assetsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Assets
          </Text>

          {assets.map((asset) => {
            const valueInr = asset.balance * asset.priceInr;
            return (
              <TouchableOpacity
                key={asset.id}
                style={[styles.assetCard, { backgroundColor: theme.card }]}
              >
                <View style={styles.assetLeft}>
                  <View
                    style={[
                      styles.assetIcon,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)",
                      },
                    ]}
                  >
                    <Image source={asset.icon} style={styles.cryptoLogo} />
                  </View>
                  <View style={styles.assetInfo}>
                    <Text style={[styles.assetName, { color: theme.text }]}>
                      {asset.name}
                    </Text>
                    <View style={styles.assetBalanceRow}>
                      <Text
                        style={[
                          styles.assetBalance,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {asset.balance} {asset.symbol}
                      </Text>
                      <Text
                        style={[
                          styles.assetDot,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {" "}
                        •{" "}
                      </Text>
                      <Text
                        style={[
                          styles.assetPrice,
                          { color: theme.textSecondary },
                        ]}
                      >
                        ₹{asset.priceInr.toLocaleString("en-IN")}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.assetRight}>
                  <Text style={[styles.assetValue, { color: theme.text }]}>
                    ₹
                    {valueInr.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <Text
                    style={[
                      styles.assetChange,
                      { color: (asset.change24h || 0) >= 0 ? "#4CAF50" : "#F44336" },
                    ]}
                  >
                    {(asset.change24h || 0) >= 0 ? "+" : ""}
                    {(asset.change24h || 0).toFixed(2)}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent Transactions */}
        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/transaction-history")}
            >
              <Text style={[styles.seeAll, { color: theme.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {recentPayments.map((transaction) => {
             // Find asset for icon
             const asset = assets.find(a => a.symbol === transaction.symbol);

             return (
            <TouchableOpacity
              key={transaction.id}
              style={[styles.transactionCard, { backgroundColor: theme.card }]}
              onPress={() => {
                router.push({
                  pathname: "/transaction-details",
                  params: { id: transaction.id },
                });
              }}
            >
              <View style={styles.transactionLeft}>
                <View style={styles.iconContainer}>
                  <Image
                    source={asset?.icon || require('../../assets/images/icon.png')}
                    style={styles.transactionCryptoIcon}
                  />
                  <View
                    style={[
                      styles.typeIndicator,
                      {
                        backgroundColor:
                           "#FF3B30",
                      },
                    ]}
                  >
                    <Ionicons
                      name="arrow-up"
                      size={12}
                      color="#FFF"
                    />
                  </View>
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionType, { color: theme.text }]}>
                    Sent {transaction.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.transactionMeta,
                      { color: theme.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {transaction.recipient || "External Wallet"}{" "}
                    • {transaction.timestamp.toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionRight}>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  -
                  {transaction.amountCrypto} {transaction.symbol}
                </Text>
                <Text
                  style={[
                    styles.transactionInr,
                    { color: theme.textSecondary },
                  ]}
                >
                  ₹{transaction.amountInr.toLocaleString("en-IN")}
                </Text>
              </View>
            </TouchableOpacity>
          )})}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
  },
  walletLabel: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(8),
  },
  totalBalance: {
    fontSize: scaleFont(36),
    fontWeight: "bold",
  },
  settingsButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(32),
    gap: scale(16),
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(12),
  },
  quickActionButton: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    textAlign: "center",
  },
  assetsSection: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontWeight: "600",
    marginBottom: verticalScale(16),
  },
  assetCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  assetIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  cryptoLogo: {
    width: scale(34),
    height: scale(34),
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  assetBalanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  assetBalance: {
    fontSize: scaleFont(13),
  },
  assetDot: {
    fontSize: scaleFont(13),
  },
  assetPrice: {
    fontSize: scaleFont(13),
  },
  assetRight: {
    alignItems: "flex-end",
  },
  assetValue: {
    fontSize: scaleFont(16),
    fontWeight: "700",
    marginBottom: verticalScale(4),
  },
  assetChange: {
    fontSize: scaleFont(13),
    fontWeight: "600",
  },
  transactionsSection: {
    paddingHorizontal: scale(20),
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  seeAll: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    padding: scale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  transactionIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },

  transactionBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: scaleFont(13),
  },
  transactionValue: {
    fontSize: scaleFont(13),
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(10),
    backgroundColor: "transparent",
    borderWidth: 1,
    gap: scale(6),
  },

  viewAllText: {
    fontSize: scaleFont(15),
    fontWeight: "600",
  },

  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },

  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
    marginRight: scale(12),
  },

  iconContainer: {
    position: "relative",
  },

  transactionCryptoIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
  },

  typeIndicator: {
    position: "absolute",
    bottom: scale(-2),
    right: scale(-2),
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  transactionInfo: {
    flex: 1,
  },

  transactionType: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },

  transactionMeta: {
    fontSize: scaleFont(13),
  },

  transactionRight: {
    alignItems: "flex-end",
    minWidth: scale(100),
  },

  transactionAmount: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },

  transactionInr: {
    fontSize: scaleFont(13),
  },
});
