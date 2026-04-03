"use client";
import { useEffect, useState } from 'react';
import { useWizardStore, SemanticTokenKey } from '@/store/wizardStore';
import { suggestSemanticTokens, semanticReasoning } from '@/lib/colorUtils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronRight, Info } from 'lucide-react';

const ESSENTIAL_TOKENS: SemanticTokenKey[] = [
  'text/primary', 'text/secondary', 'text/disabled', 'text/inverse',
  'bg/default', 'bg/subtle', 'bg/inverse', 'border/default', 'interactive'
];

const EXTENDED_TOKENS: SemanticTokenKey[] = [
  'interactive/hover', 'interactive/pressed', 'interactive/disabled',
  'feedback/success', 'feedback/warning', 'feedback/error', 'feedback/info',
  'icon/default', 'icon/subtle', 'icon/inverse', 'overlay', 'focus'
];

export function Step3() {
  const { 
    colorFoundation, 
    semanticMapping, 
    updateSemanticMapping, 
    nextStep, 
    prevStep 
  } = useWizardStore();

  const [showExtended, setShowExtended] = useState(false);

  // Auto-fill semantic tokens on mount if not yet assigned
  useEffect(() => {
    if (Object.keys(semanticMapping).length === 0 && colorFoundation.primitiveScales[1]) {
      const suggestions = suggestSemanticTokens(
        colorFoundation.primitiveScales[1], 
        colorFoundation.neutralScale
      );
      
      Object.entries(suggestions).forEach(([key, value]) => {
        updateSemanticMapping(key as SemanticTokenKey, value);
      });
    }
  }, [semanticMapping, colorFoundation, updateSemanticMapping]);

  const renderTokenRow = (key: SemanticTokenKey) => {
    const value = semanticMapping[key] || '';
    const reasoning = semanticReasoning[key];
    
    return (
      <div key={key} className="flex gap-4 items-start p-4 border rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 space-y-2">
          <Label className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            color/{key}
          </Label>
          <div className="flex gap-2 items-center text-xs text-zinc-500 dark:text-zinc-400">
            <Info className="w-3.5 h-3.5" />
            <p>{reasoning}</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-center w-48 shrink-0">
           <div 
             className="w-8 h-8 rounded shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-sm"
             style={{ backgroundColor: value || 'transparent' }}
           />
           <Input 
             value={value}
             onChange={(e) => updateSemanticMapping(key, e.target.value)}
             className="h-8 text-xs font-mono"
           />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Semantic Mapping</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          We've intelligently assigned colors to functional roles based on accessibility and contrast logic. You can curate them below.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-8">
        
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Essential Tokens
              <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
                {ESSENTIAL_TOKENS.length} tokens
              </span>
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Core tokens needed for almost every component.
            </p>
          </div>
          <div className="grid gap-3">
             {ESSENTIAL_TOKENS.map(renderTokenRow)}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            onClick={() => setShowExtended(!showExtended)}
            className="flex items-center gap-2 font-semibold text-lg border-b pb-2 w-full text-left hover:text-indigo-600 transition-colors"
          >
            {showExtended ? <ChevronDown className="w-5 h-5 text-zinc-400" /> : <ChevronRight className="w-5 h-5 text-zinc-400" />}
            Extended Tokens
            <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 rounded-full">
              {EXTENDED_TOKENS.length} tokens
            </span>
          </button>
          
          {showExtended && (
            <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
               <p className="text-xs text-zinc-500 mb-2">
                 Supporting tokens for specific component states and feedback.
               </p>
               {EXTENDED_TOKENS.map(renderTokenRow)}
            </div>
          )}
        </div>

      </div>

      <div className="mt-8 pt-6 flex justify-between border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={nextStep}>
          Continue to Typography
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
