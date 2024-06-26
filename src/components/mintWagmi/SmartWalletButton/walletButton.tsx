import { useCallback } from 'react'
import { useConnect } from 'wagmi'
import { CoinbaseWalletLogo } from './CoinbaseWalletLogo'
import styles from './BlueCreateWalletButton.module.css'

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
    <button className={styles.button} onClick={createWallet}>
      <CoinbaseWalletLogo />
      Create Wallet
    </button>
  )
}
