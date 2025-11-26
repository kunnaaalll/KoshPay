import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="phone-login" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="kyc-basic-info" />
      <Stack.Screen name="kyc-nid-front" />
      <Stack.Screen name="kyc-nid-back" />
      <Stack.Screen name="kyc-selfie" />
      <Stack.Screen name="kyc-review" />
    </Stack>
  );
}
