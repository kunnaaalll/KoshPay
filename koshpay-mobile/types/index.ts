export interface AdSlide {
  id: number;
  title: string;
  subtitle: string;
  backgroundColor: string;
  gradient: string[];
}

export interface QuickAction {
  id: number;
  icon: string;
  iconLib: IconLibrary;
  label: string;
  color: string;
}

export interface Person {
  id: number;
  name: string;
  initials: string;
  bgColor: string;
  textColor?: string;
  hasNotification?: boolean;
  isMore?: boolean;
}

export interface Business {
  id: number;
  name: string;
  initials: string;
  bgColor: string;
  isMore?: boolean;
}

export interface OfferReward {
  id: number;
  name: string;
  icon: string;
  iconLib: IconLibrary;
  color: string;
  hasNotification?: boolean;
}

export type IconLibrary = 'MaterialCommunityIcons' | 'Ionicons' | 'FontAwesome5' | 'Feather';

export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  searchBar: string;
  primary: string;
  navBar: string;
  illustration: string;
}