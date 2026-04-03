"use client";
import { useWizardStore } from '@/store/wizardStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { Step5 } from './steps/Step5';
import { Step6 } from './steps/Step6';

const stepsMeta = [
  { id: 1, title: 'Project Setup', description: 'Brand and base units' },
  { id: 2, title: 'Color Foundation', description: 'Brand colors and scales' },
  { id: 3, title: 'Semantic Mapping', description: 'Assign token purposes' },
  { id: 4, title: 'Typography', description: 'Fonts and scale ratios' },
  { id: 5, title: 'Spacing & Radius', description: 'Metrics configuration' },
  { id: 6, title: 'Review & Generate', description: 'JSON and Preview' },
];

export function WizardLayout() {
  const currentStep = useWizardStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 />;
      default: return <Step1 />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-50 text-sm">
      {/* Sidebar Navigation */}
      <aside className="w-72 border-r bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="font-bold text-lg tracking-tight">Design Token Studio</h1>
          <p className="text-zinc-500 mt-1 dark:text-zinc-400">Flow Testing MVP</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            {stepsMeta.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              return (
                <li key={step.id} className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
                    )}
                  </div>
                  <div className={`flex flex-col ${isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'}`}>
                    <span className={`font-medium ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {step.description}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-4xl mx-auto min-h-full flex flex-col">
            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
