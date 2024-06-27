import { type BaseError, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from './abi';

export function MintNFT() {
  const {isConnected } = useAccount();  // Estado de conexión
  const { data: hash, error, isPending, writeContract } = useWriteContract();  // Estado de la transacción

  async function getNextTokenId() {
    //Harcodeada
    return 100
  }


  async function mintNFT() {
    if (!isConnected) {
      alert('Please connect your wallet to mint an NFT.');
      return;
    }


    

    const tokenId = await getNextTokenId();

    // Función writeContract para enviar la transacción
    try {
      await writeContract({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', // Dirección del smartContract Harcodeada
        abi,
        functionName: 'mint',
        args: [tokenId],
      });
    } catch (error) {
      console.error(error);
      alert('An error occurred during minting. Please check the console for details.');
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return (
    <div className="mint-nft-container">
      {!isConnected && (
        <div className="alert alert-warning">Please connect your wallet to mint an NFT.</div>
      )}
      <button className="mint-btn" disabled={isPending || !isConnected} onClick={mintNFT}>
        {isPending ? 'Confirming...' : 'Mint NFT'}
      </button>
      {hash && <div className="transaction-hash">Transaction Hash: {hash}</div>}
      {isConfirming && <div className="confirming-msg">Waiting for confirmation...</div>}
      {isConfirmed && (
        <div className="confirmed-msg">Transaction confirmed. Your NFT is minted!</div>
      )}
      {error && <div className="alert alert-danger">Error: {(error as BaseError).shortMessage || error.message}</div>}
    </div>
  );
}
