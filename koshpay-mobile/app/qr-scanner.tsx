import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale, scaleFont, isSmallDevice } from '../utils/responsive';

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.72;

export default function QRScannerScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    router.push({
      pathname: '/payment',
      params: {
        name: 'Scanned User',
        id: data,
      },
    });
  };

  const handleGalleryUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert(
          'Gallery Upload',
          'QR code detection from gallery images will be implemented soon.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <Text style={[styles.message, { color: theme.text }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.message, { color: theme.text }]}>
            Camera access required
          </Text>
          <Text style={[styles.subMessage, { color: theme.textSecondary }]}>
            Enable camera in Settings to scan KoshPay QR codes
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Overlay - Using absolute positioning (NOT as children of CameraView) */}
      <View style={styles.overlayContainer}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KoshPay Scanner</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {/* Scan Frame */}
          <View style={styles.scanContainer}>
            <View style={[styles.corner, styles.cornerTopLeft, { borderTopColor: theme.primary, borderLeftColor: theme.primary }]} />
            <View style={[styles.corner, styles.cornerTopRight, { borderTopColor: theme.primary, borderRightColor: theme.primary }]} />
            <View style={[styles.corner, styles.cornerBottomLeft, { borderBottomColor: theme.primary, borderLeftColor: theme.primary }]} />
            <View style={[styles.corner, styles.cornerBottomRight, { borderBottomColor: theme.primary, borderRightColor: theme.primary }]} />
          </View>

          {/* Instructions */}
          <View style={styles.instructionContainer}>
            <Ionicons name="qr-code-outline" size={40} color="#FFF" style={{ marginBottom: 8 }} />
            <Text style={styles.instructionTitle}>Scan KoshPay QR Code</Text>
            <Text style={styles.instructionSubtitle}>
              Position the QR code within the frame
            </Text>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}
            onPress={handleGalleryUpload}
          >
            <Ionicons name="image-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'box-none',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanContainer: {
    width: scale(SCAN_AREA_SIZE),
    height: scale(SCAN_AREA_SIZE),
    position: 'relative',
    borderRadius: moderateScale(20),
  },
  corner: {
    position: 'absolute',
    width: scale(32),
    height: scale(32),
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: moderateScale(8),
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: moderateScale(8),
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: moderateScale(8),
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: moderateScale(8),
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: verticalScale(32),
  },
  instructionTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#FFF',
    marginBottom: verticalScale(4),
  },
  instructionSubtitle: {
    fontSize: scaleFont(13),
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: verticalScale(16),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(24),
  },
  actionButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#FFF',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(32),
    gap: verticalScale(16),
  },
  message: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: verticalScale(16),
  },
  subMessage: {
    fontSize: scaleFont(14),
    textAlign: 'center',
    lineHeight: scaleFont(20),
  },
  backButton: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(24),
  },
  backButtonText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#FFF',
  },
});
