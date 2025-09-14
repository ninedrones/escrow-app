import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting Escrow contract deployment...");

  // Get the contract factory
  const Escrow = await ethers.getContractFactory("Escrow");

  // Base Sepolia addresses
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC
  const USDT_ADDRESS = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"; // Base Sepolia USDT
  
  // Chainlink price feeds on Base Sepolia
  const ETH_USD_FEED = "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
  const USDC_USD_FEED = "0x7c56eF3650A7e18d1bC2c0d8b8b0c8b8b0c8b8b0"; // Placeholder - needs actual address
  const USD_JPY_FEED = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"; // Placeholder - needs actual address

  console.log("📋 Deployment parameters:");
  console.log("  USDC Address:", USDC_ADDRESS);
  console.log("  USDT Address:", USDT_ADDRESS);
  console.log("  ETH/USD Feed:", ETH_USD_FEED);
  console.log("  USDC/USD Feed:", USDC_USD_FEED);
  console.log("  USD/JPY Feed:", USD_JPY_FEED);

  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const escrow = await Escrow.deploy(
    USDC_ADDRESS,
    USDT_ADDRESS,
    ETH_USD_FEED,
    USDC_USD_FEED,
    USD_JPY_FEED
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
    ethUsdFeed: ETH_USD_FEED,
    usdcUsdFeed: USDC_USD_FEED,
    usdJpyFeed: USD_JPY_FEED,
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
