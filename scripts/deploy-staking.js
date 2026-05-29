const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Mulai deployment staking contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploy dengan account: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  // Token address (ganti dengan address token yang sudah di-deploy)
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "";

  if (!TOKEN_ADDRESS) {
    console.error("❌ TOKEN_ADDRESS tidak ditemukan di .env");
    console.error("   Silakan set TOKEN_ADDRESS dengan address token yang sudah di-deploy");
    process.exit(1);
  }

  // Deploy TokenStaking
  console.log("\n📦 Deploying TokenStaking...");
  const TokenStaking = await hre.ethers.getContractFactory("TokenStaking");
  const staking = await TokenStaking.deploy(TOKEN_ADDRESS);

  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();

  console.log(`✅ TokenStaking deployed ke: ${stakingAddress}`);

  // Get staking configuration
  const stats = await staking.getStakingStats();
  console.log(`\n📋 Staking Configuration:`);
  console.log(`   Reward Rate: ${stats.currentRewardRate}% APY`);
  console.log(`   Lock Period: ${Number(stats.lockPeriodSeconds) / 86400} days`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    tokenAddress: TOKEN_ADDRESS,
    stakingAddress: stakingAddress,
    timestamp: new Date().toISOString(),
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions
  console.log("\n📌 Next Steps:");
  console.log(`1. Save staking address: ${stakingAddress}`);
  console.log(`2. Transfer reward tokens to staking contract`);
  console.log(`3. Update TOKEN_ADDRESS in .env to deploy staking`);
  console.log(`4. Users can now stake tokens!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
