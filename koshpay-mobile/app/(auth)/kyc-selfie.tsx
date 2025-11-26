import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../../utils/responsive';
import { useRouter } from 'expo-router';

export default function KYCSelfieScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [photo, setPhoto] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const handleTakePhoto = async () => {
    const granted = await requestPermissions();
    if (granted) {
      setShowCamera(true);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  const handleContinue = () => {
    if (!photo) {
      Alert.alert('No Photo', 'Please capture your selfie');
      return;
    }
    router.push('/(auth)/kyc-review');
  };

  if (showCamera) {
    return (
      <CameraView style={styles.camera} facing="front">
        <View style={[styles.cameraOverlay, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCamera(false)}
          >
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.selfieFrame}>
            <View style={styles.faceOval} />
          </View>

          <Text style={styles.cameraInstruction}>
            Position your face within the frame
          </Text>

          <View style={styles.cameraActions}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => {
                setShowCamera(false);
                Alert.alert('Captured!', 'Selfie saved successfully');
              }}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    );
  }

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
          KYC Verification
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.primary, width: '100%' },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          Step 4 of 4
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="person-circle" size={40} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Take a Selfie</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Take a clear photo of your face for verification
        </Text>

        {photo ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: photo }} style={styles.photoPreview} />
            <TouchableOpacity
              style={[styles.retakeButton, { backgroundColor: theme.card }]}
              onPress={handleRetake}
            >
              <Ionicons name="refresh" size={20} color={theme.text} />
              <Text style={[styles.retakeText, { color: theme.text }]}>
                Retake Photo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadOptions}>
            <TouchableOpacity
              style={[styles.uploadButton, { borderColor: theme.primary }]}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={32} color={theme.primary} />
              <Text style={[styles.uploadButtonText, { color: theme.text }]}>
                Take Selfie
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, { borderColor: theme.primary }]}
              onPress={handlePickImage}
            >
              <Ionicons name="image" size={32} color={theme.primary} />
              <Text style={[styles.uploadButtonText, { color: theme.text }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.guidelinesBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.guidelinesTitle, { color: theme.text }]}>
            Selfie Guidelines
          </Text>
          <View style={styles.guideline}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={[styles.guidelineText, { color: theme.textSecondary }]}>
              Look straight at the camera
            </Text>
          </View>
          <View style={styles.guideline}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={[styles.guidelineText, { color: theme.textSecondary }]}>
              Remove glasses and hat
            </Text>
          </View>
          <View style={styles.guideline}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={[styles.guidelineText, { color: theme.textSecondary }]}>
              Ensure good lighting
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom + 16, backgroundColor: theme.background },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: photo ? theme.primary : theme.card },
          ]}
          onPress={handleContinue}
          disabled={!photo}
        >
          <Text
            style={[
              styles.continueButtonText,
              { color: photo ? '#FFF' : theme.textSecondary },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  headerTitle: { fontSize: scaleFont(18), fontWeight: '600' },
  progressContainer: { paddingHorizontal: scale(16), marginBottom: verticalScale(24) },
  progressBar: {
    height: verticalScale(4),
    backgroundColor: 'rgba(128,128,128,0.2)',
    borderRadius: moderateScale(2),
    marginBottom: verticalScale(8),
  },
  progressFill: { height: '100%', borderRadius: moderateScale(2) },
  progressText: { fontSize: scaleFont(12) },
  content: { flex: 1, paddingHorizontal: scale(16) },
  iconContainer: { alignItems: 'center', marginBottom: verticalScale(24) },
  iconCircle: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: scaleFont(24), fontWeight: '700', textAlign: 'center', marginBottom: verticalScale(8) },
  subtitle: { fontSize: scaleFont(14), textAlign: 'center', marginBottom: verticalScale(isSmallDevice ? 20 : 32), paddingHorizontal: scale(20) },
  uploadOptions: { flexDirection: 'row', gap: scale(12), marginBottom: verticalScale(32) },
  uploadButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(isSmallDevice ? 24 : 32),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  uploadButtonText: { fontSize: scaleFont(14), fontWeight: '600', marginTop: verticalScale(8) },
  photoPreviewContainer: { marginBottom: verticalScale(32) },
  photoPreview: { width: '100%', height: verticalScale(isSmallDevice ? 250 : 300), borderRadius: moderateScale(12), marginBottom: verticalScale(16) },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    gap: scale(8),
  },
  retakeText: { fontSize: scaleFont(16), fontWeight: '600' },
  guidelinesBox: { padding: scale(16), borderRadius: moderateScale(12) },
  guidelinesTitle: { fontSize: scaleFont(16), fontWeight: '700', marginBottom: verticalScale(12) },
  guideline: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(8), gap: scale(8) },
  guidelineText: { fontSize: scaleFont(14) },
  bottomContainer: { paddingHorizontal: scale(16), paddingTop: verticalScale(16) },
  continueButton: { paddingVertical: verticalScale(16), borderRadius: moderateScale(12), alignItems: 'center' },
  continueButtonText: { fontSize: scaleFont(16), fontWeight: '700' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  closeButton: { alignSelf: 'flex-end', margin: scale(20) },
  selfieFrame: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  faceOval: {
    width: scale(isSmallDevice ? 200 : 250),
    height: scale(isSmallDevice ? 260 : 320),
    borderRadius: scale(isSmallDevice ? 100 : 125),
    borderWidth: scale(4),
    borderColor: '#FFF',
    borderStyle: 'dashed',
  },
  cameraInstruction: {
    color: '#FFF',
    fontSize: scaleFont(16),
    textAlign: 'center',
    marginBottom: verticalScale(40),
    paddingHorizontal: scale(40),
  },
  cameraActions: { alignItems: 'center', marginBottom: verticalScale(40) },
  captureButton: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: { width: scale(64), height: scale(64), borderRadius: scale(32), backgroundColor: '#FFF' },
});
