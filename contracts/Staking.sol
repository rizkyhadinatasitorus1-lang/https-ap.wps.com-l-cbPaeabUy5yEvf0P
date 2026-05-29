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
     * @param user User address
     */
    function calculateRewards(address user) public view returns (uint256) {
        if (!hasStaked[user]) {
            return 0;
        }
        
        StakeInfo storage stakeInfo = stakes[user];
        uint256 stakingDuration = block.timestamp - stakeInfo.lastRewardTime;
        
        // Calculate rewards: (amount * rewardRate * duration) / (365 days * 100)
        uint256 rewards = (stakeInfo.amount * rewardRate * stakingDuration) / 
                         (365 days * 100);
        
        return rewards;
    }
    
    /**
     * @dev Claim rewards
     */
    function claimReward() public nonReentrant {
        require(hasStaked[msg.sender], "No staking position");
        
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards available");
        
        StakeInfo storage stakeInfo = stakes[msg.sender];
        stakeInfo.lastRewardTime = block.timestamp;
        stakeInfo.totalRewardsClaimed += rewards;
        
        totalRewardsDistributed += rewards;
        
        // Transfer rewards to user
        require(token.transfer(msg.sender, rewards), "Transfer failed");
        
        emit RewardClaimed(msg.sender, rewards);
    }
    
    /**
     * @dev Get user staking info
     * @param user User address
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 pendingRewards,
        uint256 totalRewardsClaimed,
        bool locked
    ) {
        StakeInfo storage stakeInfo = stakes[user];
        uint256 stakingDuration = block.timestamp - stakeInfo.startTime;
        bool isLocked = stakingDuration < lockPeriod && stakeInfo.amount > 0;
        
        return (
            stakeInfo.amount,
            stakeInfo.startTime,
            calculateRewards(user),
            stakeInfo.totalRewardsClaimed,
            isLocked
        );
    }
    
    /**
     * @dev Update reward rate (only owner)
     * @param newRate New reward rate
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 100, "Rate cannot exceed 100%");
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }
    
    /**
     * @dev Update lock period (only owner)
     * @param newPeriod New lock period in seconds
     */
    function setLockPeriod(uint256 newPeriod) external onlyOwner {
        lockPeriod = newPeriod;
        emit LockPeriodUpdated(newPeriod);
    }
    
    /**
     * @dev Update minimum stake amount
     * @param newAmount New minimum amount
     */
    function setMinStakeAmount(uint256 newAmount) external onlyOwner {
        minStakeAmount = newAmount;
    }
    
    /**
     * @dev Update maximum stake amount
     * @param newAmount New maximum amount
     */
    function setMaxStakeAmount(uint256 newAmount) external onlyOwner {
        maxStakeAmount = newAmount;
    }
    
    /**
     * @dev Get total staking stats
     */
    function getStakingStats() external view returns (
        uint256 totalStakedAmount,
        uint256 totalDistributedRewards,
        uint256 currentRewardRate,
        uint256 lockPeriodSeconds
    ) {
        return (
            totalStaked,
            totalRewardsDistributed,
            rewardRate,
            lockPeriod
        );
    }
}
