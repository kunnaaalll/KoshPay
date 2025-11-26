import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

type TransactionType = "send" | "receive" | "deposit" | "withdrawal";
type TransactionStatus = "completed" | "pending" | "failed";

type Transaction = {
  id: string;
  type: TransactionType;
  crypto: string;
  amount: number;
  inrValue: number;
  date: string;
  time: string;
  recipient?: string;
  sender?: string;
  txHash: string;
  status: TransactionStatus;
  icon: any;
};

type FilterOption = "all" | "send" | "receive" | "deposit" | "withdrawal";

export default function TransactionHistoryScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

  // Mock transaction data
  const allTransactions: Transaction[] = [
    {
      id: "1",
      type: "send",
      crypto: "SOL",
      amount: 0.5,
      inrValue: 7710,
      date: "Today",
      time: "2:30 PM",
      recipient: "Raj Kumar",
      txHash: "5KJp4v1mPYcz...",
      status: "completed",
      icon: require("../assets/images/crypto/sol.png"),
    },
    {
      id: "2",
      type: "receive",
      crypto: "BTC",
      amount: 0.001,
      inrValue: 9135,
      date: "Yesterday",
      time: "6:45 PM",
      sender: "Priya Sharma",
      txHash: "2xA9mN8kLpQ...",
      status: "completed",
      icon: require("../assets/images/crypto/btc.png"),
    },
    {
      id: "3",
      type: "deposit",
      crypto: "ETH",
      amount: 0.05,
      inrValue: 15925,
      date: "Yesterday",
      time: "3:20 PM",
      txHash: "8pL2vK9mXqR...",
      status: "completed",
      icon: require("../assets/images/crypto/eth.png"),
    },
    {
      id: "4",
      type: "send",
      crypto: "SOL",
      amount: 1.2,
      inrValue: 18504,
      date: "Nov 14",
      time: "11:15 AM",
      recipient: "Amit Patel",
      txHash: "9vN3pL5kQwZ...",
      status: "pending",
      icon: require("../assets/images/crypto/sol.png"),
    },
    {
      id: "5",
      type: "withdrawal",
      crypto: "BTC",
      amount: 0.002,
      inrValue: 18270,
      date: "Nov 13",
      time: "4:30 PM",
      txHash: "1mK8nP2vLxY...",
      status: "completed",
      icon: require("../assets/images/crypto/btc.png"),
    },
  ];

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All" },
    { value: "send", label: "Sent" },
    { value: "receive", label: "Received" },
    { value: "deposit", label: "Deposits" },
    { value: "withdrawal", label: "Withdrawals" },
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesFilter =
      selectedFilter === "all" || tx.type === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      tx.crypto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "send":
        return { name: "arrow-up", color: "#FF3B30" };
      case "receive":
        return { name: "arrow-down", color: "#4CAF50" };
      case "deposit":
        return { name: "add-circle", color: "#007AFF" };
      case "withdrawal":
        return { name: "remove-circle", color: "#FF9500" };
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#FF9500";
      case "failed":
        return "#F44336";
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
          Transaction History
        </Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search transactions..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === option.value
                    ? theme.primary
                    : theme.background,
                borderColor:
                  selectedFilter === option.value
                    ? theme.primary
                    : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter(option.value)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: selectedFilter === option.value ? "#FFF" : theme.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="receipt-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No transactions found
            </Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => {
            const iconConfig = getTransactionIcon(tx.type);
            return (
              <TouchableOpacity
                key={tx.id}
                style={[
                  styles.transactionCard,
                  { backgroundColor: theme.card },
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/transaction-details",
                    params: { id: tx.id },
                  });
                }}
              >
                <View style={styles.transactionLeft}>
                  <View style={styles.iconContainer}>
                    <Image source={tx.icon} style={styles.cryptoIcon} />
                    <View
                      style={[
                        styles.typeIndicator,
                        { backgroundColor: iconConfig.color },
                      ]}
                    >
                      <Ionicons
                        name={iconConfig.name as any}
                        size={12}
                        color="#FFF"
                      />
                    </View>
                  </View>

                  <View style={styles.transactionInfo}>
                    <View style={styles.transactionRow}>
                      <Text
                        style={[styles.transactionType, { color: theme.text }]}
                      >
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </Text>
                      {tx.status !== "completed" && (
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(tx.status) + "20",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              { color: getStatusColor(tx.status) },
                            ]}
                          >
                            {tx.status}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.transactionMeta,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {tx.recipient || tx.sender || "External Wallet"} •{" "}
                      {tx.date} at {tx.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          tx.type === "receive" || tx.type === "deposit"
                            ? "#4CAF50"
                            : theme.text,
                      },
                    ]}
                  >
                    {tx.type === "receive" || tx.type === "deposit" ? "+" : "-"}
                    {tx.amount} {tx.crypto}
                  </Text>
                  <Text
                    style={[
                      styles.transactionInr,
                      { color: theme.textSecondary },
                    ]}
                  >
                    ₹{tx.inrValue.toLocaleString("en-IN")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: scaleFont(15),
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(16),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontSize: scaleFont(16),
    marginTop: verticalScale(16),
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
  },
  iconContainer: {
    position: "relative",
  },
  cryptoIcon: {
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
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: verticalScale(4),
  },
  transactionType: {
    fontSize: scaleFont(15),
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
  },
  statusText: {
    fontSize: scaleFont(11),
    fontWeight: "600",
    textTransform: "capitalize",
  },
  transactionMeta: {
    fontSize: scaleFont(13),
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  transactionInr: {
    fontSize: scaleFont(13),
  },
  filterContainer: {
    marginBottom: verticalScale(12),
    maxHeight: verticalScale(50),
  },

  filterContent: {
    paddingHorizontal: scale(16),
    gap: scale(10),
    paddingVertical: verticalScale(4),
  },

  filterChip: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(24),
    borderWidth: 1,
  },

  filterText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
});
