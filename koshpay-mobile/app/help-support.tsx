import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export default function HelpSupportScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I add cryptocurrency to my wallet?',
      answer: 'Go to Wallet → Add Crypto → Enter your wallet address or scan QR code. Your crypto will appear once the transaction is confirmed on the blockchain.',
    },
    {
      id: '2',
      question: 'What are the transaction fees?',
      answer: 'We charge a 1% service fee + blockchain gas fees. Gas fees vary based on network congestion. You\'ll see the exact fee before confirming any transaction.',
    },
    {
      id: '3',
      question: 'How long do transactions take?',
      answer: 'Bitcoin: 10-60 minutes\nSolana: 2-5 seconds\nEthereum: 1-15 minutes\n\nTime varies based on network congestion and gas fees paid.',
    },
    {
      id: '4',
      question: 'Is my money safe?',
      answer: 'Yes! We use industry-standard encryption, secure cold storage for majority of funds, and multi-signature wallets. We\'re also insured against security breaches.',
    },
    {
      id: '5',
      question: 'How do I verify my account (KYC)?',
      answer: 'Go to Profile → Settings → Security → Verify Identity. Upload your government ID and take a selfie. Verification usually takes 24-48 hours.',
    },
    {
      id: '6',
      question: 'Can I cancel a transaction?',
      answer: 'Once a transaction is confirmed on the blockchain, it cannot be reversed. Always double-check recipient address before sending.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'support@koshpay.com',
      action: () => Linking.openURL('mailto:support@koshpay.com'),
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      subtitle: '+91 98765 43210',
      action: () => Linking.openURL('https://wa.me/919876543210'),
    },
    {
      icon: 'call',
      title: 'Phone Support',
      subtitle: '1800-123-4567 (Toll Free)',
      action: () => Linking.openURL('tel:18001234567'),
    },
    {
      icon: 'chatbubbles',
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      action: () => {
        // TODO: Implement live chat
        alert('Live chat coming soon!');
      },
    },
  ];

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Help & Support
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Options */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Contact Us
        </Text>
        {contactOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.contactCard, { backgroundColor: theme.card }]}
            onPress={option.action}
          >
            <View
              style={[
                styles.contactIcon,
                { backgroundColor: theme.primary + '20' },
              ]}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={theme.primary}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactTitle, { color: theme.text }]}>
                {option.title}
              </Text>
              <Text style={[styles.contactSubtitle, { color: theme.textSecondary }]}>
                {option.subtitle}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ))}

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Frequently Asked Questions
        </Text>
        {faqs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={[styles.faqCard, { backgroundColor: theme.card }]}
            onPress={() =>
              setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
            }
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQuestion, { color: theme.text }]}>
                {faq.question}
              </Text>
              <Ionicons
                name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.textSecondary}
              />
            </View>
            {expandedFAQ === faq.id && (
              <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
                {faq.answer}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Additional Resources */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Resources
        </Text>
        <TouchableOpacity
          style={[styles.resourceCard, { backgroundColor: theme.card }]}
          onPress={() => Linking.openURL('https://koshpay.com/terms')}
        >
          <Ionicons
            name="document-text-outline"
            size={24}
            color={theme.text}
          />
          <Text style={[styles.resourceText, { color: theme.text }]}>
            Terms & Conditions
          </Text>
          <Ionicons
            name="open-outline"
            size={18}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resourceCard, { backgroundColor: theme.card }]}
          onPress={() => Linking.openURL('https://koshpay.com/privacy')}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color={theme.text} />
          <Text style={[styles.resourceText, { color: theme.text }]}>
            Privacy Policy
          </Text>
          <Ionicons
            name="open-outline"
            size={18}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resourceCard, { backgroundColor: theme.card }]}
          onPress={() => Linking.openURL('https://koshpay.com/blog')}
        >
          <Ionicons name="book-outline" size={24} color={theme.text} />
          <Text style={[styles.resourceText, { color: theme.text }]}>
            Knowledge Base
          </Text>
          <Ionicons
            name="open-outline"
            size={18}
            color={theme.textSecondary}
          />
        </TouchableOpacity>

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
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(12),
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  contactIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  contactSubtitle: {
    fontSize: scaleFont(14),
  },
  faqCard: {
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    flex: 1,
    marginRight: scale(12),
  },
  faqAnswer: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
    marginTop: verticalScale(12),
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
    gap: scale(12),
  },
  resourceText: {
    fontSize: scaleFont(15),
    fontWeight: '500',
    flex: 1,
  },
});
