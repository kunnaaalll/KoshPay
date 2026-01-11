import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import {
  scale,
  verticalScale,
  moderateScale,
  scaleFont,
  isSmallDevice,
} from "../../utils/responsive";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";
import { API_URL } from "../../constants/config";

export default function KYCNIDBackScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const docKind = params.doc_kind as string | undefined;

  const [photo, setPhoto] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission",
        "Please enable camera access in Settings to take photos."
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const ok = await requestCameraPermission();
    if (!ok) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 10],
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleRetake = () => setPhoto(null);

  const handleContinue = async () => {
    if (!photo) {
      Alert.alert("No Photo", "Please capture your NID Back photo");
      return;
    }
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        alert("Authentication error, Please Login Again");
        return;
      } 

      const formData = new FormData();
            formData.append("kycBackImage", {
              uri: photo,
              name: "nid-back.jpg",
              type: "image/jpeg",
            } as any);
      
            const uploadRes = await fetch(
               `${API_URL}/upload/kyc-back-image`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  // no Content-Type here; fetch sets multipart boundary automatically
                },
                body: formData,
              }
            );
      
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok || !uploadData.imageUrl) {
              Alert.alert(
                "Upload error",
                uploadData.error || "Failed to upload image"
              );
              return;
            }
      
            const imageUrl = uploadData.imageUrl;

      const res = await fetch(`${API_URL}/kyc/nid-back`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl,
          doc_kind : docKind,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error || "Failed to save Back ID photo, Please Try Again :("
        );
        return;
      }
      router.push("/(auth)/kyc-selfie");
    } catch (error) {
      alert("An error occurred. Please Try Again :(");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          KYC Verification
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.primary, width: "75%" },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          Step 3 of 4
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Ionicons name="card" size={40} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Upload NID Back
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Take a clear photo of the back side of your National ID card
        </Text>

        {/* Photo Preview or Upload Options */}
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
                Take Photo
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

        {/* Guidelines */}
        <View style={[styles.guidelinesBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.guidelinesTitle, { color: theme.text }]}>
            Photo Guidelines
          </Text>
          <View style={styles.guideline}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text
              style={[styles.guidelineText, { color: theme.textSecondary }]}
            >
              Ensure all text is clearly visible
            </Text>
          </View>
          <View style={styles.guideline}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text
              style={[styles.guidelineText, { color: theme.textSecondary }]}
            >
              Avoid glare and shadows
            </Text>
          </View>
          <View style={styles.guideline}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text
              style={[styles.guidelineText, { color: theme.textSecondary }]}
            >
              Capture the entire card within frame
            </Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: theme.background,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: photo ? theme.primary : theme.card,
            },
          ]}
          onPress={handleContinue}
          disabled={!photo}
        >
          <Text
            style={[
              styles.continueButtonText,
              { color: photo ? "#FFF" : theme.textSecondary },
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: "600",
  },
  progressContainer: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  progressBar: {
    height: verticalScale(4),
    backgroundColor: "rgba(128,128,128,0.2)",
    borderRadius: moderateScale(2),
    marginBottom: verticalScale(8),
  },
  progressFill: {
    height: "100%",
    borderRadius: moderateScale(2),
  },
  progressText: {
    fontSize: scaleFont(12),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  iconCircle: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: scaleFont(24),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: scaleFont(14),
    textAlign: "center",
    marginBottom: verticalScale(isSmallDevice ? 20 : 32),
    paddingHorizontal: scale(20),
  },
  uploadOptions: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(32),
  },
  uploadButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(isSmallDevice ? 24 : 32),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderStyle: "dashed",
  },
  uploadButtonText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    marginTop: verticalScale(8),
  },
  photoPreviewContainer: {
    marginBottom: verticalScale(32),
  },
  photoPreview: {
    width: "100%",
    height: verticalScale(200),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    gap: scale(8),
  },
  retakeText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
  guidelinesBox: {
    padding: scale(16),
    borderRadius: moderateScale(12),
  },
  guidelinesTitle: {
    fontSize: scaleFont(16),
    fontWeight: "700",
    marginBottom: verticalScale(12),
  },
  guideline: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
    gap: scale(8),
  },
  guidelineText: {
    fontSize: scaleFont(14),
  },
  bottomContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  continueButton: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: scaleFont(16),
    fontWeight: "700",
  },
  // Camera styles
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  closeButton: {
    alignSelf: "flex-end",
    margin: scale(20),
  },
  cameraFrame: {
    flex: 1,
    margin: scale(40),
    position: "relative",
  },
  frameCorner: {
    position: "absolute",
    width: scale(40),
    height: scale(40),
    borderTopWidth: scale(4),
    borderLeftWidth: scale(4),
    borderColor: "#FFF",
    top: 0,
    left: 0,
  },
  frameTopRight: {
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: scale(4),
  },
  frameBottomLeft: {
    top: undefined,
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: scale(4),
  },
  frameBottomRight: {
    top: undefined,
    bottom: 0,
    left: undefined,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: scale(4),
    borderRightWidth: scale(4),
  },
  cameraInstruction: {
    color: "#FFF",
    fontSize: scaleFont(16),
    textAlign: "center",
    marginBottom: verticalScale(40),
    paddingHorizontal: scale(40),
  },
  cameraActions: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  captureButton: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonInner: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: "#FFF",
  },
});
