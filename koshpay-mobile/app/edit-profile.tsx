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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

export default function EditProfileScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState('Kunal Sharma');
  const [email, setEmail] = useState('kunal@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [username, setUsername] = useState('@kunal_sharma');
//   const [bio, setBio] = useState('Crypto enthusiast | Blockchain developer');

  const handleSave = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile has been updated successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => console.log('Camera') },
        { text: 'Choose from Library', onPress: () => console.log('Gallery') },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.cancelButton, { color: theme.text }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Edit Profile
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: theme.primary }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <View
              style={[
                styles.photoCircle,
                { backgroundColor: theme.primary + '20' },
              ]}
            >
              <Text style={[styles.photoText, { color: theme.primary }]}>
                KS
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.editPhotoButton, { backgroundColor: theme.primary }]}
              onPress={handleChangePhoto}
            >
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto}>
            <Text style={[styles.changePhotoText, { color: theme.primary }]}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Full Name
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
            <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Email
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Phone Number
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
            <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Username
          </Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
            <Ionicons name="at" size={20} color={theme.textSecondary} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
            />
          </View>

          {/* <Text style={[styles.label, { color: theme.textSecondary }]}>
            Bio
          </Text>
          <View
            style={[
              styles.inputContainer,
              styles.bioInput,
              { backgroundColor: theme.card },
            ]}
          > */}
            {/* <TextInput
              style={[styles.input, { color: theme.text }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            /> */}
          {/* </View> */}
        </View>

       

        <View style={{ height: 40 }} />
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
  cancelButton: {
    fontSize: scaleFont(16),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  saveButton: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: scale(16),
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: verticalScale(24),
  },
  photoContainer: {
    position: 'relative',
    marginBottom: verticalScale(12),
  },
  photoCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: scaleFont(36),
    fontWeight: '700',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  changePhotoText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  formSection: {
    marginBottom: verticalScale(24),
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    marginBottom: verticalScale(8),
    marginTop: verticalScale(16),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    gap: scale(10),
  },
  bioInput: {
    alignItems: 'flex-start',
    minHeight: verticalScale(100),
  },
  input: {
    flex: 1,
    fontSize: scaleFont(15),
  },
  dangerSection: {
    marginTop: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    marginBottom: verticalScale(12),
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(16),
    borderRadius: moderateScale(10),
    gap: scale(8),
  },
  dangerButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
});
