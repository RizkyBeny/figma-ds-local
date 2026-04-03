"use client";
import { useEffect, useState } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { generateSpacingScale, defaultBorderRadius, defaultShadows } from '@/lib/spacingUtils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function Step5() {
  const { 
    projectSetup, 
    metrics, 
    updateMetrics, 
    nextStep, 
    prevStep 
  } = useWizardStore();

  // Auto-fill metrics on mount if empty
  useEffect(() => {
    if (Object.keys(metrics.spacing).length === 0) {
      updateMetrics({
        spacing: generateSpacingScale(projectSetup.spacingUnit),
        radius: defaultBorderRadius,
        shadow: defaultShadows,
      });
    }
  }, [metrics.spacing, projectSetup.spacingUnit, updateMetrics]);

  const updateSpacing = (key: string, value: string) => {
    updateMetrics({ spacing: { ...metrics.spacing, [key]: value } });
  };

  const updateRadius = (key: string, value: string) => {
    updateMetrics({ radius: { ...metrics.radius, [key]: value } });
  };

  const updateShadow = (key: string, value: string) => {
    updateMetrics({ shadow: { ...metrics.shadow, [key]: value } });
  };

  const updateBreakpoint = (key: string, value: string) => {
    updateMetrics({ breakpoints: { ...metrics.breakpoints, [key]: value } });
  };

  // Safe checks for mapping over state
  const spacingEntries = Object.entries(metrics.spacing || {});
  const radiusEntries = Object.entries(metrics.radius || {});
  const shadowEntries = Object.entries(metrics.shadow || {});
  const breakpointEntries = Object.entries(metrics.breakpoints || {});

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Spacing, Radius & Shadow</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Your base spacing unit is <strong>{projectSetup.spacingUnit}px</strong>. We've generated T-shirt sized scales. You can override any value.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-12">
        
        {/* Breakpoints */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg">Screens & Breakpoints</h3>
            <p className="text-xs text-zinc-500 mt-1">Define your core responsive breakpoints.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {breakpointEntries.map(([key, val]) => (
              <div key={`bp-${key}`} className="space-y-2 p-3 border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 w-32">
                <Label className="text-xs font-mono text-indigo-600 dark:text-indigo-400 capitalize">screen/{key}</Label>
                <Input 
                  value={val}
                  onChange={(e) => updateBreakpoint(key, e.target.value)}
                  className="h-8 font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg">Spacing Scale</h3>
            <p className="text-xs text-zinc-500 mt-1">Used for padding, margins, and layout gaps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spacingEntries.map(([key, val]) => (
              <div key={`space-${key}`} className="space-y-2 p-3 border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50">
                <Label className="text-xs font-mono text-indigo-600 dark:text-indigo-400">space/{key}</Label>
                <Input 
                  value={val}
                  onChange={(e) => updateSpacing(key, e.target.value)}
                  className="h-8 font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg">Border Radius</h3>
            <p className="text-xs text-zinc-500 mt-1">Used for rounding corners of components.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {radiusEntries.map(([key, val]) => (
              <div key={`radius-${key}`} className="space-y-2 p-3 border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 w-32">
                <Label className="text-xs font-mono text-indigo-600 dark:text-indigo-400">radius/{key}</Label>
                <div 
                  className="w-full h-8 bg-zinc-200 dark:bg-zinc-800 border"
                  style={{ borderRadius: val }}
                />
                <Input 
                  value={val}
                  onChange={(e) => updateRadius(key, e.target.value)}
                  className="h-8 font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Shadows */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="font-semibold text-lg">Elevation & Shadows</h3>
            <p className="text-xs text-zinc-500 mt-1">Used for depth and elevation z-index visual mapping.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shadowEntries.map(([key, val]) => (
              <div key={`shadow-${key}`} className="space-y-3 p-4 border rounded-lg bg-white dark:bg-zinc-950">
                <Label className="text-xs font-mono text-indigo-600 dark:text-indigo-400 block mb-2">shadow/{key}</Label>
                <div 
                  className="w-full h-12 bg-white dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-800 mb-4"
                  style={{ boxShadow: val }}
                />
                <Input 
                  value={val}
                  onChange={(e) => updateShadow(key, e.target.value)}
                  className="h-8 font-mono text-xs w-full"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-8 pt-6 flex justify-between border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={nextStep}>
          Review & Generate
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
