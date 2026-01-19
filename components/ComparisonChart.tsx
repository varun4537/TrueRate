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
      <div className="bg-white/95 backdrop-blur-md border border-neutral-100 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-bold text-neutral-900 mb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-neutral-500 flex justify-between gap-4">
            <span>Nominal:</span> <span className="font-mono text-neutral-900">{data.rawRating}</span>
          </p>
          <p className="text-brand-primary flex justify-between gap-4">
            <span>True Score:</span> <span className="font-bold font-mono">{data.adjusted.toFixed(2)}</span>
          </p>
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
      name: 'Prod A',
      fullName: productA.name,
      rawRating: productA.rating,
      adjusted: resultA.adjustedStars,
      max: productA.maxRating,
      fill: '#E75A7C',
    },
    {
      id: 'B',
      name: 'Prod B',
      fullName: productB.name,
      rawRating: productB.rating,
      adjusted: resultB.adjustedStars,
      max: productB.maxRating,
      fill: '#2C363F',
    }
  ];

  const winnerId = resultA.lowerBound > resultB.lowerBound ? 'A' : (resultB.lowerBound > resultA.lowerBound ? 'B' : null);

  return (
    <div className="w-full h-[320px] glass-panel rounded-3xl p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-neutral-700">Visual Comparison</h3>
        <div className="flex gap-2 text-[10px] font-bold text-neutral-400 uppercase">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-neutral-200"></div> Avg</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-primary"></div> True</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          barGap={4}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fill: '#CBD5E1', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.02)', radius: 8}} />
          
          <Bar dataKey="rawRating" fill="#E2E8F0" radius={[4, 4, 4, 4]} barSize={32} />

          <Bar dataKey="adjusted" radius={[4, 4, 4, 4]} barSize={32}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
                opacity={winnerId ? (entry.id === winnerId ? 1 : 0.4) : 1}
              />
            ))}
             <LabelList 
                dataKey="adjusted" 
                position="top" 
                fill="#334155" 
                fontWeight="600"
                fontFamily="monospace"
                fontSize={11} 
                formatter={(val: number) => val.toFixed(2)} 
             />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;