import { createPublicClient, createWalletClient, http, defineChain } from 'viem';
import { baseSepolia, base } from 'viem/chains';

// Base Sepolia chain configuration
export const baseSepoliaChain = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  network: 'baseSepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
});

// Base Mainnet chain configuration
export const baseChain = defineChain({
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
  testnet: false,
});

// Get the appropriate chain based on environment
export const getChain = () => {
  const isTestnet = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_NETWORK === 'testnet';
  return isTestnet ? baseSepoliaChain : baseChain;
};

// Create public client
export const createPublicClientConfig = () => {
  const chain = getChain();
  return createPublicClient({
    chain,
    transport: http(),
  });
};

// Create wallet client
export const createWalletClientConfig = () => {
  const chain = getChain();
  return createWalletClient({
    chain,
    transport: http(),
  });
};

// Network configuration for OnchainKit
export const networkConfig = {
  chain: getChain(),
  rpcUrl: getChain().rpcUrls.default.http[0],
};
