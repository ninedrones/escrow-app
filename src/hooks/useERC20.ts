'use client';

import { useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, ERC20_ABI } from '@/lib/contracts';
import { toast } from 'react-hot-toast';

export function useERC20() {
  const { address } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();

  // トークン残高取得（useReadContractを使用）
  const getBalance = useCallback(async (tokenAddress: string): Promise<bigint> => {
    try {
      // この関数は非同期でコントラクトを読み取る必要があるため、
      // 実際の実装ではuseReadContractフックを使用することを推奨
      return 0n;
    } catch (err) {
      console.error('Get balance failed:', err);
      return 0n;
    }
  }, [address]);

  // トークン承認
  const approve = useCallback(async (
    tokenAddress: string,
    spender: string,
    amount: number,
    decimals: number = 6
  ) => {
    try {
      if (!address) {
        throw new Error('ウォレットが接続されていません');
      }

      const parsedAmount = parseUnits(amount.toString(), decimals);

      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spender as `0x${string}`, parsedAmount],
      });

      toast.success('トークンの承認を開始しました...');
    } catch (err) {
      console.error('Approve failed:', err);
      toast.error(err instanceof Error ? err.message : 'トークンの承認に失敗しました');
    }
  }, [address, writeContract]);

  // トークン情報取得（useReadContractを使用）
  const getTokenInfo = useCallback(async (tokenAddress: string) => {
    try {
      // この関数は非同期でコントラクトを読み取る必要があるため、
      // 実際の実装ではuseReadContractフックを使用することを推奨
      return null;
    } catch (err) {
      console.error('Get token info failed:', err);
      return null;
    }
  }, []);

  return {
    getBalance,
    approve,
    getTokenInfo,
    isPending,
    error,
  };
}

// トークン残高表示用のフック
export function useTokenBalance(tokenAddress?: string) {
  const { address } = useAccount();
  
  const { data: balance, isLoading, error } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: tokenAddress && address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!tokenAddress && !!address,
    },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const formattedBalance = balance && decimals ? 
    formatUnits(balance, decimals) : '0';

  return {
    balance: balance as bigint | undefined,
    formattedBalance,
    decimals: decimals as number | undefined,
    isLoading,
    error,
  };
}
