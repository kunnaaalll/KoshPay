// components/common/DynamicIcon.tsx

import React from 'react';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from '@expo/vector-icons';

type IconFamily = 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome' | 'Feather';

type DynamicIconProps = {
  family: IconFamily;
  name: string; // Keep as string for flexibility with data
  size: number;
  color: string;
};

export const DynamicIcon = ({ family, name, size, color }: DynamicIconProps) => {
  switch (family) {
    case 'Ionicons':
      return <Ionicons name={name as any} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    case 'FontAwesome':
      return <FontAwesome name={name as any} size={size} color={color} />;
    case 'Feather':
      return <Feather name={name as any} size={size} color={color} />;
    default:
      return <Ionicons name="alert-circle" size={size} color="red" />;
  }
};
