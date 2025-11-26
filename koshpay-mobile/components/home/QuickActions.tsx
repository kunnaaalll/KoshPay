// components/home/QuickActions.tsx

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Fixed path
import { DynamicIcon } from "../common/DynamicIcon";
import { QUICK_ACTIONS } from "../../constants/data";
import { useRouter } from "expo-router";

export const QuickActions = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleActionPress = (action: any) => {
    if (action.label === "Scan To Pay") {
      router.push("/qr-scanner");
    } else if (action.label === "Pay Anyone") {
      router.push("/payment");
    }
  };

  return (
    <View style={styles.container}>
      {QUICK_ACTIONS.map((action) => (
        <Pressable
          key={action.id}
          style={styles.actionButton}
          onPress={() => handleActionPress(action)}
        >
          <View
            style={[styles.iconContainer, { backgroundColor: action.color }]}
          >
            <DynamicIcon
              family={
                action.iconLib as
                  | "Ionicons"
                  | "MaterialCommunityIcons"
                  | "FontAwesome"
                  | "Feather"
              }
              name={action.icon}
              size={28}
              color="#FFFFFF"
            />
          </View>
          <Text style={[styles.label, { color: theme.text }]} numberOfLines={2}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionButton: {
    alignItems: "center",
    width: 80,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
});
