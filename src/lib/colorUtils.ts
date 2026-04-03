import chroma from 'chroma-js';
import { SemanticTokenKey } from '@/store/wizardStore';

const SCALE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Validates if a string is a valid CSS color
 */
export const isValidColor = (color: string): boolean => {
  return chroma.valid(color);
};

/**
 * Checks if two colors have a hue delta < 30 degrees (too similar)
 */
export const isTooSimilar = (color1: string, color2: string): boolean => {
  if (!isValidColor(color1) || !isValidColor(color2)) return false;
  // Use LCH to compare hue
  const h1 = chroma(color1).lch()[2] || 0;
  const h2 = chroma(color2).lch()[2] || 0;
  
  // Calculate shortest distance on a circle
  let diff = Math.abs(h1 - h2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff < 30;
};

/**
 * Generates a full scale (50-950) from a single color using an opinionated curve.
 * This is a simplified scale generator. It forces the input color to be near the 500 mark.
 */
export const generatePrimitiveScale = (baseColor: string): Record<number, string> => {
  if (!isValidColor(baseColor)) return {};
  
  const base = chroma(baseColor);
  
  // Create a bezier interpolation between quite light and quite dark
  // We tint the base to get 50, and shade it to get 950
  
  // A simplistic approach to a cohesive scale:
  const lightest = base.set('hsl.l', 0.96).hex();
  const darkest = 'black'; // Or very dark version of base: base.set('hsl.l', 0.1).hex();
  
  const scale = chroma.scale([lightest, base, darkest]).domain([0, 0.5, 1]).mode('lrgb');
  
  const result: Record<number, string> = {};
  
  // Map index to domain (0 to 1)
  SCALE_STOPS.forEach(stop => {
    // 50 => 0, 500 => 0.5, 950 => 0.95 (approx)
    const t = stop === 50 ? 0.05 : stop / 1000;
    result[stop] = scale(t).hex();
  });
  
  return result;
};

/**
 * Generates a neutral scale heavily desaturated, slightly tinted towards the primary hue.
 */
export const generateNeutralScale = (primaryColor: string): Record<number, string> => {
  if (!isValidColor(primaryColor)) return {};
  
  const base = chroma(primaryColor);
  const h = base.hsl()[0] || 0;
  
  // Create a very grayish version of the hue
  // Lightness ~0.5, Saturation ~0.05
  const midNeutral = chroma.hsl(h, 0.05, 0.5);
  
  const lightest = chroma.hsl(h, 0.05, 0.98).hex();
  const darkest = chroma.hsl(h, 0.05, 0.1).hex();
  
  const scale = chroma.scale([lightest, midNeutral, darkest]).domain([0, 0.5, 1]).mode('lrgb');
  
  const result: Record<number, string> = {};
  SCALE_STOPS.forEach(stop => {
    const t = stop === 50 ? 0.05 : stop / 1000;
    result[stop] = scale(t).hex();
  });
  
  return result;
};

/**
 * Auto-suggest semantic token mapping based on lightness/contrast logic
 */
export const suggestSemanticTokens = (
  primitiveScale: Record<number, string>, 
  neutralScale: Record<number, string>
): Record<SemanticTokenKey, string> => {
  
  // Safety checks
  if (Object.keys(primitiveScale).length === 0 || Object.keys(neutralScale).length === 0) {
    return {} as Record<SemanticTokenKey, string>;
  }

  // PRD defined logic
  return {
    'text/primary': primitiveScale[900], // Darkest shade for highest contrast
    'text/secondary': primitiveScale[600], // Mid-dark supporting text
    'text/disabled': neutralScale[400], // Desaturated inactive state
    'text/inverse': '#ffffff', // For dark backgrounds
    
    'bg/default': '#ffffff', // Page background
    'bg/subtle': neutralScale[50], // Alternate section bg
    'bg/inverse': primitiveScale[900], // Dark surface
    
    'border/default': neutralScale[200], // Standard divider
    
    'interactive': primitiveScale[500], // CTA
    
    // Extended
    'interactive/hover': primitiveScale[600],
    'interactive/pressed': primitiveScale[700],
    'interactive/disabled': neutralScale[300],
    
    'feedback/success': '#22c55e', // green-500
    'feedback/warning': '#eab308', // yellow-500
    'feedback/error': '#ef4444', // red-500
    'feedback/info': '#3b82f6', // blue-500
    
    'icon/default': neutralScale[700],
    'icon/subtle': neutralScale[400],
    'icon/inverse': '#ffffff',
    
    'overlay': chroma(primitiveScale[900]).alpha(0.6).css(),
    'focus': chroma(primitiveScale[500]).alpha(0.4).css(),
  };
};

export const semanticReasoning: Record<SemanticTokenKey, string> = {
  'text/primary': 'Assigned as primary text — darkest shade in your brand scale.',
  'text/secondary': 'Assigned as secondary text — provides accessible contrast without competing with primary.',
  'text/disabled': 'Low contrast neutral to indicate inactionability.',
  'text/inverse': 'Pure white ensures AAA contrast on dark interactive elements.',
  'bg/default': 'Standard clean background for optimal readability.',
  'bg/subtle': 'Very light neutral for section separation.',
  'bg/inverse': 'Darkest brand shade for inverted surface contrast.',
  'border/default': 'Subtle neutral border for structural separation.',
  'interactive': 'Mid-tone brand color — strikes the balance of visibility for CTAs.',
  'interactive/hover': 'Slightly darker shade for interactive hover state.',
  'interactive/pressed': 'Deeper shade for active/pressed state.',
  'interactive/disabled': 'Muted neutral to signal inactive button state.',
  'feedback/success': 'Standard semantic green for success states.',
  'feedback/warning': 'Standard semantic yellow for warning states.',
  'feedback/error': 'Standard semantic red for destructive/error states.',
  'feedback/info': 'Standard semantic blue for general info states.',
  'icon/default': 'Dark neutral for recognizable iconography.',
  'icon/subtle': 'Lighter neutral for supporting icons.',
  'icon/inverse': 'White icons for use on dark backgrounds or CTAs.',
  'overlay': 'Modal overlay using 60% opacity of darkest brand color.',
  'focus': 'Focus ring using 40% opacity of interactive color.'
};
