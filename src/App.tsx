import React, { useState } from 'react';
import { Framework } from './types';
import { AkinatorEngine } from './components/AkinatorEngine';
import { FrameworkExplorer } from './components/FrameworkExplorer';
import { Compass, HelpCircle, Search, Layers, Dna, Info, ArrowLeft, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'explorer'>('game');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [completionPercent, setCompletionPercent] = useState<number>(0);

  // When clicking "Examine in Explorer" from guessed state:
  const handleSelectFrameworkFromGame = (framework: Framework) => {
    setSelectedFramework(framework);
    setActiveTab('explorer');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans">
      
      {/* 1. ELEGANT SYSTEM HEADER */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <Compass className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-950 tracking-tight flex items-center gap-1.5 font-sans">
                Frameworks Compass
              </h1>
            </div>
          </div>

          {/* Status bar & Canvas link */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto shadow-inner">
            <div
              onClick={activeTab === 'explorer' ? () => setActiveTab('game') : undefined}
              role={activeTab === 'explorer' ? 'button' : 'progressbar'}
              aria-valuenow={completionPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`flex items-center gap-3 bg-white px-3.5 py-2 rounded-lg shadow-sm ${
                activeTab === 'explorer' ? 'cursor-pointer hover:bg-slate-50 transition' : ''
              }`}
            >
              <div className="w-24 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700 tabular-nums whitespace-nowrap">
                {completionPercent}% complete
              </span>
            </div>
            <a
              href="https://business-frameworks.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition text-indigo-600 hover:text-indigo-700 hover:bg-white/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Go back to Canvas
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

        </div>
      </header>

      {/* 2. THE MAIN CONTAINER PLATFORM */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* APP CONTEXT EXPLAINER HERO BANNER */}
        <div className="mb-8 bg-gradient-to-r from-indigo-50/50 via-white to-slate-50 border border-slate-100 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-xl font-extrabold text-slate-950 tracking-tight font-sans">
              Find Your strategic Fit
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed mt-1">
              Need a framework for marketing campaigns, product launch, crisis response, operational alignment, or psychometric analysis? Pick a tab above. Play the Akinator diagnostic check to find matching models, or search our comprehensive database of over 200 standard systems complete with digital whiteboard templates.
            </p>
          </div>
          
          <div className="flex gap-2 self-start md:self-auto">
            <a 
              href="#tab-explorer-toggle"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('explorer');
              }}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 border border-indigo-100/50 py-2.5 px-4 rounded-xl transition"
            >
              Explore directory
            </a>
          </div>
        </div>

        {/* 3. TABS CONTAINER */}
        <div className="transition-all duration-300">
          {activeTab === 'game' ? (
            <div className="py-4">
              <AkinatorEngine
                onSelectFramework={handleSelectFrameworkFromGame}
                onProgressChange={setCompletionPercent}
              />
            </div>
          ) : (
            <div className="py-4">
              <FrameworkExplorer
                selectedFramework={selectedFramework}
                onSelectFramework={setSelectedFramework}
              />
            </div>
          )}
        </div>

      </main>

      {/* FOOTER METRICS INFO */}
      <footer className="border-t border-slate-100 bg-white mt-16 py-6 text-center text-xs text-slate-400 font-medium">
        <p className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-4">
          <span>For informational purposes only, not professional advice.</span>
          <span className="text-slate-300">•</span>
          <a
            href="https://business-frameworks.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:underline transition"
          >
            <ArrowLeft className="w-3 h-3" />
            Go back to Canvas
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </p>
      </footer>

    </div>
  );
}
