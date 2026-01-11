import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  withDelay, 
  withSpring, 
  Easing
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedCheckmarkProps {
    size?: number;
    color?: string;
}

export const AnimatedCheckmark = ({ size = 100, color = '#4285F4' }: AnimatedCheckmarkProps) => {
    const progress = useSharedValue(0);
    const circleScale = useSharedValue(0);

    const radius = 40;
    const strokeWidth = 6;
    const circleLength = 2 * Math.PI * radius; // approx 251.32
    
    // Checkmark path length is roughly 50
    const checkmarkLength = 60;

    useEffect(() => {
        progress.value = 0;
        circleScale.value = 0;

        // Animate Circle Scale Pop
        circleScale.value = withSpring(1, { damping: 12, stiffness: 100 });

        // Animate Checkmark Drawing
        progress.value = withDelay(
            300, 
            withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) })
        );
    }, []);

    const animatedCheckProps = useAnimatedProps(() => ({
        strokeDashoffset: checkmarkLength * (1 - progress.value),
    }));

    // Google Pay style: Blue Shield/Circle 
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={[{ transform: [{ scale: circleScale }] }]}>
                 <Svg width={size} height={size} viewBox="0 0 100 100">
                    <AnimatedCircle 
                        cx="50" 
                        cy="50" 
                        r={radius} 
                        fill={color}
                    />
                    <AnimatedPath
                        d="M32 50 L45 63 L68 40"
                        stroke="#FFF"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        strokeDasharray={checkmarkLength}
                        animatedProps={animatedCheckProps}
                    />
                 </Svg>
            </Animated.View>
        </View>
    );
};
