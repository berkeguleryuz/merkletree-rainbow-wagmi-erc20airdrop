"use client";

// Front
import { useState, useEffect } from "react";

// Wagmi
import {
  useAccount,
  useReadContracts,
  type BaseError,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";

// Contract informations
import { CONTRACT_ADDRESS, CONTRACT_ABI, whitelisted } from "@/constants";

// Viem
import { formatEther } from "viem";

// Merkle Tree
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

type Props = {};

const Mint = (props: Props) => {
  const { address } = useAccount();
  const [merkleProof, setMerkleProof] = useState<string[]>([]);
  const [merkleError, setMerkleError] = useState<string>("");

  // Get the total amount of the ERC20 airdropped
  const {
    data: totalSupply,
    isLoading: totalSupplyLoading,
    refetch: refetchTotalSupply,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "totalSupply",
    account: address,
  });

  const formatTotalSupply = (supply: bigint | undefined) => {
    if (supply !== undefined) {
      return formatEther(supply);
    }
    return "0";
  };

  const {
    data: hash,
    error: airdropError,
    isPending,
    writeContract,
  } = useWriteContract();

  const getAirdrop = async () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "mint",
      account: address,
      args: [address, merkleProof],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (address) {
      try {
        const tree = StandardMerkleTree.of(whitelisted, ["address"], {
          sortLeaves: true,
        });
        const proof = tree.getProof([address]);
        setMerkleProof(proof);
      } catch (err) {
        setMerkleError("You are not eligible to an airdrop.");
      }
    }
  }, []);

  useEffect(() => {
    isConfirmed && refetchTotalSupply();
  }, [isConfirmed]);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col">
        {totalSupplyLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            Amount Airdrop Given:{" "}
            {formatTotalSupply(totalSupply as bigint | undefined)} OMEGA
          </div>
        )}
        {merkleError ? (
          <div>{merkleError}</div>
        ) : (
          <>
            {hash && (
              <div className="flex flex-row mt-10">
                Hash of the airdrop transaction: {hash}
              </div>
            )}
            {isConfirming && <div>Waiting for confirmation... </div>}
            {isConfirmed && (
              <div>Check your wallet, you have received 2 OMEGA </div>
            )}
            {airdropError && (
              <div>
                Error:{" "}
                {(airdropError as BaseError).shortMessage ||
                  airdropError.message}
              </div>
            )}
            <button
              className="bg-blue-500 rounded-md px-5 h-10 w-auto"
              onClick={() => getAirdrop()}>
              {isPending ? "Minting..." : "Mint"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Mint;
