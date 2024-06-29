import { useState } from 'react'
import {
  type BaseError,
  useAccount,
  useConnect,
  Connector,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi'
import { abi } from './abi'

export function MintNFT() {
  const { isConnected } = useAccount()

  //transacción
  const { data: hash, error, isPending, writeContract } = useWriteContract()

  const [showConnectOptions, setShowConnectOptions] = useState(false)

  // Configuración de conexión
  const { connect, connectors } = useConnect() //Aqupi debería poder importar los de mi config, pero no he dado con la documentación correcta.

  async function getNextTokenId() {
    //funcion harcodeada para obtener el siguiente ID
    return 100
  }

  // Función para mintear el NFT
  async function mintNFT() {
    if (!isConnected) {
      alert('Please connect your wallet to mint an NFT.')
      return
    }

    const tokenId = await getNextTokenId()

    try {
      writeContract({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', // Dirección del smart contract, harcodeada también
        abi,
        functionName: 'mint',
        args: [tokenId]
      })
    } catch (error) {
      console.error(error)
      alert('An error occurred during minting. Please check the console for details.')
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash
  })

  const handleButtonClick = () => {
    if (!isConnected) {
      setShowConnectOptions((prev) => !prev)
    } else {
      mintNFT()
    }
  }

  const handleConnect = async (connector: Connector) => {
    connect({ connector })
    setShowConnectOptions(false)
  }

  return (
    <div className='mint-nft-container'>
      {/* Botón principal para conectar o mintear */}
      <button className='mint-btn' disabled={isPending} onClick={handleButtonClick}>
        {!isConnected ? 'Connect Wallet' : isPending ? 'Confirming...' : 'Mint NFT'}
      </button>

      {/* Opciones de conexión de la Wallet, metamask, etc. */}
      {!isConnected && showConnectOptions && (
        <div className='connect-options'>
          <h3>Connect your wallet</h3>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              className='wallet-option-button'
              onClick={() => handleConnect(connector)}
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}

      {hash && <div className='transaction-hash'>Transaction Hash: {hash}</div>}
      {isConfirming && <div className='confirming-msg'>Waiting for confirmation...</div>}
      {isConfirmed && (
        <div className='confirmed-msg'>Transaction confirmed. Your NFT is minted!</div>
      )}
      {error && (
        <div className='alert alert-danger'>
          Error: {(error as BaseError)?.shortMessage || error.message}
        </div>
      )}
    </div>
  )
}
