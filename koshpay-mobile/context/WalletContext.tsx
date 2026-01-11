import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../constants/config';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
  memoId: string | null;
  depositSimulate: (amount: number) => Promise<void>;
  refreshWallet: () => Promise<void>;
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
  const { user, logout } = useAuth(); // Get logout function
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [memoId, setMemoId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchWallet();
      fetchRealTimePrices(); // Fetch immediately
    }

    // Poll every 60 seconds
    const interval = setInterval(() => {
        fetchRealTimePrices();
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const fetchRealTimePrices = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum,usd-coin&vs_currencies=inr&include_24hr_change=true'
      );
      const prices = response.data;
      
      setAssets(prev => prev.map(asset => {
        let newPrice = asset.priceInr;
        let change24h = asset.change24h;

        if (asset.symbol === 'SOL' && prices.solana) {
           newPrice = prices.solana.inr;
           change24h = prices.solana.inr_24h_change;
        } else if (asset.symbol === 'BTC' && prices.bitcoin) {
           newPrice = prices.bitcoin.inr;
           change24h = prices.bitcoin.inr_24h_change;
        } else if (asset.symbol === 'ETH' && prices.ethereum) {
           newPrice = prices.ethereum.inr;
           change24h = prices.ethereum.inr_24h_change;
        } else if (asset.symbol === 'USDC' && prices['usd-coin']) {
           newPrice = prices['usd-coin'].inr;
           change24h = prices['usd-coin'].inr_24h_change;
        }

        return { ...asset, priceInr: newPrice, change24h };
      }));
    } catch (error: any) {
      console.warn("Price fetch failed (using fallback/cache):", error.message);
    }
  };

  const fetchWallet = async () => {
    if (!user?.id) return;
    
    // --- DEMO USER BYPASS ---
    if (user.phone === '9999999999') {
        console.log("Fetching Mock Wallet for Demo User");
        // Set fixed mock balance
        const solBalance = 15.5; 
        
        const updatedAssets = INITIAL_ASSETS.map(asset => {
            if (asset.symbol === 'SOL') {
              return { ...asset, balance: solBalance };
            }
            return { ...asset, balance: 0 };
        });
        setAssets(updatedAssets);
        
        // Mock Transactions
        setTransactions([
            {
                id: 'demo_tx_1',
                type: 'DEPOSIT',
                amountCrypto: 10,
                symbol: 'SOL',
                amountInr: 154200,
                recipient: 'Deposit',
                timestamp: new Date(),
                status: 'SUCCESS'
            },
            {
                id: 'demo_tx_2',
                type: 'PAYMENT',
                amountCrypto: 2.5,
                symbol: 'SOL',
                amountInr: 38550,
                recipient: 'Grocery Store',
                timestamp: new Date(Date.now() - 86400000),
                status: 'SUCCESS'
            }
        ]);
        return; // Skip API call
    }

    try {
      // 1. Fetch Wallet Data
      const res = await axios.get(`${API_URL}/wallet/${user.id}`);
      const walletData = res.data;

      setMemoId(walletData.memo_id);
      
      // ... mapping logic ...
      const solBalance = Number(walletData.balance);
      const updatedAssets = INITIAL_ASSETS.map(asset => {
        if (asset.symbol === 'SOL') {
          return { ...asset, balance: solBalance };
        }
        return { ...asset, balance: 0 }; 
      });
      setAssets(updatedAssets);

      const mappedTransactions: Transaction[] = walletData.transactions.map((tx: any) => ({
        id: tx.reference_id,
        type: tx.type === 'PAYMENT' ? 'PAYMENT' : 'DEPOSIT',
        amountCrypto: Number(tx.amount),
        symbol: 'SOL', 
        amountInr: Number(tx.amount) * 15420, 
        recipient: tx.metadata?.recipient || (tx.type === 'DEPOSIT' ? 'Deposit' : 'External'),
        timestamp: new Date(tx.created_at),
        status: 'SUCCESS'
      }));
      setTransactions(mappedTransactions);

    } catch (error: any) {
        console.error("Error fetching wallet:", error);
        // If wallet/user not found (404) or Unauthorized (401), force logout to fix data mismatch
        if (error.response?.status === 404 || error.response?.status === 401) {
            console.log("Invalid session/user detected. Logging out...");
            logout();
        }
    }
  };

  // Derived State
  const totalBalanceInr = assets.reduce(
    (total, asset) => total + asset.balance * asset.priceInr,
    0
  );

  const getAsset = (symbol: string) => assets.find((a) => a.symbol === symbol);

  const refreshPrices = async () => {
    // Simulating API call
    console.log('Refreshing prices...');
    await fetchWallet(); // Also refresh balance
  };

  const processPayment = async (symbol: string, amountCrypto: number, recipient: string) => {
    if (!user?.id) return false;
    try {
        await axios.post(`${API_URL}/wallet/pay`, {
            userId: user.id,
            amount: amountCrypto,
            recipientName: recipient
        });
        await fetchWallet(); // Refresh after pay
        return true;
    } catch (e) {
        console.error("Payment failed", e);
        throw e;
    }
  };

  const depositSimulate = async (amount: number) => {
    if (!user?.id) return;
    try {
        await axios.post(`${API_URL}/wallet/deposit`, {
            userId: user.id,
            amount
        });
        await fetchWallet();
    } catch (e) {
        console.error("Deposit failed", e);
    }
  }

  return (
    <WalletContext.Provider
      value={{
        assets,
        transactions,
        totalBalanceInr,
        getAsset,
        processPayment,
        refreshPrices,
        memoId,        // Exposed for Deposit Screen
        depositSimulate, // Exposed for Deposit Screen
        refreshWallet: fetchWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
