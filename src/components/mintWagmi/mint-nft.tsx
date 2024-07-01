import { type BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { abi } from './abi'

export function MintNFT() {
  const { isConnected } = useAccount()
  const { data: hash, error, isPending, writeContract } = useWriteContract()

  async function getNextTokenId() {
    return 100 // Función harcodeada para obtener el siguiente ID
  }

  async function mintNFT() {
    if (!isConnected) {
      alert('Please connect your wallet to mint an NFT.')
      return
    }

    const tokenId = await getNextTokenId()

    try {
      writeContract({
        address: import.meta.env.VITE_SMARTCONTRACT_ADDR,
        abi,
        functionName: 'mint',
        args: [tokenId]
      })
    } catch (error) {
      console.error(error)
      alert('An error occurred during minting. Please check the console for details.')
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleButtonClick = () => {
    if (isConnected) {
      mintNFT()
    } else {
      alert('Please connect your wallet to mint an NFT.')
    }
  }

  return (
    <div className=''>
      <button
        className={`btn btn-primary btn-outline px-10 ${
          isPending
            ? 'bg-gray-500 cursor-not-allowed'
            : isConnected
              ? 'btn btn-primary btn-outline px-10'
              : 'bg-gray-400'
        }`}
        disabled={!isConnected || isPending} // Deshabilita el botón si no está conectado o está pendiente
        onClick={handleButtonClick}
      >
        {!isConnected ? 'Mint NFT' : isPending ? 'Confirming...' : 'Mint NFT'}
      </button>

      {hash && <div className='mt-2 text-sm sm:text-base'>Transaction Hash: {hash}</div>}
      {isConfirming && <div className='mt-2 text-sm sm:text-base'>Waiting for confirmation...</div>}
      {isConfirmed && (
        <div className='mt-2 text-sm sm:text-base'>Transaction confirmed. Your NFT is minted!</div>
      )}
      {error && (
        <div className='mt-2 p-2 bg-red-400 rounded-lg'>
          Error: {(error as BaseError)?.shortMessage || error.message}
        </div>
      )}
    </div>
  )
}
