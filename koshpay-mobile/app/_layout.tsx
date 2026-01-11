import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;

import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';

import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { NotificationProvider } from "../context/NotificationContext";
import { AuthProvider } from "../context/AuthContext";
import { WalletProvider } from "../context/WalletContext";

// Keep the splash screen visible while we fetch resources
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);


  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay for smoothness
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await ExpoSplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <WalletProvider>
             {/* Show App only, but overlay splash if animation not done */}
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/* ... existing screens ... */}

                
                {/* ... copy all existing screens ... */}
                <Stack.Screen name="qr-scanner" options={{ animationTypeForReplace: "pop" }} />
                <Stack.Screen name="payment-confirmation" options={{ animation: "slide_from_bottom" }} />
                <Stack.Screen name="payment-success" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="payment-failure" options={{ animation: "slide_from_bottom" }} />
                <Stack.Screen name="transaction-details" options={{ animation: "slide_from_bottom" }} />
                <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="add-crypto" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="transaction-history" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="notifications" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="send-crypto" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="search" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="help-support" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="security" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="crypto-details" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="edit-profile" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="user-qr" options={{ animation: "slide_from_right" }} />
              </Stack>
              

            </WalletProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </View>
  );
}

