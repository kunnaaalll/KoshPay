import React, { createContext, useContext, useState, useCallback } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NotificationType = 'success' | 'error' | 'info' | 'payment';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
};

type NotificationContextType = {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [translateY] = useState(new Animated.Value(-200));
  const insets = useSafeAreaInsets();

  const showNotification = useCallback((notif: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notif,
      id: Date.now().toString(),
      duration: notif.duration || 8000,
    };

    setNotification(newNotification);

    // Slide down animation
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();

    // Auto hide after duration
    setTimeout(() => {
      hideNotification();
    }, newNotification.duration);
  }, []);

  const hideNotification = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  }, []);

  const getNotificationConfig = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: '#4CAF50', bg: '#E8F5E9' };
      case 'error':
        return { icon: 'close-circle', color: '#F44336', bg: '#FFEBEE' };
      case 'payment':
        return { icon: 'card', color: '#007AFF', bg: '#E3F2FD' };
      default:
        return { icon: 'information-circle', color: '#2196F3', bg: '#E3F2FD' };
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {notification && (
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [{ translateY }],
              top: Platform.OS === 'ios' ? insets.top : 10,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.notification,
              { backgroundColor: getNotificationConfig(notification.type).bg },
            ]}
            onPress={hideNotification}
            activeOpacity={0.9}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getNotificationConfig(notification.type).color },
              ]}
            >
              <Ionicons
                name={getNotificationConfig(notification.type).icon as any}
                size={20}
                color="#FFF"
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.message} numberOfLines={2}>
                {notification.message}
              </Text>
            </View>

            <TouchableOpacity
              onPress={hideNotification}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    color: '#666',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
