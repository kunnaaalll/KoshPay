import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Clipboard } from 'react-native';
import { useWallet } from '../context/WalletContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
// import { Header } from '../components/Header'; // Removed

export default function DepositScreen() {
  const { isDarkMode, theme } = useTheme();
  const { memoId, depositSimulate } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const styles = getStyles(theme, isDarkMode);

  const handleCopy = () => {
    if (memoId) {
        Clipboard.setString(memoId);
        Alert.alert("Copied", "Memo ID copied to clipboard");
    }
  };

  const handleSimulateDeposit = async () => {
    setLoading(true);
    try {
        await depositSimulate(100); // Simulate 100 SOL/Units
        Alert.alert("Success", "Deposit of 100 SOL Simulated! Check your balance.");
        router.back();
    } catch (e) {
        Alert.alert("Error", "Deposit failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
       {/* Inline Header */}
       <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Deposit Crypto</Text>
       </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>KoshPay Main Address</Text>
        <Text style={styles.value}>koshpay_main_wallet_address_sol</Text>
        <Text style={styles.subtext}>Send only SOL to this address.</Text>
      </View>

      <View style={[styles.card, { marginTop: 20 }]}>
        <Text style={styles.label}>Your Unique Memo ID</Text>
        <Text style={styles.memo}>{memoId || "Loading..."}</Text>
        <Text style={styles.warning}>
            ⚠️ You MUST include this Memo ID in your transaction or funds will be lost.
        </Text>
        
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={20} color="#fff" />
            <Text style={styles.copyText}>Copy Memo ID</Text>
        </TouchableOpacity>
      </View>

      {/* MVP Feature: Test Faucet */}
      <View style={styles.faucetContainer}>
        <Text style={styles.faucetTitle}>Test Faucet (Devnet/MVP)</Text>
        <Text style={styles.faucetDescription}>
            Since we are in test mode, you can simulate a deposit arriving at the address above.
        </Text>
        <TouchableOpacity style={styles.faucetButton} onPress={handleSimulateDeposit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.faucetButtonText}>Simulate Deposit 100 SOL</Text>}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const getStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  card: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: theme.text,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  subtext: {
    color: theme.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  memo: {
    color: theme.primary,
    fontSize: 32,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    letterSpacing: 2
  },
  warning: {
    color: '#FF6B6B', // Red
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter_500Medium',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 8
  },
  copyText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  faucetContainer: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.border
  },
  faucetTitle: {
    color: theme.text,
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  faucetDescription: {
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  faucetButton: {
    backgroundColor: '#34C759', // Green
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  faucetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold'
  }
});
