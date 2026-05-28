const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let myToken;
  let owner;
  let addr1;
  let addr2;
  const INITIAL_SUPPLY = 1000000;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy(INITIAL_SUPPLY);
    await myToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await myToken.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      const totalSupply = await myToken.totalSupply();
      expect(ownerBalance).to.equal(totalSupply);
    });

    it("Should have correct token properties", async function () {
      expect(await myToken.name()).to.equal("MyToken");
      expect(await myToken.symbol()).to.equal("MTK");
      expect(await myToken.decimals()).to.equal(18);
    });
  });

  describe("Transfer", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      await myToken.transfer(addr1.address, transferAmount);
      expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const balanceOfAddr1 = await myToken.balanceOf(addr1.address);
      const transferAmount = ethers.parseUnits("1", 18);

      await expect(
        myToken.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");
    });
  });

  describe("Pause", function () {
    it("Should pause transfers by owner", async function () {
      await myToken.pause();
      expect(await myToken.paused()).to.be.true;

      const transferAmount = ethers.parseUnits("100", 18);
      await expect(
        myToken.transfer(addr1.address, transferAmount)
      ).to.be.revertedWithCustomError(myToken, "EnforcedPause");
    });

    it("Should unpause transfers by owner", async function () {
      await myToken.pause();
      expect(await myToken.paused()).to.be.true;

      await myToken.unpause();
      expect(await myToken.paused()).to.be.false;

      const transferAmount = ethers.parseUnits("100", 18);
      await myToken.transfer(addr1.address, transferAmount);
      expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should prevent non-owner from pausing", async function () {
      await expect(myToken.connect(addr1).pause()).to.be.revertedWithCustomError(
        myToken,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Mint", function () {
    it("Should mint new tokens by owner", async function () {
      const mintAmount = ethers.parseUnits("500", 18);
      await myToken.mint(addr1.address, mintAmount);
      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should prevent non-owner from minting", async function () {
      const mintAmount = ethers.parseUnits("100", 18);
      await expect(
        myToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.revertedWithCustomError(myToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burn", function () {
    it("Should burn tokens", async function () {
      const burnAmount = ethers.parseUnits("100", 18);
      await myToken.burn(burnAmount);
      
      const totalSupply = await myToken.totalSupply();
      const expectedSupply = ethers.parseUnits(INITIAL_SUPPLY.toString(), 18) - burnAmount;
      expect(totalSupply).to.equal(expectedSupply);
    });

    it("Should burn tokens from specified account by owner", async function () {
      const transferAmount = ethers.parseUnits("500", 18);
      await myToken.transfer(addr1.address, transferAmount);

      const burnAmount = ethers.parseUnits("100", 18);
      await myToken.burnFrom(addr1.address, burnAmount);

      const balanceAfterBurn = ethers.parseUnits("500", 18) - burnAmount;
      expect(await myToken.balanceOf(addr1.address)).to.equal(balanceAfterBurn);
    });
  });

  describe("Allowance & Approve", function () {
    it("Should approve tokens for spending", async function () {
      const approveAmount = ethers.parseUnits("100", 18);
      await myToken.approve(addr1.address, approveAmount);
      
      const allowance = await myToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(approveAmount);
    });

    it("Should transfer approved tokens", async function () {
      const approveAmount = ethers.parseUnits("100", 18);
      await myToken.approve(addr1.address, approveAmount);

      await myToken
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, approveAmount);
      
      expect(await myToken.balanceOf(addr2.address)).to.equal(approveAmount);
    });
  });
});
