import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { Address, parseEther, formatEther } from 'viem';
import { ESCROW_ABI, CONTRACT_ADDRESSES } from '@/lib/contracts';

export function useEscrowContract() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { data: hash, isPending, error } = useWriteContract();

  // Read contract functions
  const { data: minJpyAmount } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'MIN_JPY_AMOUNT',
  });

  const { data: maxUsdCap } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'MAX_USD_CAP',
  });

  const { data: defaultDeadline } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'DEFAULT_DEADLINE_DURATION',
  });

  const { data: maxDeadline } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'MAX_DEADLINE_DURATION',
  });

  // Write contract functions
  const createEscrow = async (
    taker: Address,
    asset: Address,
    jpyAmount: bigint,
    assetAmount: bigint,
    deadlineDuration: bigint,
    otcCode: string,
    value?: bigint
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'createEscrow',
        args: [taker, asset, jpyAmount, assetAmount, deadlineDuration, otcCode],
        value: value || 0n,
      });
    } catch (err) {
      console.error('Failed to create escrow:', err);
      throw err;
    }
  };

  const releaseEscrow = async (escrowId: bigint, otcCode: string) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'release',
        args: [escrowId, otcCode],
      });
    } catch (err) {
      console.error('Failed to release escrow:', err);
      throw err;
    }
  };

  const refundEscrow = async (escrowId: bigint) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.ESCROW,
        abi: ESCROW_ABI,
        functionName: 'refund',
        args: [escrowId],
      });
    } catch (err) {
      console.error('Failed to refund escrow:', err);
      throw err;
    }
  };

  return {
    // Contract constants
    minJpyAmount,
    maxUsdCap,
    defaultDeadline,
    maxDeadline,
    
    // Write functions
    createEscrow,
    releaseEscrow,
    refundEscrow,
    
    // Transaction state
    hash,
    isPending,
    error,
    
    // Account info
    address,
  };
}

export function useEscrowData(escrowId: bigint) {
  const { data: escrowData, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'getEscrow',
    args: [escrowId],
  });

  const { data: isRefundAvailable } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'isRefundAvailable',
    args: [escrowId],
  });

  const { data: timeUntilRefund } = useReadContract({
    address: CONTRACT_ADDRESSES.ESCROW,
    abi: ESCROW_ABI,
    functionName: 'getTimeUntilRefund',
    args: [escrowId],
  });

  return {
    escrowData,
    isRefundAvailable,
    timeUntilRefund,
    isLoading,
    error,
  };
}
