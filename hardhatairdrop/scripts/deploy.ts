import { ethers } from "hardhat";

// Types
import { OmegayonERC20 } from "../typechain-types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

// Whitelisted addresses
import { whitelisted } from "../utils/whitelisted";

async function main() {
  
  let contract: OmegayonERC20;
  let merkleTree: StandardMerkleTree<string[]>
  merkleTree = StandardMerkleTree.of(whitelisted, ["address"], { sortLeaves: true });

  const [owner] = await ethers.getSigners();
  contract = await ethers.deployContract("OmegayonERC20", [owner.address, merkleTree.root]);

  await contract.waitForDeployment();

  console.log(
    `OmegayonERC20 deployed to ${contract.target} with merkleRoot ${merkleTree.root}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});