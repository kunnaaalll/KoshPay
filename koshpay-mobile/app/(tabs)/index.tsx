import React, { useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useAdBanner } from "../../hooks/useAdBanner";
import { SearchBar } from "../../components/common/SearchBar";
import { AdBanner } from "../../components/home/AdBanner";
import { QuickActions } from "../../components/home/QuickActions";
import { PeopleSection } from "../../components/home/PeopleSection";
import {
  AD_SLIDES,
  QUICK_ACTIONS,
  PEOPLE,
  BUSINESSES,
  OFFERS_REWARDS,
} from "../../constants/data";
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../../utils/responsive';

export default function HomeScreen() {
  const { isDarkMode, theme } = useTheme();
  const { activeAdIndex, handleAdScroll } = useAdBanner();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [unreadCount] = useState(3);

  // Handle Quick Action taps
  const handleQuickAction = (action: any) => {
    if (action.label.includes("Scan")) {
      router.push("/qr-scanner");
    } else if (action.label.includes("Pay\nanyone")) {
      router.push("/payment");
    } else if (action.label.includes("B2B")) {
      console.log("B2B Transfer");
    } else if (action.label.includes("Stake")) {
      console.log("Stake SOL");
    }
  };

  // Handle person tap
  // const handlePersonTap = (person: any) => {
  //   if (person.isMore) {
  //     console.log("Show all people");
  //   } else {
  //     router.push({
  //       pathname: "/payment",
  //       params: {
  //         name: person.name.toUpperCase(),
  //         koshpayId: person.name.toLowerCase(),
  //       },
  //     });
  //   }
  // };

  //
  const handlePersonTap = (person: any) => {
    if (person.isMore) {
      console.log("Show all people");
    } else {
      // Navigate to payment with person details pre-filled
      router.push({
        pathname: "/payment",
        params: {
          recipientName: person.name,
          recipientId: person.name.toLowerCase(),
          recipientAvatar: person.bgColor,
          fromPeople: "true", // Flag to indicate coming from people section
        },
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={{ paddingTop: insets.top }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Search - Theme Toggle Removed */}
        <View style={styles.header}>
          <SearchBar theme={theme} />
          
          {/* <TouchableOpacity
            style={[styles.profileIcon, { backgroundColor: theme.card }]}
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person" size={20} color={theme.textSecondary} />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        {/* Advertisement Banner */}
        <AdBanner
          slides={AD_SLIDES}
          activeIndex={activeAdIndex}
          onScroll={handleAdScroll}
        />

        {/* Quick Actions - WITH NAVIGATION */}
        <View style={styles.quickActionsContainer}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              onPress={() => handleQuickAction(action)}
              
            >
              <View
                style={[
                  styles.quickActionButton,
                  { backgroundColor: action.color },
                ]}
              >
                <Ionicons name={action.icon as any} size={28} color="#FFFFFF" />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* People Section - WITH NAVIGATION */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            People
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.peopleList}
          >
            {PEOPLE.map((person) => (
              <TouchableOpacity
                key={person.id}
                style={styles.personItem}
                onPress={() => handlePersonTap(person)}
              >
                {person.isMore ? (
                  <View
                    style={[
                      styles.personAvatar,
                      { backgroundColor: theme.card },
                    ]}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={24}
                      color={theme.text}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.personAvatar,
                      { backgroundColor: person.bgColor },
                    ]}
                  >
                    {person.hasNotification && (
                      <View style={styles.notificationDot} />
                    )}
                    <Text
                      style={[
                        styles.personInitials,
                        { color: person.textColor || "#FFFFFF" },
                      ]}
                    >
                      {person.initials}
                    </Text>
                  </View>
                )}
                <Text
                  style={[styles.personName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {person.name}
                </Text>
              </TouchableOpacity>
            ))}

            {/* DEBUG: Test Navigation Button */}
            {__DEV__ && (
              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: "#FF9500" }]}
                onPress={() => router.push("/test-navigation")}
              >
                <Text style={styles.testButtonText}>🧪 Test Payment Flow</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Gift Cards Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Gift cards & more
          </Text>
          <View style={styles.giftCardsContainer}>
            <TouchableOpacity
              style={[styles.giftCard, { backgroundColor: theme.card }]}
            >
              <MaterialCommunityIcons
                name="movie-open"
                size={32}
                color={theme.primary}
              />
              <Text style={[styles.giftCardTitle, { color: theme.text }]}>
                Subscriptions
              </Text>
              <Text
                style={[
                  styles.giftCardSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Buy plans from{"\n"}leading OTT{"\n"}platforms
              </Text>
              <View style={styles.ottLogos}>
                <MaterialCommunityIcons
                  name="netflix"
                  size={16}
                  color="#E50914"
                />
                <Ionicons name="logo-youtube" size={16} color="#FF0000" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.giftCard, { backgroundColor: theme.card }]}
            >
              <Ionicons name="gift" size={32} color={theme.primary} />
              <Text style={[styles.giftCardTitle, { color: theme.text }]}>
                Gift cards
              </Text>
              <Text
                style={[
                  styles.giftCardSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Buy gift cards from{"\n"}the biggest brands
              </Text>
              <View style={styles.ottLogos}>
                <MaterialCommunityIcons
                  name="shopping"
                  size={16}
                  color={theme.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Businesses Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Businesses
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.businessList}
          >
            {BUSINESSES.map((business) => (
              <TouchableOpacity key={business.id} style={styles.businessItem}>
                {business.isMore ? (
                  <View
                    style={[
                      styles.businessAvatar,
                      { backgroundColor: theme.card },
                    ]}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={24}
                      color={theme.text}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.businessAvatar,
                      { backgroundColor: business.bgColor },
                    ]}
                  >
                    <Text style={styles.businessLetter}>
                      {business.initials}
                    </Text>
                  </View>
                )}
                <Text
                  style={[styles.businessName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {business.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Offers & Rewards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Offers & rewards
          </Text>
          <View style={styles.offersContainer}>
            {OFFERS_REWARDS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.offerItem}>
                <View
                  style={[styles.offerIcon, { backgroundColor: item.color }]}
                >
                  <Ionicons name={item.icon as any} size={28} color="#FFFFFF" />
                  {item.hasNotification && (
                    <View style={styles.offerNotification} />
                  )}
                </View>
                <Text style={[styles.offerName, { color: theme.text }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promotional Banner */}
        <View style={[styles.promoBanner, { backgroundColor: theme.card }]}>
          <View style={styles.promoContent}>
            <Text style={[styles.promoTitle, { color: theme.text }]}>
              Loan amount in account,{"\n"}in under 24 hrs
            </Text>
            <Text style={[styles.promoButton, { color: theme.primary }]}>
              Apply now
            </Text>
          </View>
          <View style={styles.promoIllustration}>
            <MaterialCommunityIcons name="home" size={32} color="#4CAF50" />
            <Ionicons
              name="car"
              size={28}
              color={theme.primary}
              style={{ marginTop: 8 }}
            />
            <MaterialCommunityIcons
              name="bank"
              size={32}
              color="#FFC107"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>

        {/* Manage Your Money */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Manage your money
          </Text>
          <View style={styles.loanCardsContainer}>
            <TouchableOpacity
              style={[styles.loanCard, { backgroundColor: theme.card }]}
            >
              <MaterialCommunityIcons
                name="calendar-check"
                size={32}
                color={theme.primary}
              />
              <Text style={[styles.loanTitle, { color: theme.text }]}>
                Personal loan
              </Text>
              <Text
                style={[styles.loanSubtitle, { color: theme.textSecondary }]}
              >
                Up to ₹10 lakh,{"\n"}instant approval
              </Text>
              <Text style={[styles.applyButton, { color: theme.primary }]}>
                Apply now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loanCard, { backgroundColor: theme.card }]}
            >
              <MaterialCommunityIcons
                name="diamond-stone"
                size={32}
                color="#FFC107"
              />
              <Text style={[styles.loanTitle, { color: theme.text }]}>
                Gold loan
              </Text>
              <Text
                style={[styles.loanSubtitle, { color: theme.textSecondary }]}
              >
                Interest rate{"\n"}starting at 0.96%{"\n"}monthly
              </Text>
              <Text style={[styles.applyButton, { color: theme.primary }]}>
                Apply now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={[styles.quickLink, { backgroundColor: theme.card }]}
          >
            <Ionicons name="time-outline" size={24} color={theme.text} />
            <Text style={[styles.quickLinkText, { color: theme.text }]}>
              See transaction history
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Test Button */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => router.push("/test-navigation")}
          >
            <Text style={styles.testButtonText}>🧪 Test Screens</Text>
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
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
    gap: scale(12),
  },

  ///start
  testButton: {
    marginHorizontal: scale(16),
    marginVertical: verticalScale(12),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: "center",
    backgroundColor: "#FF9500",
    marginTop: verticalScale(12),
  },

  testButtonText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#FFF",
  },
  /// End

  profileIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  notificationButton: {
    padding: scale(8),
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    gap: scale(12),
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(8),
  },
  quickActionButton: {
    width: scale(68),
    height: scale(68),
    borderRadius: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: scaleFont(12),
    textAlign: "center",
    lineHeight: scaleFont(16),
  },
  peopleList: {
    paddingHorizontal: scale(16),
    gap: scale(20),
  },
  personItem: {
    alignItems: "center",
    width: scale(70),
  },
  personAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(8),
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: scale(4),
    right: scale(4),
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: "#FFFFFF",
  },
  personInitials: {
    fontSize: scaleFont(20),
    fontWeight: "600",
  },
  personName: {
    fontSize: scaleFont(12),
    textAlign: "center",
  },
  section: {
    paddingVertical: verticalScale(16),
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontWeight: "600",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },
  giftCardsContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  giftCard: {
    flex: 1,
    borderRadius: moderateScale(12),
    padding: scale(16),
  },
  giftCardTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  giftCardSubtitle: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    marginBottom: verticalScale(12),
  },
  ottLogos: {
    flexDirection: "row",
    gap: scale(8),
  },
  businessList: {
    paddingHorizontal: scale(16),
    gap: scale(20),
  },
  businessItem: {
    alignItems: "center",
    width: scale(70),
  },
  businessAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(8),
  },
  businessLetter: {
    fontSize: scaleFont(24),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  businessName: {
    fontSize: scaleFont(12),
    textAlign: "center",
  },
  offersContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    gap: scale(16),
  },
  offerItem: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(8),
  },
  offerIcon: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  offerNotification: {
    position: "absolute",
    top: scale(4),
    right: scale(4),
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: "#FFFFFF",
  },
  offerName: {
    fontSize: scaleFont(12),
  },
  promoBanner: {
    marginHorizontal: scale(16),
    borderRadius: moderateScale(16),
    padding: scale(20),
    flexDirection: "row",
    marginVertical: verticalScale(16),
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginBottom: verticalScale(12),
    lineHeight: scaleFont(22),
  },
  promoButton: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  promoIllustration: {
    width: scale(80),
    alignItems: "center",
    justifyContent: "center",
  },
  loanCardsContainer: {
    flexDirection: "row",
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  loanCard: {
    flex: 1,
    borderRadius: moderateScale(12),
    padding: scale(16),
  },
  loanTitle: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
  },
  loanSubtitle: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    marginBottom: verticalScale(12),
  },
  applyButton: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  quickLinks: {
    paddingHorizontal: scale(16),
    gap: 1,
  },
  quickLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    gap: scale(12),
  },
  quickLinkText: {
    flex: 1,
    fontSize: scaleFont(15),
  },
  notificationBadge: {
    position: "absolute",
    top: scale(-4),
    right: scale(-4),
    backgroundColor: "#FF3B30",
    minWidth: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(4),
  },

  notificationBadgeText: {
    fontSize: scaleFont(11),
    fontWeight: "700",
    color: "#FFF",
  },
});
