import { type BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from './abi';

export function MintNFT() {
  const { isConnected } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function getNextTokenId() {
    return 100; // Función harcodeada para obtener el siguiente ID
  }

  async function mintNFT() {
    if (!isConnected) {
      alert('Please connect your wallet to mint an NFT.');
      return;
    }

    const tokenId = await getNextTokenId();

    try {
      await writeContract({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', // Dirección del smart contract, harcodeada
        abi,
        functionName: 'mint',
        args: [tokenId],
      });
    } catch (error) {
      console.error(error);
      alert('An error occurred during minting. Please check the console for details.');
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleButtonClick = () => {
    if (isConnected) {
      mintNFT();
    } else {
      alert('Please connect your wallet to mint an NFT.');
    }
  };

  return (
    <div className="flex flex-col items-center p-5 bg-transparent rounded-lg shadow-none w-full max-w-md mx-auto text-white">
      <button
        className={`mt-4 py-3 px-8 text-lg font-bold border-none rounded-lg cursor-pointer transition duration-300 transform ${
          isPending ? 'bg-gray-500 cursor-not-allowed' : isConnected ? 'bg-blue-600 hover:bg-blue-400 hover:scale-105' : 'bg-gray-400'
        }`}
        disabled={!isConnected || isPending} // Deshabilita el botón si no está conectado o está pendiente
        onClick={handleButtonClick}
      >
        {!isConnected ? 'Mint NFT' : isPending ? 'Confirming...' : 'Mint NFT'}
      </button>

      {hash && <div className="mt-2 text-sm sm:text-base">Transaction Hash: {hash}</div>}
      {isConfirming && <div className="mt-2 text-sm sm:text-base">Waiting for confirmation...</div>}
      {isConfirmed && <div className="mt-2 text-sm sm:text-base">Transaction confirmed. Your NFT is minted!</div>}
      {error && (
        <div className="mt-2 p-2 bg-red-400 rounded-lg">
          Error: {(error as BaseError)?.shortMessage || error.message}
        </div>
      )}
    </div>
  );
}
