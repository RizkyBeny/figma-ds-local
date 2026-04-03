"use client";
import { useState, useEffect } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { generatePrimitiveScale, generateNeutralScale, isValidColor, isTooSimilar } from '@/lib/colorUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Plus, Trash2, AlertTriangle } from 'lucide-react';

export function Step2() {
  const { colorFoundation, updateColorFoundation, nextStep, prevStep } = useWizardStore();
  
  const [colors, setColors] = useState<string[]>(
    colorFoundation.brandColors.length > 0 ? colorFoundation.brandColors : ['#4F46E5']
  );
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Analyze colors for similarity and update store whenever they change
  useEffect(() => {
    // Check similarity
    let hasSimilar = false;
    for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
            if (isTooSimilar(colors[i], colors[j])) {
                hasSimilar = true;
                break;
            }
        }
    }
    
    if (hasSimilar) {
        setWarningMessage("Some of these colors are very similar — consider using fewer colors for a tighter brand system.");
    } else {
        setWarningMessage(null);
    }

    // Only proceed with generating if we have at least one valid color
    const validColors = colors.filter(c => isValidColor(c));
    
    if (validColors.length > 0) {
        // We generate the scale based on the FIRST valid color as the primary brand color
        const primaryColor = validColors[0];
        const neutralScale = generateNeutralScale(primaryColor);
        
        // MVP constraint: we only generate one primitive scale based on the primary color for now,
        // or one per input color in a full system. For this MVP we will just generate for the primary.
        const primitiveScale = generatePrimitiveScale(primaryColor);

        updateColorFoundation({
            brandColors: validColors,
            primitiveScales: { 1: primitiveScale }, // '1' indicates the primary scale
            neutralScale: neutralScale
        });
    }
  }, [colors, updateColorFoundation]);

  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, '#000000']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    }
  };

  const updateColor = (index: number, val: string) => {
    const newColors = [...colors];
    newColors[index] = val;
    setColors(newColors);
  };

  // Ensure at least one valid color before proceeding
  const isFormValid = colors.filter(c => isValidColor(c)).length > 0;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Color Foundation</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Input your core brand colors. We will automatically generate a cohesive color scale and a harmonious neutral palette.
        </p>
      </div>

      <div className="space-y-8 flex-1">
        <div className="space-y-4">
          <div className="flex justify-between items-center max-w-lg">
            <Label>Brand Colors (Max 5)</Label>
            {colors.length < 5 && (
              <Button variant="outline" size="sm" onClick={addColor} className="h-8">
                <Plus className="w-4 h-4 mr-1" /> Add Color
              </Button>
            )}
          </div>

          <div className="space-y-3 max-w-lg">
            {colors.map((color, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <div 
                  className="w-10 h-10 rounded-md border shadow-sm shrink-0" 
                  style={{ backgroundColor: isValidColor(color) ? color : 'transparent' }} 
                />
                <Input 
                  value={color} 
                  onChange={(e) => updateColor(idx, e.target.value)} 
                  placeholder="#HexCode"
                  className="font-mono"
                />
                {colors.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeColor(idx)} className="text-zinc-400 hover:text-red-500 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {warningMessage && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400 rounded-lg max-w-lg text-sm border border-yellow-200 dark:border-yellow-900/50">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{warningMessage}</p>
            </div>
          )}
        </div>

        {/* Preview Generated Scales */}
        {isFormValid && colorFoundation.primitiveScales[1] && (
          <div className="space-y-6 pt-6 border-t px-2">
             <div>
                <Label className="mb-3 block text-zinc-500">Auto-Generated Primary Scale</Label>
                <div className="flex gap-1 h-12 w-full rounded-md overflow-hidden">
                    {Object.entries(colorFoundation.primitiveScales[1]).map(([stop, hex]) => (
                        <div key={stop} className="flex-1 flex items-end p-1 justify-center relative group" style={{ backgroundColor: hex }}>
                            <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 mix-blend-difference text-white pb-1 transition-opacity">
                                {stop}
                            </span>
                        </div>
                    ))}
                </div>
             </div>

             <div>
                <Label className="mb-3 block text-zinc-500">Auto-Generated Harmonized Neutrals</Label>
                <div className="flex gap-1 h-12 w-full rounded-md overflow-hidden">
                    {Object.entries(colorFoundation.neutralScale).map(([stop, hex]) => (
                        <div key={stop} className="flex-1 flex items-end p-1 justify-center relative group" style={{ backgroundColor: hex }}>
                            <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 mix-blend-difference text-white pb-1 transition-opacity">
                                {stop}
                            </span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={nextStep} disabled={!isFormValid}>
          Continue to Roles
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
