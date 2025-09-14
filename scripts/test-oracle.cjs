const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing Base Sepolia Chainlink Oracle...");

  // Base Sepolia ETH/USD feed address
  const ETH_USD_FEED = "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
  
  try {
    // Create interface for Chainlink feed
    const priceFeed = new ethers.Contract(
      ETH_USD_FEED,
      [
        "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)"
      ],
      ethers.provider
    );

    console.log("📡 Fetching price from Chainlink feed...");
    console.log("Feed Address:", ETH_USD_FEED);
    
    const roundData = await priceFeed.latestRoundData();
    console.log("✅ Price data retrieved successfully!");
    console.log("Round ID:", roundData.roundId.toString());
    console.log("ETH/USD Price:", ethers.formatUnits(roundData.answer, 8), "USD");
    console.log("Started At:", new Date(Number(roundData.startedAt) * 1000).toISOString());
    console.log("Updated At:", new Date(Number(roundData.updatedAt) * 1000).toISOString());
    console.log("Answered In Round:", roundData.answeredInRound.toString());
    
    // Test with our fixed USD/JPY rate
    const USD_JPY_RATE = 1475n * 10n**5n; // 147.5 in 8 decimals
    const jpyAmount = 10000n; // ¥10,000
    const usdAmount = (jpyAmount * 10n**8n) / USD_JPY_RATE;
    const ethPrice = Number(ethers.formatUnits(roundData.answer, 8));
    const ethPriceWei = ethers.parseUnits(ethPrice.toString(), 8);
    const requiredEth = (usdAmount * 10n**18n) / BigInt(ethPriceWei);
    
    // Correct BigInt calculation with proper precision
    const jpyAmountCorrect = 10000n * 10n**8n; // ¥10,000 in 8 decimals
    const usdAmountCorrect = jpyAmountCorrect / USD_JPY_RATE;
    const requiredEthCorrect = (usdAmountCorrect * 10n**18n) / BigInt(ethPriceWei);
    
    // Manual calculation for verification
    const jpyAmountNum = 10000;
    const usdAmountNum = jpyAmountNum / 147.5;
    const ethAmountNum = usdAmountNum / ethPrice;
    
    console.log("\n💰 Price calculation test:");
    console.log("JPY Amount:", jpyAmount, "¥");
    console.log("USD Amount (BigInt):", ethers.formatUnits(usdAmount, 8), "USD");
    console.log("USD Amount (Correct):", ethers.formatUnits(usdAmountCorrect, 8), "USD");
    console.log("USD Amount (Manual):", usdAmountNum.toFixed(2), "USD");
    console.log("ETH Price:", ethPrice, "USD");
    console.log("Required ETH (BigInt):", ethers.formatEther(requiredEth), "ETH");
    console.log("Required ETH (Correct):", ethers.formatEther(requiredEthCorrect), "ETH");
    console.log("Required ETH (Manual):", ethAmountNum.toFixed(6), "ETH");
    
  } catch (error) {
    console.error("❌ Error fetching price data:", error.message);
    console.log("\n🔧 Fallback: Using mock price feeds for testing");
    
    // Deploy mock price feed as fallback
    const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    const mockFeed = await MockPriceFeed.deploy(ethers.parseUnits("3000", 8)); // $3000 ETH
    await mockFeed.waitForDeployment();
    
    const mockAddress = await mockFeed.getAddress();
    console.log("Mock Feed Address:", mockAddress);
    
    const mockData = await mockFeed.latestRoundData();
    console.log("Mock ETH/USD Price:", ethers.formatUnits(mockData.answer, 8), "USD");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
