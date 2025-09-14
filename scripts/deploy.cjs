const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Escrow contract deployment...");

  // Get the contract factory
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available. Please check your private key configuration.");
  }
  
  const deployer = signers[0];
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const Escrow = await ethers.getContractFactory("Escrow");

  // Base Sepolia addresses
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC
  const USDT_ADDRESS = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"; // Base Sepolia USDT
  
  // Price feeds removed - using CoinMarketCap API in frontend

  console.log("📋 Deployment parameters:");
  console.log("  USDC Address:", USDC_ADDRESS);
  console.log("  USDT Address:", USDT_ADDRESS);
  console.log("  Price Source: CoinMarketCap API (frontend)");

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const escrow = await Escrow.deploy(
    USDC_ADDRESS,
    USDT_ADDRESS
  );

  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();
  console.log("✅ Escrow contract deployed successfully!");
  console.log("📍 Contract Address:", escrowAddress);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const owner = await escrow.owner();
  const minJpyAmount = await escrow.MIN_JPY_AMOUNT();
  const maxUsdCap = await escrow.MAX_USD_CAP();
  const defaultDeadline = await escrow.DEFAULT_DEADLINE_DURATION();

  console.log("📊 Contract verification:");
  console.log("  Owner:", owner);
  console.log("  Min JPY Amount:", minJpyAmount.toString());
  console.log("  Max USD Cap:", maxUsdCap.toString());
  console.log("  Default Deadline:", defaultDeadline.toString());

  // Save deployment info
  const deploymentInfo = {
    network: "baseSepolia",
    contractAddress: escrowAddress,
    usdcAddress: USDC_ADDRESS,
    usdtAddress: USDT_ADDRESS,
    priceSource: "CoinMarketCap API (frontend)",
    deployedAt: new Date().toISOString(),
    deployer: owner
  };

  console.log("💾 Deployment info saved:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("🎉 Deployment completed successfully!");
  console.log("📝 Next steps:");
  console.log("  1. Update .env.local with contract address");
  console.log("  2. Verify contract on BaseScan");
  console.log("  3. Test contract functions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
