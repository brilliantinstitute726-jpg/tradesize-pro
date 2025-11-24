import React from 'react';
import { TradeDirection, AIStrategy } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Sparkles, Activity, MousePointerClick, Target, ShieldAlert, ExternalLink } from 'lucide-react';
import { AFFILIATE_CONFIG } from '../constants';

interface CalculatorCardProps {
  direction: TradeDirection;
  diffPoints: number;
  lotSize: number;
  targetProfit: number;
  isActive?: boolean;
  aiStrategy?: AIStrategy;
  onApplyEntry?: (price: number) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  direction,
  diffPoints,
  lotSize,
  targetProfit,
  isActive = false,
  aiStrategy,
  onApplyEntry,
}) => {
  const isLong = direction === TradeDirection.LONG;
  
  // Logic: 
  // Value per lot for this move = DiffPoints * LotSize
  // Required Lots = TargetProfit / ValuePerLot
  
  const valuePerLotForMove = diffPoints * lotSize;
  const requiredLots = valuePerLotForMove > 0 ? (targetProfit / valuePerLotForMove) : 0;
  
  // Format numbers nicely
  const formattedLots = requiredLots.toFixed(2);
  const formattedPoints = diffPoints.toFixed(2);

  const themeClass = isLong 
    ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10" 
    : "border-red-500/30 bg-red-500/5 hover:bg-red-500/10";

  const textClass = isLong ? "text-green-400" : "text-red-400";
  const icon = isLong ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />;

  return (
    <div className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 ${themeClass} ${isActive ? 'scale-[1.02] shadow-xl ring-1 ring-white/10' : 'opacity-80 grayscale-[0.3]'}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-xl font-bold flex items-center gap-2 ${textClass}`}>
          {icon}
          {direction}
        </h4>
        <div className="bg-slate-900/50 px-3 py-1 rounded-full text-xs font-mono text-slate-400">
          Target: ${targetProfit}
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* The Logic Explanation */}
        <div className="bg-slate-900/40 rounded-lg p-4 space-y-2">
           <div className="flex justify-between text-sm">
              <span className="text-slate-400">Risk Gap (pts)</span>
              <span className="font-mono text-slate-200">{formattedPoints}</span>
           </div>
           <div className="flex justify-between text-sm">
              <span className="text-slate-400">Value per Lot (at gap)</span>
              <span className="font-mono text-slate-200">${valuePerLotForMove.toFixed(4)}</span>
           </div>
        </div>

        {/* The Big Result */}
        <div className="text-center py-2">
            <div className="text-xs text-slate-400 mb-1 uppercase tracking-widest">Required Position Size</div>
            <div className={`text-5xl font-black ${textClass} tracking-tight`}>
                {formattedLots} <span className="text-lg font-medium text-slate-500">Lots</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 max-w-[80%] mx-auto leading-relaxed">
              If price moves <span className="text-white font-bold">{formattedPoints}</span> pts, this size yields <span className="text-white font-bold">${targetProfit}</span>.
            </p>
        </div>

        {/* Affiliate CTA - Only show if active and lots > 0 */}
        {isActive && requiredLots > 0 && (
          <a 
            href={AFFILIATE_CONFIG.LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
          >
            {AFFILIATE_CONFIG.CTA_TEXT} on {AFFILIATE_CONFIG.BROKER_NAME} <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        )}

        {/* AI Recommendations */}
        {aiStrategy && (
           <div className="mt-6 pt-6 border-t border-slate-700/50 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    <Sparkles size={14} /> AI Strategy
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold border ${isLong ? "text-green-400 bg-green-900/20 border-green-500/20" : "text-red-400 bg-red-900/20 border-red-500/20"}`}>
                    <Activity size={12} />
                    {aiStrategy.probability}% Probability
                </div>
              </div>

              {/* Probability Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mb-5 overflow-hidden ring-1 ring-slate-700/30">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isLong ? 'bg-gradient-to-r from-green-600 to-green-400 shadow-green-500/20' : 'bg-gradient-to-r from-red-600 to-red-400 shadow-red-500/20'}`} 
                    style={{ width: `${aiStrategy.probability}%` }}
                />
              </div>

              <div className="space-y-3">
                 {/* Entry Button */}
                 <button 
                    onClick={() => onApplyEntry && onApplyEntry(aiStrategy.entryPrice)}
                    className="w-full bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-400 rounded-lg p-3 transition-all flex items-center justify-between group shadow-lg shadow-black/20"
                    title="Click to apply as Close Price for calculation"
                 >
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-md text-indigo-400 group-hover:scale-110 transition-transform">
                            <MousePointerClick size={18} />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Suggested Entry</div>
                            <div className="text-[10px] text-indigo-400/80 group-hover:text-indigo-300">Click to Recalculate</div>
                        </div>
                    </div>
                    <div className="font-mono text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {aiStrategy.entryPrice}
                    </div>
                 </button>
                 
                 {/* SL / TP Grid */}
                 <div className="grid grid-cols-2 gap-3">
                     <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/40"></div>
                        <div className="flex items-center gap-2 mb-1 pl-2">
                             <ShieldAlert size={12} className="text-red-400" />
                             <span className="text-[10px] text-red-400/80 uppercase font-semibold">Stop Loss</span>
                        </div>
                        <div className="font-mono text-lg font-bold text-red-300 pl-2">{aiStrategy.stopLossPrice}</div>
                     </div>
                     
                     <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500/40"></div>
                        <div className="flex items-center gap-2 mb-1 pl-2">
                             <Target size={12} className="text-green-400" />
                             <span className="text-[10px] text-green-400/80 uppercase font-semibold">Target</span>
                        </div>
                        <div className="font-mono text-lg font-bold text-green-300 pl-2">{aiStrategy.targetPrice}</div>
                     </div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
