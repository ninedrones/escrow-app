import { Address } from 'viem';

export interface EscrowData {
  id: bigint;
  maker: Address;
  taker: Address;
  asset: Address;
  amount: bigint;
  jpyAmount: bigint;
  deadline: bigint;
  hashOTC: `0x${string}`;
  isReleased: boolean;
  isRefunded: boolean;
  createdAt: bigint;
}

export interface EscrowFormData {
  taker: Address;
  asset: Address;
  jpyAmount: bigint;
  assetAmount: bigint;
  deadlineDuration: bigint;
  otcCode: string;
}

export type AssetType = 'ETH' | 'USDC' | 'USDT';

export interface AssetInfo {
  symbol: AssetType;
  address: Address;
  decimals: number;
  name: string;
}

export interface EscrowConstants {
  minJpyAmount: bigint;
  maxUsdCap: bigint;
  defaultDeadline: bigint;
  maxDeadline: bigint;
}

export interface TransactionState {
  hash?: `0x${string}`;
  isPending: boolean;
  error?: Error;
}

export interface EscrowSession {
  id: bigint;
  data: EscrowData;
  isRefundAvailable: boolean;
  timeUntilRefund: bigint;
  status: 'active' | 'released' | 'refunded' | 'expired';
}
