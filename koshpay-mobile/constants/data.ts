import { AdSlide, QuickAction, Person, Business, OfferReward } from "../types";
import { DynamicIcon } from "../components/common/DynamicIcon";

export const AD_SLIDES: AdSlide[] = [
  {
    id: 1,
    title: "Get 10% Cashback",
    subtitle: "On your first crypto transaction",
    backgroundColor: "#1565C0",
    gradient: ["#1565C0", "#0D47A1"],
  },
  {
    id: 2,
    title: "Zero Transaction Fees",
    subtitle: "For the next 30 days",
    backgroundColor: "#2E7D32",
    gradient: ["#2E7D32", "#1B5E20"],
  },
  {
    id: 3,
    title: "Refer & Earn ₹500",
    subtitle: "Share with friends and earn rewards",
    backgroundColor: "#F57C00",
    gradient: ["#F57C00", "#E65100"],
  },
  {
    id: 4,
    title: "Lightning Fast Payments",
    subtitle: "Settle in seconds, not days",
    backgroundColor: "#7B1FA2",
    gradient: ["#7B1FA2", "#4A148C"],
  },
  {
    id: 5,
    title: "Bank-Grade Security",
    subtitle: "Your money is always safe with us",
    backgroundColor: "#C62828",
    gradient: ["#C62828", "#B71C1C"],
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 1,
    icon: "qr-code",
    iconLib: "MaterialCommunityIcons",
    label: "Scan To Pay",
    color: "#1565C0",
  },
  {
    id: 2,
    icon: "swap-vertical",
    iconLib: "MaterialCommunityIcons",
    label: "Buy / Sell\n Crypto",
    color: "#1565C0",
  },
  {
    id: 3,
    icon: "business",
    iconLib: "MaterialCommunityIcons",
    label: "B2B \nTransfers",
    color: "#1565C0",
  },
  {
    id: 4,
    icon: "lock-closed",
    iconLib: "MaterialCommunityIcons",
    label: "Stake\nMoney",
    color: "#1565C0",
  },
];

export const PEOPLE: Person[] = [
  {
    id: 1,
    name: "Sangeeta",
    initials: "S",
    bgColor: "#E91E63",
    hasNotification: false,
  },
  {
    id: 2,
    name: "Javed",
    initials: "J",
    bgColor: "#9C27B0",
    hasNotification: false,
  },
  {
    id: 3,
    name: "Pritesh",
    initials: "P",
    bgColor: "#3F51B5",
    hasNotification: false,
  },
  {
    id: 4,
    name: "Subhodeep",
    initials: "S",
    bgColor: "#1565C0",
    hasNotification: true,
  },
  {
    id: 6,
    name: "Bhavin",
    initials: "B",
    bgColor: "#00BCD4",
    hasNotification: false,
  },
  {
    id: 7,
    name: "Hardik",
    initials: "H",
    bgColor: "#4CAF50",
    hasNotification: false,
  },
  { id: 8, name: "More", initials: "", bgColor: "", isMore: true },
];

export const BUSINESSES: Business[] = [
  { id: 1, name: "Shivam Su...", initials: "S", bgColor: "#546E7A" },
  { id: 2, name: "PVR INOX ...", initials: "P", bgColor: "#558B2F" },
  { id: 3, name: "Shivam Su...", initials: "S", bgColor: "#546E7A" },
  { id: 4, name: "More", initials: "", bgColor: "", isMore: true },
];

export const OFFERS_REWARDS: OfferReward[] = [
  {
    id: 1,
    name: "Rewards",
    icon: "trophy",
    iconLib: "Ionicons",
    color: "#FFA000",
    hasNotification: true,
  },
  {
    id: 2,
    name: "Offers",
    icon: "diamond",
    iconLib: "MaterialCommunityIcons",
    color: "#E91E63",
  },
  {
    id: 3,
    name: "Referrals",
    icon: "people",
    iconLib: "Ionicons",
    color: "#1E88E5",
  },
  {
    id: 4,
    name: "Tick Squad",
    icon: "checkmark-circle",
    iconLib: "Ionicons",
    color: "#558B2F",
  },
];
