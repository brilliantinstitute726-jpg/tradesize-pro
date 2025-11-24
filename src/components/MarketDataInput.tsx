import React from 'react';
import { MarketData } from '../types';
import { RefreshCcw } from 'lucide-react';

interface MarketDataInputProps {
  data: MarketData;
  onChange: (data: MarketData) => void;
  onReset: () => void;
}

export const MarketDataInput: React.FC<MarketDataInputProps> = ({ data, onChange, onReset }) => {
  const handleChange = (field: keyof MarketData, value: string) => {
    const numVal = parseFloat(value);
    onChange({
      ...data,
      [field]: isNaN(numVal) ? 0 : numVal,
    });
  };

  const isInvalid = 
    data.close > data.high || 
    data.close < data.low || 
    data.open > data.high || 
    data.open < data.low;

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-200">Candle Data (Pre-Analysis)</h3>
        <button onClick={onReset} className="text-xs flex items-center gap-1 text-slate-400 hover:text-indigo-400">
          <RefreshCcw size={12} /> Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-amber-400 mb-1 uppercase tracking-wider">Open Price</label>
          <input
            type="number"
            value={data.open}
            onChange={(e) => handleChange('open', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono text-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-green-400 mb-1 uppercase tracking-wider">High Price</label>
          <input
            type="number"
            value={data.high}
            onChange={(e) => handleChange('high', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-mono text-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-red-400 mb-1 uppercase tracking-wider">Low Price</label>
          <input
            type="number"
            value={data.low}
            onChange={(e) => handleChange('low', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono text-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-400 mb-1 uppercase tracking-wider">Close Price</label>
          <input
            type="number"
            value={data.close}
            onChange={(e) => handleChange('close', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-lg"
          />
        </div>
      </div>
      
      {isInvalid ? (
        <div className="mt-3 text-amber-500 text-xs flex items-center gap-2">
           Warning: Open or Close price is outside the High/Low range. Please check inputs.
        </div>
      ) : null}
    </div>
  );
};
