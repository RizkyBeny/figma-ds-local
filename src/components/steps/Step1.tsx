"use client";
import { useWizardStore, SpacingUnit } from '@/store/wizardStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Step1() {
  const { projectSetup, updateProjectSetup, nextStep } = useWizardStore();

  const isFormValid = projectSetup.name.trim().length > 0;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Project Setup</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Let’s start with the basics. This will define your project's foundation.
        </p>
      </div>

      <div className="space-y-8 flex-1">
        {/* Brand Name */}
        <div className="space-y-3">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input 
            id="brandName" 
            placeholder="e.g. Acme Studio" 
            value={projectSetup.name}
            onChange={(e) => updateProjectSetup({ name: e.target.value })}
            className="max-w-md"
          />
        </div>

        {/* Base Spacing Unit */}
        <div className="space-y-3">
          <Label>Base Spacing Unit</Label>
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {([4, 8] as SpacingUnit[]).map((unit) => (
              <Card 
                key={unit}
                className={`cursor-pointer transition-all hover:border-indigo-500/50 ${projectSetup.spacingUnit === unit ? 'border-2 border-indigo-500 shadow-sm' : 'border border-zinc-200 dark:border-zinc-800'}`}
                onClick={() => updateProjectSetup({ spacingUnit: unit })}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{unit === 4 ? 'Compact' : 'Comfortable'}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{unit}px Base</div>
                  </div>
                  <div className="flex gap-1" aria-hidden="true">
                    {/* Visual representation */}
                    <div className={`bg-zinc-200 dark:bg-zinc-800 rounded-sm ${unit === 4 ? 'w-2 h-2' : 'w-4 h-4'}`} />
                    <div className={`bg-zinc-200 dark:bg-zinc-800 rounded-sm ${unit === 4 ? 'w-2 h-2' : 'w-4 h-4'}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            This base unit determines your entire spacing, padding, and layout scale.
          </p>
        </div>

        {/* Dark Mode */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between max-w-sm rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Dark Mode Support</Label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Generate dark-mode ready tokens
              </p>
            </div>
            <Switch 
              checked={projectSetup.darkMode}
              onCheckedChange={(checked) => updateProjectSetup({ darkMode: checked })}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 flex justify-end">
        <Button onClick={nextStep} disabled={!isFormValid}>
          Continue to Colors
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
