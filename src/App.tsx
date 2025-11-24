import React, { useState, useEffect } from 'react';
import { DEFAULT_INSTRUMENTS, DEFAULT_MARKET_DATA, ADSENSE_CONFIG } from './constants';
import { Instrument, MarketData, TradeDirection, AIAnalysisResponse } from './types';
import { InstrumentSelector } from './components/InstrumentSelector';
import { MarketDataInput } from './components/MarketDataInput';
import { CalculatorCard } from './components/CalculatorCard';
import { AdBanner } from './components/AdBanner';
import { analyzeCandleStructure } from './services/geminiService';
import { Bot, DollarSign } from 'lucide-react';

export default function App() {
  const [instruments, setInstruments] = useState<Instrument[]>(DEFAULT_INSTRUMENTS);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(DEFAULT_INSTRUMENTS[0].id);
  const [marketData, setMarketData] = useState<MarketData>(DEFAULT_MARKET_DATA);
  const [targetProfit, setTargetProfit] = useState<number>(1);
  const [geminiAnalysis, setGeminiAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedInstrument = instruments.find(i => i.id === selectedInstrumentId) || instruments[0];

  // Derived calculations
  const longDiff = Math.abs(marketData.close - marketData.low);
  const shortDiff = Math.abs(marketData.high - marketData.close);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeCandleStructure(selectedInstrument, marketData);
    setGeminiAnalysis(result);
    setIsAnalyzing(false);
  };
  
  // Handler to update market data close price from AI entry suggestion
  const handleApplyEntry = (price: number) => {
    setMarketData(prev => ({
      ...prev,
      close: price // Updating Close price to trigger lot recalculation
    }));
  };
  
  // Clear analysis when data changes
  useEffect(() => {
    setGeminiAnalysis(null);
  }, [marketData, selectedInstrumentId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <DollarSign className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">TradeSize Pro</h1>
                    <p className="text-xs text-slate-400">Precision Position Calculator</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 hidden sm:inline-block">
                    {selectedInstrument.name} (Lot: {selectedInstrument.lotSize})
                </span>
            </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Top Ad Banner */}
        <AdBanner slotId={ADSENSE_CONFIG.SLOT_IDS.TOP_BANNER} />

        {/* Top Section: Config & Inputs */}
        <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Left Column: Configuration */}
            <div className="lg:col-span-5 space-y-6">
                <InstrumentSelector 
                    instruments={instruments}
                    selectedId={selectedInstrumentId}
                    onSelect={setSelectedInstrumentId}
                    onUpdateInstruments={setInstruments}
                />

                <MarketDataInput 
                    data={marketData} 
                    onChange={setMarketData}
                    onReset={() => setMarketData(DEFAULT_MARKET_DATA)}
                />

                {/* Target Profit Input */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <label className="block text-sm font-medium text-indigo-400 mb-2">Target Profit ($)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input 
                            type="number" 
                            min="1"
                            value={targetProfit}
                            onChange={(e) => setTargetProfit(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-xl"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Calculate lots required to achieve this dollar amount based on the gap.
                    </p>
                </div>
                
                {/* AI Analysis Button */}
                <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-hidden">
                    <button 
                        onClick={handleRunAnalysis}
                        disabled={isAnalyzing}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        <Bot size={18} className={isAnalyzing ? "animate-pulse" : ""} />
                        {isAnalyzing ? "Analyzing Candle..." : "Ask AI: Recommended TP/SL"}
                    </button>
                    {geminiAnalysis && (
                        <div className="p-4 bg-slate-900/50 text-sm text-indigo-200 leading-relaxed border-t border-slate-700 animate-in fade-in slide-in-from-top-1">
                            <span className="font-bold text-indigo-400 block mb-1">
                                {geminiAnalysis.bias} Bias
                            </span>
                            {geminiAnalysis.reasoning}
                        </div>
                    )}
                </div>

            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7">
                <div className="grid md:grid-cols-2 gap-6 h-full">
                    {/* Long Calculation */}
                    <CalculatorCard 
                        direction={TradeDirection.LONG}
                        diffPoints={longDiff}
                        lotSize={selectedInstrument.lotSize}
                        targetProfit={targetProfit}
                        isActive={marketData.close >= marketData.open} // Green Candle Focus
                        aiStrategy={geminiAnalysis?.longStrategy}
                        onApplyEntry={handleApplyEntry}
                    />
                    
                    {/* Short Calculation */}
                    <CalculatorCard 
                        direction={TradeDirection.SHORT}
                        diffPoints={shortDiff}
                        lotSize={selectedInstrument.lotSize}
                        targetProfit={targetProfit}
                        isActive={marketData.close < marketData.open} // Red Candle Focus
                        aiStrategy={geminiAnalysis?.shortStrategy}
                        onApplyEntry={handleApplyEntry}
                    />
                </div>
            </div>
        </div>

        {/* Bottom Ad Banner */}
        <AdBanner slotId={ADSENSE_CONFIG.SLOT_IDS.BOTTOM_BANNER} />

        {/* Info / Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800 text-center">
            <div className="text-slate-500 text-sm max-w-2xl mx-auto">
                <p>
                    Formula: Lots = Target ($) / ( |Close - Reference| * Lot Size )
                </p>
                <p className="mt-2 opacity-60">
                    Trading involves significant risk. This tool is for educational purposes only.
                </p>
            </div>
            
            {/* AdSense Mandatory Links */}
            <div className="mt-6 flex justify-center gap-6 text-xs text-slate-600">
                <a href="#" className="hover:text-slate-400">Privacy Policy</a>
                <a href="#" className="hover:text-slate-400">Terms of Service</a>
                <a href="#" className="hover:text-slate-400">Contact Us</a>
            </div>
            <div className="mt-4 text-xs text-slate-700">
                &copy; {new Date().getFullYear()} TradeSize Pro. All rights reserved.
            </div>
        </footer>

      </main>
    </div>
  );
}
