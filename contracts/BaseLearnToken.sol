// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract BaseLearnToken {
    // Token metadata (Module 2: Basic Types)
    string public constant name = "Base Learn Token";
    string public constant symbol = "BLT";
    uint8 public constant decimals = 18;
    
    // Supply management
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**decimals;
    
    // ERC-20 storage (Module 4: Mappings)
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Packed struct for optimization (Module 4: Storage)
    struct UserData {
        uint128 stakedAmount;
        uint64 lastAction;
        uint32 points;
        bool isVip;
        bool isActive;
    }
    
    mapping(address => UserData) public userData;
    
    // Access control
    address public owner;
    bool public paused;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // Custom errors (Module 3: Error Handling)
    error InsufficientBalance();
    error Unauthorized();
    error InvalidAddress();
    
    // Modifiers (Module 3: Access Control)
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }
    
    modifier validAddress(address addr) {
        if (addr == address(0)) revert InvalidAddress();
        _;
    }
    
    constructor(uint256 _initialSupply, address _owner) validAddress(_owner) {
        require(_initialSupply <= MAX_SUPPLY, "Exceeds max supply");
        
        owner = _owner;
        totalSupply = _initialSupply;
        balanceOf[_owner] = _initialSupply;
        
        emit Transfer(address(0), _owner, _initialSupply);
        
        console.log("BaseLearnToken deployed with", _initialSupply / 10**decimals, "tokens");
    }
    
    // ERC-20 transfer function (Module 3: Control Structures)
    function transfer(address to, uint256 amount) external validAddress(to) returns (bool) {
        require(!paused, "Contract paused");
        return _transfer(msg.sender, to, amount);
    }
    
    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        if (balanceOf[from] < amount) revert InsufficientBalance();
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        // Update user data (Module 4: Packed storage)
        userData[from].lastAction = uint64(block.timestamp);
        userData[to].lastAction = uint64(block.timestamp);
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external validAddress(spender) returns (bool) {
        require(!paused, "Contract paused");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    // Admin functions
    function mint(address to, uint256 amount) external onlyOwner validAddress(to) {
        require(totalSupply + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function togglePause() external onlyOwner {
        paused = !paused;
        console.log("Contract paused:", paused);
    }
    
    function setVipStatus(address user, bool status) external onlyOwner validAddress(user) {
        userData[user].isVip = status;
        console.log("VIP status set for", user, ":", status);
    }
    
    // View functions
    function getUserData(address user) external view returns (
        uint256 balance,
        uint128 stakedAmount,
        uint64 lastAction,
        uint32 points,
        bool isVip
    ) {
        UserData storage data = userData[user];
        return (
            balanceOf[user],
            data.stakedAmount,
            data.lastAction,
            data.points,
            data.isVip
        );
    }
}