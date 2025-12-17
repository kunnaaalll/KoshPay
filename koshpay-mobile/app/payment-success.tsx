import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, scaleFont } from '../utils/responsive';

export default function PaymentSuccessScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const params = useLocalSearchParams();
    
    const recipientName = params.recipientName || 'Recipient';
    const amount = params.amount || '0';
    const symbol = params.symbol || 'SOL';

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
                <Text style={[styles.title, { color: theme.text }]}>Payment Successful!</Text>
                
                {/* Payment Done To Details */}
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Payment done to</Text>
                <Text style={[styles.recipientName, { color: theme.text }]}>{recipientName}</Text>

                {/* Amount */}
                <Text style={[styles.amount, { color: theme.text }]}>
                    {symbol === 'INR' ? '₹' : ''}{amount} {symbol !== 'INR' ? symbol : ''}
                </Text>
                
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    // Map to Home tab (index)
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
    },
    content: {
        alignItems: 'center',
        gap: verticalScale(10), // Reduced gap for tighter layout
    },
    title: {
        fontSize: scaleFont(24),
        fontWeight: 'bold',
        marginBottom: verticalScale(10),
    },
    amount: {
        fontSize: scaleFont(40),
        fontWeight: 'bold',
        marginVertical: verticalScale(10),
    },
    recipientName: {
        fontSize: scaleFont(20),
        fontWeight: '600',
        marginBottom: verticalScale(10),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: scaleFont(16),
        textAlign: 'center',
    },
    button: {
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(48),
        borderRadius: moderateScale(30),
        marginTop: verticalScale(30),
    },
    buttonText: {
        color: '#FFF',
        fontSize: scaleFont(18),
        fontWeight: '600',
    }
});
