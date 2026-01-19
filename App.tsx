import React, { useState, useMemo, useEffect, useRef } from 'react';
import ProductCard from './components/ProductCard';
import ComparisonChart from './components/ComparisonChart';
import Explanation from './components/Explanation';
import { ProductData, WilsonResult } from './types';
import { calculateWilsonScore } from './utils/wilson';
import { Trophy, Scale, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, HelpCircle, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [activeMobileTab, setActiveMobileTab] = useState<'A' | 'B'>('A');
  const [isCalculated, setIsCalculated] = useState(false);
  const [isVerdictInView, setIsVerdictInView] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const verdictRef = useRef<HTMLDivElement>(null);

  const [productA, setProductA] = useState<ProductData>({
    id: 'A',
    name: 'Product A',
    rating: 5.0,
    maxRating: 5,
    reviewCount: 24,
  });

  const [productB, setProductB] = useState<ProductData>({
    id: 'B',
    name: 'Product B',
    rating: 4.89,
    maxRating: 5,
    reviewCount: 162,
  });

  // Validation Check
  const isValidA = productA.rating >= 0 && productA.rating <= productA.maxRating;
  const isValidB = productB.rating >= 0 && productB.rating <= productB.maxRating;
  const isAllValid = isValidA && isValidB;

  const resultA: WilsonResult = useMemo(() => 
    calculateWilsonScore(productA.rating, productA.maxRating, productA.reviewCount), 
  [productA]);

  const resultB: WilsonResult = useMemo(() => 
    calculateWilsonScore(productB.rating, productB.maxRating, productB.reviewCount), 
  [productB]);

  const winner = isAllValid 
    ? (resultA.lowerBound > resultB.lowerBound ? productA : (resultB.lowerBound > resultA.lowerBound ? productB : null))
    : null;
    
  const winMargin = Math.abs(resultA.lowerBound - resultB.lowerBound);
  const isCloseCall = winMargin < 0.05 && winMargin > 0;

  // Signal Effect: Briefly flash when results change/become valid
  useEffect(() => {
    if (isAllValid) {
      setIsCalculated(true);
      const timer = setTimeout(() => setIsCalculated(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [productA, productB, isAllValid]);

  // Observer for Floating Button
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVerdictInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (verdictRef.current) {
      observer.observe(verdictRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToVerdict = () => {
    verdictRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Verdict Insights Logic
  const winnerResult = winner?.id === 'A' ? resultA : resultB;
  const loserResult = winner?.id === 'A' ? resultB : resultA;
  const safetyPercentage = winner ? ((winnerResult.lowerBound - loserResult.lowerBound) * 100).toFixed(1) : '0';
  const inflation = winner ? (winner.rating - winnerResult.adjustedStars).toFixed(2) : '0';
  
  // Calculate relative win strength for bar chart (0 to 100 scale)
  const winStrength = Math.min(100, Math.max(10, winMargin * 500)); 

  return (
    <div className="min-h-screen px-4 py-8 md:p-8 max-w-[1440px] mx-auto pb-24">
      
      {/* Header - Compact */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 glass-panel rounded-2xl text-brand-primary shadow-sm">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
              TrueRate
            </h1>
            <p className="text-neutral-500 text-sm font-medium">Statistical Product Comparison</p>
          </div>
        </div>
        
        {/* Mobile Toggle (Visible only on small screens) */}
        <div className="lg:hidden w-full md:w-auto">
          <div className="flex bg-neutral-200/50 p-1 rounded-full relative w-full md:w-64">
            <button 
              onClick={() => setActiveMobileTab('A')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 z-10 ${
                activeMobileTab === 'A' ? 'text-neutral-900 shadow-sm bg-white' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Product A
            </button>
            <button 
              onClick={() => setActiveMobileTab('B')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 z-10 ${
                activeMobileTab === 'B' ? 'text-neutral-900 shadow-sm bg-white' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Product B
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Product A Column (Hidden on mobile if B selected) */}
        <div className={`lg:block ${activeMobileTab === 'A' ? 'block' : 'hidden'}`}>
          <ProductCard 
            product={productA} 
            onChange={setProductA} 
            color="bg-brand-primary"
            labelColor="text-brand-primary"
          />
        </div>

        {/* Product B Column (Hidden on mobile if A selected) */}
        <div className={`lg:block ${activeMobileTab === 'B' ? 'block' : 'hidden'}`}>
          <ProductCard 
            product={productB} 
            onChange={setProductB} 
            color="bg-brand-accent"
            labelColor="text-brand-accent"
          />
        </div>

        {/* Analytics Column - Sticks to top on desktop */}
        <div 
          ref={verdictRef}
          id="verdict-section" 
          className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 scroll-mt-8"
        >
          
          {/* Verdict Card */}
          <div className={`glass-panel rounded-3xl p-5 shadow-floating relative overflow-visible group transition-all duration-500 ${isCalculated ? 'ring-2 ring-brand-secondary/50 scale-[1.01]' : ''}`}>
             
             {/* Dynamic Status Bar */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-t-3xl opacity-0 transition-opacity duration-300" style={{ opacity: isCalculated ? 1 : 0 }}></div>

             {isAllValid ? (
               winner ? (
                 <div className="relative z-10 flex flex-col">
                   {/* Header */}
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Analysis Verdict</span>
                        <div className="h-px w-6 bg-neutral-200"></div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide transition-colors duration-500 ${isCalculated ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-400'}`}>
                        {isCalculated ? 'Live' : 'Cached'}
                      </span>
                   </div>
                   
                   {/* Winner Header - Compact Layout */}
                   <div className="flex items-center gap-3 mb-3">
                      <div className={`shrink-0 p-2.5 rounded-xl shadow-sm transition-transform duration-500 ${isCalculated ? 'scale-110 rotate-3' : ''} ${winner.id === 'A' ? 'bg-brand-primary text-white' : 'bg-brand-accent text-white'}`}>
                         <Trophy className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className="text-lg font-bold text-neutral-900 leading-tight truncate">
                             {winner.name || `Product ${winner.id}`}
                           </span>
                           <div className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${winner.id === 'A' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-accent/10 text-brand-accent'}`}>
                             Winner
                           </div>
                        </div>
                        <p className="text-xs text-neutral-500 leading-tight">
                          Statistically safer choice based on data volume.
                        </p>
                      </div>
                   </div>

                   {/* Analysis Toggle - Integrated with Header/Summary */}
                   <button 
                      onClick={() => setShowAnalysis(!showAnalysis)}
                      className="group w-full flex items-center justify-between px-3 py-2 bg-neutral-50 border border-neutral-200/60 rounded-xl hover:bg-white hover:border-brand-primary/30 transition-all shadow-sm mb-0"
                   >
                      <div className="flex items-center gap-2">
                        <div className="bg-white text-brand-secondary p-1 rounded-full shadow-sm">
                           <HelpCircle className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">Why did it win?</span>
                      </div>
                      {showAnalysis ? <ChevronUp className="w-3.5 h-3.5 text-neutral-400" /> : <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />}
                   </button>

                   {/* Dropdown Content - Technical Metrics */}
                   <div className={`grid transition-all duration-300 ease-in-out ${showAnalysis ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                          {/* Deep Insights */}
                          <div className="bg-brand-surface/80 rounded-2xl p-4 mb-2 border border-neutral-200/50 space-y-3">
                              <div className="flex justify-between items-center border-b border-neutral-200/50 pb-2">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-3.5 h-3.5 text-brand-secondary" />
                                  <span className="text-xs font-bold text-neutral-600">Safety Advantage</span>
                                </div>
                                <span className="font-mono font-bold text-brand-accent text-xs">+{safetyPercentage}%</span>
                              </div>
                              
                              <div className="flex justify-between items-center pb-1">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                                  <span className="text-xs font-bold text-neutral-600">Rating Inflation</span>
                                </div>
                                <span className="font-mono font-bold text-neutral-500 text-xs">-{inflation} ★</span>
                              </div>

                              <div className="pt-1">
                                <div className="flex justify-between text-[9px] uppercase font-bold text-neutral-400 mb-1">
                                    <span>Win Probability</span>
                                    <span>{winStrength > 80 ? 'Decisive' : (winStrength > 40 ? 'Strong' : 'Marginal')}</span>
                                </div>
                                <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden w-full relative">
                                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(45deg,rgba(0,0,0,0.1) 25%,transparent 25%,transparent 50%,rgba(0,0,0,0.1) 50%,rgba(0,0,0,0.1) 75%,transparent 75%,transparent)', backgroundSize: '8px 8px'}}></div>
                                    <div 
                                      className={`h-full transition-all duration-1000 ease-out ${winner.id === 'A' ? 'bg-brand-primary' : 'bg-brand-accent'}`} 
                                      style={{ width: `${winStrength}%` }}
                                    ></div>
                                </div>
                              </div>
                          </div>

                          {/* Stats Tiles */}
                          <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white/50 p-2.5 rounded-xl border border-white/60 group relative cursor-help">
                                <div className="flex items-center gap-1 mb-1">
                                    <div className="text-[9px] uppercase font-bold text-neutral-400">Confidence</div>
                                    <HelpCircle className="w-3 h-3 text-neutral-300 group-hover:text-brand-primary transition-colors" />
                                </div>
                                <div className="text-sm font-mono font-semibold text-neutral-900">
                                  {((winner.id === 'A' ? resultA.lowerBound : resultB.lowerBound) * 100).toFixed(0)}%
                                </div>
                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-neutral-800 text-white text-[10px] p-2 rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none z-20 shadow-xl">
                                    We are 95% statistically certain the true quality is at least this high.
                                    <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-neutral-800"></div>
                                </div>
                              </div>

                              <div className="bg-white/50 p-2.5 rounded-xl border border-white/60 group relative cursor-help">
                                <div className="flex items-center gap-1 mb-1">
                                    <div className="text-[9px] uppercase font-bold text-neutral-400">True Score</div>
                                    <TrendingUp className="w-3 h-3 text-neutral-300 group-hover:text-brand-primary transition-colors" />
                                </div>
                                <div className="text-sm font-mono font-semibold text-neutral-900">
                                  {(winner.id === 'A' ? resultA.adjustedStars : resultB.adjustedStars).toFixed(2)}
                                </div>
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-neutral-800 text-white text-[10px] p-2 rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none z-20 shadow-xl">
                                    The lower bound of the Wilson Score Interval. A conservative estimate of actual quality.
                                    <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-neutral-800"></div>
                                </div>
                              </div>
                          </div>
                      </div>
                   </div>

                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-neutral-400 text-sm">
                   <Scale className="w-8 h-8 mb-2 opacity-50" />
                   Tie game
                 </div>
               )
             ) : (
               <div className="flex flex-col items-center justify-center py-16 text-state-error text-center px-4">
                 <AlertTriangle className="w-10 h-10 mb-3 text-red-400" />
                 <h3 className="text-neutral-900 font-bold mb-1">Invalid Configuration</h3>
                 <p className="text-xs text-neutral-500">Please correct the rating values to proceed.</p>
               </div>
             )}
          </div>

          {/* Chart */}
          {isAllValid && (
            <ComparisonChart 
              productA={productA} 
              productB={productB}
              resultA={resultA}
              resultB={resultB}
            />
          )}

          {/* Educational Note */}
          <div className="hidden lg:block bg-brand-secondary/10 rounded-2xl p-4 border border-brand-secondary/20">
            <p className="text-xs text-neutral-600 leading-relaxed">
              <strong className="text-brand-accent">Why this matters:</strong> TrueRate penalizes uncertainty. A high rating with few reviews is risky.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button - Smart Visibility */}
      {isAllValid && (
        <div 
          className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${
            isVerdictInView ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <button 
            onClick={scrollToVerdict}
            className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full shadow-floating font-bold text-sm animate-bounce hover:animate-none"
            style={{ animationDuration: '2s' }} // Slower bounce
          >
            View Verdict <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer Content */}
      <div className="mt-16">
        <Explanation />
        <footer className="text-center text-neutral-400 text-xs py-12 font-medium">
          TrueRate &copy; {new Date().getFullYear()} &middot; Scientific Ranking Tool
        </footer>
      </div>
    </div>
  );
};

export default App;