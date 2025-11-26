import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { NotificationProvider } from "../context/NotificationContext";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
        
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Test Navigation Screen */}
              <Stack.Screen
                name="test-navigation"
                options={{
                  animation: "slide_from_right",
                }}
              />

              {/* Other screens */}
              <Stack.Screen
                name="qr-scanner"
                options={{
                  animationTypeForReplace: "pop",
                }}
              />

              <Stack.Screen
                name="payment-confirmation"
                options={{
                  animation: "slide_from_bottom",
                }}
              />

              <Stack.Screen
                name="payment-success"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="payment-failure"
                options={{
                  animation: "slide_from_bottom",
                }}
              />

              <Stack.Screen
                name="transaction-details"
                options={{
                  animation: "slide_from_bottom",
                }}
              />

              <Stack.Screen
                name="settings"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="add-crypto"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="transaction-history"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="notifications"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="send-crypto"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="search"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="help-support"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="security"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="crypto-details"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="edit-profile"
                options={{
                  animation: "slide_from_right",
                }}
              />

              <Stack.Screen
                name="user-qr"
                options={{
                  animation: "slide_from_right",
                }}
              />
            </Stack>
    
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
