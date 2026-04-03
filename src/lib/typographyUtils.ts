export const TYPOGRAPHY_RATIOS = {
  'Minor Second (1.067x)': 1.067,
  'Major Second (1.125x)': 1.125,
  'Minor Third (1.200x)': 1.2,
  'Major Third (1.250x)': 1.25,
  'Perfect Fourth (1.333x)': 1.333,
  'Augmented Fourth (1.414x)': 1.414,
  'Perfect Fifth (1.500x)': 1.5,
  'Golden Ratio (1.618x)': 1.618,
};

export type FontStyles = {
  display: Record<number, string>; // D1-D4 (D1 is largest)
  heading: Record<number, string>; // H1-H4
  body: Record<number, string>; // B1 (lg), B2 (default), B3 (sm), B4 (xs)
  caption: Record<number, string>; // C1, C2
};

export const generateTypeScale = (baseSize: number, ratio: number): FontStyles => {
  // Base size is mapped to Body 2 (Default, index 0)
  
  // A helper to calculate size based on steps from base
  const calcSize = (steps: number) => {
    return Math.round(baseSize * Math.pow(ratio, steps));
  };

  return {
    display: {
      1: `${calcSize(9)}px`,
      2: `${calcSize(8)}px`,
      3: `${calcSize(7)}px`,
      4: `${calcSize(6)}px`,
    },
    heading: {
      1: `${calcSize(5)}px`,
      2: `${calcSize(4)}px`,
      3: `${calcSize(3)}px`,
      4: `${calcSize(2)}px`,
    },
    body: {
      1: `${calcSize(1)}px`, // Large
      2: `${calcSize(0)}px`, // Default (Base)
      3: `${calcSize(-1)}px`, // Small
      4: `${calcSize(-2)}px`, // Extra Small
    },
    caption: {
      1: `${calcSize(-1)}px`, // Similar to Body 3 but used differently
      2: `${calcSize(-2)}px`,
    }
  };
};
