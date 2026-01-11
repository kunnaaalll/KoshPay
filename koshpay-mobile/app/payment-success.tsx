import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { AnimatedCheckmark } from '../components/common/AnimatedCheckmark';

const { width } = Dimensions.get('window');

export default function PaymentSuccessScreen() {
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const params = useLocalSearchParams();
    
    const recipientName = (params.recipientName as string) || 'Recipient';
    const amount = (params.amount as string) || '0';
    const symbol = (params.symbol as string) || 'SOL';
    const inrAmount = (params.inrAmount as string) || '0';
    const txId = (params.txId as string) || 'TX-' + Math.floor(Math.random() * 1000000);
    const date = new Date();
    
    // Format Date: "11 January 2026, 3:29 pm"
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true
    }).toLowerCase();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Payment Successful of ₹${inrAmount} to ${recipientName} via KoshPay. Ref: ${txId}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            <View style={styles.content}>
                
                {/* 1. Animated Tick */}
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.iconContainer}>
                     <AnimatedCheckmark size={90} color="#4285F4" />
                </Animated.View>

                {/* 2. Large Amount */}
                <Animated.View entering={FadeInUp.delay(300).springify()}>
                    <Text style={styles.amountText}>
                        ₹{inrAmount !== '0' ? inrAmount : '0.00'}
                    </Text>
                     <Text style={[styles.cryptoText, { color: theme.textSecondary }]}>
                        {amount} {symbol}
                    </Text>
                </Animated.View>

                {/* 3. Recipient Details */}
                <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.recipientContainer}>
                    <Text style={styles.paidToLabel}>Paid to</Text>
                    <Text style={styles.recipientName}>{recipientName}</Text>
                    
                    <View style={styles.walletRow}>
                        <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
                        <Text style={styles.walletText}>KoshPay Verified Wallet</Text>
                    </View>
                    
                    <Text style={styles.dateText}>{formattedDate}, {formattedTime}</Text>
                    
                    <Text style={styles.refText}>Ref ID: {txId}</Text>
                </Animated.View>

                {/* Spacer to push footer down */}
                <View style={{ flex: 1 }} />

                {/* 4. Footer Section */}
                <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.footer}>
                    
                    <View style={styles.poweredBy}>
                        <Text style={styles.poweredByText}>POWERED BY</Text>
                        <Text style={styles.koshpayLogo}>KOSHPAY</Text>
                    </View>

                    {/* Action Buttons Row */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.outlineButton} onPress={handleShare}>
                             <Ionicons name="share-social-outline" size={20} color="#FFF" />
                             <Text style={styles.outlineButtonText}>Share receipt</Text>
                        </TouchableOpacity>

                         <TouchableOpacity style={styles.outlineButton}>
                             <Ionicons name="list-outline" size={20} color="#FFF" />
                             <Text style={styles.outlineButtonText}>See details</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Done Button */}
                    <TouchableOpacity 
                        style={styles.doneButton}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>

                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: verticalScale(60),
        paddingHorizontal: scale(20),
    },
    iconContainer: {
        marginBottom: verticalScale(20),
    },
    amountText: {
        fontSize: scaleFont(48),
        fontWeight: '400', // Google Pay uses lighter weight for numbers usually
        color: '#FFF',
        textAlign: 'center',
    },
    cryptoText: {
        fontSize: scaleFont(16),
        textAlign: 'center',
        marginTop: verticalScale(4),
        opacity: 0.7,
    },
    recipientContainer: {
        marginTop: verticalScale(40),
        alignItems: 'center',
        width: '100%',
    },
    paidToLabel: {
        fontSize: scaleFont(16),
        color: '#AAAAAA',
        marginBottom: verticalScale(4),
    },
    recipientName: {
        fontSize: scaleFont(24),
        color: '#FFF',
        fontWeight: '500',
        marginBottom: verticalScale(8),
    },
    walletRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        marginBottom: verticalScale(8),
    },
    walletText: {
        color: '#AAAAAA',
        fontSize: scaleFont(14),
    },
    dateText: {
        color: '#AAAAAA',
        fontSize: scaleFont(14),
        marginTop: verticalScale(4),
    },
    refText: {
         color: '#666',
        fontSize: scaleFont(12),
        marginTop: verticalScale(8),
    },
    footer: {
        width: '100%',
        paddingBottom: verticalScale(20),
        alignItems: 'center',
    },
    poweredBy: {
        alignItems: 'center',
        marginBottom: verticalScale(30),
        opacity: 0.6,
    },
    poweredByText: {
        fontSize: scaleFont(10),
        color: '#FFF',
        letterSpacing: 1,
    },
    koshpayLogo: {
         fontSize: scaleFont(16),
        color: '#FFF',
        fontWeight: '800',
        fontStyle: 'italic',
    },
    actionRow: {
        flexDirection: 'row',
        gap: scale(12),
        width: '100%',
        marginBottom: verticalScale(20),
    },
    outlineButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: moderateScale(24), // Pill shape
        paddingVertical: verticalScale(12),
        gap: scale(8),
        backgroundColor: '#111',
    },
    outlineButtonText: {
        color: '#FFF',
        fontSize: scaleFont(14),
        fontWeight: '500',
    },
    doneButton: {
        width: '100%',
        backgroundColor: '#8AB4F8', // Google Blue-ish Light
        borderRadius: moderateScale(28), // Pill shape
        paddingVertical: verticalScale(16),
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#000',
        fontSize: scaleFont(18),
        fontWeight: '600',
    }
});
