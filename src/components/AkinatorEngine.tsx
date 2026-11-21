import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Framework, Question, QuestionHistory } from '../types';
import { frameworks } from '../data/frameworks';
import { findBestQuestion, matchesQuestion } from '../utils/entropy';
import { VisualPreview } from './VisualPreview';
import { HelpCircle, RefreshCw, Undo2, Award, ArrowRight, Lightbulb, Play, Search, AlertCircle } from 'lucide-react';

interface AkinatorEngineProps {
  onSelectFramework: (framework: Framework) => void;
  onProgressChange?: (percent: number) => void;
}

export const AkinatorEngine: React.FC<AkinatorEngineProps> = ({ onSelectFramework, onProgressChange }) => {
  const [candidates, setCandidates] = useState<Framework[]>([...frameworks]);
  const [askedKeys, setAskedKeys] = useState<Set<string>>(new Set<string>());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<QuestionHistory[]>([]);
  const [suggestedTarget, setSuggestedTarget] = useState<Framework | null>(null);
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'guessed' | 'noMatch'>('welcome');

  // Triggered when playing starts or resets
  const startGame = (autoSuggest: boolean = false) => {
    setCandidates([...frameworks]);
    setAskedKeys(new Set<string>());
    setHistory([]);
    setGameState('playing');

    if (autoSuggest) {
      const randomIndex = Math.floor(Math.random() * frameworks.length);
      setSuggestedTarget(frameworks[randomIndex]);
    } else {
      setSuggestedTarget(null);
    }
  };

  // Find the next question whenever candidates or asked keys change
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (candidates.length === 1) {
      setGameState('guessed');
      return;
    }

    if (candidates.length === 0) {
      setGameState('noMatch');
      return;
    }

    const nextQ = findBestQuestion(candidates, askedKeys);
    if (!nextQ) {
      // No more questions to ask, even if candidate count > 1
      // We can present the closest or first match
      if (candidates.length > 0) {
        setGameState('guessed');
      } else {
        setGameState('noMatch');
      }
    } else {
      setCurrentQuestion(nextQ);
    }
  }, [candidates, askedKeys, gameState]);

  // Sync completion percentage to parent status bar
  useEffect(() => {
    if (!onProgressChange) return;
    if (gameState === 'welcome' || gameState === 'noMatch') {
      onProgressChange(0);
    } else if (gameState === 'guessed') {
      onProgressChange(100);
    } else {
      const pct = Math.round(((frameworks.length - candidates.length) / frameworks.length) * 100);
      onProgressChange(pct);
    }
  }, [candidates.length, gameState, onProgressChange]);

  // Handle answers
  const handleAnswer = (answer: 'yes' | 'no' | 'dontKnow') => {
    if (!currentQuestion) return;

    const questionKey = `${currentQuestion.type}:${currentQuestion.value}`;
    const newAskedKeys = new Set(askedKeys);
    newAskedKeys.add(questionKey);

    // Save history for undoing
    const newHistoryItem: QuestionHistory = {
      question: currentQuestion,
      answer
    };
    setHistory([...history, newHistoryItem]);

    let nextCandidates: Framework[] = [];

    if (answer === 'yes') {
      nextCandidates = candidates.filter(c => matchesQuestion(c, currentQuestion));
    } else if (answer === 'no') {
      nextCandidates = candidates.filter(c => !matchesQuestion(c, currentQuestion));
    } else if (answer === 'dontKnow') {
      // Determine what the majority of remaining candidates have for this attribute
      const matchingCount = candidates.filter(c => matchesQuestion(c, currentQuestion)).length;
      const majorityIsYes = matchingCount >= candidates.length / 2;

      // Filter based on majority to keep the search flowing
      if (majorityIsYes) {
        nextCandidates = candidates.filter(c => matchesQuestion(c, currentQuestion));
      } else {
        nextCandidates = candidates.filter(c => !matchesQuestion(c, currentQuestion));
      }
    }

    setCandidates(nextCandidates);
    setAskedKeys(newAskedKeys);
  };

  // Undo the last question
  const handleUndo = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const undoneItem = newHistory.pop()!;
    setHistory(newHistory);

    // Reconstruct AskedKeys and Candidates list step-by-step from scratch
    const recAskedKeys = new Set<string>();
    let recCandidates = [...frameworks];

    for (const step of newHistory) {
      const qKey = `${step.question.type}:${step.question.value}`;
      recAskedKeys.add(qKey);

      if (step.answer === 'yes') {
        recCandidates = recCandidates.filter(c => matchesQuestion(c, step.question));
      } else if (step.answer === 'no') {
        recCandidates = recCandidates.filter(c => !matchesQuestion(c, step.question));
      } else if (step.answer === 'dontKnow') {
        const matchingCount = recCandidates.filter(c => matchesQuestion(c, step.question)).length;
        const majorityIsYes = matchingCount >= recCandidates.length / 2;
        if (majorityIsYes) {
          recCandidates = recCandidates.filter(c => matchesQuestion(c, step.question));
        } else {
          recCandidates = recCandidates.filter(c => !matchesQuestion(c, step.question));
        }
      }
    }

    setCandidates(recCandidates);
    setAskedKeys(recAskedKeys);
    setGameState('playing');
  };

  const getPercentageReduction = () => {
    const total = frameworks.length;
    const remaining = candidates.length;
    return Math.round(((total - remaining) / total) * 100);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        
        {/* WELCOME / START SCREEN */}
        {gameState === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="text-center py-10"
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md border border-indigo-100">
              <Lightbulb className="w-10 h-10 animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 mb-3 font-sans">
              Strategic Frameworks Consultant
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Think of any business framework, methodology, or psychometric assessment. Participate in a systematic diagnostic interview, and our virtual management consultant will identify the exact model you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <button
                onClick={() => startGame(false)}
                id="btn-play-standard"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-5 rounded-xl font-semibold transition shadow-md shadow-indigo-100 hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                Play standard mode
              </button>
              <button
                onClick={() => startGame(true)}
                id="btn-play-random"
                className="flex items-center justify-center gap-2 border border-indigo-100 hover:border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-600 py-3 px-5 rounded-xl font-semibold transition"
              >
                <RefreshCw className="w-4 h-4" />
                Pick a target for me
              </button>
            </div>
          </motion.div>
        )}

        {/* ACTIVE PLAYING SCREEN */}
        {gameState === 'playing' && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col min-h-[350px] justify-between"
          >
            {/* Top header stats */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 font-bold">
                Question {history.length + 1}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {candidates.length} candidates left
                </span>
                <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${Math.max(1, (1 - candidates.length / frameworks.length) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Suggested Target Card for testing */}
            {suggestedTarget && (
              <div className="mb-6 bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">Suggested Test Target:</h4>
                  <p className="text-sm font-semibold text-amber-800">{suggestedTarget.name}</p>
                  <p className="text-[11px] text-amber-700 mt-1">Answer questions based on this model to see the engine in action!</p>
                </div>
              </div>
            )}

            {/* The main Question display */}
            <div className="my-auto py-6 text-center">
              <p className="text-[11px] font-mono text-indigo-500 uppercase tracking-widest font-bold mb-2">
                {currentQuestion.type === 'category' && 'Consulting Phase 1: Domain & System'}
                {currentQuestion.type === 'tag' && 'Consulting Phase 2: Operational Purpose'}
                {currentQuestion.type === 'visualType' && 'Consulting Phase 3: Visual Representation'}
                {currentQuestion.type === 'elementCount' && 'Consulting Phase 3: Structural Properties'}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 px-2 leading-snug">
                {currentQuestion.text}
              </h3>
            </div>

            {/* Answer buttons */}
            <div className="mt-8 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAnswer('yes')}
                  id="btn-ans-yes"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition hover:scale-[1.01] shadow-md shadow-slate-100"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('no')}
                  id="btn-ans-no"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3.5 rounded-xl transition hover:scale-[1.01]"
                >
                  No
                </button>
              </div>
              <button
                onClick={() => handleAnswer('dontKnow')}
                id="btn-ans-dontknow"
                className="border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 font-medium py-2.5 rounded-xl text-sm transition"
              >
                Don't Know
              </button>

              {/* Back controls */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                <button
                  disabled={history.length === 0}
                  onClick={handleUndo}
                  id="btn-undo"
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                    history.length === 0 
                      ? 'text-slate-300 cursor-not-allowed' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Undo step
                </button>

                <button
                  onClick={() => startGame(false)}
                  id="btn-restart-playing"
                  className="flex items-center gap-1.5 text-xs text-rose-500 hover:bg-rose-50 font-medium px-3 py-1.5 rounded-lg transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restart Game
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* RESULTS: GUESSED SUCCESSFULLY */}
        {gameState === 'guessed' && (
          <motion.div
            key="guessed"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
              <Award className="w-8 h-8 animate-bounce" />
            </div>

            <p className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider font-bold mb-1">
              Match Identified!
            </p>
            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
              {candidates[0]?.name || "Closest Match"}
            </h3>

            <div className="inline-flex gap-2 mb-6">
              <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2.5 py-1 rounded-md border border-indigo-100">
                {candidates[0]?.category}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-md">
                {candidates[0]?.visualType} ({candidates[0]?.elementCount} elements)
              </span>
            </div>

            {/* CSS Schematic Visual Preview */}
            {candidates[0] && (
              <div className="mb-6">
                <VisualPreview visualType={candidates[0].visualType} elementCount={candidates[0].elementCount} />
              </div>
            )}

            {candidates[0] && (
              <div className="text-left bg-slate-50/50 rounded-2xl p-5 border border-slate-100 mb-6 text-sm">
                <h4 className="font-semibold text-slate-800 mb-1">Strategic Purpose</h4>
                <p className="text-indigo-950 font-medium mb-4 text-xs leading-relaxed">{candidates[0].purpose}</p>

                <h4 className="font-semibold text-slate-800 mb-1">Core Concept</h4>
                <p className="text-slate-600 mb-4 text-xs leading-relaxed">{candidates[0].description}</p>

                <h4 className="font-semibold text-slate-800 mb-1">On-Screen Construction Guide</h4>
                <p className="text-slate-600 text-xs leading-relaxed font-mono bg-white p-2.5 rounded-lg border border-slate-100">{candidates[0].guide}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                onClick={() => startGame(false)}
                id="btn-play-again"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition shadow-md shadow-indigo-100"
              >
                Play Again
              </button>
              {candidates[0] && (
                <button
                  onClick={() => onSelectFramework(candidates[0])}
                  id="btn-view-explorer"
                  className="border border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-semibold py-2.5 px-5 rounded-xl text-sm transition flex items-center justify-center gap-1"
                >
                  <Search className="w-4 h-4" />
                  Examine in Explorer
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* RESULTS: NO MATCH FOUND */}
        {gameState === 'noMatch' && (
          <motion.div
            key="noMatch"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              No matching framework found
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              The combination of answers did not narrow down to a known model in our database of 200+ systems.
            </p>

            <button
              onClick={() => startGame(false)}
              id="btn-retry-no-match"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition"
            >
              Try Again
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
