import React, { useState, useMemo } from 'react';
import { Framework } from '../types';
import { frameworks } from '../data/frameworks';
import { VisualPreview } from './VisualPreview';
import { Search, SlidersHorizontal, BookOpen, Layers, Grid, ChevronRight, Check, X, FileSpreadsheet, ArrowUpDown } from 'lucide-react';

interface FrameworkExplorerProps {
  selectedFramework: Framework | null;
  onSelectFramework: (framework: Framework | null) => void;
}

export const FrameworkExplorer: React.FC<FrameworkExplorerProps> = ({
  selectedFramework,
  onSelectFramework
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVisualType, setSelectedVisualType] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'count-asc' | 'count-desc'>('name-asc');

  // Categories present in database
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(frameworks.map(f => f.category)))];
  }, []);

  // Visual types present in database
  const visualTypes = useMemo(() => {
    return ['All', ...Array.from(new Set(frameworks.map(f => f.visualType)))];
  }, []);

  // Filter & sort logic
  const filteredFrameworks = useMemo(() => {
    return frameworks
      .filter(f => {
        const matchesSearch =
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.context.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
        const matchesVis = selectedVisualType === 'All' || f.visualType === selectedVisualType;

        return matchesSearch && matchesCat && matchesVis;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'count-asc':
            return a.elementCount - b.elementCount;
          case 'count-desc':
            return b.elementCount - a.elementCount;
          default:
            return 0;
        }
      });
  }, [searchQuery, selectedCategory, selectedVisualType, sortOrder]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT COLUMN: FILTERS & THE DATA TABLE */}
      <div className={`col-span-1 lg:col-span-7 bg-white border border-slate-100 rounded-3xl shadow-sm p-5 md:p-6 transition-all duration-300`}>
        
        {/* Top Header info */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Framework Directory</h3>
            <p className="text-slate-400 text-xs mt-0.5">Explore {frameworks.length} standard methodologies</p>
          </div>
          <span className="self-start text-[11px] font-mono bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100/60 font-bold">
            Showing {filteredFrameworks.length} entries
          </span>
        </div>

        {/* Filters and Inputs section */}
        <div className="space-y-3 mb-5">
          {/* 1. Full-text search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, tag, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* 2. Dropdown selectors grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mb-1">Visual Shape</label>
              <select
                value={selectedVisualType}
                onChange={(e) => setSelectedVisualType(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {visualTypes.map(vt => (
                  <option key={vt} value={vt}>{vt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mb-1">Sort By</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full bg-slate-50/50 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="count-asc">Element Count (Asc)</option>
                <option value="count-desc">Element Count (Desc)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table rows list */}
        <div className="max-h-[500px] overflow-y-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-mono tracking-wider uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Framework / Test Name</th>
                <th className="py-3 px-3 hidden sm:table-cell">Category</th>
                <th className="py-3 px-3 hidden md:table-cell">Shape</th>
                <th className="py-3 px-3 text-center">Elements</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFrameworks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No frameworks match your search filters.
                  </td>
                </tr>
              ) : (
                filteredFrameworks.map(f => {
                  const isSelected = selectedFramework?.id === f.id;
                  return (
                    <tr
                      key={f.id}
                      onClick={() => onSelectFramework(f)}
                      className={`group cursor-pointer border-b border-slate-50 transition ${
                        isSelected 
                          ? 'bg-indigo-50/45 hover:bg-indigo-50/60' 
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                          {f.name}
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5 sm:hidden">
                          {f.category} • {f.visualType}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 hidden sm:table-cell">
                        <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[10px]">
                          {f.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 hidden md:table-cell text-slate-500">
                        {f.visualType}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-600">
                        {f.elementCount}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition group-hover:translate-x-0.5 ${
                          isSelected ? 'text-indigo-500 translate-x-0.5' : ''
                        }`} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* RIGHT COLUMN: DETAIL CARD PREVIEW & ON-BOARD BUILDING INSTRUCTIONS */}
      <div className="col-span-1 lg:col-span-5 space-y-4 lg:sticky lg:top-4">
        {selectedFramework ? (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden p-6">
            
            {/* Header / Dismiss */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 font-bold">
                {selectedFramework.category}
              </span>
              <button
                onClick={() => onSelectFramework(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
              {selectedFramework.name}
            </h3>

            {/* Shape metrics card */}
            <div className="grid grid-cols-2 gap-3 my-4 bg-slate-50/60 p-3 rounded-xl border border-slate-100/50">
              <div>
                <span className="block text-[9px] uppercase font-mono text-slate-400 tracking-wider">Visual Shape</span>
                <span className="text-xs font-semibold text-slate-700">{selectedFramework.visualType}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-mono text-slate-400 tracking-wider">Elements Count</span>
                <span className="text-xs font-semibold text-slate-700">{selectedFramework.elementCount} elements</span>
              </div>
            </div>

            {/* Interactive schematic rendering */}
            <div className="mb-5">
              <VisualPreview
                visualType={selectedFramework.visualType}
                elementCount={selectedFramework.elementCount}
              />
            </div>

            {/* Purpose */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 uppercase font-mono text-[9px] tracking-wider mb-1">Strategic Purpose</h4>
                <p className="text-indigo-950 font-semibold leading-relaxed bg-indigo-50/20 p-2.5 rounded-xl border border-indigo-100/30">
                  {selectedFramework.purpose}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase font-mono text-[9px] tracking-wider mb-1">Core Concept</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50/30 p-2.5 rounded-xl border border-slate-50">
                  {selectedFramework.description}
                </p>
              </div>

              {/* On board guide */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase font-mono text-[9px] tracking-wider mb-1">Board Construction Steps</h4>
                <div className="bg-indigo-950 text-indigo-200 p-3 rounded-xl border border-indigo-900 font-mono text-[11px] leading-relaxed shadow-inner">
                  {selectedFramework.guide}
                </div>
              </div>

              {/* Related tags */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase font-mono text-[9px] tracking-wider mb-1.5">Context Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFramework.context.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50/50 border border-slate-100/50 rounded-3xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
            <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
            <h4 className="font-semibold text-slate-700">Select a Framework</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
              Click on any item in the framework directory to review its core purpose, board construction steps, and CSS schematic visual shape.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
