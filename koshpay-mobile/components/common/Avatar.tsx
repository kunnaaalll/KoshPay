import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
  initials?: string;
  bgColor: string;
  textColor?: string;
  hasNotification?: boolean;
  isMore?: boolean;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  bgColor,
  textColor = '#FFFFFF',
  hasNotification,
  isMore,
  size = 60,
}) => {
  return (
    <View style={[styles.avatar, { backgroundColor: bgColor, width: size, height: size, borderRadius: size / 2 }]}>
      {hasNotification && <View style={styles.notificationDot} />}
      {isMore ? (
        <Ionicons name="chevron-down" size={24} color="#999999" />
      ) : (
        <Text style={[styles.initials, { color: textColor, fontSize: size / 3 }]}>{initials}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  initials: {
    fontWeight: '600',
  },
});
