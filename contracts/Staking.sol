// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TokenStaking
 * @dev Staking contract untuk MyToken dengan reward mechanism
 */
contract TokenStaking is Ownable, ReentrancyGuard {
    IERC20 public token;
    
    // Staking configuration
    uint256 public rewardRate = 10; // 10% APY
    uint256 public minStakeAmount = 1e18; // 1 token minimum
    uint256 public maxStakeAmount = 1000000e18; // 1M token maximum
    uint256 public lockPeriod = 7 days; // 7 days lock period
    
    // User staking data
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardTime;
        uint256 totalRewardsClaimed;
    }
    
    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public hasStaked;
    
    uint256 public totalStaked;
    uint256 public totalRewardsDistributed;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    event LockPeriodUpdated(uint256 newPeriod);
    
    /**
     * @dev Constructor
     * @param tokenAddress Address of MyToken contract
     */
    constructor(address tokenAddress) Ownable(msg.sender) {
        require(tokenAddress != address(0), "Invalid token address");
        token = IERC20(tokenAddress);
    }
    
    /**
     * @dev Stake tokens
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount >= minStakeAmount, "Amount below minimum stake");
        require(amount <= maxStakeAmount, "Amount exceeds maximum stake");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim existing rewards first
        if (hasStaked[msg.sender]) {
            claimReward();
        }
        
        // Transfer tokens to contract
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        // Update staking info
        StakeInfo storage stakeInfo = stakes[msg.sender];
        stakeInfo.amount += amount;
        stakeInfo.startTime = block.timestamp;
        stakeInfo.lastRewardTime = block.timestamp;
        hasStaked[msg.sender] = true;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        require(hasStaked[msg.sender], "No staking position");
        
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.amount >= amount, "Amount exceeds staked balance");
        
        // Check lock period
        uint256 stakingDuration = block.timestamp - stakeInfo.startTime;
        require(stakingDuration >= lockPeriod, "Tokens still locked");
        
        // Claim rewards first
        claimReward();
        
        // Update staking info
        stakeInfo.amount -= amount;
        if (stakeInfo.amount == 0) {
            hasStaked[msg.sender] = false;
        }
        
        totalStaked -= amount;
        
        // Transfer tokens back to user
        require(token.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Calculate pending rewards
     * @param user User address\n     */\n    function calculateRewards(address user) public view returns (uint256) {\n        if (!hasStaked[user]) {\n            return 0;\n        }\n        \n        StakeInfo storage stakeInfo = stakes[user];\n        uint256 stakingDuration = block.timestamp - stakeInfo.lastRewardTime;\n        \n        // Calculate rewards: (amount * rewardRate * duration) / (365 days * 100)\n        uint256 rewards = (stakeInfo.amount * rewardRate * stakingDuration) / \n                         (365 days * 100);\n        \n        return rewards;\n    }\n    \n    /**\n     * @dev Claim rewards\n     */\n    function claimReward() public nonReentrant {\n        require(hasStaked[msg.sender], \"No staking position\");\n        \n        uint256 rewards = calculateRewards(msg.sender);\n        require(rewards > 0, \"No rewards available\");\n        \n        StakeInfo storage stakeInfo = stakes[msg.sender];\n        stakeInfo.lastRewardTime = block.timestamp;\n        stakeInfo.totalRewardsClaimed += rewards;\n        \n        totalRewardsDistributed += rewards;\n        \n        // Transfer rewards to user\n        require(token.transfer(msg.sender, rewards), \"Transfer failed\");\n        \n        emit RewardClaimed(msg.sender, rewards);\n    }\n    \n    /**\n     * @dev Get user staking info\n     * @param user User address\n     */\n    function getStakeInfo(address user) external view returns (\n        uint256 amount,\n        uint256 startTime,\n        uint256 pendingRewards,\n        uint256 totalRewardsClaimed,\n        bool locked\n    ) {\n        StakeInfo storage stakeInfo = stakes[user];\n        uint256 stakingDuration = block.timestamp - stakeInfo.startTime;\n        bool isLocked = stakingDuration < lockPeriod && stakeInfo.amount > 0;\n        \n        return (\n            stakeInfo.amount,\n            stakeInfo.startTime,\n            calculateRewards(user),\n            stakeInfo.totalRewardsClaimed,\n            isLocked\n        );\n    }\n    \n    /**\n     * @dev Update reward rate (only owner)\n     * @param newRate New reward rate\n     */\n    function setRewardRate(uint256 newRate) external onlyOwner {\n        require(newRate <= 100, \"Rate cannot exceed 100%\");\n        rewardRate = newRate;\n        emit RewardRateUpdated(newRate);\n    }\n    \n    /**\n     * @dev Update lock period (only owner)\n     * @param newPeriod New lock period in seconds\n     */\n    function setLockPeriod(uint256 newPeriod) external onlyOwner {\n        lockPeriod = newPeriod;\n        emit LockPeriodUpdated(newPeriod);\n    }\n    \n    /**\n     * @dev Update minimum stake amount\n     * @param newAmount New minimum amount\n     */\n    function setMinStakeAmount(uint256 newAmount) external onlyOwner {\n        minStakeAmount = newAmount;\n    }\n    \n    /**\n     * @dev Update maximum stake amount\n     * @param newAmount New maximum amount\n     */\n    function setMaxStakeAmount(uint256 newAmount) external onlyOwner {\n        maxStakeAmount = newAmount;\n    }\n    \n    /**\n     * @dev Get total staking stats\n     */\n    function getStakingStats() external view returns (\n        uint256 totalStakedAmount,\n        uint256 totalDistributedRewards,\n        uint256 currentRewardRate,\n        uint256 lockPeriodSeconds\n    ) {\n        return (\n            totalStaked,\n            totalRewardsDistributed,\n            rewardRate,\n            lockPeriod\n        );\n    }\n}\n