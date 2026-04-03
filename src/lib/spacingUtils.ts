export type SpacingScale = Record<string, string>;

export const generateSpacingScale = (baseUnit: 4 | 8): SpacingScale => {
  // The PRD specifies exact T-shirt names and values based on the base unit
  if (baseUnit === 4) {
    return {
      '2xs': '2px', // half base
      'xs': '4px',  // 1x base
      'sm': '8px',  // 2x base
      'md': '12px', // 3x base
      'lg': '16px', // 4x base
      'xl': '24px', // 6x base
      '2xl': '32px', // 8x base
      '3xl': '48px', // 12x base
    };
  } else {
    // 8px base
    return {
      '2xs': '4px',  // half base
      'xs': '8px',   // 1x base
      'sm': '12px',  // 1.5x base
      'md': '16px',  // 2x base
      'lg': '24px',  // 3x base
      'xl': '32px',  // 4x base
      '2xl': '48px', // 6x base
      '3xl': '64px', // 8x base
    };
  }
};

export const defaultBorderRadius = {
  'none': '0px',
  'sm': '4px',
  'md': '8px',
  'lg': '16px',
  'full': '9999px',
};

export const defaultShadows = {
  'sm': '0 1px 2px rgba(0,0,0,0.05)',
  'md': '0 4px 6px rgba(0,0,0,0.07)',
  'lg': '0 10px 15px rgba(0,0,0,0.10)',
  'xl': '0 20px 25px rgba(0,0,0,0.15)',
};
