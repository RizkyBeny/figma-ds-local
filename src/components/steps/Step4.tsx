"use client";
import { useWizardStore } from '@/store/wizardStore';
import { TYPOGRAPHY_RATIOS, generateTypeScale } from '@/lib/typographyUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const COMMON_WEIGHTS = ['Regular', 'Medium', 'SemiBold', 'Bold'];

export function Step4() {
  const { typography, updateTypography, nextStep, prevStep } = useWizardStore();

  const handleWeightToggle = (weight: string) => {
    const current = typography.weights;
    if (current.includes(weight)) {
      updateTypography({ weights: current.filter(w => w !== weight) });
    } else {
      updateTypography({ weights: [...current, weight] });
    }
  };

  const isFormValid = typography.fontFamily.trim().length > 0 && typography.weights.length > 0 && typography.baseSize > 0;

  // Generate a preview scale based on current settings
  const previewScale = generateTypeScale(typography.baseSize, typography.scaleRatio);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Typography</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Define your base font properties and modular scale ratio. We'll generate a complete, mathematically harmonized type scale.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 flex-1">
        
        {/* Form Controls */}
        <div className="space-y-6 flex-1 max-w-sm">
          <div className="space-y-3">
            <Label htmlFor="fontFamily">Font Family</Label>
            <Input 
              id="fontFamily" 
              placeholder="e.g. Inter, Roboto" 
              value={typography.fontFamily}
              onChange={(e) => updateTypography({ fontFamily: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <Label>Available Weights</Label>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_WEIGHTS.map(weight => (
                <div key={weight} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`weight-${weight}`} 
                    checked={typography.weights.includes(weight)}
                    onCheckedChange={() => handleWeightToggle(weight)}
                  />
                  <label 
                    htmlFor={`weight-${weight}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {weight}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="baseSize">Base Size (px)</Label>
              <Input 
                id="baseSize" 
                type="number"
                min={12}
                max={24}
                value={typography.baseSize}
                onChange={(e) => updateTypography({ baseSize: parseInt(e.target.value) || 16 })}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="scaleRatio">Scale Ratio</Label>
              <select 
                id="scaleRatio"
                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950"
                value={typography.scaleRatio}
                onChange={(e) => updateTypography({ scaleRatio: parseFloat(e.target.value) })}
              >
                {Object.entries(TYPOGRAPHY_RATIOS).map(([name, value]) => (
                  <option key={name} value={value}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 border-l dark:border-zinc-800 pl-0 md:pl-12 mt-8 md:mt-0">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-6">Generated Scale Preview</h3>
          
          <div className="space-y-8" style={{ fontFamily: typography.fontFamily || 'sans-serif' }}>
            
            {/* Display / Heading preview array */}
            <div className="space-y-4">
               <div className="flex items-baseline gap-4 border-b dark:border-zinc-800 pb-2">
                  <span className="text-xs text-zinc-400 font-mono w-12">H1</span>
                  <span style={{ fontSize: previewScale.heading[1], fontWeight: typography.weights.includes('Bold') ? 700 : 400 }} className="leading-tight">
                    Sphinx of black quartz
                  </span>
               </div>
               <div className="flex items-baseline gap-4 border-b dark:border-zinc-800 pb-2">
                  <span className="text-xs text-zinc-400 font-mono w-12">H2</span>
                  <span style={{ fontSize: previewScale.heading[2], fontWeight: typography.weights.includes('SemiBold') || typography.weights.includes('Bold') ? 600 : 400 }} className="leading-tight">
                    Judge my vow
                  </span>
               </div>
               <div className="flex items-baseline gap-4 border-b dark:border-zinc-800 pb-2">
                  <span className="text-xs text-zinc-400 font-mono w-12">H3</span>
                  <span style={{ fontSize: previewScale.heading[3], fontWeight: typography.weights.includes('Medium') || typography.weights.includes('SemiBold') ? 500 : 400 }} className="leading-tight">
                    The quick brown fox
                  </span>
               </div>
               <div className="flex items-baseline gap-4 border-b dark:border-zinc-800 pb-2">
                  <span className="text-xs text-zinc-400 font-mono w-12">Body</span>
                  <span style={{ fontSize: previewScale.body[2], fontWeight: typography.weights.includes('Regular') ? 400 : 400 }} className="leading-relaxed">
                    Jumps over the lazy dog. This is your base size at {typography.baseSize}px.
                  </span>
               </div>
               <div className="flex items-baseline gap-4 border-b dark:border-zinc-800 pb-2">
                  <span className="text-xs text-zinc-400 font-mono w-12">Caps</span>
                  <span style={{ fontSize: previewScale.caption[1], fontWeight: 400 }} className="leading-relaxed uppercase tracking-wider text-zinc-500">
                    Small supporting text
                  </span>
               </div>
            </div>

          </div>
        </div>

      </div>

      <div className="mt-8 pt-6 flex justify-between border-t border-zinc-200 dark:border-zinc-800">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={!isFormValid}>
          Continue to Spacing
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
