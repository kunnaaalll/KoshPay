import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';
import { Camera } from 'expo-camera';

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check navigation state is ready
    if (!rootNavigationState?.key) return;

    checkPermissionsAndNavigate();
  }, [rootNavigationState, isLoading, isAuthenticated]);

  const checkPermissionsAndNavigate = async () => {
    if (isLoading) return;

    // 1. Request Permissions (Only on first run mostly, but we ask here)
    if (!isReady) {
        // Camera
        const camStatus = await Camera.requestCameraPermissionsAsync();
        
        // Microphone (often needed with camera)
        const micStatus = await Camera.requestMicrophonePermissionsAsync();

        // Biometrics (just check support)
        const bioStatus = await LocalAuthentication.hasHardwareAsync();
        
        // Notifications (Skipped as package missing)
        // const { status: notifStatus } = await Notifications.requestPermissionsAsync();

        setIsReady(true);
    }

    // 2. Navigate based on Auth
    if (isAuthenticated) {
        // Authenticated -> Home
        router.replace('/(tabs)');
    } else {
        // Not Authenticated -> Login (Demo flow)
        router.replace('/(auth)/phone-login');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Initializing KoshPay...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    marginTop: 20,
    color: '#FFF',
    fontSize: 16,
  },
});
