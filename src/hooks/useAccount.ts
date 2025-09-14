import { useAccount as useWagmiAccount, useBalance, useDisconnect } from 'wagmi';
import { formatEther } from 'viem';

export function useAccount() {
  const { address, isConnected, isConnecting, isDisconnected, connector } = useWagmiAccount();
  const { disconnect } = useDisconnect();
  
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const formattedBalance = balance ? formatEther(balance.value) : '0';

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    connector,
    balance: balance?.value || 0n,
    formattedBalance,
    isBalanceLoading,
    disconnect,
  };
}
