import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext'; 
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';// ← ADD THIS

export default function TestNavigation() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showNotification } = useNotification(); // ← ADD THIS

  const testRoutes = [
    { name: 'Payment Screen', path: '/payment' },
    {
      name: 'Payment Confirmation',
      path: '/payment-confirmation',
      params: {
        amount: '1',
        crypto: 'SOL',
        recipientName: 'Test User',
        walletAddress: '0x1234567890...',
        cryptoPrice: '150',
      },
    },
    {
      name: 'Payment Success',
      path: '/payment-success',
      params: {
        amount: '1',
        crypto: 'SOL',
        recipientName: 'Test User',
        walletAddress: '0x1234567890...',
        cryptoPrice: '150',
      },
    },
    {
      name: 'Transaction Details',
      path: '/transaction-details',
      params: {
        txHash: 'TXH123456789ABC',
        amount: '1',
        crypto: 'SOL',
        recipientName: 'Test User',
        walletAddress: '0x1234567890...',
        inrAmount: '150',
        timestamp: new Date().toLocaleTimeString(),
      },
    },
    { name: 'Crypto Info Screen', path: '/crypto-details' },
    { name: 'KYC Front', path: '/kyc-nid-front' },
    { name: 'KYC Back', path: '/kyc-nid-back' },
    { name: 'Cam Test', path: '/CameraTest' },
    // { name: 'Components Screen', path: '/test-components' },
    
  ];

  // ← ADD NOTIFICATION TEST ACTIONS
  const notificationTests = [
    {
      name: '✅ Success Notification',
      action: () => showNotification({
        type: 'success',
        title: 'Success!',
        message: 'Transaction completed successfully',
      }),
    },
    {
      name: '❌ Error Notification',
      action: () => showNotification({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      }),
    },
    {
      name: '💰 Payment Notification',
      action: () => showNotification({
        type: 'payment',
        title: 'Payment Received!',
        message: 'You received 0.5 SOL from Priya Sharma',
      }),
    },
    {
      name: 'ℹ️ Info Notification',
      action: () => showNotification({
        type: 'info',
        title: 'App Update Available',
        message: 'Version 2.0 is ready to download',
      }),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Test Navigation</Text>
      
      {/* Navigation Tests */}
      {testRoutes.map((route, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => router.push({
            pathname: route.path,
            params: route.params,
          } as any)}
        >
          <Text style={styles.buttonText}>{route.name}</Text>
        </TouchableOpacity>
      ))}

      

      {/* Notification Tests */}
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Test Notifications
      </Text>
      {notificationTests.map((test, index) => (
        <TouchableOpacity
          key={`notif-${index}`}
          style={[styles.button, { backgroundColor: '#34C759' }]}
          onPress={test.action}
        >
          <Text style={styles.buttonText}>{test.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    marginBottom: verticalScale(20),
  },
  subtitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
  },
  button: {
    width: '100%',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  buttonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#FFF',
  },
});
