import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Theme } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const CONTAINER_WIDTH = width - (HORIZONTAL_PADDING * 2);
const TAB_WIDTH = CONTAINER_WIDTH / 3;

interface Tab {
  id: string;
  label: string;
  icon: string;
  iconLib: 'Ionicons' | 'MaterialCommunityIcons';
}

interface AnimatedBottomNavRoundedProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  theme: Theme;
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: 'home', iconLib: 'Ionicons' },
  { id: 'wallet', label: 'Wallet', icon: 'wallet', iconLib: 'MaterialCommunityIcons' },
  { id: 'profile', label: 'You', icon: 'person-circle-outline', iconLib: 'Ionicons' },
];

export const AnimatedBottomNavRounded: React.FC<AnimatedBottomNavRoundedProps> = ({
  activeTab,
  onTabPress,
  theme,
}) => {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    const index = TABS.findIndex(tab => tab.id === activeTab);
    // Simplified calculation - just multiply by tab width
    translateX.value = withSpring(index * TAB_WIDTH, {
      damping: 40,
      stiffness: 300,
    });
  }, [activeTab]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const renderIcon = (tab: Tab, isActive: boolean) => {
    const iconSize = isActive ? 24 : 22;
    const iconColor = isActive ? '#FFFFFF' : theme.textSecondary;

    if (tab.iconLib === 'Ionicons') {
      return <Ionicons name={tab.icon as any} size={iconSize} color={iconColor} />;
    }
    return <MaterialCommunityIcons name={tab.icon as any} size={iconSize} color={iconColor} />;
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.navBar, 
        borderTopColor: theme.border,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
      }
    ]}>
      <View style={styles.innerContainer}>
        {/* Animated Rounded Background */}
        <Animated.View
          style={[
            styles.activeIndicatorRounded,
            { backgroundColor: theme.primary },
            animatedIndicatorStyle,
          ]}
        />

        {/* Tab Buttons */}
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {renderIcon(tab, isActive)}
              </View>
              <Animated.Text
                style={[
                  styles.label,
                  {
                    color: isActive ? '#FFFFFF' : theme.textSecondary,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {tab.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
    borderTopWidth: 0.5,
  },
  innerContainer: {
    flexDirection: 'row',
    height: 56,
    position: 'relative',
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  activeIndicatorRounded: {
    position: 'absolute',
    height: 56,
    width: TAB_WIDTH,
    borderRadius: 118,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    gap: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  label: {
    fontSize: 11,
  },
});