import { useCallback } from 'react'
import { useConnect } from 'wagmi'
import { CoinbaseWalletLogo } from './CoinbaseWalletLogo'

export function BlueCreateWalletButton() {
  const { connectors, connect } = useConnect()

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    )
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector })
    }
  }, [connectors, connect])

  return (
    <button
    className="flex items-center justify-center p-3 text-lg font-bold text-white bg-blue-700 rounded-lg cursor-pointer transition duration-300 hover:bg-blue-800 disabled:bg-gray-600 disabled:cursor-not-allowed"
    onClick={createWallet}
  >
    <CoinbaseWalletLogo className="w-6 h-6 mr-2" />
    Create Wallet
  </button>
  )
}
