import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { 
//   useSharedValue, 
//   useAnimatedStyle, 
//   withSpring, 
  withTiming, 
//   withSequence, 
//   runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { isSmallDevice } from '../utils/responsive';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  
  // Container Background Opacity for fade out
  const containerOpacity = useSharedValue(1);

  const startAnimation = () => {
    // 1. Scale Up Logo
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withTiming(1, { duration: 800 });
    
    // 2. Fade In Text with delay
    textOpacity.value = withTiming(1, { duration: 1000 });

    // 3. Wait and then Exit
    setTimeout(() => {
        // Fade out everything
        containerOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
            if (finished) {
                runOnJS(onFinish)();
            }
        });
    }, 2500);
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background with Gradient - Vibrant Premium Theme */}
        <LinearGradient
            colors={['#2E3192', '#1BFFFF']} // Vibrant Blue to Cyan/Teal
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
        />
        {/* Overlay for depth */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />

      {/* Center Content */}
      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.iconCircle}>
            <Ionicons name="wallet" size={64} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.appName}>KOSHPAY</Text>
          <Text style={styles.tagline}>Future of Payments</Text>
        </Animated.View>
      </View>

      {/* Bottom Powered By */}
      <Animated.View style={[styles.bottomContainer, textStyle]}>
        <Text style={styles.poweredBy}>Secured by Blockchain</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Ensure it sits on top
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
    fontFamily: isSmallDevice ? 'System' : 'System', // Could use custom font if available
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
  },
  poweredBy: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
  },
});
