import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../../utils/responsive';

// ... imports
import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";

export default function ProfileScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  // We don't have totalSpend in context yet, we can calculate from transactions or mock it 
  // But let's use dynamic user info at least.

  // User data
  const userName = user?.name || "KoshPay User";
  const koshpayId = user?.koshpayId || user?.phone || "user@koshpay";
  const koshpayNumber = user?.phone || "";
  const totalSpend = 248750.5; // Keeping this hardcoded or calc later

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={{ paddingTop: insets.top }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Profile */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {userName}
              </Text>
              <Text style={[styles.koshpayId, { color: theme.textSecondary }]}>
                KoshPay ID: {koshpayId}
              </Text>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
            </TouchableOpacity>

            
            {/* <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color={theme.text} />
            </TouchableOpacity> */}
          </View>

          {/* Profile Image with QR */}
          <View style={styles.profileImageContainer}>
            <View
              style={[styles.profileImage, { backgroundColor: theme.card }]}
            >
              <Ionicons name="person" size={60} color={theme.textSecondary} />
            </View>
            <TouchableOpacity
              style={[styles.qrBadge, { backgroundColor: theme.background }]}
            >
              <MaterialCommunityIcons
                name="qrcode"
                size={20}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>

          {/* KoshPay Number Badge */}
          <TouchableOpacity
            style={[
              styles.koshpayNumberBadge,
              { backgroundColor: theme.primary },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <View>
              <Text style={styles.koshpayNumberText}>KoshPay number</Text>
              <Text style={styles.actualNumber}>{koshpayNumber}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Rewards and Referral */}
        <View style={styles.rewardsContainer}>
          <TouchableOpacity
            style={[
              styles.rewardCard,
              { backgroundColor: isDarkMode ? "#4A148C" : "#7B1FA2" },
            ]}
          >
            <MaterialCommunityIcons
              name="ticket-percent"
              size={28}
              color="#FFFFFF"
            />
            <View style={styles.rewardContent}>
              <Text style={styles.rewardTitle}>8 rewards</Text>
              <Text style={styles.rewardSubtitle}>View now</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rewardCard,
              { backgroundColor: isDarkMode ? "#004D40" : "#00695C" },
            ]}
          >
            <Ionicons name="people" size={28} color="#FFFFFF" />
            <View style={styles.rewardContent}>
              <Text style={styles.rewardTitle}>Get ₹501</Text>
              <Text style={styles.rewardSubtitle}>Refer a friend</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Total Spend Card */}
        <View style={[styles.spendCard, { backgroundColor: theme.card }]}>
          <View style={styles.spendHeader}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={28}
              color={theme.primary}
            />
            <Text style={[styles.spendLabel, { color: theme.textSecondary }]}>
              Total Amount Spent
            </Text>
          </View>
          <Text style={[styles.spendAmount, { color: theme.text }]}>
            ₹
            {totalSpend.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <View style={styles.spendFooter}>
            <Text
              style={[styles.spendFooterText, { color: theme.textSecondary }]}
            >
              Lifetime transactions
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </View>
        </View>

        {/* Menu Items Section */}
        <View style={styles.menuSection}>
          {/* QR Code Section */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => router.push('/user-qr')}
          >
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
                ]}
              >
                <MaterialCommunityIcons
                  name="qrcode"
                  size={24}
                  color={theme.text}
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: theme.text }]}>
                  Your QR code
                </Text>
                <Text
                  style={[styles.menuSubtitle, { color: theme.textSecondary }]}
                >
                  Use to receive money from any KoshPay user
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => router.push("/settings")}
            style={[styles.menuItem, { backgroundColor: theme.card }]}
          >
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
                ]}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={theme.text}
                />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text }]}>
                Settings
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
          >
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
                ]}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color={theme.text}
                />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text }]}>
                Manage Google account
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => router.push("/help-support")}
          >
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={theme.text}
                />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text }]}>
                Get help
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
          >
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
                ]}
              >
                <Ionicons name="globe-outline" size={24} color={theme.text} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, { color: theme.text }]}>
                  Language
                </Text>
                <Text
                  style={[styles.menuSubtitle, { color: theme.textSecondary }]}
                >
                  English
                </Text>
            </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card, marginTop: 12 }]}
            onPress={logout}
          >
            <View style={styles.menuLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: "#FFEBEE" },
                ]}
              >
                <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
              </View>
              <Text style={[styles.menuTitle, { color: "#D32F2F" }]}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: verticalScale(24),
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    marginBottom: verticalScale(4),
  },
  koshpayId: {
    fontSize: scaleFont(14),
  },
  moreButton: {
    padding: scale(4),
  },
  settingsButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: verticalScale(16),
  },
  profileImage: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    alignItems: "center",
    justifyContent: "center",
  },
  qrBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#000000",
  },
  koshpayNumberBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(24),
    gap: scale(10),
  },
  koshpayNumberText: {
    color: "#FFFFFF",
    fontSize: scaleFont(13),
    fontWeight: "600",
  },
  actualNumber: {
    color: "#FFFFFF",
    fontSize: scaleFont(15),
    fontWeight: "700",
    marginTop: verticalScale(2),
  },
  rewardsContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    gap: scale(12),
    marginBottom: verticalScale(20),
  },
  rewardCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: moderateScale(16),
    gap: scale(12),
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    color: "#FFFFFF",
    fontSize: scaleFont(16),
    fontWeight: "700",
    marginBottom: verticalScale(2),
  },
  rewardSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scaleFont(13),
  },
  spendCard: {
    marginHorizontal: scale(20),
    padding: scale(20),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(20),
  },
  spendHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  spendLabel: {
    fontSize: scaleFont(14),
  },
  spendAmount: {
    fontSize: scaleFont(32),
    fontWeight: "bold",
    marginBottom: verticalScale(12),
  },
  spendFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spendFooterText: {
    fontSize: scaleFont(13),
  },
  menuSection: {
    paddingHorizontal: scale(20),
    gap: verticalScale(12),
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    borderRadius: moderateScale(16),
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(16),
    flex: 1,
  },
  menuIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
  menuSubtitle: {
    fontSize: scaleFont(13),
    marginTop: verticalScale(4),
  },
});
