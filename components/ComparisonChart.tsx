import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { ProductData, WilsonResult } from '../types';

interface ComparisonChartProps {
  productA: ProductData;
  productB: ProductData;
  resultA: WilsonResult;
  resultB: WilsonResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-neutral-300 p-4 rounded-xl shadow-floating text-sm">
        <p className="font-bold text-neutral-900 mb-2 text-base">{data.name}</p>
        <p className="text-neutral-500 mb-1">
          Nominal: <span className="text-neutral-900 font-mono">{data.rawRating.toFixed(2)}</span> / {data.max}
        </p>
        <p className="text-brand-primary">
          True Score: <span className="font-bold font-mono">{data.adjusted.toFixed(2)}</span> / {data.max}
        </p>
        <div className="mt-2 pt-2 border-t border-neutral-200">
           <p className="text-xs text-neutral-500 uppercase tracking-wide">Confidence: 95%</p>
        </div>
      </div>
    );
  }
  return null;
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({ productA, productB, resultA, resultB }) => {
  const data = [
    {
      id: 'A',
      name: productA.name || 'Product A',
      rawRating: productA.rating,
      adjusted: resultA.adjustedStars,
      max: productA.maxRating,
      fill: '#E75A7C', // Brand Primary
    },
    {
      id: 'B',
      name: productB.name || 'Product B',
      rawRating: productB.rating,
      adjusted: resultB.adjustedStars,
      max: productB.maxRating,
      fill: '#2C363F', // Brand Accent (Neutral 900)
    }
  ];

  // Determine winner for highlight
  const winnerId = resultA.lowerBound > resultB.lowerBound ? 'A' : (resultB.lowerBound > resultA.lowerBound ? 'B' : null);

  return (
    <div className="w-full h-[450px] bg-white rounded-xl p-6 border border-neutral-300 shadow-card flex flex-col">
      <h3 className="text-center text-neutral-700 font-semibold mb-6 text-lg">Quality Comparison</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barGap={12}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#5F6770', fontSize: 14 }} 
            axisLine={{ stroke: '#D6DBD2' }}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            domain={[0, (dataMax: number) => Math.ceil(dataMax)]} 
            tick={{ fill: '#9AA0A6', fontSize: 12, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#F2F5EA'}} />
          
          {/* Raw Rating Ghost Bar */}
          <Bar dataKey="rawRating" name="Nominal Average" fill="#D6DBD2" radius={[6, 6, 0, 0]} barSize={64}>
            <LabelList dataKey="rawRating" position="top" fill="#9AA0A6" fontSize={12} formatter={(val: number) => `Avg: ${val}`} />
          </Bar>

          {/* Wilson Score Bar */}
          <Bar dataKey="adjusted" name="True Score" radius={[6, 6, 0, 0]} barSize={64}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
                opacity={winnerId ? (entry.id === winnerId ? 1 : 0.3) : 1}
              />
            ))}
             <LabelList 
                dataKey="adjusted" 
                position="insideTop" 
                fill="#fff" 
                fontWeight="600"
                fontFamily="monospace"
                fontSize={14} 
                formatter={(val: number) => val.toFixed(2)} 
                offset={10}
             />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-8 text-xs mt-4 text-neutral-500 font-medium">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-neutral-300 rounded-sm"></div> Nominal Average
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-brand-primary rounded-sm"></div> True Score (A)
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-brand-accent rounded-sm"></div> True Score (B)
         </div>
      </div>
    </div>
  );
};

export default ComparisonChart;