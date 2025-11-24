import { Instrument } from './types';

export const DEFAULT_INSTRUMENTS: Instrument[] = [
  {
    id: 'eth',
    name: 'ETH Futures',
    lotSize: 0.01, 
  },
  {
    id: 'btc',
    name: 'BTC Futures',
    lotSize: 0.001,
  },
  {
    id: 'sol',
    name: 'SOL Futures',
    lotSize: 1,
  },
  {
    id: 'nifty',
    name: 'Nifty Options',
    lotSize: 25, // Example lot size
  }
];

export const DEFAULT_MARKET_DATA = {
  open: 2990,
  high: 3000,
  low: 2980,
  close: 2995,
};

// --- AD CONFIGURATION ---
export const ADSENSE_CONFIG = {
  // Your Publisher ID (Found in AdSense -> Account -> Settings -> Account Information)
  // Format: "ca-pub-XXXXXXXXXXXXXXXX"
  PUBLISHER_ID: "ca-pub-XXXXXXXXXXXXXXXX", 

  // Create "Display" ad units in AdSense to get these IDs
  SLOT_IDS: {
    TOP_BANNER: "1234567890",    // Replace with actual ID
    BOTTOM_BANNER: "0987654321", // Replace with actual ID
  }
};

// --- AFFILIATE CONFIGURATION (THE REAL MONEY MAKER) ---
export const AFFILIATE_CONFIG = {
  // The name of the broker you are promoting
  BROKER_NAME: "Delta Exchange",
  
  // Your referral link
  LINK: "https://www.delta.exchange/?code=Tradesize", 
  
  // Call to action text
  CTA_TEXT: "Trade on Delta Exchange"
};
