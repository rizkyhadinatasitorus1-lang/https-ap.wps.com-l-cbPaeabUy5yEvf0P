const hre = require("hardhat");
require("dotenv").config();

// Ganti dengan address contract yang sudah di-deploy
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS || "";

async function main() {
  if (!TOKEN_ADDRESS) {
    console.error("❌ TOKEN_ADDRESS tidak ditemukan di .env");
    process.exit(1);
  }

  const [owner] = await hre.ethers.getSigners();
  console.log(`👤 Owner: ${owner.address}`);

  // Get contract instance
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = MyToken.attach(TOKEN_ADDRESS);

  console.log(`\n📋 Interacting dengan token: ${TOKEN_ADDRESS}\n`);

  // 1. Get basic info
  console.log("=== Basic Information ===");
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();

  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Total Supply: ${hre.ethers.formatUnits(totalSupply, decimals)}`);

  // 2. Get owner balance
  console.log("\n=== Owner Balance ===");
  const ownerBalance = await token.balanceOf(owner.address);
  console.log(`${owner.address}: ${hre.ethers.formatUnits(ownerBalance, decimals)} ${symbol}`);

  // 3. Check if paused
  console.log("\n=== Status ===");
  const isPaused = await token.paused();
  console.log(`Is Paused: ${isPaused ? "✅ Yes" : "❌ No"}`);

  // 4. Get owner
  console.log("\n=== Owner ===");
  const contractOwner = await token.owner();
  console.log(`Contract Owner: ${contractOwner}`);
  console.log(`Is Current Signer Owner: ${contractOwner.toLowerCase() === owner.address.toLowerCase() ? "✅ Yes" : "❌ No"}`);

  console.log("\n✅ Interaction selesai!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
