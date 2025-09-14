'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES, ESCROW_ABI, ERC20_ABI } from '@/lib/contracts';
import { toast } from 'react-hot-toast';

export interface EscrowData {
  id: bigint;
  maker: string;
  taker: string;
  asset: string;
  amount: bigint;
  jpyAmount: bigint;
  deadline: bigint;
  hashOTC: string;
  isReleased: boolean;
  isRefunded: boolean;
  createdAt: bigint;
}

export function useEscrow() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Escrow作成
  const createEscrow = useCallback(async (
    taker: string,
    asset: string,
    jpyAmount: number,
    assetAmount: number,
    deadlineDuration: number,
    otcCode: string
  ) => {
    try {
      if (!address) {
        throw new Error('ウォレットが接続されていません');
      }

      const assetAddress = asset === 'ETH' ? '0x0000000000000000000000000000000000000000' : 
                          asset === 'USDC' ? CONTRACT_ADDRESSES.USDC : 
                          CONTRACT_ADDRESSES.USDT;

      const value = asset === 'ETH' ? parseEther(assetAmount.toString()) : 0n;

      await writeContract({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'createEscrow',
        args: [
          taker as `0x${string}`,
          assetAddress as `0x${string}`,
          BigInt(jpyAmount),
          parseEther(assetAmount.toString()),
          BigInt(deadlineDuration),
          otcCode,
        ],
        value,
      });

      toast.success('Escrowの作成を開始しました...');
    } catch (err) {
      console.error('Create escrow failed:', err);
      toast.error(err instanceof Error ? err.message : 'Escrowの作成に失敗しました');
    }
  }, [address, writeContract]);

  // Escrow取得（useReadContractを使用）
  const getEscrow = useCallback(async (escrowId: number): Promise<EscrowData | null> => {
    try {
      // この関数は非同期でコントラクトを読み取る必要があるため、
      // 実際の実装ではuseReadContractフックを使用することを推奨
      return null;
    } catch (err) {
      console.error('Get escrow failed:', err);
      return null;
    }
  }, []);

  // Release実行
  const releaseEscrow = useCallback(async (escrowId: number, otcCode: string) => {
    try {
      if (!address) {
        throw new Error('ウォレットが接続されていません');
      }

      await writeContract({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'release',
        args: [BigInt(escrowId), otcCode],
      });

      toast.success('Releaseを開始しました...');
    } catch (err) {
      console.error('Release failed:', err);
      toast.error(err instanceof Error ? err.message : 'Releaseに失敗しました');
    }
  }, [address, writeContract]);

  // Refund実行
  const refundEscrow = useCallback(async (escrowId: number) => {
    try {
      if (!address) {
        throw new Error('ウォレットが接続されていません');
      }

      await writeContract({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'refund',
        args: [BigInt(escrowId)],
      });

      toast.success('Refundを開始しました...');
    } catch (err) {
      console.error('Refund failed:', err);
      toast.error(err instanceof Error ? err.message : 'Refundに失敗しました');
    }
  }, [address, writeContract]);

  // Refund可能かチェック（useReadContractを使用）
  const isRefundAvailable = useCallback(async (escrowId: number): Promise<boolean> => {
    try {
      // この関数は非同期でコントラクトを読み取る必要があるため、
      // 実際の実装ではuseReadContractフックを使用することを推奨
      return false;
    } catch (err) {
      console.error('Check refund availability failed:', err);
      return false;
    }
  }, []);

  // 残り時間取得（useReadContractを使用）
  const getTimeUntilRefund = useCallback(async (escrowId: number): Promise<number> => {
    try {
      // この関数は非同期でコントラクトを読み取る必要があるため、
      // 実際の実装ではuseReadContractフックを使用することを推奨
      return 0;
    } catch (err) {
      console.error('Get time until refund failed:', err);
      return 0;
    }
  }, []);

  return {
    createEscrow,
    getEscrow,
    releaseEscrow,
    refundEscrow,
    isRefundAvailable,
    getTimeUntilRefund,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

// コントラクト読み取り用のフック
export function useEscrowRead(escrowId?: number) {
  const { data: escrowData, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'getEscrow',
    args: escrowId ? [BigInt(escrowId)] : undefined,
    query: {
      enabled: !!escrowId,
    },
  });

  const { data: isRefundAvailable } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'isRefundAvailable',
    args: escrowId ? [BigInt(escrowId)] : undefined,
    query: {
      enabled: !!escrowId,
    },
  });

  const { data: timeUntilRefund } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'getTimeUntilRefund',
    args: escrowId ? [BigInt(escrowId)] : undefined,
    query: {
      enabled: !!escrowId,
    },
  });

  return {
    escrowData: escrowData as EscrowData | undefined,
    isRefundAvailable: isRefundAvailable as boolean | undefined,
    timeUntilRefund: timeUntilRefund ? Number(timeUntilRefund) : undefined,
    isLoading,
    error,
  };
}
