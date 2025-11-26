import { useState } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const useAdBanner = () => {
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  const handleAdScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveAdIndex(slideIndex);
  };

  return { activeAdIndex, handleAdScroll };
};
