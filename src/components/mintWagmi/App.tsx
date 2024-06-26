import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi'
import { WalletOptions } from './wallet-options'
import { MintNFT } from './mint-nft'
import { BlueCreateWalletButton } from './SmartWalletButton/walletButton'
const queryClient = new QueryClient()

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BlueCreateWalletButton />
        <WalletOptions />
        <MintNFT />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
