import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  priceInr: number;
  icon: any; // Using any for require() images for now
  color: string;
  change24h?: number; // Optional percentage change
}

export interface Transaction {
  id: string;
  type: 'PAYMENT' | 'DEPOSIT';
  amountCrypto: number;
  symbol: string;
  amountInr: number;
  recipient?: string;
  timestamp: Date;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

interface WalletContextType {
  assets: Asset[];
  transactions: Transaction[];
  totalBalanceInr: number;
  getAsset: (symbol: string) => Asset | undefined;
  processPayment: (symbol: string, amountCrypto: number, recipient: string) => Promise<boolean>;
  refreshPrices: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Initial Mock Data
const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    symbol: 'SOL',
    name: 'Solana',
    balance: 14.5,
    priceInr: 15420,
    icon: require('../assets/images/crypto/sol.png'),
    color: '#14F195',
  },
  {
    id: '2',
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 0.0024,
    priceInr: 9135000,
    icon: require('../assets/images/crypto/btc.png'),
    color: '#F7931A',
  },
  {
    id: '3',
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 0.15,
    priceInr: 318500,
    icon: require('../assets/images/crypto/eth.png'),
    color: '#627EEA',
  },
  {
    id: '4',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 120.50,
    priceInr: 88.5,
    icon: require('../assets/images/icon.png'), // Placeholder
    color: '#2775CA',
  },
];

// Initial Mock Transactions
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'DEPOSIT',
    amountCrypto: 10,
    symbol: 'SOL',
    amountInr: 154200,
    timestamp: new Date(Date.now() - 86400000), // Yesterday
    status: 'SUCCESS',
  },
  {
    id: 'tx_2',
    type: 'PAYMENT',
    amountCrypto: 0.5,
    symbol: 'SOL',
    amountInr: 7710,
    recipient: 'Raj Kumar',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'SUCCESS',
  },
  {
    id: 'tx_3',
    type: 'PAYMENT',
    amountCrypto: 0.001,
    symbol: 'BTC',
    amountInr: 9135,
    recipient: 'Priya Sharma',
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    status: 'SUCCESS',
  }
];

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Derived State
  const totalBalanceInr = assets.reduce(
    (total, asset) => total + asset.balance * asset.priceInr,
    0
  );

  const getAsset = (symbol: string) => assets.find((a) => a.symbol === symbol);

  const refreshPrices = async () => {
    // Simulating API call
    console.log('Refreshing prices...');
    // In a real app, fetch from Coingecko/Binance here
  };

  const processPayment = async (symbol: string, amountCrypto: number, recipient: string) => {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        setAssets((prevAssets) =>
          prevAssets.map((asset) => {
            if (asset.symbol === symbol) {
              if (asset.balance < amountCrypto) {
                reject(new Error('Insufficient balance'));
                return asset;
              }
              return { ...asset, balance: asset.balance - amountCrypto };
            }
            return asset;
          })
        );

        const asset = getAsset(symbol);
        const newTx: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'PAYMENT',
            amountCrypto,
            symbol,
            amountInr: amountCrypto * (asset?.priceInr || 0),
            recipient,
            timestamp: new Date(),
            status: 'SUCCESS'
        };
        setTransactions(prev => [newTx, ...prev]);

        resolve(true);
      }, 1500); // Simulate network delay
    });
  };

  return (
    <WalletContext.Provider
      value={{
        assets,
        transactions,
        totalBalanceInr,
        getAsset,
        processPayment,
        refreshPrices,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
