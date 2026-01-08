import React, { useState } from 'react';
import { ProductData } from '../types';
import { parseProductData } from '../services/geminiService';
import { Sparkles, Loader2, AlertCircle, Link } from 'lucide-react';

interface ProductCardProps {
  product: ProductData;
  onChange: (data: ProductData) => void;
  color: string;     // Tailwind border class e.g., 'border-brand-primary'
  labelColor: string; // Tailwind text class e.g., 'text-brand-primary'
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onChange, color, labelColor }) => {
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProductData, value: string | number) => {
    onChange({ ...product, [field]: value });
  };

  const handleSmartExtract = async () => {
    if (!inputText.trim()) return;
    
    setIsExtracting(true);
    setError(null);
    try {
      const result = await parseProductData(inputText);
      onChange({
        ...product,
        name: result.name || product.name,
        rating: result.rating || 0,
        reviewCount: result.reviewCount || 0,
        maxRating: result.maxRating || 5
      });
    } catch (err) {
      setError("Could not extract data. Please enter manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-card border border-neutral-300 relative overflow-hidden transition-shadow hover:shadow-md`}>
      {/* Accent Top Border */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${color.replace('border-', 'bg-')}`}></div>

      <div className="flex justify-between items-center mb-6 mt-2">
        <h2 className={`text-xl font-bold ${labelColor} flex items-center gap-2`}>
          Product {product.id}
        </h2>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 uppercase tracking-wide">
          Input
        </span>
      </div>

      {/* AI Extraction Section */}
      <div className="bg-neutral-100/50 p-4 rounded-xl border border-neutral-300 mb-6">
        <label className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-3 block flex items-center gap-2">
           <Sparkles className="w-3 h-3 text-brand-primary" /> AI Auto-Fill
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Paste product URL..."
              className="w-full pl-9 bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <button
            onClick={handleSmartExtract}
            disabled={isExtracting || !inputText}
            className="bg-brand-primary hover:bg-[#D94B6C] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors shadow-sm font-semibold"
            title="Extract data using AI"
          >
            {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fill"}
          </button>
        </div>
        {error && <p className="text-state-error text-xs mt-2 flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3"/> {error}</p>}
      </div>

      {/* Manual Input Fields */}
      <div className="space-y-5">
        <div>
          <label className="block text-neutral-700 font-medium text-sm mb-1.5">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
            placeholder={`e.g. Super Widget 3000`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-medium text-sm mb-1.5">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max={product.maxRating}
              value={product.rating || ''}
              onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
              className="no-spinner w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-900 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
              placeholder="4.5"
            />
          </div>
          <div>
            <label className="block text-neutral-700 font-medium text-sm mb-1.5">Max Scale</label>
            <input
              type="number"
              min="1"
              value={product.maxRating}
              onChange={(e) => handleInputChange('maxRating', parseFloat(e.target.value))}
              className="no-spinner w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-900 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 font-medium text-sm mb-1.5">Total Reviews (n)</label>
          <input
            type="number"
            min="0"
            value={product.reviewCount || ''}
            onChange={(e) => handleInputChange('reviewCount', parseInt(e.target.value))}
            className="no-spinner w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-neutral-900 font-mono focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
            placeholder="100"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;