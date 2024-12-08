import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { IDOPoolDetails, IDOTime, IDOType } from "./utils/types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AoiFactory,
  AoiRouter,
  IDOPool,
  MockERC20,
  WETH,
  IIDOPoolState,
} from "../../typechain-types";

describe("IDOPool contract - Private sale - Whitelisted", function () {
  let whitelistedAddresses: any[] = [];
  let whitelistedSigner: HardhatEthersSigner[] = [];
  const MIN_DELAY_STARTING = 10 * 60;
  const EMPTY_MERKLE_ROOT =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  let signers: HardhatEthersSigner[],
    poolDetail: IDOPoolDetails,
    poolTime: IDOTime,
    whitelistedRoot: string,
    merkleTree: any;

  async function whitelisted() {
    // Prepare the whitelisted address
    const address = [["0xa"], ["0xb"], ["0xc"], ["0xa"]];
    // Set up merkle tree
    const tree = StandardMerkleTree.of(address, ["address"]);
    // Generate root
    const root = tree.root;
    // Generate proof for each whitelisted address
    let proofs: any[] = [];
    for (const [i, v] of tree.entries()) {
      proofs.push(tree.getProof(i));
    }
  }

  async function IDOPoolFixture() {
    signers = await ethers.getSigners();
    // for (let i = 5; i <= 10; i++) {
    //   whitelistedAddresses.push([signers[i].address]);
    //   whitelistedSigner.push(signers[i]);
    // }
    whitelistedAddresses = [
      ["0x2abAbea544e1729d8955644e5a74bD106e5aB3e7"],
      ["0xda64bb5e5601f3c37880272607e5909D44B09841"],
      ["0x6BFF88BDdbd65B72a9A67CE8df65070440f7C859"],
    ];
    // whitelistedSigner = [];
    for (const addr of whitelistedAddresses) {
      const signer = await ethers.getImpersonatedSigner(addr[0]);
      await signers[0].sendTransaction({
        to: signer.address,
        value: ethers.parseEther("10"),
      });
      whitelistedSigner.push(signer);
    }
    const weth = await ethers.deployContract("WETH");
    const aoiFactory = await ethers.deployContract("AoiFactory", [
      signers[0].address,
    ]);
    const aoiRouter = await ethers.deployContract("AoiRouter", [
      await weth.getAddress(),
      await aoiFactory.getAddress(),
    ]);
    const idoPool = await ethers.deployContract("IDOPool", [
      await weth.getAddress(),
      await aoiFactory.getAddress(),
      await aoiRouter.getAddress(),
    ]);
    const mockERC20 = await ethers.deployContract("MockERC20");

    poolDetail = {
      tokenAddress: await mockERC20.getAddress(),
      pricePerToken: ethers.parseEther("1"),
      raisedAmount: 0n,
      raisedTokenAmount: 0n,
      softCap: ethers.parseEther("5"),
      hardCap: ethers.parseEther("10"),
      minInvest: ethers.parseEther("0.01"),
      maxInvest: ethers.parseEther("0.5"),
      liquidityWETH9: ethers.parseEther("10"),
      liquidityToken: ethers.parseEther("100000"),
      privateSaleAmount: ethers.parseEther("5"),
    };
    const startTime = (await time.latest()) + MIN_DELAY_STARTING * 2;
    poolTime = {
      startTime: startTime,
      endTime: startTime + 24 * 60 * 60,
      startPublicSale: startTime + 12 * 60 * 60,
    };
    // Generate whitelisted root
    merkleTree = StandardMerkleTree.of(whitelistedAddresses, ["address"]);
    whitelistedRoot = merkleTree.root;
    console.log(whitelistedRoot);
    await idoPool.initialize(
      poolDetail,
      poolTime,
      signers[1].address,
      whitelistedRoot,
      true
    );
    return { idoPool, aoiFactory, aoiRouter, weth, mockERC20 };
  }

  it("Initialize successfully", async () => {
    const { idoPool } = await loadFixture(IDOPoolFixture);
    // Check the result after initializing
    expect(await idoPool.getPoolType()).equal(BigInt(IDOType.PRIVATE_SALE));
    expect(await idoPool.WHITELISTED()).equal(whitelistedRoot);
  });
  it("Register private sale", async () => {
    const { idoPool } = await loadFixture(IDOPoolFixture);
    const registers = [
      (await ethers.getSigners())[11],
      (await ethers.getSigners())[12],
    ];
    expect(await idoPool.registers(registers[0].address)).equal(false);
    await idoPool.connect(registers[0]).registerPrivatePool();
    expect(await idoPool.registers(registers[0].address)).equal(true);
    await expect(
      idoPool.connect(registers[0]).registerPrivatePool()
    ).to.be.revertedWithCustomError(idoPool, "InvestorAlreadyRegistered");

    // Skip time to invest
    await time.increaseTo(poolTime.startTime);

    await expect(
      idoPool.connect(registers[1]).registerPrivatePool()
    ).to.be.revertedWithCustomError(idoPool, "IDOIsNotStarted");
  });
  it("Registered Investment", async () => {
    const { idoPool } = await loadFixture(IDOPoolFixture);
    const registers = [
      (await ethers.getSigners())[11],
      (await ethers.getSigners())[12],
    ];
    expect(await idoPool.registers(registers[0].address)).equal(false);
    await idoPool.connect(registers[0]).registerPrivatePool();
    expect(await idoPool.registers(registers[0].address)).equal(true);
    await expect(
      idoPool.connect(registers[0]).registerPrivatePool()
    ).to.be.revertedWithCustomError(idoPool, "InvestorAlreadyRegistered");

    // Skip time to invest
    await time.increaseTo(poolTime.startTime);

    const investingAmount = poolDetail.maxInvest;
    await expect(
      await idoPool.connect(registers[0]).investPool([], {
        value: investingAmount,
      })
    ).to.not.be.reverted;
    const raisedAmount = await idoPool.getPoolRaisedAmount();
    expect(raisedAmount).equal(investingAmount);
    await expect(
      idoPool.connect(registers[1]).investPool([], {
        value: investingAmount,
      })
    ).to.be.revertedWithCustomError(idoPool, "IDOPoolIsPrivate");

    // Skip time to public sale
    await time.increaseTo(poolTime.startPublicSale);
    await expect(
      idoPool.connect(registers[1]).investPool([], {
        value: investingAmount,
      })
    ).to.not.be.reverted;
    expect(await idoPool.getPoolRaisedAmount()).equal(
      raisedAmount + investingAmount
    );
  });
  it.only("Whitelisted investment", async () => {
    const { idoPool } = await loadFixture(IDOPoolFixture);

    // Skip time to invest
    await time.increaseTo(poolTime.startTime);

    // generate proof
    const investingAmount = poolDetail.maxInvest;
    for (let index = 0; index < 3; index++) {
      let proof: any = null;
      for (const [i, v] of merkleTree.entries()) {
        if (v[0] === whitelistedAddresses[index][0]) {
          // (3)
          proof = merkleTree.getProof(i);
          console.log("Value:", v);
          console.log("Proof:", proof);
          break;
        }
      }
      const raisedAmount = await idoPool.getPoolRaisedAmount();
      await expect(
        await idoPool.connect(whitelistedSigner[index]).investPool(proof, {
          value: investingAmount,
        })
      ).to.not.be.reverted;
      expect(await idoPool.getPoolRaisedAmount()).equal(
        raisedAmount + investingAmount
      );
    }
  });
});
