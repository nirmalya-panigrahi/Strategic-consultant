import React from 'react';

interface VisualPreviewProps {
  visualType: string;
  elementCount: number;
}

export const VisualPreview: React.FC<VisualPreviewProps> = ({ visualType, elementCount }) => {
  // Select which CSS preview style to render based on the visualType
  const type = visualType.toLowerCase();

  return (
    <div className="relative w-full h-44 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-4">
      <span className="absolute top-2 right-3 font-mono text-[10px] uppercase text-slate-400 tracking-wider">
        Schematic Grid
      </span>

      {/* 1. MATRIX VIEW */}
      {type === 'matrix' && (
        <div className="grid grid-cols-2 gap-2 w-32 h-32">
          <div className="border border-indigo-200 bg-indigo-50/40 rounded flex items-center justify-center text-[10px] font-mono text-indigo-500 font-medium">Q1</div>
          <div className="border border-emerald-200 bg-emerald-50/40 rounded flex items-center justify-center text-[10px] font-mono text-emerald-500 font-medium">Q2</div>
          <div className="border border-amber-200 bg-amber-50/40 rounded flex items-center justify-center text-[10px] font-mono text-amber-500 font-medium">Q3</div>
          <div className="border border-rose-200 bg-rose-50/40 rounded flex items-center justify-center text-[10px] font-mono text-rose-500 font-medium">Q4</div>
        </div>
      )}

      {/* 2. FUNNEL VIEW */}
      {type === 'funnel' && (
        <div className="flex flex-col items-center gap-1.5 w-full max-w-[140px]">
          <div className="h-6 bg-indigo-100 border border-indigo-200 text-indigo-600 rounded flex items-center justify-center text-[10px] font-medium w-full shadow-sm">Top</div>
          <div className="h-6 bg-indigo-200 border border-indigo-300 text-indigo-700 rounded flex items-center justify-center text-[10px] font-medium w-4/5 shadow-sm">Mid-Top</div>
          <div className="h-6 bg-indigo-300 border border-indigo-400 text-indigo-800 rounded flex items-center justify-center text-[10px] font-medium w-3/5 shadow-sm">Mid-Low</div>
          <div className="h-6 bg-indigo-400 border border-indigo-500 text-white rounded flex items-center justify-center text-[10px] font-medium w-2/5 shadow-sm">Core</div>
        </div>
      )}

      {/* 3. PYRAMID VIEW */}
      {type === 'pyramid' && (
        <div className="flex flex-col items-center gap-1.5 w-full max-w-[140px] justify-end h-full py-2">
          <div className="h-6 bg-amber-400 border border-amber-500 text-white rounded flex items-center justify-center text-[10px] font-medium w-1/3 shadow-sm">Pinnacle</div>
          <div className="h-6 bg-amber-200 border border-amber-300 text-amber-800 rounded flex items-center justify-center text-[10px] font-medium w-3/5 shadow-sm">Mid Tier</div>
          <div className="h-6 bg-amber-100 border border-amber-200 text-amber-700 rounded flex items-center justify-center text-[10px] font-medium w-5/6 shadow-sm">Foundation</div>
        </div>
      )}

      {/* 4. CYCLE VIEW */}
      {type === 'cycle' && (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full border-2 border-dashed border-indigo-300 animate-[spin_12s_linear_infinite]"></div>
          <div className="absolute top-0 bg-indigo-500 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold shadow-sm">Node 1</div>
          <div className="absolute right-0 bg-indigo-500 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold shadow-sm">Node 2</div>
          <div className="absolute bottom-0 bg-indigo-500 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold shadow-sm">Node 3</div>
          <div className="absolute left-0 bg-indigo-500 text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold shadow-sm">Node 4</div>
        </div>
      )}

      {/* 5. FLOWCHART VIEW */}
      {type === 'flowchart' && (
        <div className="flex items-center gap-1 w-full max-w-[240px] justify-center overflow-x-auto">
          <div className="border border-indigo-200 bg-indigo-50 text-indigo-600 p-1.5 rounded text-[9px] font-medium text-center shadow-xs">Step 1</div>
          <span className="text-indigo-400 text-xs font-bold font-mono">→</span>
          <div className="border border-emerald-200 bg-emerald-50 text-emerald-600 p-1.5 rounded text-[9px] font-medium text-center shadow-xs">Step 2</div>
          <span className="text-indigo-400 text-xs font-bold font-mono">→</span>
          <div className="border border-amber-200 bg-amber-50 text-amber-600 p-1.5 rounded text-[9px] font-medium text-center shadow-xs">Step 3</div>
        </div>
      )}

      {/* 6. CONCENTRIC CIRCLES */}
      {type === 'concentric circles' && (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border border-indigo-200 bg-indigo-50/10 flex items-center justify-center">
            <div className="absolute w-20 h-20 rounded-full border border-indigo-300 bg-indigo-50/20 flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full border border-indigo-400 bg-indigo-100 flex items-center justify-center shadow-inner">
                <span className="font-mono text-[9px] text-indigo-700 font-bold">Core</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. SEQUENTIAL STEPS */}
      {type === 'sequential steps' && (
        <div className="flex flex-col gap-2 w-full max-w-[180px]">
          <div className="relative h-6 bg-slate-100 border border-slate-200 rounded-md overflow-hidden flex items-center px-3">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
            <span className="font-mono text-[9px] text-slate-600 font-medium">1. Prepare Strategy</span>
          </div>
          <div className="relative h-6 bg-slate-100 border border-slate-200 rounded-md overflow-hidden flex items-center px-3">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
            <span className="font-mono text-[9px] text-slate-600 font-medium">2. Target Objectives</span>
          </div>
          <div className="relative h-6 bg-slate-100 border border-slate-200 rounded-md overflow-hidden flex items-center px-3">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
            <span className="font-mono text-[9px] text-slate-600 font-medium">3. Measure Outcomes</span>
          </div>
        </div>
      )}

      {/* 8. GRID VIEW */}
      {type === 'grid' && (
        <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
          <div className="border border-slate-200 bg-white p-2 rounded flex flex-col justify-between h-20 shadow-xs">
            <div className="h-2 w-6 bg-slate-200 rounded" />
            <div className="h-1 bg-slate-100 rounded" />
            <div className="h-1 bg-slate-100 rounded" />
          </div>
          <div className="border border-slate-200 bg-white p-2 rounded flex flex-col justify-between h-20 shadow-xs">
            <div className="h-2 w-6 bg-indigo-200 rounded" />
            <div className="h-1 bg-slate-100 rounded" />
            <div className="h-1 bg-slate-100 rounded" />
          </div>
          <div className="border border-slate-200 bg-white p-2 rounded flex flex-col justify-between h-20 shadow-xs">
            <div className="h-2 w-6 bg-slate-200 rounded" />
            <div className="h-1 bg-slate-100 rounded" />
            <div className="h-1 bg-slate-100 rounded" />
          </div>
        </div>
      )}

      {/* 9. HIERARCHY */}
      {type === 'hierarchy' && (
        <div className="flex flex-col items-center gap-3">
          <div className="border border-indigo-300 bg-indigo-50 px-2.5 py-1 rounded text-[9px] font-mono text-indigo-700 font-bold shadow-xs">Root Node</div>
          <div className="flex gap-4 relative">
            {/* simple line connections */}
            <div className="absolute -top-3 left-1/2 right-1/2 w-[1px] h-3 bg-indigo-200" />
            <div className="border border-slate-200 bg-white px-2 py-1 rounded text-[8px] font-mono text-slate-600 shadow-xs">Branch A</div>
            <div className="border border-slate-200 bg-white px-2 py-1 rounded text-[8px] font-mono text-slate-600 shadow-xs">Branch B</div>
          </div>
        </div>
      )}

      {/* 10. CURVE VIEW */}
      {type === 'curve' && (
        <div className="relative w-40 h-28 border-b border-l border-slate-200 p-1">
          <svg className="w-full h-full text-indigo-400 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Draw a smooth S-curve */}
            <path
              d="M 0 95 C 30 95, 40 5, 100 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="1 1"
              className="animate-[dash_2s_ease-in-out_infinite]"
            />
          </svg>
          <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400">Time →</span>
          <span className="absolute top-1 left-2 text-[8px] font-mono text-slate-400">Growth ↑</span>
        </div>
      )}

      {/* 11. TIMELINE */}
      {type === 'timeline' && (
        <div className="relative w-full max-w-[200px] flex items-center justify-between py-6">
          <div className="absolute left-0 right-0 h-1 bg-slate-200" />
          <div className="relative z-10 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow flex items-center justify-center">
            <div className="absolute top-5 font-mono text-[8px] text-slate-500">Phase 1</div>
          </div>
          <div className="relative z-10 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow flex items-center justify-center">
            <div className="absolute top-5 font-mono text-[8px] text-slate-500">Phase 2</div>
          </div>
          <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow flex items-center justify-center">
            <div className="absolute top-5 font-mono text-[8px] text-emerald-600 font-bold">Launch</div>
          </div>
        </div>
      )}

      {/* 12. QUESTIONNAIRE */}
      {type === 'questionnaire' && (
        <div className="flex flex-col gap-1.5 w-full max-w-[180px]">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-indigo-400 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 text-[9px] font-bold">✓</div>
            <div className="h-1.5 bg-slate-200 rounded w-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-sm bg-white" />
            <div className="h-1.5 bg-slate-100 rounded w-4/5" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-indigo-400 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 text-[9px] font-bold">✓</div>
            <div className="h-1.5 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
      )}

      {/* 13. RADAR CHART */}
      {type === 'radar chart' && (
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full text-indigo-500/30" viewBox="0 0 100 100">
            {/* outer hexagon */}
            <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* inner hexagon */}
            <polygon points="50,30 71,42 71,58 50,70 29,58 29,42" fill="none" stroke="currentColor" strokeWidth="1" />
            {/* plot line */}
            <polygon points="50,15 78,35 60,53 50,80 20,60 35,38" fill="rgba(99, 102, 241, 0.25)" stroke="rgb(99, 102, 241)" strokeWidth="1.5" />
            {/* center axes */}
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
            <line x1="15" y1="30" x2="85" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
            <line x1="15" y1="70" x2="85" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
          </svg>
        </div>
      )}

      {/* FALLBACK FOR UNKNOWN SHAPE */}
      {!['matrix', 'funnel', 'pyramid', 'cycle', 'flowchart', 'concentric circles', 'sequential steps', 'grid', 'hierarchy', 'curve', 'timeline', 'questionnaire', 'radar chart'].includes(type) && (
        <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/10 p-4 rounded-xl flex flex-col items-center gap-1.5 text-center">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-indigo-600">N={elementCount}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{visualType}</span>
        </div>
      )}
    </div>
  );
};
