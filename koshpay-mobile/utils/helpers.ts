import React from 'react';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { IconLibrary } from '../types';

export const renderIcon = (iconName: string, iconLib: IconLibrary, size: number, color: string) => {
  switch (iconLib) {
    case 'Ionicons':
      return React.createElement(Ionicons, { name: iconName as any, size, color });
    case 'MaterialCommunityIcons':
      return React.createElement(MaterialCommunityIcons, { name: iconName as any, size, color });
    case 'FontAwesome5':
      return React.createElement(FontAwesome5, { name: iconName as any, size, color });
    case 'Feather':
      return React.createElement(Feather, { name: iconName as any, size, color });
    default:
      return null;
  }
};
