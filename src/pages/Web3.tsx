import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../components/mintWagmi/wagmi'
import { WalletOptions } from '../components/mintWagmi/wallet-options'
import { MintNFT } from '../components/mintWagmi/mint-nft'
import { BlueCreateWalletButton } from '../components/mintWagmi/SmartWalletButton/walletButton'

import '../styles/custom.css'

const queryClient = new QueryClient()

export default function Web3() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className='container'>
          <BlueCreateWalletButton />
          <WalletOptions />

          <MintNFT />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
