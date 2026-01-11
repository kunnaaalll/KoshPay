import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale, scaleFont } from '../utils/responsive';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/config';
import { useWallet } from '../context/WalletContext';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function WithdrawUpiScreen() {
    const { isDarkMode, theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { totalBalanceInr, refreshWallet } = useWallet();

    const [amount, setAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleWithdraw = async () => {
        if (!amount || !upiId || !name) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        if (parseFloat(amount) > totalBalanceInr) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", "Insufficient Balance");
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) throw new Error("Not logged in");

            const res = await fetch(`${API_URL}/payout/upi`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    upiId: upiId,
                    name: name
                })
            });

            const data = await res.json();
            if (res.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                refreshWallet();
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    router.back();
                }, 2000);
            } else {
                throw new Error(data.error || "Withdrawal failed");
            }

        } catch (error: any) {
            console.error(error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Withdraw to UPI</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                
                {/* Balance Card - Animated */}
                <Animated.View 
                    entering={FadeInDown.delay(100).duration(600)}
                    style={[styles.balanceCard, { backgroundColor: theme.card }]}
                >
                     <Text style={[styles.label, { color: theme.textSecondary }]}>Available Balance</Text>
                     <Text style={[styles.balance, { color: theme.text }]}>₹{totalBalanceInr.toLocaleString('en-IN')}</Text>
                </Animated.View>

                {/* Form - Animated Staggered */}
                <View style={styles.form}>
                    <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                        <Text style={[styles.label, { color: theme.text }]}>Amount to Withdraw (₹)</Text>
                        <TextInput 
                            style={[
                                styles.input, 
                                { 
                                    backgroundColor: theme.card, 
                                    color: theme.text,
                                    borderColor: focusedInput === 'amount' ? theme.primary : 'transparent',
                                    borderWidth: 1
                                }
                            ]}
                            placeholder="e.g. 500"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            onFocus={() => setFocusedInput('amount')}
                            onBlur={() => setFocusedInput(null)}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                        <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>UPI ID (VPA)</Text>
                        <TextInput 
                            style={[
                                styles.input, 
                                { 
                                    backgroundColor: theme.card, 
                                    color: theme.text,
                                    borderColor: focusedInput === 'upi' ? theme.primary : 'transparent',
                                    borderWidth: 1
                                }
                            ]}
                            placeholder="username@upi"
                            placeholderTextColor={theme.textSecondary}
                            autoCapitalize="none"
                            value={upiId}
                            onChangeText={setUpiId}
                            onFocus={() => setFocusedInput('upi')}
                            onBlur={() => setFocusedInput(null)}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(600)}>
                        <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Account Holder Name</Text>
                        <TextInput 
                            style={[
                                styles.input, 
                                { 
                                    backgroundColor: theme.card, 
                                    color: theme.text,
                                    borderColor: focusedInput === 'name' ? theme.primary : 'transparent',
                                    borderWidth: 1
                                }
                            ]}
                            placeholder="As per bank records"
                            placeholderTextColor={theme.textSecondary}
                            value={name}
                            onChangeText={setName}
                            onFocus={() => setFocusedInput('name')}
                            onBlur={() => setFocusedInput(null)}
                        />
                    </Animated.View>
                </View>

                {/* Warning */}
                <Animated.View 
                    entering={FadeInDown.delay(500).duration(600)}
                    style={styles.warningBox}
                >
                    <Ionicons name="information-circle-outline" size={20} color="#856404" />
                    <Text style={styles.warningText}>
                        Transfers are usually instant but may take up to 24 hours. Ensure UPI ID is correct.
                    </Text>
                </Animated.View>

            </View>

             <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                 <TouchableOpacity 
                    style={[
                        styles.button, 
                        { 
                            backgroundColor: loading ? theme.border : theme.primary,
                            opacity: loading ? 0.7 : 1
                        }
                    ]}
                    onPress={handleWithdraw}
                    disabled={loading}
                    activeOpacity={0.8}
                 >
                     {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Confirm Withdrawal</Text>}
                 </TouchableOpacity>
             </View>

            {/* Success Modal */}
            <Modal transparent visible={showSuccess} animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View entering={ZoomIn.duration(400)} style={[styles.successCard, { backgroundColor: theme.card }]}>
                        <View style={styles.successIconBg}>
                            <Ionicons name="checkmark" size={40} color="#FFF" />
                        </View>
                        <Text style={[styles.successTitle, { color: theme.text }]}>Success!</Text>
                        <Text style={[styles.successDesc, { color: theme.textSecondary }]}>
                            Withdrawal of ₹{amount} initiated.
                        </Text>
                    </Animated.View>
                </View>
            </Modal>

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
        paddingVertical: verticalScale(16),
    },
    headerTitle: {
        fontSize: scaleFont(18),
        fontWeight: '600',
    },
    content: {
        padding: scale(20),
        flex: 1
    },
    balanceCard: {
        padding: scale(20),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        marginBottom: verticalScale(24),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4
    },
    balance: {
        fontSize: scaleFont(32),
        fontWeight: 'bold',
        marginTop: 8
    },
    form: {
        marginBottom: 24
    },
    label: {
        fontSize: scaleFont(14),
        marginBottom: 8,
        fontWeight: '600'
    },
    input: {
        padding: scale(16),
        borderRadius: moderateScale(12),
        fontSize: scaleFont(16),
    },
    warningBox: {
        backgroundColor: '#FFF3CD',
        padding: scale(16),
        borderRadius: moderateScale(12),
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center'
    },
    warningText: {
        color: '#856404',
        flex: 1,
        fontSize: scaleFont(13),
        lineHeight: 20
    },
    footer: {
        padding: scale(20),
    },
    button: {
        padding: verticalScale(16),
        borderRadius: moderateScale(14),
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4
    },
    buttonText: {
        color: '#fff',
        fontSize: scaleFont(16),
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    successCard: {
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340
    },
    successIconBg: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8
    },
    successDesc: {
        fontSize: 16,
        textAlign: 'center'
    }
});
