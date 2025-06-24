/**
 * Text contrast utility functions
 * Use these to ensure consistent, readable text throughout the app
 */

export const textColors = {
  // Semantic text colors with good contrast
  primary: 'text-text-primary',      // #111827 - Very dark, for headings
  secondary: 'text-text-secondary',  // #1f2937 - Dark, for body text
  muted: 'text-text-muted',          // #374151 - Medium, for labels/descriptions
  subtle: 'text-text-subtle',        // #4b5563 - Light but readable, for metadata
  disabled: 'text-text-disabled',    // #9ca3af - For disabled states
} as const;

/**
 * Get appropriate text color based on content type
 */
export const getTextColor = (type: 'heading' | 'body' | 'caption' | 'label' | 'meta' | 'disabled' = 'body'): string => {
  switch (type) {
    case 'heading':
      return textColors.primary;
    case 'body':
      return textColors.secondary;
    case 'caption':
    case 'label':
      return textColors.muted;
    case 'meta':
      return textColors.subtle;
    case 'disabled':
      return textColors.disabled;
    default:
      return textColors.secondary;
  }
};

/**
 * Legacy gray class mapping to new readable colors
 * Use this if you need to manually replace classes
 */
export const grayClassMapping = {
  'text-gray-300': 'text-text-disabled',
  'text-gray-400': 'text-text-subtle',
  'text-gray-500': 'text-text-subtle',
  'text-gray-600': 'text-text-muted',
  'text-gray-700': 'text-text-secondary',
  'text-gray-800': 'text-text-primary',
  'text-gray-900': 'text-text-primary',
} as const;

/**
 * Replace legacy gray classes with semantic ones
 */
export const replaceGrayClasses = (className: string): string => {
  let updatedClassName = className;
  
  Object.entries(grayClassMapping).forEach(([oldClass, newClass]) => {
    updatedClassName = updatedClassName.replace(new RegExp(`\\b${oldClass}\\b`, 'g'), newClass);
  });
  
  return updatedClassName;
};

/**
 * Common text combinations for consistent usage
 */
export const textCombinations = {
  cardTitle: `${textColors.primary} text-lg font-semibold`,
  cardDescription: `${textColors.muted} text-sm`,
  sectionHeading: `${textColors.primary} text-2xl font-bold`,
  sectionSubtitle: `${textColors.secondary} text-lg`,
  buttonText: `${textColors.primary} font-medium`,
  inputLabel: `${textColors.muted} text-sm font-medium`,
  inputHelp: `${textColors.subtle} text-xs`,
  metadata: `${textColors.subtle} text-xs`,
  price: `${textColors.primary} text-xl font-bold`,
  priceUnit: `${textColors.subtle} text-sm`,
} as const;

export default {
  textColors,
  getTextColor,
  grayClassMapping,
  replaceGrayClasses,
  textCombinations,
};
