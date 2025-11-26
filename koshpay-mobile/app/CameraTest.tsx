import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CameraCaptureScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const retakePhoto = () => setPhotoUri(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Take Your Photo</Text>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.button} onPress={retakePhoto}>
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Ionicons name="camera" size={30} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', padding: 20,
  },
  title: {
    fontSize: 22, fontWeight: '700', marginBottom: 30, color: '#fff',
  },
  previewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: 300, height: 400, borderRadius: 15, marginBottom: 20,
  },
  button: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E88E5', padding: 15, borderRadius: 10,
  },
  buttonText: {
    color: '#fff', fontSize: 18, marginLeft: 10,
  },
});
