import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export const demoAddresses = [
  "0xda64bb5e5601f3c37880272607e5909D44B09841",
  "0x2abAbea544e1729d8955644e5a74bD106e5aB3e7",
  "0x6BFF88BDdbd65B72a9A67CE8df65070440f7C859"
]

export const EMPTY_MERKLE_ROOT =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const generateMerkleTreeFromAddressList = (addresses: string[]) => {
  const treeInput = addresses.map((address) => [address]);
  const tree = StandardMerkleTree.of(treeInput, ["address"]);

  return tree;
}

export const getWhitelistMerkleTreeRoot = (tree: StandardMerkleTree<string[]>) => {
  return tree.root;
}

export const getWhitelistProofs = (tree: StandardMerkleTree<string[]>) => {
  let proofs: any[] = [];
  for (const [i, v] of tree.entries()) {
    proofs.push({
      Value: v,
      Proof: tree.getProof(i)
    });
  }

  return proofs;
}