"use client";
import { useState } from 'react';
import { useWizardStore } from '@/store/wizardStore';
import { exportToJSON } from '@/lib/tokenExport';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Copy, CheckCircle2, Eye, FileJson, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Step6() {
  const state = useWizardStore();
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const jsonOutput = exportToJSON(state);

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.projectSetup.name.toLowerCase().replace(/\s+/g, '-')}-tokens.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Count metrics for summary
  const colorsCount = 
    Object.keys(state.colorFoundation.primitiveScales[1] || {}).length + 
    Object.keys(state.colorFoundation.neutralScale || {}).length + 
    Object.keys(state.semanticMapping).length;
  
  const typeCount = 4 + 4 + 4 + 2; // D1-4, H1-4, B1-4, C1-2
  const spacingCount = Object.keys(state.metrics.spacing).length;
  const radiusCount = Object.keys(state.metrics.radius).length;
  const shadowCount = Object.keys(state.metrics.shadow).length;
  
  const totalTokens = colorsCount + typeCount + spacingCount + radiusCount + shadowCount + 3; // +3 for breakpoints

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return state.metrics.breakpoints.mobile;
      case 'tablet': return state.metrics.breakpoints.tablet;
      case 'desktop': return '100%';
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Review & Generate</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Your design token system is ready. Review the summary, check the preview, and export your W3C DTCG formatted JSON.
        </p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col space-y-6">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
             <div className="text-2xl mb-1">🎨</div>
             <div className="font-bold text-lg">{colorsCount}</div>
             <div className="text-xs text-zinc-500 uppercase tracking-widest">Colors</div>
           </div>
           <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
             <div className="text-2xl mb-1">📝</div>
             <div className="font-bold text-lg">{typeCount}</div>
             <div className="text-xs text-zinc-500 uppercase tracking-widest">Typography</div>
           </div>
           <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
             <div className="text-2xl mb-1">📐</div>
             <div className="font-bold text-lg">{spacingCount}</div>
             <div className="text-xs text-zinc-500 uppercase tracking-widest">Spacing</div>
           </div>
           <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
             <div className="text-2xl mb-1">⭕</div>
             <div className="font-bold text-lg">{radiusCount}</div>
             <div className="text-xs text-zinc-500 uppercase tracking-widest">Radius</div>
           </div>
           <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-center">
             <div className="text-2xl mb-1">🌑</div>
             <div className="font-bold text-lg">{shadowCount}</div>
             <div className="text-xs text-zinc-500 uppercase tracking-widest">Shadows</div>
           </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 p-3 rounded-md text-center text-sm font-medium border border-indigo-100 dark:border-indigo-900/50">
           Total: {totalTokens} design tokens uniquely generated for {state.projectSetup.name || 'your project'}.
        </div>

        <Tabs defaultValue="json" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="json"><FileJson className="w-4 h-4 mr-2" /> JSON Structure</TabsTrigger>
            <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-2" /> Canvas Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="flex-1 mt-4 overflow-hidden flex flex-col relative border rounded-lg bg-zinc-950">
             <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button size="sm" onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
             </div>
             <div className="flex-1 overflow-auto p-4 text-xs font-mono text-zinc-300">
                <pre>{jsonOutput}</pre>
             </div>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 mt-4 border rounded-lg overflow-auto bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center">
             
             {/* Device Toggle */}
             <div className="w-full border-b p-2 flex justify-center bg-white dark:bg-zinc-900 sticky top-0 z-10">
               <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                 <button 
                   onClick={() => setPreviewMode('mobile')}
                   className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${previewMode === 'mobile' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
                 >
                   <Smartphone className="w-4 h-4" /> Mobile
                 </button>
                 <button 
                   onClick={() => setPreviewMode('tablet')}
                   className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${previewMode === 'tablet' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
                 >
                   <Tablet className="w-4 h-4" /> Tablet
                 </button>
                 <button 
                   onClick={() => setPreviewMode('desktop')}
                   className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${previewMode === 'desktop' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500'}`}
                 >
                   <Monitor className="w-4 h-4" /> Desktop
                 </button>
               </div>
             </div>

             {/* Mocking a component card preview using the actual tokens generated */}
             <div className="flex-1 w-full p-8 flex justify-center items-start overflow-y-auto">
               <div 
                 className="p-8 transition-all duration-500 bg-white" 
                 style={{ 
                   width: getPreviewWidth(),
                   backgroundColor: state.semanticMapping['bg/default'], 
                   borderRadius: state.metrics.radius['lg'],
                   boxShadow: state.metrics.shadow['lg'],
                   color: state.semanticMapping['text/primary'],
                   fontFamily: state.typography.fontFamily
                 }}
               >
                  <div 
                    className="mb-6 pb-4 border-b" 
                    style={{ borderColor: state.semanticMapping['border/default'] }}
                  >
                    <h3 style={{ fontSize: `${state.typography.baseSize * state.typography.scaleRatio}px`, fontWeight: 'bold' }}>
                      Responsive Preview
                    </h3>
                    <p style={{ color: state.semanticMapping['text/secondary'], fontSize: '14px', marginTop: state.metrics.spacing['xs'] }}>
                      Container width: <strong>{getPreviewWidth()}</strong>. This card uses your exact generated tokens for border radius, shadows, spacing, typography, and semantic colors.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: state.metrics.spacing['md'] }}>
                     <button 
                       style={{ 
                         padding: `${state.metrics.spacing['sm']} ${state.metrics.spacing['md']}`,
                         backgroundColor: state.semanticMapping['interactive'],
                         color: state.semanticMapping['text/inverse'],
                         borderRadius: state.metrics.radius['sm'],
                         fontWeight: 500,
                         border: 'none',
                         cursor: 'pointer'
                       }}
                     >
                        Primary Action
                     </button>
                     <button 
                       style={{ 
                         padding: `${state.metrics.spacing['sm']} ${state.metrics.spacing['md']}`,
                         backgroundColor: state.semanticMapping['bg/subtle'],
                         color: state.semanticMapping['text/primary'],
                         border: `1px solid ${state.semanticMapping['border/default']}`,
                         borderRadius: state.metrics.radius['sm'],
                         fontWeight: 500,
                         cursor: 'pointer'
                       }}
                     >
                        Secondary Action
                     </button>
                  </div>
               </div>
             </div>
          </TabsContent>
        </Tabs>

      </div>

      <div className="mt-8 pt-6 flex justify-between border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <Button variant="outline" onClick={state.prevStep}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Download className="mr-2 w-4 h-4" />
          Export Token JSON
        </Button>
      </div>
    </div>
  );
}
