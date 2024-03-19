import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="flex justify-between p-7 border-b-2">
      <h1 className="font-bold text-xl">Omegayon ERC20 Rainbow & Wagmi</h1>
      
      <ConnectButton />
    </div>
  );
};

export default Navbar;
