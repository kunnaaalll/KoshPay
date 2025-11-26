import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AdSlide } from '../../types';

const { width } = Dimensions.get('window');

interface AdBannerProps {
  slides: AdSlide[];
  activeIndex: number;
  onScroll: (event: any) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slides, activeIndex, onScroll }) => {
  const getAdIcon = (id: number) => {
    switch (id) {
      case 1: return <MaterialCommunityIcons name="cash-multiple" size={40} color="#FFFFFF" />;
      case 2: return <MaterialCommunityIcons name="cash-remove" size={40} color="#FFFFFF" />;
      case 3: return <Ionicons name="people" size={40} color="#FFFFFF" />;
      case 4: return <Ionicons name="flash" size={40} color="#FFFFFF" />;
      case 5: return <MaterialCommunityIcons name="shield-check" size={40} color="#FFFFFF" />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
      >
        {slides.map((ad) => (
          <TouchableOpacity
            key={ad.id}
            style={[styles.slide, { width, backgroundColor: ad.backgroundColor }]}
            activeOpacity={0.9}
          >
            <View style={styles.content}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{ad.title}</Text>
                <Text style={styles.subtitle}>{ad.subtitle}</Text>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Learn More</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  {getAdIcon(ad.id)}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  slide: {
    height: 200,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    width: 24,
    height: 6,
    backgroundColor: '#FFFFFF',
  },
});