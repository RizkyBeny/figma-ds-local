import { WizardState } from '@/store/wizardStore';

export const exportToJSON = (state: WizardState) => {
  const { colorFoundation, semanticMapping, typography, metrics } = state;
  const extractNumber = (val: string | number) => parseFloat(String(val).replace(/[^0-9.-]/g, '')) || 0;

  const figmaFormat: any = {
    Primitives: {
      color: {},
      spacing: {},
      radius: {},
      breakpoint: {}
    },
    Usage: {
      color: {},
      typography: { size: {} },
      shadow: {} // export shadow here since it's a usage metric usually
    }
  };

  const reverseLookup: Record<string, string> = {};

  // Convert primitive scales
  Object.entries(colorFoundation.primitiveScales).forEach(([idx, scale]) => {
    Object.entries(scale).forEach(([shade, hex]) => {
      if (!figmaFormat.Primitives.color[`brand-${idx}`]) {
        figmaFormat.Primitives.color[`brand-${idx}`] = {};
      }
      figmaFormat.Primitives.color[`brand-${idx}`][shade] = {
        $value: hex,
        $type: 'color'
      };
      reverseLookup[hex.toLowerCase()] = `{Primitives.color.brand-${idx}.${shade}}`;
    });
  });
  
  // Convert neutral scales
  Object.entries(colorFoundation.neutralScale).forEach(([shade, hex]) => {
    if (!figmaFormat.Primitives.color.neutral) {
      figmaFormat.Primitives.color.neutral = {};
    }
    figmaFormat.Primitives.color.neutral[shade] = {
      $value: hex,
      $type: 'color'
    };
    if (!reverseLookup[hex.toLowerCase()]) {
      reverseLookup[hex.toLowerCase()] = `{Primitives.color.neutral.${shade}}`;
    }
  });

  // Convert semantic tokens (Usage)
  Object.entries(semanticMapping).forEach(([key, value]) => {
    if (!value) return;
    const hex = value.toLowerCase();
    const aliasOrHex = reverseLookup[hex] || value; // fallback to raw string if not found in primitives

    const parts = key.split('/');
    let current = figmaFormat.Usage.color;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = {
          $value: aliasOrHex,
          $type: 'color'
        };
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    });
  });

  // Typography (Usage)
  figmaFormat.Usage.typography.fontFamily = { $value: typography.fontFamily, $type: 'string' };
  const generatedTypeScale = require('./typographyUtils').generateTypeScale(typography.baseSize, typography.scaleRatio);
  
  ['display', 'heading', 'body', 'caption'].forEach(category => {
    const scaleObj = generatedTypeScale[category];
    if(scaleObj) {
      Object.keys(scaleObj).forEach(key => {
        figmaFormat.Usage.typography.size[`${category}-${key}`] = { 
          $value: extractNumber(scaleObj[key]), 
          $type: 'number' 
        };
      });
    }
  });

  // Metrics (Primitives & Usage)
  Object.entries(metrics.spacing).forEach(([key, val]) => {
    figmaFormat.Primitives.spacing[key] = { $value: extractNumber(val), $type: 'number' };
  });
  Object.entries(metrics.radius).forEach(([key, val]) => {
    figmaFormat.Primitives.radius[key] = { $value: extractNumber(val), $type: 'number' };
  });
  Object.entries(metrics.shadow).forEach(([key, val]) => {
    figmaFormat.Usage.shadow[key] = { $value: val, $type: 'string' }; 
  });
  Object.entries(metrics.breakpoints).forEach(([key, val]) => {
    figmaFormat.Primitives.breakpoint[key] = { $value: extractNumber(val), $type: 'number' };
  });
  
  return JSON.stringify(figmaFormat, null, 2);
};
