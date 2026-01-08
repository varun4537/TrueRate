import React, { useState, useMemo } from 'react';
import ProductCard from './components/ProductCard';
import ComparisonChart from './components/ComparisonChart';
import Explanation from './components/Explanation';
import { ProductData, WilsonResult } from './types';
import { calculateWilsonScore } from './utils/wilson';
import { Trophy, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [activeMobileTab, setActiveMobileTab] = useState<'A' | 'B'>('A');

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

  const resultA: WilsonResult = useMemo(() => 
    calculateWilsonScore(productA.rating, productA.maxRating, productA.reviewCount), 
  [productA]);

  const resultB: WilsonResult = useMemo(() => 
    calculateWilsonScore(productB.rating, productB.maxRating, productB.reviewCount), 
  [productB]);

  const winner = resultA.lowerBound > resultB.lowerBound ? productA : (resultB.lowerBound > resultA.lowerBound ? productB : null);
  const winMargin = Math.abs(resultA.lowerBound - resultB.lowerBound);
  const isCloseCall = winMargin < 0.05 && winMargin > 0;

  return (
    <div className="min-h-screen bg-neutral-100 p-6 md:p-12">
      
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-card ring-1 ring-neutral-300">
            <Scale className="w-8 h-8 text-brand-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-accent tracking-tight leading-[1.1]">
              TrueRate
            </h1>
            <p className="text-neutral-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Compare products fairly. We use the <strong className="text-brand-primary font-semibold">Wilson Score Interval</strong> to statistically balance ratings with review counts.
            </p>
          </div>
        </header>

        {/* Comparison Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Mobile Tab Toggle */}
            <div className="flex lg:hidden bg-white p-1 rounded-xl shadow-sm border border-neutral-300">
              <button 
                onClick={() => setActiveMobileTab('A')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  activeMobileTab === 'A' 
                    ? 'bg-brand-primary text-white shadow-sm' 
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                Product A
              </button>
              <button 
                onClick={() => setActiveMobileTab('B')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  activeMobileTab === 'B' 
                    ? 'bg-brand-accent text-white shadow-sm' 
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                Product B
              </button>
            </div>

            {/* Product Cards Container */}
            <div className="space-y-6">
              {/* Desktop: Show Both. Mobile: Show Active Only */}
              <div className={`${activeMobileTab === 'A' ? 'block' : 'hidden'} lg:block`}>
                <ProductCard 
                  product={productA} 
                  onChange={setProductA} 
                  color="border-brand-primary"
                  labelColor="text-brand-primary"
                />
              </div>

              {/* VS Separator (Desktop Only) */}
              <div className="hidden lg:flex justify-center items-center">
                 <span className="bg-neutral-300 text-neutral-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest shadow-sm">VS</span>
              </div>

              <div className={`${activeMobileTab === 'B' ? 'block' : 'hidden'} lg:block`}>
                <ProductCard 
                  product={productB} 
                  onChange={setProductB} 
                  color="border-brand-accent"
                  labelColor="text-brand-accent"
                />
              </div>
            </div>
          </div>

          {/* Results & Chart */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            
            {/* Verdict Card */}
            <div className="bg-white rounded-xl p-8 border border-neutral-300 shadow-card relative overflow-hidden group">
               {winner ? (
                 <>
                    <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
                       <Trophy size={300} className="text-brand-accent" />
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-neutral-500 font-medium uppercase tracking-widest text-sm mb-3">Statistical Verdict</h2>
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className={`p-3 rounded-full ${winner.id === 'A' ? 'bg-[#FFF0F3] text-brand-primary' : 'bg-[#EDF0F2] text-brand-accent'}`}>
                           <Trophy className="w-8 h-8" />
                        </div>
                        <span className="text-3xl md:text-4xl font-bold text-brand-accent">
                          {winner.name || `Product ${winner.id}`} Wins 
                          {isCloseCall && <span className="text-xl text-neutral-500 font-normal ml-2">(Barely)</span>}
                        </span>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-neutral-100 p-5 rounded-xl border border-neutral-300">
                           <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Confidence Score</div>
                           <div className="text-2xl font-mono font-medium text-brand-secondary">
                             {((winner.id === 'A' ? resultA.lowerBound : resultB.lowerBound) * 100).toFixed(1)}%
                           </div>
                        </div>
                         <div className="bg-neutral-100 p-5 rounded-xl border border-neutral-300">
                           <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Adjusted Rating</div>
                           <div className="text-2xl font-mono font-medium text-brand-accent">
                             {(winner.id === 'A' ? resultA.adjustedStars : resultB.adjustedStars).toFixed(2)}
                             <span className="text-base text-neutral-500 ml-1">/ {winner.maxRating}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                 </>
               ) : (
                 <div className="flex items-center justify-center h-48 text-neutral-500 italic">
                   Enter product data to see the winner
                 </div>
               )}
            </div>

            {/* Visualization */}
            <ComparisonChart 
              productA={productA} 
              productB={productB}
              resultA={resultA}
              resultB={resultB}
            />
          </div>
        </div>

        {/* Educational Footer */}
        <Explanation />
        
        <footer className="text-center text-neutral-500 text-sm py-8">
          TrueRate &copy; {new Date().getFullYear()} &middot; Designed with DesignAcademy Theme
        </footer>
      </div>
    </div>
  );
};

export default App;