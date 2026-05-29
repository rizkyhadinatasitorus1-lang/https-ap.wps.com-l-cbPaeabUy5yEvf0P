const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenStaking", function () {
  let myToken;
  let staking;
  let owner;
  let addr1;
  let addr2;
  const INITIAL_SUPPLY = 1000000;
  const STAKE_AMOUNT = ethers.parseUnits("1000", 18);
  const REWARD_RATE = 10; // 10% APY

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy MyToken
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(INITIAL_SUPPLY);
    await myToken.waitForDeployment();

    // Deploy TokenStaking
    const TokenStaking = await ethers.getContractFactory("TokenStaking");
    staking = await TokenStaking.deploy(await myToken.getAddress());
    await staking.waitForDeployment();

    // Transfer tokens to addr1
    await myToken.transfer(
      addr1.address,
      ethers.parseUnits("50000", 18)
    );

    // Approve staking contract
    await myToken.connect(addr1).approve(
      await staking.getAddress(),
      ethers.parseUnits("50000", 18)
    );
  });

  describe("Staking", function () {
    it("Should stake tokens", async function () {
      await staking.connect(addr1).stake(STAKE_AMOUNT);
      const stakeInfo = await staking.getStakeInfo(addr1.address);
      expect(stakeInfo.amount).to.equal(STAKE_AMOUNT);
    });

    it("Should reject stake below minimum", async function () {
      const tooSmallAmount = ethers.parseUnits("0.5", 18);
      await expect(
        staking.connect(addr1).stake(tooSmallAmount)
      ).to.be.revertedWith("Amount below minimum stake");
    });

    it("Should reject stake exceeding maximum", async function () {
      const tooLargeAmount = ethers.parseUnits("2000000", 18);
      await expect(
        staking.connect(addr1).stake(tooLargeAmount)
      ).to.be.revertedWith("Amount exceeds maximum stake");
    });

    it("Should increase total staked", async function () {
      await staking.connect(addr1).stake(STAKE_AMOUNT);
      const stats = await staking.getStakingStats();
      expect(stats.totalStakedAmount).to.equal(STAKE_AMOUNT);
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      await staking.connect(addr1).stake(STAKE_AMOUNT);
    });

    it("Should not allow unstaking before lock period", async function () {
      await expect(
        staking.connect(addr1).unstake(STAKE_AMOUNT)
      ).to.be.revertedWith("Tokens still locked");
    });

    it("Should allow unstaking after lock period", async function () {
      // Wait 7 days
      await ethers.provider.send("hardhat_mine", ["0x15180"]); // ~7 days in blocks
      
      const initialBalance = await myToken.balanceOf(addr1.address);
      await staking.connect(addr1).unstake(STAKE_AMOUNT);
      
      const finalBalance = await myToken.balanceOf(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Rewards", function () {
    beforeEach(async function () {
      await staking.connect(addr1).stake(STAKE_AMOUNT);
    });

    it("Should calculate rewards", async function () {
      // Wait some time
      await ethers.provider.send("hardhat_mine", ["100"]);
      
      const rewards = await staking.calculateRewards(addr1.address);
      expect(rewards).to.be.gt(0);
    });

    it("Should claim rewards", async function () {
      // Wait some time
      await ethers.provider.send("hardhat_mine", ["1000"]);
      
      const initialBalance = await myToken.balanceOf(addr1.address);
      const rewards = await staking.calculateRewards(addr1.address);
      
      await staking.connect(addr1).claimReward();
      
      const finalBalance = await myToken.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance + rewards);
    });
  });

  describe("Configuration", function () {
    it("Should update reward rate", async function () {
      await staking.setRewardRate(15);
      const stats = await staking.getStakingStats();
      expect(stats.currentRewardRate).to.equal(15);
    });

    it("Should not allow invalid reward rate", async function () {
      await expect(
        staking.setRewardRate(150)
      ).to.be.revertedWith("Rate cannot exceed 100%");
    });
  });
});
