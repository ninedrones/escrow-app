import { Address } from 'viem';

// Contract addresses
export const CONTRACT_ADDRESSES = {
  ESCROW: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS as Address,
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS as Address || '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS as Address || '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
} as const;

// Escrow contract ABI (minimal for frontend)
export const ESCROW_ABI = [
  {
    inputs: [
      { name: '_taker', type: 'address' },
      { name: '_asset', type: 'address' },
      { name: '_jpyAmount', type: 'uint256' },
      { name: '_assetAmount', type: 'uint256' },
      { name: '_deadlineDuration', type: 'uint256' },
      { name: '_otcCode', type: 'string' },
    ],
    name: 'createEscrow',
    outputs: [{ name: 'escrowId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_escrowId', type: 'uint256' },
      { name: '_otcCode', type: 'string' },
    ],
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_escrowId', type: 'uint256' }],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_escrowId', type: 'uint256' }],
    name: 'getEscrow',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'maker', type: 'address' },
          { name: 'taker', type: 'address' },
          { name: 'asset', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'jpyAmount', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'hashOTC', type: 'bytes32' },
          { name: 'isReleased', type: 'bool' },
          { name: 'isRefunded', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
        ],
        name: 'escrow',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_escrowId', type: 'uint256' }],
    name: 'isRefundAvailable',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_escrowId', type: 'uint256' }],
    name: 'getTimeUntilRefund',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_JPY_AMOUNT',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_USD_CAP',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEFAULT_DEADLINE_DURATION',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_DEADLINE_DURATION',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ETH_ADDRESS',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDC_ADDRESS',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'USDT_ADDRESS',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// ERC20 ABI for token operations
export const ERC20_ABI = [
  {
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Event types
export const ESCROW_EVENTS = {
  EscrowCreated: 'EscrowCreated',
  EscrowReleased: 'EscrowReleased',
  EscrowRefunded: 'EscrowRefunded',
} as const;
