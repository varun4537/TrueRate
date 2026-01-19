import React from 'react';
import { Info, Calculator, CheckCircle2, XCircle } from 'lucide-react';

const Explanation: React.FC = () => {
  return (
    <div className="space-y-12 pt-12 border-t border-neutral-300/50">
      
      {/* Quick Summary */}
      <div className="glass-panel rounded-3xl p-8 shadow-floating flex flex-col md:flex-row gap-8">
        <div className="shrink-0">
          <div className="p-4 bg-brand-secondary/20 rounded-2xl text-brand-secondary inline-block backdrop-blur-sm border border-brand-secondary/20">
            <Info className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <h3 className="text-2xl font-bold text-brand-accent">The "Trusted Rating" Problem</h3>
          <p className="text-neutral-700 leading-relaxed text-lg">
            Comparing products by average rating alone is misleading. A 5-star product with 1 review is statistically unreliable compared to a 4.8-star product with 100 reviews.
          </p>
          <div className="bg-white/50 p-6 rounded-2xl border-l-4 border-brand-primary backdrop-blur-sm">
             <p className="text-lg italic text-neutral-700 font-serif">
              "We need a way to balance the proportion of positive ratings with the uncertainty of a small sample size."
             </p>
          </div>
        </div>
      </div>

      {/* Deep Dive / Evan Miller Section */}
      <div>
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-brand-accent mb-3">
            Learnings from Evan Miller
          </h3>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
            Based on <a href="https://www.evanmiller.org/how-not-to-sort-by-average-rating.html" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-[#D94B6C] underline decoration-2 decoration-brand-primary/30 hover:decoration-brand-primary">How Not To Sort By Average Rating</a>.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Wrong Way */}
          <div className="glass-panel border-state-error/30 rounded-3xl p-8 flex flex-col shadow-lg">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-state-error/10 rounded-full text-state-error backdrop-blur-sm">
                 <XCircle size={24} />
               </div>
               <h4 className="text-lg font-bold text-state-error">
                 The Naive Approach
               </h4>
             </div>
             
             <div className="space-y-4 flex-1">
                <p className="text-neutral-700">
                  <strong>Score = (Positive Ratings) / (Total Ratings)</strong>
                </p>
                <p className="text-neutral-500 text-sm">
                  This is just the simple average.
                </p>
                <div className="bg-white/50 p-5 rounded-2xl text-sm space-y-3 font-mono text-neutral-700 border border-white/50">
                   <div className="flex justify-between">
                     <span>Item A (1 pos, 0 neg)</span>
                     <span className="text-state-error font-bold">Score: 100%</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Item B (99 pos, 1 neg)</span>
                     <span className="text-state-success font-bold">Score: 99%</span>
                   </div>
                </div>
                <p className="text-sm text-state-error italic font-medium">
                   Result: The algorithm wrongly bets on Item A, despite zero data density.
                </p>
             </div>
          </div>

          {/* Right Way */}
          <div className="glass-panel border-brand-secondary/40 rounded-3xl p-8 flex flex-col shadow-lg">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-brand-secondary/20 rounded-full text-brand-secondary backdrop-blur-sm">
                 <CheckCircle2 size={24} />
               </div>
               <h4 className="text-lg font-bold text-state-success">
                 The Wilson Score
               </h4>
             </div>
             
             <div className="space-y-4 flex-1">
                <p className="text-neutral-700">
                  <strong>Score = Lower Bound of 95% Confidence Interval</strong>
                </p>
                 <p className="text-neutral-500 text-sm">
                  Calculates what the rating <em>probably</em> is, at minimum.
                </p>
                <div className="bg-white/50 p-5 rounded-2xl text-sm space-y-3 font-mono text-neutral-700 border border-white/50">
                   <div className="flex justify-between">
                     <span>Item A (1 review)</span>
                     <span className="text-state-error font-bold">Lower Bound: ~20%</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Item B (100 reviews)</span>
                     <span className="text-state-success font-bold">Lower Bound: ~94%</span>
                   </div>
                </div>
                 <p className="text-sm text-state-success italic font-medium">
                   Result: Item B is correctly identified as the better bet.
                </p>
             </div>
          </div>

        </div>
        
        <div className="mt-8 p-8 rounded-3xl bg-neutral-900/90 backdrop-blur-md text-neutral-300 shadow-floating border border-white/10">
           <h5 className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
             <Calculator className="w-5 h-5 text-brand-primary"/> How this tool calculates it
           </h5>
           <p className="text-neutral-400 leading-relaxed max-w-4xl">
             We treat the star rating as a probability $p$ (e.g. 4.5/5 stars = 0.9). We then apply the Wilson formula for Bernoulli parameter $p$ with a 95% confidence level ($z=1.96$). The result is the "Adjusted Score" you see in the chart.
           </p>
        </div>

      </div>
    </div>
  );
};

export default Explanation;