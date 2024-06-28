import { useAccount, useDisconnect } from 'wagmi'

export function WalletOptions() {
  const account = useAccount() //Utiliza el hook useAccount para obtener la cuenta actual del usuario, es el importante
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
      
     </div>
  )
};

