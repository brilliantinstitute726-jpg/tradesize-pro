import React, { useEffect } from 'react';
import { ADSENSE_CONFIG } from '../constants';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slotId,
  format = "auto",
  className = ""
}) => {

  useEffect(() => {
    // If no slot ID provided, don't try to load
    if (!slotId) return;

    try {
      // Use a timeout to ensure the DOM element has been painted and has width
      // This fixes "No slot size for availableWidth=0"
      const timer = setTimeout(() => {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [slotId]); // Re-run if slotId changes

  if (!slotId) return null;

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden ${className}`}>
      <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Advertisement</div>
      
      <div className="w-full bg-slate-900/50 min-h-[100px] rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center relative">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%' }}
             data-ad-client={ADSENSE_CONFIG.PUBLISHER_ID}
             data-ad-slot={slotId}
             data-ad-format={format}
             data-full-width-responsive="true"
        ></ins>
        
        {/* Helper text only visible if ad doesn't load/is blocked */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 text-slate-800 text-xs">
           Ad Space
        </div>
      </div>
    </div>
  );
};
