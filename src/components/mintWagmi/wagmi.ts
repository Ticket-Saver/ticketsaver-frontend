import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'


export const config = createConfig({

  chains: [mainnet, sepolia, baseSepolia], //Define las cadenas principales y secundarias a utilizar
  connectors: [
    injected(),
    coinbaseWallet({appName: 'TDT', appLogoUrl: 'URL',preference: 'smartWalletOnly'}),
    
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})


declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
