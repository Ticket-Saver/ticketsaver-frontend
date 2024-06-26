import * as React from 'react'
import { useAccount, useConnect, useDisconnect, Connector } from 'wagmi'

export function WalletOptions() {
  const account = useAccount() //Utiliza el hook useAccount para obtener la cuenta actual del usuario, es el importante
  const { connectors, connect, status, error } = useConnect() //información sobre la conexión y los conectores disponibles
  const { disconnect } = useDisconnect()

  return (
    <div className='wallet-options-container'>
      <div className='account-info'>
        <h2>Account</h2>
        <div>
          <strong>Status:</strong> {account.status}
          <br />
          <strong>Address:</strong> {account.address}
          <br />
          <strong>Chain ID:</strong> {account.chain?.id}
        </div>
        {account.status === 'connected' && (
          <button className='disconnect-button' onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div className='connect-options'>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <WalletOption
            key={connector.id}
            connector={connector}
            onClick={() => connect({ connector })}
          />
        ))}
        <div className='connection-status'>
          <strong>Status:</strong> {status}
        </div>
        <div className='error-message'>{error?.message}</div>
      </div>
    </div>
  )
}

function WalletOption({ connector, onClick }: { connector: Connector; onClick: () => void }) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <button className='wallet-option-button' disabled={!ready} onClick={onClick}>
      {connector.name}
    </button>
  )
}
