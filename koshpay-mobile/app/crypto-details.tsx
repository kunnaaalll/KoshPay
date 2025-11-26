import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

const { width } = Dimensions.get('window');

export default function CryptoDetailsScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  // Mock data - will come from API later
  const cryptoData = {
    BTC: {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: require('../assets/images/crypto/btc.png'),
      balance: 0.0234,
      balanceInr: 213777.9,
      price: 9135000,
      priceChange24h: 2.45,
      marketCap: '₹86,50,00,000 Cr',
      volume24h: '₹2,35,000 Cr',
      high24h: '₹91,85,000',
      low24h: '₹89,20,000',
      about: 'Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network without intermediaries.',
    },
    SOL: {
      name: 'Solana',
      symbol: 'SOL',
      icon: require('../assets/images/crypto/sol.png'),
      balance: 12.5,
      balanceInr: 192750,
      price: 15420,
      priceChange24h: -1.23,
      marketCap: '₹3,45,000 Cr',
      volume24h: '₹12,500 Cr',
      high24h: '₹15,890',
      low24h: '₹15,120',
      about: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.',
    },
    ETH: {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: require('../assets/images/crypto/eth.png'),
      balance: 0.85,
      balanceInr: 270725,
      price: 318500,
      priceChange24h: 3.12,
      marketCap: '₹38,25,000 Cr',
      volume24h: '₹8,90,000 Cr',
      high24h: '₹3,22,000',
      low24h: '₹3,14,500',
      about: 'Ethereum is a decentralized platform that runs smart contracts and enables developers to build decentralized applications.',
    },
  };

  const crypto = cryptoData[params.crypto as keyof typeof cryptoData] || cryptoData.BTC;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={crypto.icon} style={styles.headerIcon} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {crypto.name}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="star-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={[styles.currentPrice, { color: theme.text }]}>
            ₹{crypto.price.toLocaleString('en-IN')}
          </Text>
          <View style={styles.priceChange}>
            <Ionicons
              name={crypto.priceChange24h >= 0 ? 'trending-up' : 'trending-down'}
              size={16}
              color={crypto.priceChange24h >= 0 ? '#4CAF50' : '#FF3B30'}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: crypto.priceChange24h >= 0 ? '#4CAF50' : '#FF3B30',
                marginLeft: 4,
              }}
            >
              {crypto.priceChange24h >= 0 ? '+' : ''}
              {crypto.priceChange24h}% (24h)
            </Text>
          </View>
        </View>

        {/* Chart Placeholder */}
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartPlaceholder, { color: theme.textSecondary }]}>
            📈 Price Chart Coming Soon
          </Text>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframeContainer}>
          {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
            <TouchableOpacity
              key={tf}
              style={[
                styles.timeframeButton,
                {
                  backgroundColor: timeframe === tf ? theme.primary : theme.card,
                },
              ]}
              onPress={() => setTimeframe(tf)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  { color: timeframe === tf ? '#FFF' : theme.text },
                ]}
              >
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Your Holdings */}
        <View style={[styles.holdingsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Your Holdings
          </Text>
          <View style={styles.holdingsRow}>
            <Text style={[styles.holdingsAmount, { color: theme.text }]}>
              {crypto.balance} {crypto.symbol}
            </Text>
            <Text style={[styles.holdingsInr, { color: theme.textSecondary }]}>
              ≈ ₹{crypto.balanceInr.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Market Stats */}
        <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Market Stats
          </Text>
          
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Market Cap
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {crypto.marketCap}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              24h Volume
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {crypto.volume24h}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              24h High
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {crypto.high24h}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              24h Low
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {crypto.low24h}
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={[styles.aboutCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            About {crypto.name}
          </Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            {crypto.about}
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.bottomActions,
          {
            backgroundColor: theme.background,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() =>
            router.push({
              pathname: '/send-crypto',
              params: { crypto: crypto.symbol },
            })
          }
        >
          <Ionicons name="arrow-up" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card }]}
          onPress={() =>
            router.push({
              pathname: '/add-crypto',
              params: { crypto: crypto.symbol },
            })
          }
        >
          <Ionicons name="arrow-down" size={20} color={theme.text} />
          <Text style={[styles.actionButtonText, { color: theme.text }]}>
            Receive
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  headerIcon: {
    width: scale(28),
    height: scale(28),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(16),
  },
  priceSection: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  currentPrice: {
    fontSize: scaleFont(36),
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartContainer: {
    height: verticalScale(200),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
  },
  chartPlaceholder: {
    fontSize: scaleFont(16),
  },
  timeframeContainer: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(20),
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  holdingsCard: {
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  cardTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginBottom: verticalScale(12),
  },
  holdingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  holdingsAmount: {
    fontSize: scaleFont(20),
    fontWeight: '700',
  },
  holdingsInr: {
    fontSize: scaleFont(16),
  },
  statsCard: {
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  statLabel: {
    fontSize: scaleFont(14),
  },
  statValue: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  aboutCard: {
    padding: scale(16),
    borderRadius: moderateScale(12),
  },
  aboutText: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(22),
  },
  bottomActions: {
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  actionButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#FFF',
  },
});
