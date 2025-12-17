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
import { useWallet } from "../context/WalletContext";

type FilterOption = "all" | "PAYMENT" | "DEPOSIT";

export default function TransactionHistoryScreen() {
  const { isDarkMode, theme } = useTheme();
  const { transactions, assets } = useWallet();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All" },
    { value: "PAYMENT", label: "Sent" },
    { value: "DEPOSIT", label: "Deposits" },
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      selectedFilter === "all" || tx.type === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      tx.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return { name: "arrow-up", color: "#FF3B30" };
      case "DEPOSIT":
        return { name: "add-circle", color: "#007AFF" };
      default:
        return { name: "time", color: "#FF9500" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "#4CAF50";
      case "PENDING":
        return "#FF9500";
      case "FAILED":
        return "#F44336";
      default: 
        return "#808080";
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
            const asset = assets.find(a => a.symbol === tx.symbol);

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
                    <Image source={asset?.icon || require('../assets/images/icon.png')} style={styles.cryptoIcon} />
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
                        {tx.type} 
                      </Text>
                      {tx.status !== "SUCCESS" && (
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
                      {tx.recipient || "External Wallet"} •{" "}
                      {tx.timestamp.toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          tx.type === "DEPOSIT"
                            ? "#4CAF50"
                            : theme.text,
                      },
                    ]}
                  >
                    {tx.type === "DEPOSIT" ? "+" : "-"}
                    {tx.amountCrypto} {tx.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.transactionInr,
                      { color: theme.textSecondary },
                    ]}
                  >
                    ₹{tx.amountInr.toLocaleString("en-IN")}
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
