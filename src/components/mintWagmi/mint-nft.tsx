import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ethers } from 'ethers';
import { abi } from './abi';

export function MintNFT() {

  const { address: connectedAddress, isConnected } = useAccount();  //Estado de conexión
  const { data: hash, error, isPending, write: writeContract } = useWriteContract();  //estado de la transacción

  

  const [tokenId, setTokenId] = useState('');
  const [value, setValue] = useState('');

  const handleTokenIdChange = (e) => setTokenId(e.target.value);
  const handleValueChange = (e) => setValue(e.target.value);

  async function submit(e) {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet to mint an NFT.');
      return;
    }

    if (!tokenId || !value) {
      alert('Please enter a valid token ID and value.');
      return;
    }
 // función writeContract para enviar la transacción 
    try {
      await writeContract({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2', // Dirección del smartContract
        abi,
        functionName: 'mint',
        args: [BigInt(tokenId)],
        overrides: {
          from: connectedAddress,
          value: ethers.utils.parseEther(value), // Convertir valor a ETH
        },
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
    <form className="mint-nft-form" onSubmit={submit}>
      {!isConnected && (
        <div className="alert alert-warning">Please connect your wallet to mint an NFT.</div>
      )}
      <div className="form-group">
        <label htmlFor="tokenId">Token ID:</label>
        <input
          id="tokenId"
          name="tokenId"
          type="number"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={handleTokenIdChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="value">Value (ETH):</label>
        <input
          id="value"
          name="value"
          type="number"
          step="any"
          placeholder="Enter ETH Value"
          value={value}
          onChange={handleValueChange}
          required
        />
      </div>
      <button className="submit-btn" disabled={isPending || !isConnected} type="submit">
        {isPending ? 'Confirming...' : 'Mint NFT'}
      </button>
      {hash && <div className="transaction-hash">Transaction Hash: {hash}</div>}
      {isConfirming && <div className="confirming-msg">Waiting for confirmation...</div>}
      {isConfirmed && (
        <div className="confirmed-msg">Transaction confirmed. Your NFT is minted!</div>
      )}
      {error && <div className="alert alert-danger">Error: { error.message}</div>}
    </form>
  );
}
