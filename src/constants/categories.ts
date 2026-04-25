export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string;
  type: CategoryType;
  group: string;
  labelKey: string;
  iconName: string;
  isCustom?: boolean;
  name?: string; // For custom categories
}

export const CATEGORY_GROUPS = {
  FOOD: 'food',
  TRANSPORT: 'transport',
  UTILITIES: 'utilities',
  LIFESTYLE: 'lifestyle',
  HEALTH: 'health',
  INCOME: 'income',
  CUSTOM: 'custom',
};

export const categories: Category[] = [
  // Expense - Food
  { id: 'food', type: 'expense', group: CATEGORY_GROUPS.FOOD, labelKey: 'cat_food', iconName: 'Utensils' },
  { id: 'coffee', type: 'expense', group: CATEGORY_GROUPS.FOOD, labelKey: 'cat_coffee', iconName: 'Coffee' },
  { id: 'drinks', type: 'expense', group: CATEGORY_GROUPS.FOOD, labelKey: 'cat_drinks', iconName: 'CupSoda' },
  { id: 'dessert', type: 'expense', group: CATEGORY_GROUPS.FOOD, labelKey: 'cat_dessert', iconName: 'Cake' },
  { id: 'alcohol', type: 'expense', group: CATEGORY_GROUPS.FOOD, labelKey: 'cat_alcohol', iconName: 'Beer' },
  { id: 'groceries', type: 'expense', group: CATEGORY_GROUPS.FOOD, labelKey: 'cat_groceries', iconName: 'ShoppingCart' },

  // Expense - Transport
  { id: 'taxi', type: 'expense', group: CATEGORY_GROUPS.TRANSPORT, labelKey: 'cat_taxi', iconName: 'Car' },
  { id: 'fuel', type: 'expense', group: CATEGORY_GROUPS.TRANSPORT, labelKey: 'cat_fuel', iconName: 'Fuel' },
  { id: 'bus', type: 'expense', group: CATEGORY_GROUPS.TRANSPORT, labelKey: 'cat_bus', iconName: 'Bus' },
  { id: 'train', type: 'expense', group: CATEGORY_GROUPS.TRANSPORT, labelKey: 'cat_train', iconName: 'Train' },
  { id: 'flight', type: 'expense', group: CATEGORY_GROUPS.TRANSPORT, labelKey: 'cat_flight', iconName: 'Plane' },
  { id: 'parking', type: 'expense', group: CATEGORY_GROUPS.TRANSPORT, labelKey: 'cat_parking', iconName: 'ParkingCircle' },
  { id: 'maintenance', type: 'expense', group: CATEGORY_GROUPS.TRANSPORT, labelKey: 'cat_maintenance', iconName: 'Wrench' },

  // Expense - Utilities
  { id: 'electricity', type: 'expense', group: CATEGORY_GROUPS.UTILITIES, labelKey: 'cat_electricity', iconName: 'Zap' },
  { id: 'water', type: 'expense', group: CATEGORY_GROUPS.UTILITIES, labelKey: 'cat_water', iconName: 'Droplets' },
  { id: 'internet', type: 'expense', group: CATEGORY_GROUPS.UTILITIES, labelKey: 'cat_internet', iconName: 'Globe' },
  { id: 'phone', type: 'expense', group: CATEGORY_GROUPS.UTILITIES, labelKey: 'cat_phone', iconName: 'Phone' },
  { id: 'rent', type: 'expense', group: CATEGORY_GROUPS.UTILITIES, labelKey: 'cat_rent', iconName: 'Home' },
  { id: 'subscription', type: 'expense', group: CATEGORY_GROUPS.UTILITIES, labelKey: 'cat_subscription', iconName: 'Repeat' },

  // Expense - Lifestyle
  { id: 'shopping', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_shopping', iconName: 'ShoppingBag' },
  { id: 'clothes', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_clothes', iconName: 'Shirt' },
  { id: 'beauty', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_beauty', iconName: 'Sparkles' },
  { id: 'cinema', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_cinema', iconName: 'Film' },
  { id: 'hobby', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_hobby', iconName: 'Palette' },
  { id: 'game', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_game', iconName: 'Gamepad2' },
  { id: 'gift', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_gift', iconName: 'Gift' },
  { id: 'sport', type: 'expense', group: CATEGORY_GROUPS.LIFESTYLE, labelKey: 'cat_sport', iconName: 'Trophy' },

  // Expense - Health
  { id: 'medical', type: 'expense', group: CATEGORY_GROUPS.HEALTH, labelKey: 'cat_medical', iconName: 'Stethoscope' },
  { id: 'pill', type: 'expense', group: CATEGORY_GROUPS.HEALTH, labelKey: 'cat_pill', iconName: 'Pill' },
  { id: 'gym', type: 'expense', group: CATEGORY_GROUPS.HEALTH, labelKey: 'cat_gym', iconName: 'Dumbbell' },
  { id: 'insurance', type: 'expense', group: CATEGORY_GROUPS.HEALTH, labelKey: 'cat_insurance', iconName: 'ShieldCheck' },

  // Income
  { id: 'salary', type: 'income', group: CATEGORY_GROUPS.INCOME, labelKey: 'cat_salary', iconName: 'Wallet' },
  { id: 'business', type: 'income', group: CATEGORY_GROUPS.INCOME, labelKey: 'cat_business', iconName: 'Briefcase' },
  { id: 'investment', type: 'income', group: CATEGORY_GROUPS.INCOME, labelKey: 'cat_investment', iconName: 'TrendingUp' },
  { id: 'bonus', type: 'income', group: CATEGORY_GROUPS.INCOME, labelKey: 'cat_bonus', iconName: 'Star' },
  { id: 'interest', type: 'income', group: CATEGORY_GROUPS.INCOME, labelKey: 'cat_interest', iconName: 'Percent' },
  { id: 'other_income', type: 'income', group: CATEGORY_GROUPS.INCOME, labelKey: 'cat_other_income', iconName: 'PlusCircle' },
];
