import { expect } from "chai";
import { ethers } from "hardhat";
import { Escrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Escrow", function () {
  let escrow: Escrow;
  let owner: SignerWithAddress;
  let maker: SignerWithAddress;
  let taker: SignerWithAddress;
  let other: SignerWithAddress;

  // Mock addresses for testing
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const USDT_ADDRESS = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb";
  const ETH_USD_FEED = "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
  const USDC_USD_FEED = "0x7c56eF3650A7e18d1bC2c0d8b8b0c8b8b0c8b8b0";
  const USD_JPY_FEED = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";

  beforeEach(async function () {
    [owner, maker, taker, other] = await ethers.getSigners();

    const EscrowFactory = await ethers.getContractFactory("Escrow");
    escrow = await EscrowFactory.deploy(
      USDC_ADDRESS,
      USDT_ADDRESS,
      ETH_USD_FEED,
      USDC_USD_FEED,
      USD_JPY_FEED
    );
    await escrow.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await escrow.owner()).to.equal(owner.address);
    });

    it("Should set the correct constants", async function () {
      expect(await escrow.MIN_JPY_AMOUNT()).to.equal(1000);
      expect(await escrow.MAX_USD_CAP()).to.equal(5000 * 1e8);
      expect(await escrow.DEFAULT_DEADLINE_DURATION()).to.equal(30 * 60);
      expect(await escrow.MAX_DEADLINE_DURATION()).to.equal(24 * 60 * 60);
    });

    it("Should set the correct token addresses", async function () {
      expect(await escrow.USDC_ADDRESS()).to.equal(USDC_ADDRESS);
      expect(await escrow.USDT_ADDRESS()).to.equal(USDT_ADDRESS);
    });
  });

  describe("createEscrow", function () {
    it("Should create escrow with valid parameters", async function () {
      const jpyAmount = 1000;
      const deadlineDuration = 60 * 60; // 1 hour
      const otcCode = "test-otc-123";

      await expect(
        escrow.createEscrow(
          taker.address,
          ethers.ZeroAddress, // ETH
          jpyAmount,
          deadlineDuration,
          otcCode,
          { value: ethers.parseEther("0.001") } // Small ETH amount for testing
        )
      ).to.emit(escrow, "EscrowCreated");
    });

    it("Should reject invalid JPY amount (not multiple of 1000)", async function () {
      const jpyAmount = 1500; // Not multiple of 1000
      const deadlineDuration = 60 * 60;
      const otcCode = "test-otc-123";

      await expect(
        escrow.createEscrow(
          taker.address,
          ethers.ZeroAddress,
          jpyAmount,
          deadlineDuration,
          otcCode,
          { value: ethers.parseEther("0.001") }
        )
      ).to.be.revertedWithCustomError(escrow, "InvalidJPYAmount");
    });

    it("Should reject invalid JPY amount (below minimum)", async function () {
      const jpyAmount = 500; // Below minimum
      const deadlineDuration = 60 * 60;
      const otcCode = "test-otc-123";

      await expect(
        escrow.createEscrow(
          taker.address,
          ethers.ZeroAddress,
          jpyAmount,
          deadlineDuration,
          otcCode,
          { value: ethers.parseEther("0.001") }
        )
      ).to.be.revertedWithCustomError(escrow, "InvalidJPYAmount");
    });

    it("Should reject invalid deadline duration", async function () {
      const jpyAmount = 1000;
      const deadlineDuration = 25 * 60 * 60; // 25 hours (exceeds max)
      const otcCode = "test-otc-123";

      await expect(
        escrow.createEscrow(
          taker.address,
          ethers.ZeroAddress,
          jpyAmount,
          deadlineDuration,
          otcCode,
          { value: ethers.parseEther("0.001") }
        )
      ).to.be.revertedWithCustomError(escrow, "InvalidDeadline");
    });

    it("Should reject invalid asset", async function () {
      const jpyAmount = 1000;
      const deadlineDuration = 60 * 60;
      const otcCode = "test-otc-123";
      const invalidAsset = other.address; // Invalid asset address

      await expect(
        escrow.createEscrow(
          taker.address,
          invalidAsset,
          jpyAmount,
          deadlineDuration,
          otcCode,
          { value: ethers.parseEther("0.001") }
        )
      ).to.be.revertedWithCustomError(escrow, "InvalidAsset");
    });
  });

  describe("release", function () {
    let escrowId: number;
    const jpyAmount = 1000;
    const deadlineDuration = 60 * 60;
    const otcCode = "test-otc-123";

    beforeEach(async function () {
      // Create an escrow
      const tx = await escrow.connect(maker).createEscrow(
        taker.address,
        ethers.ZeroAddress, // ETH
        jpyAmount,
        deadlineDuration,
        otcCode,
        { value: ethers.parseEther("0.001") }
      );
      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log: any) => log.fragment?.name === "EscrowCreated"
      );
      escrowId = event?.args?.id;
    });

    it("Should release escrow with correct OTC code", async function () {
      await expect(
        escrow.connect(maker).release(escrowId, otcCode)
      ).to.emit(escrow, "EscrowReleased");
    });

    it("Should reject release with incorrect OTC code", async function () {
      const wrongOtcCode = "wrong-otc-code";

      await expect(
        escrow.connect(maker).release(escrowId, wrongOtcCode)
      ).to.be.revertedWithCustomError(escrow, "InvalidOTC");
    });

    it("Should reject release by non-maker", async function () {
      await expect(
        escrow.connect(other).release(escrowId, otcCode)
      ).to.be.revertedWithCustomError(escrow, "OnlyMaker");
    });

    it("Should reject release of non-existent escrow", async function () {
      const nonExistentId = 999;

      await expect(
        escrow.connect(maker).release(nonExistentId, otcCode)
      ).to.be.revertedWithCustomError(escrow, "EscrowNotFound");
    });
  });

  describe("refund", function () {
    let escrowId: number;
    const jpyAmount = 1000;
    const deadlineDuration = 1; // 1 second for testing
    const otcCode = "test-otc-123";

    beforeEach(async function () {
      // Create an escrow with short deadline
      const tx = await escrow.connect(maker).createEscrow(
        taker.address,
        ethers.ZeroAddress, // ETH
        jpyAmount,
        deadlineDuration,
        otcCode,
        { value: ethers.parseEther("0.001") }
      );
      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log: any) => log.fragment?.name === "EscrowCreated"
      );
      escrowId = event?.args?.id;
    });

    it("Should refund after deadline", async function () {
      // Wait for deadline to pass
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        escrow.connect(maker).refund(escrowId)
      ).to.emit(escrow, "EscrowRefunded");
    });

    it("Should reject refund before deadline", async function () {
      await expect(
        escrow.connect(maker).refund(escrowId)
      ).to.be.revertedWithCustomError(escrow, "DeadlineNotReached");
    });

    it("Should reject refund by non-maker", async function () {
      // Wait for deadline to pass
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        escrow.connect(other).refund(escrowId)
      ).to.be.revertedWithCustomError(escrow, "OnlyMaker");
    });
  });

  describe("View functions", function () {
    let escrowId: number;
    const jpyAmount = 1000;
    const deadlineDuration = 60 * 60;
    const otcCode = "test-otc-123";

    beforeEach(async function () {
      // Create an escrow
      const tx = await escrow.connect(maker).createEscrow(
        taker.address,
        ethers.ZeroAddress, // ETH
        jpyAmount,
        deadlineDuration,
        otcCode,
        { value: ethers.parseEther("0.001") }
      );
      const receipt = await tx.wait();
      const event = receipt?.logs.find(
        (log: any) => log.fragment?.name === "EscrowCreated"
      );
      escrowId = event?.args?.id;
    });

    it("Should return correct escrow data", async function () {
      const escrowData = await escrow.getEscrow(escrowId);

      expect(escrowData.id).to.equal(escrowId);
      expect(escrowData.maker).to.equal(maker.address);
      expect(escrowData.taker).to.equal(taker.address);
      expect(escrowData.asset).to.equal(ethers.ZeroAddress);
      expect(escrowData.jpyAmount).to.equal(jpyAmount);
      expect(escrowData.isReleased).to.be.false;
      expect(escrowData.isRefunded).to.be.false;
    });

    it("Should return maker's escrow IDs", async function () {
      const makerEscrows = await escrow.getMakerEscrows(maker.address);

      expect(makerEscrows).to.include(escrowId);
    });

    it("Should return correct refund availability", async function () {
      const isRefundAvailable = await escrow.isRefundAvailable(escrowId);
      expect(isRefundAvailable).to.be.false; // Not yet past deadline

      // Wait for deadline to pass
      await ethers.provider.send("evm_increaseTime", [deadlineDuration + 1]);
      await ethers.provider.send("evm_mine", []);

      const isRefundAvailableAfter = await escrow.isRefundAvailable(escrowId);
      expect(isRefundAvailableAfter).to.be.true;
    });

    it("Should return correct time until refund", async function () {
      const timeUntilRefund = await escrow.getTimeUntilRefund(escrowId);
      expect(timeUntilRefund).to.be.greaterThan(0);
      expect(timeUntilRefund).to.be.lessThanOrEqual(deadlineDuration);
    });
  });
});
