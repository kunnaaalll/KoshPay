import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../../utils/responsive';
import { useAuth } from '../../context/AuthContext';

export default function KYCReviewScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { updateKYCStatus } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // TODO: Upload all KYC data to server
    setTimeout(() => {
      updateKYCStatus('submitted');
      setIsSubmitting(false);
      router.replace('/(tabs)');
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Review & Submit
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="checkmark-circle" size={48} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Almost Done!
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Review your information before submitting
        </Text>

        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={[styles.summaryText, { color: theme.text }]}>
              Personal Information
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={[styles.summaryText, { color: theme.text }]}>
              NID Front Photo
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={[styles.summaryText, { color: theme.text }]}>
              NID Back Photo
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={[styles.summaryText, { color: theme.text }]}>
              Selfie Verification
            </Text>
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.primary + '10' }]}>
          <Ionicons name="information-circle" size={24} color={theme.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              What happens next?
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Your documents will be verified within 24-48 hours. You'll receive a
              notification once approved.
            </Text>
          </View>
        </View>

        <View style={[styles.noteBox, { backgroundColor: '#FFF3CD' }]}>
          <Ionicons name="warning" size={20} color="#856404" />
          <Text style={[styles.noteText, { color: '#856404' }]}>
            You can use basic features now, but payments will be enabled after KYC
            approval.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom + 16, backgroundColor: theme.background },
        ]}
      >
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Verification</Text>
          )}
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  iconCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: scaleFont(16),
    textAlign: 'center',
    marginBottom: verticalScale(isSmallDevice ? 20 : 32),
  },
  summaryCard: {
    padding: scale(20),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(24),
    gap: verticalScale(16),
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  summaryText: {
    fontSize: scaleFont(16),
  },
  infoBox: {
    flexDirection: 'row',
    padding: scale(16),
    borderRadius: moderateScale(12),
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  infoText: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
  },
  noteBox: {
    flexDirection: 'row',
    padding: scale(12),
    borderRadius: moderateScale(10),
    gap: scale(10),
    marginBottom: verticalScale(24),
  },
  noteText: {
    flex: 1,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(18),
  },
  bottomContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  submitButton: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#FFF',
  },
});
