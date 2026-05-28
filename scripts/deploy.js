const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Mulai deployment contract...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploy dengan account: ${deployer.address}`);

  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  // Initial supply (1 juta token dengan 18 decimals)
  const initialSupply = 1000000;

  // Deploy MyToken
  console.log("\n📦 Deploying MyToken...");
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply);

  await myToken.waitForDeployment();
  const tokenAddress = await myToken.getAddress();

  console.log(`✅ MyToken deployed ke: ${tokenAddress}`);
  console.log(`📊 Initial supply: ${initialSupply} tokens`);

  // Get token info
  const name = await myToken.name();
  const symbol = await myToken.symbol();
  const totalSupply = await myToken.totalSupply();
  const decimals = await myToken.decimals();

  console.log(`\n📋 Token Information:`);
  console.log(`   Name: ${name}`);
  console.log(`   Symbol: ${symbol}`);
  console.log(`   Decimals: ${decimals}`);
  console.log(`   Total Supply: ${hre.ethers.formatUnits(totalSupply, decimals)} ${symbol}`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    tokenAddress: tokenAddress,
    tokenName: name,
    tokenSymbol: symbol,
    initialSupply: initialSupply,
    timestamp: new Date().toISOString(),
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for verification
  console.log("\n📌 Untuk verify contract di Etherscan:");
  console.log(
    `npx hardhat verify --network ${hre.network.name} ${tokenAddress} "${initialSupply}"`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
