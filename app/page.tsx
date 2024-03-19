"use client";
import Mint from "@/components/Mint";
import NotConnected from "@/components/NotConnected";
import Image from "next/image";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <main className="w-full h-full p-7 text-center justify-center">
      <h2 className="my-10 font-bold italic text-lime-300">This is MerkleTree and ERC20 Airdrop Test.</h2>
      {isConnected ? <Mint /> : <NotConnected />}
    </main>
  );
}
