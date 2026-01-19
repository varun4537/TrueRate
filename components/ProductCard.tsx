import React, { useState } from 'react';
import { ProductData } from '../types';
import { parseProductData } from '../services/geminiService';
import { Sparkles, Loader2, Link, Globe, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: ProductData;
  onChange: (data: ProductData) => void;
  color: string;     // Tailwind bg class for identifier
  labelColor: string; // Tailwind text class
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onChange, color, labelColor }) => {
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  
  const handleInputChange = (field: keyof ProductData, value: string | number) => {
    onChange({ ...product, [field]: value });
  };

  const handleSmartExtract = async () => {
    if (!inputText.trim()) return;
    setIsExtracting(true);
    try {
      const result = await parseProductData(inputText);
      onChange({
        ...product,
        name: result.name || product.name,
        rating: result.rating || 0,
        reviewCount: result.reviewCount || 0,
        maxRating: result.maxRating || 5
      });
      setInputText(''); // Clear on success
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const isRatingInvalid = product.rating > product.maxRating;
  const isRatingNegative = product.rating < 0;

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col h-full relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
           <div className={`w-2 h-8 rounded-full ${color}`}></div>
           <input 
             type="text" 
             value={product.name}
             onChange={(e) => handleInputChange('name', e.target.value)}
             className="text-lg font-bold text-neutral-900 bg-transparent border-none focus:ring-0 p-0 placeholder:text-neutral-300 w-full"
             placeholder={`Product ${product.id} Name`}
           />
        </div>
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide bg-neutral-100 px-2 py-1 rounded-md">
          {product.id}
        </div>
      </div>

      {/* Compact AI Input */}
      <div className="mb-6 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Globe className="h-4 w-4 text-neutral-400 group-focus-within:text-brand-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Paste URL to auto-fill..."
          className="w-full pl-9 pr-10 glass-input rounded-xl py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSmartExtract()}
        />
        <button
          onClick={handleSmartExtract}
          disabled={!inputText || isExtracting}
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-white shadow-sm hover:shadow-md border border-neutral-100 text-neutral-700 hover:text-brand-primary rounded-lg px-2 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Extract data"
        >
          {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Rating Group */}
        <div className={`col-span-2 rounded-2xl p-4 border transition-colors duration-300 ${isRatingInvalid || isRatingNegative ? 'bg-red-50 border-red-200' : 'bg-white/50 border-white/60'}`}>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-xs font-semibold uppercase ${isRatingInvalid || isRatingNegative ? 'text-red-500' : 'text-neutral-500'}`}>
              Average Rating
            </label>
            <span className="text-[10px] text-neutral-400 bg-white px-1.5 py-0.5 rounded border border-neutral-100">STARS</span>
          </div>
          <div className="flex items-end gap-2 relative">
            <input
              type="number"
              step="0.1"
              value={product.rating || ''}
              onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
              className={`no-spinner text-3xl font-mono font-medium bg-transparent border-none p-0 focus:ring-0 w-24 placeholder:text-neutral-300 ${isRatingInvalid || isRatingNegative ? 'text-red-600' : 'text-neutral-900'}`}
              placeholder="0.0"
            />
            <div className="flex items-center text-neutral-400 mb-2 gap-1">
               <span className="text-sm">/</span>
               <input 
                  type="number"
                  value={product.maxRating}
                  onChange={(e) => handleInputChange('maxRating', parseFloat(e.target.value))}
                  className="no-spinner w-8 bg-transparent text-sm font-medium border-none p-0 focus:ring-0 text-neutral-500" 
               />
            </div>
          </div>
          {(isRatingInvalid || isRatingNegative) && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-600 font-medium animate-pulse">
              <AlertCircle className="w-3 h-3" />
              {isRatingNegative ? 'Rating cannot be negative' : `Cannot exceed ${product.maxRating}`}
            </div>
          )}
        </div>

        {/* Review Count */}
        <div className="col-span-2 bg-white/50 rounded-2xl p-4 border border-white/60">
           <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-neutral-500 uppercase">Review Count</label>
            <span className="text-[10px] text-neutral-400 bg-white px-1.5 py-0.5 rounded border border-neutral-100">TOTAL</span>
          </div>
          <input
            type="number"
            min="0"
            value={product.reviewCount || ''}
            onChange={(e) => handleInputChange('reviewCount', parseInt(e.target.value))}
            className="no-spinner w-full text-2xl font-mono font-medium text-neutral-900 bg-transparent border-none p-0 focus:ring-0 placeholder:text-neutral-300"
            placeholder="0"
          />
        </div>

      </div>
    </div>
  );
};

export default ProductCard;