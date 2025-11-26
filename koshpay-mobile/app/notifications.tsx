import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

type NotificationType = 'transaction' | 'system' | 'promo' | 'security';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon?: any;
  actionUrl?: string;
};

export default function NotificationsScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'transaction',
      title: 'Payment Received',
      message: 'You received 0.0034 BTC from Priya Sharma',
      time: '2 min ago',
      read: false,
      icon: require('../assets/images/crypto/btc.png'),
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Payment Sent',
      message: 'Successfully sent 2.5 SOL to Amit Patel',
      time: '1 hour ago',
      read: false,
      icon: require('../assets/images/crypto/sol.png'),
    },
    {
      id: '3',
      type: 'system',
      title: 'KYC Verification Pending',
      message: 'Complete your KYC to unlock all features',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'promo',
      title: '🎉 Cashback Offer!',
      message: 'Get 2% cashback on your next transaction',
      time: 'Yesterday',
      read: true,
    },
    {
      id: '5',
      type: 'security',
      title: 'New Login Detected',
      message: 'Login from iPhone 15 Pro • Mumbai',
      time: 'Yesterday',
      read: true,
    },
    {
      id: '6',
      type: 'transaction',
      title: 'Deposit Confirmed',
      message: '0.15 ETH deposit confirmed on Ethereum network',
      time: '2 days ago',
      read: true,
      icon: require('../assets/images/crypto/eth.png'),
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'transaction':
        return { name: 'swap-horizontal', color: '#007AFF' };
      case 'system':
        return { name: 'information-circle', color: '#FF9500' };
      case 'promo':
        return { name: 'gift', color: '#FF2D55' };
      case 'security':
        return { name: 'shield-checkmark', color: '#34C759' };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Ionicons name="checkmark-done" size={24} color={theme.primary} />
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={{ width: 24 }} />}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No notifications yet
            </Text>
          </View>
        ) : (
          notifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  {
                    backgroundColor: notification.read
                      ? theme.card
                      : isDarkMode
                      ? '#2A2A3E'
                      : '#F0F5FF',
                  },
                ]}
                onPress={() => handleMarkAsRead(notification.id)}
              >
                <View style={styles.notificationLeft}>
                  {notification.icon ? (
                    <View style={styles.cryptoIconContainer}>
                      <Image
                        source={notification.icon}
                        style={styles.cryptoIcon}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: iconConfig.color + '20' },
                      ]}
                    >
                      <Ionicons
                        name={iconConfig.name as any}
                        size={24}
                        color={iconConfig.color}
                      />
                    </View>
                  )}

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationRow}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          {
                            color: theme.text,
                            fontWeight: notification.read ? '500' : '700',
                          },
                        ]}
                      >
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View
                          style={[
                            styles.unreadDot,
                            { backgroundColor: theme.primary },
                          ]}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.notificationMessage,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {notification.message}
                    </Text>
                    <Text
                      style={[styles.notificationTime, { color: theme.textSecondary }]}
                    >
                      {notification.time}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNotification(notification.id)}
                >
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
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
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  badge: {
    minWidth: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(6),
  },
  badgeText: {
    fontSize: scaleFont(12),
    fontWeight: '700',
    color: '#FFF',
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
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(12),
  },
  cryptoIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cryptoIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
  },
  iconCircle: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(4),
  },
  notificationTitle: {
    fontSize: scaleFont(15),
    flex: 1,
  },
  unreadDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  notificationMessage: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(6),
    lineHeight: scaleFont(20),
  },
  notificationTime: {
    fontSize: scaleFont(12),
  },
  deleteButton: {
    padding: scale(4),
  },
});
