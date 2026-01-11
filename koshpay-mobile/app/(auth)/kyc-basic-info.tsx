import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
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
import { API_URL } from "../../constants/config";

const ID_OPTIONS = [
  { label: "Aadhaar", value: "Aadhaar" },
  { label: "PAN", value: "PAN" },
  { label: "Driving Licence", value: "Driving Licence" },
  { label: "Voter ID", value: "Voter ID" },
];

// Aadhaar format XXXX XXXX XXXX (12 digits)
const formatAadhaar = (text: string) => {
  let cleaned = text.replace(/\D/g, "").slice(0, 12);
  let formatted = cleaned;
  if (cleaned.length > 4) {
    formatted = cleaned.slice(0, 4) + " " + cleaned.slice(4);
  }
  if (cleaned.length > 8) {
    formatted = formatted.slice(0, 9) + " " + formatted.slice(9);
  }
  return formatted;
};

// PAN format: AAAAA9999A
const formatPAN = (text: string) => {
  return text
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 10);
};

export default function KYCBasicInfoScreen() {
  const { isDarkMode, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idType, setIdType] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [address, setAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Picker logic
  const [selectedModalIndex, setSelectedModalIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const getInitialIndex = () => {
    if (!idType) return 0;
    const idx = ID_OPTIONS.findIndex((opt) => opt.value === idType);
    return idx >= 0 ? idx : 0;
  };

  const handleOpenModal = () => {
    setSelectedModalIndex(getInitialIndex());
    setModalVisible(true);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: getInitialIndex(),
        animated: false,
      });
    }, 10);
  };

  const handleSelectOption = (option: any, idx: number) => {
    setIdType(option.value);
    setModalVisible(false);
    setSelectedModalIndex(idx);
    setNidNumber(""); // Clear field on ID change
  };

  // Format and validate Aadhaar/PAN
  const isAadhaarValid =
    idType === "Aadhaar" ? nidNumber.replace(/\s/g, "").length === 12 : true;
  const isPanValid = idType === "PAN" ? nidNumber.length === 10 : true;

  // Date format DD/MM/YYYY
  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted =
        cleaned.slice(0, 2) +
        "/" +
        cleaned.slice(2, 4) +
        "/" +
        cleaned.slice(4, 8);
    }
    return formatted;
  };

  const handleContinue = async () => {
    console.log("handleContinue pressed");
    if (!fullName || !dateOfBirth || !nidNumber || !address || !idType) {
      alert("Please fill all fields");
      return;
    }
    if (idType === "Aadhaar" && !isAadhaarValid) {
      alert("Aadhaar must be 12 digits");
      return;
    }
    if (idType === "PAN" && !isPanValid) {
      alert("PAN must be 10 characters");
      return;
    }
      console.log("calling nid-front...");
    try {
       console.log("Entered try block...");
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        alert("Authentication error, Please Login Again");
        return;
      }
       console.log("Before API...");

      const [day, month, year] = dateOfBirth.split("/");
      const isoDate = `${year}-${month}-${day}`;

      const res = await fetch(`${API_URL}/kyc/basic-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          date_of_birth: isoDate,
          doc_kind: idType,
          nidNumber,
          address,
        }),
      });
       console.log("after fetch, status:", res.status);

      const text = await res.text();
      console.log("nid-front status:", res.status, "body:", text);
      let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {}

      if (!res.ok) {
        alert(data.error || "Failed to save KYC info");
        return;
      }
      console.log("basic-info ok, navigating to kyc-nid-front...");
      router.push({pathname:"/(auth)/kyc-nid-front", params: { doc_kind: idType }});
    } catch (error) {
      console.log("basic-info error:", error);
      alert("An error occurred. Please Try Again :(");
    }
  };

  const isFormValid =
    fullName &&
    dateOfBirth.length === 10 &&
    nidNumber &&
    address &&
    idType &&
    (idType !== "Aadhaar" || isAadhaarValid) &&
    (idType !== "PAN" || isPanValid);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
              { backgroundColor: theme.primary, width: "25%" },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          Step 1 of 4
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Ionicons name="person" size={40} color={theme.primary} />
          </View>
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          Personal Information
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Please provide your basic details as per your National ID
        </Text>

        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Full Name <Text style={{ color: "#FF3B30" }}>*</Text>
            </Text>
            <View
              style={[styles.inputContainer, { backgroundColor: theme.card }]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.textSecondary}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Enter your full name"
                placeholderTextColor={theme.textSecondary}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>
          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Date of Birth <Text style={{ color: "#FF3B30" }}>*</Text>
            </Text>
            <View
              style={[styles.inputContainer, { backgroundColor: theme.card }]}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.textSecondary}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme.textSecondary}
                value={dateOfBirth}
                onChangeText={(text) => setDateOfBirth(formatDate(text))}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>
          {/* ID Type Picker */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Select ID Type <Text style={{ color: "#FF3B30" }}>*</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.card,
                  justifyContent: "space-between",
                },
              ]}
              onPress={handleOpenModal}
            >
              <Text
                style={{
                  color: idType ? theme.text : theme.textSecondary,
                  fontSize: scaleFont(15),
                }}
              >
                {idType || "Choose type..."}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {/* ID Number Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              {idType ? `${idType} Number` : "National ID Number"}{" "}
              <Text style={{ color: "#FF3B30" }}>*</Text>
            </Text>
            <View
              style={[styles.inputContainer, { backgroundColor: theme.card }]}
            >
              <Ionicons
                name="card-outline"
                size={20}
                color={theme.textSecondary}
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={`Enter your ${idType || "ID"} number`}
                placeholderTextColor={theme.textSecondary}
                value={nidNumber}
                onChangeText={(text) => {
                  if (idType === "Aadhaar") {
                    setNidNumber(formatAadhaar(text));
                  } else if (idType === "PAN") {
                    setNidNumber(formatPAN(text));
                  } else {
                    setNidNumber(
                      text.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)
                    );
                  }
                }}
                keyboardType={idType === "Aadhaar" ? "number-pad" : "default"}
                maxLength={
                  idType === "Aadhaar" ? 14 : idType === "PAN" ? 10 : 20
                }
              />
            </View>
            {/* Error hints */}
            {idType === "Aadhaar" &&
              nidNumber.replace(/\s/g, "").length !== 12 &&
              !!nidNumber && (
                <Text
                  style={{
                    color: "#FF3B30",
                    fontSize: scaleFont(12),
                    marginTop: 4,
                  }}
                >
                  Aadhaar must be 12 digits
                </Text>
              )}
            {idType === "PAN" && nidNumber.length !== 10 && !!nidNumber && (
              <Text
                style={{
                  color: "#FF3B30",
                  fontSize: scaleFont(12),
                  marginTop: 4,
                }}
              >
                PAN must be 10 characters
              </Text>
            )}
          </View>
          {/* Address Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Address <Text style={{ color: "#FF3B30" }}>*</Text>
            </Text>
            <View
              style={[
                styles.inputContainer,
                styles.textAreaContainer,
                { backgroundColor: theme.card },
              ]}
            >
              <TextInput
                style={[styles.input, styles.textArea, { color: theme.text }]}
                placeholder="Enter your full address"
                placeholderTextColor={theme.textSecondary}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View
          style={[styles.infoBox, { backgroundColor: theme.primary + "10" }]}
        >
          <Ionicons name="information-circle" size={20} color={theme.primary} />
          <Text style={[styles.infoText, { color: theme.text }]}>
            Make sure your information matches your National ID card exactly.
          </Text>
        </View>
      </ScrollView>

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
              backgroundColor: isFormValid ? theme.primary : theme.card,
            },
          ]}
          onPress={handleContinue}
          disabled={!isFormValid}
        >
          <Text
            style={[
              styles.continueButtonText,
              { color: isFormValid ? "#FFF" : theme.textSecondary },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Modal Picker */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: theme.card,
                paddingBottom: insets.bottom + 16,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: theme.text, marginBottom: 12 },
              ]}
            >
              Choose ID Type
            </Text>
            <FlatList
              ref={flatListRef}
              data={ID_OPTIONS}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              snapToInterval={50}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
              contentContainerStyle={{ paddingBottom: 24 }}
              style={{ maxHeight: 220 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleSelectOption(item, index)}
                  style={[
                    styles.wheelOption,
                    selectedModalIndex === index && {
                      backgroundColor: theme.primary + "30",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: scaleFont(17),
                      fontWeight: selectedModalIndex === index ? "700" : "400",
                      color: theme.text,
                    }}
                  >
                    {item.label}
                  </Text>
                  {selectedModalIndex === index && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={theme.primary}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalDone, { backgroundColor: theme.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "700",
                  fontSize: scaleFont(16),
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
  },
  headerTitle: { fontSize: scaleFont(18), fontWeight: "600" },
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
  progressFill: { height: "100%", borderRadius: moderateScale(2) },
  progressText: { fontSize: scaleFont(12) },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: scale(16) },
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
  form: { marginBottom: verticalScale(24) },
  inputGroup: { marginBottom: verticalScale(20) },
  label: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    gap: scale(10),
  },
  textAreaContainer: { alignItems: "flex-start" },
  input: { flex: 1, fontSize: scaleFont(15) },
  textArea: { minHeight: verticalScale(80), paddingTop: verticalScale(8) },
  infoBox: {
    flexDirection: "row",
    padding: scale(12),
    borderRadius: moderateScale(10),
    gap: scale(10),
  },
  infoText: {
    flex: 1,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(18),
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
  continueButtonText: { fontSize: scaleFont(16), fontWeight: "700" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
  },
  modalTitle: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    alignSelf: "center",
  },
  wheelOption: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: moderateScale(10),
    marginBottom: 0,
  },
  modalDone: {
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: moderateScale(10),
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
    width: "60%",
  },
});
