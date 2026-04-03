import { create } from 'zustand';

export type SpacingUnit = 4 | 8;

export interface ProjectSetupState {
  name: string;
  spacingUnit: SpacingUnit;
  darkMode: boolean;
}

export interface ColorFoundationState {
  brandColors: string[];
  // Will hold the generated scales e.g., { '50': '#...', '100': '#...' }
  primitiveScales: Record<number, Record<number, string>>; 
  neutralScale: Record<number, string>;
}

export type SemanticTokenKey = 
  // Essential
  | 'text/primary' | 'text/secondary' | 'text/disabled' | 'text/inverse'
  | 'bg/default' | 'bg/subtle' | 'bg/inverse' | 'border/default' | 'interactive'
  // Extended
  | 'interactive/hover' | 'interactive/pressed' | 'interactive/disabled'
  | 'feedback/success' | 'feedback/warning' | 'feedback/error' | 'feedback/info'
  | 'icon/default' | 'icon/subtle' | 'icon/inverse'
  | 'overlay' | 'focus';

export interface TypographyState {
  fontFamily: string;
  weights: string[];
  baseSize: number;
  scaleRatio: number;
}

export interface MetricsState {
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadow: Record<string, string>;
  breakpoints: Record<string, string>;
}

export interface WizardState {
  currentStep: number;
  
  // States per step
  projectSetup: ProjectSetupState;
  colorFoundation: ColorFoundationState;
  semanticMapping: Partial<Record<SemanticTokenKey, string>>;
  typography: TypographyState;
  metrics: MetricsState;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  updateProjectSetup: (data: Partial<ProjectSetupState>) => void;
  updateColorFoundation: (data: Partial<ColorFoundationState>) => void;
  updateSemanticMapping: (key: SemanticTokenKey, value: string) => void;
  updateTypography: (data: Partial<TypographyState>) => void;
  updateMetrics: (data: Partial<MetricsState>) => void;
}

const initialState = {
  currentStep: 1,
  
  projectSetup: {
    name: '',
    spacingUnit: 8 as SpacingUnit,
    darkMode: false,
  },
  
  colorFoundation: {
    brandColors: ['#4F46E5'], // default indigo-ish
    primitiveScales: {},
    neutralScale: {},
  },
  
  semanticMapping: {},
  
  typography: {
    fontFamily: 'Inter',
    weights: ['Regular', 'SemiBold', 'Bold'],
    baseSize: 16,
    scaleRatio: 1.25, // Major Third
  },
  
  metrics: {
    spacing: {},
    radius: {},
    shadow: {},
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
    }
  }
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  updateProjectSetup: (data) => 
    set((state) => ({ projectSetup: { ...state.projectSetup, ...data } })),
    
  updateColorFoundation: (data) => 
    set((state) => ({ colorFoundation: { ...state.colorFoundation, ...data } })),
    
  updateSemanticMapping: (key, value) => 
    set((state) => ({ semanticMapping: { ...state.semanticMapping, [key]: value } })),
    
  updateTypography: (data) => 
    set((state) => ({ typography: { ...state.typography, ...data } })),

  updateMetrics: (data) => 
    set((state) => ({ metrics: { ...state.metrics, ...data } })),
}));
