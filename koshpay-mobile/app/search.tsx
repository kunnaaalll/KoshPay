import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

type SearchCategory = 'all' | 'people' | 'transactions';

type Person = {
  id: string;
  name: string;
  username: string;
  avatar?: any;
};

type Transaction = {
  id: string;
  type: 'send' | 'receive';
  crypto: string;
  amount: number;
  recipient?: string;
  sender?: string;
  date: string;
  icon: any;
};

export default function SearchScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');

  // Mock data
  const people: Person[] = [
    { id: '1', name: 'Priya Sharma', username: '@priya_s' },
    { id: '2', name: 'Raj Kumar', username: '@rajk' },
    { id: '3', name: 'Amit Patel', username: '@amit_p' },
    { id: '4', name: 'Sangeeta Parmar', username: '@sangeeta' },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'receive',
      crypto: 'BTC',
      amount: 0.0034,
      sender: 'Priya Sharma',
      date: 'Today, 2:30 PM',
      icon: require('../assets/images/crypto/btc.png'),
    },
    {
      id: '2',
      type: 'send',
      crypto: 'SOL',
      amount: 2.5,
      recipient: 'Amit Patel',
      date: 'Yesterday, 4:15 PM',
      icon: require('../assets/images/crypto/sol.png'),
    },
    {
      id: '3',
      type: 'receive',
      crypto: 'ETH',
      amount: 0.15,
      sender: 'Raj Kumar',
      date: 'Nov 14, 11:20 AM',
      icon: require('../assets/images/crypto/eth.png'),
    },
  ];

  // Filter results
  const filteredPeople = people.filter(
    (person) =>
      searchQuery === '' ||
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (tx) =>
      searchQuery === '' ||
      tx.crypto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showPeople = activeCategory === 'all' || activeCategory === 'people';
  const showTransactions = activeCategory === 'all' || activeCategory === 'transactions';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header with Search */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search people, transactions..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        {(['all', 'people', 'transactions'] as SearchCategory[]).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  activeCategory === category ? theme.primary : theme.card,
              },
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: activeCategory === category ? '#FFF' : theme.text,
                },
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery === '' && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Search for people or transactions
            </Text>
          </View>
        )}

        {searchQuery !== '' && filteredPeople.length === 0 && filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="sad-outline" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No results found
            </Text>
          </View>
        )}

        {/* People Results */}
        {showPeople && filteredPeople.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              People ({filteredPeople.length})
            </Text>
            {filteredPeople.map((person) => (
              <TouchableOpacity
                key={person.id}
                style={[styles.personCard, { backgroundColor: theme.card }]}
                onPress={() => {
                  router.push({
                    pathname: '/payment',
                    params: { recipientName: person.name },
                  });
                }}
              >
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.primary + '20' },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: theme.primary }]}>
                    {person.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.personInfo}>
                  <Text style={[styles.personName, { color: theme.text }]}>
                    {person.name}
                  </Text>
                  <Text style={[styles.personUsername, { color: theme.textSecondary }]}>
                    {person.username}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Transactions Results */}
        {showTransactions && filteredTransactions.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Transactions ({filteredTransactions.length})
            </Text>
            {filteredTransactions.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={[styles.transactionCard, { backgroundColor: theme.card }]}
                onPress={() => {
                  router.push({
                    pathname: '/transaction-details',
                    params: { id: tx.id },
                  });
                }}
              >
                <View style={styles.transactionLeft}>
                  <Image source={tx.icon} style={styles.cryptoIcon} />
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionType, { color: theme.text }]}>
                      {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.crypto}
                    </Text>
                    <Text style={[styles.transactionMeta, { color: theme.textSecondary }]}>
                      {tx.recipient || tx.sender} • {tx.date}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: tx.type === 'receive' ? '#4CAF50' : theme.text },
                  ]}
                >
                  {tx.type === 'receive' ? '+' : '-'}
                  {tx.amount} {tx.crypto}
                </Text>
              </TouchableOpacity>
            ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
    gap: scale(12),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: scaleFont(15),
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
    gap: scale(10),
  },
  categoryChip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  categoryText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(16),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontSize: scaleFont(16),
    marginTop: verticalScale(16),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginBottom: verticalScale(12),
    marginTop: verticalScale(8),
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  avatar: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  avatarText: {
    fontSize: scaleFont(20),
    fontWeight: '700',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  personUsername: {
    fontSize: scaleFont(14),
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(12),
  },
  cryptoIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  transactionMeta: {
    fontSize: scaleFont(13),
  },
  transactionAmount: {
    fontSize: scaleFont(15),
    fontWeight: '600',
  },
});
