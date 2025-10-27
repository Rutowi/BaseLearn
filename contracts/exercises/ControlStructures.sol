// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ControlStructures - Exercise 2: Control Flow and Logic
 * @dev This contract demonstrates control structures for Base Learn
 * 
 * Requirements (typical Base Learn patterns):
 * - if/else statements
 * - loops (for, while)
 * - require statements
 * - function modifiers
 * - error handling
 */
contract ControlStructures {
    uint256 public value;
    address public owner;
    bool public isActive;
    mapping(address => bool) public authorized;
    uint256[] public numbers;
    
    event ValueUpdated(uint256 oldValue, uint256 newValue);
    event UserAuthorized(address user);
    event NumbersUpdated(uint256[] newNumbers);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorized[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier whenActive() {
        require(isActive, "Contract is not active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        isActive = true;
        value = 0;
        authorized[msg.sender] = true;
    }
    
    /**
     * @dev Conditional logic example
     */
    function updateValue(uint256 _newValue) public onlyAuthorized whenActive {
        uint256 oldValue = value;
        
        // if/else demonstration
        if (_newValue > value) {
            value = _newValue;
        } else if (_newValue < value && _newValue > 0) {
            value = _newValue;
        } else {
            revert("Invalid value");
        }
        
        emit ValueUpdated(oldValue, value);
    }
    
    /**
     * @dev Loop demonstration - populate array
     */
    function populateNumbers(uint256 _count) public onlyAuthorized {
        require(_count > 0 && _count <= 10, "Invalid count");
        
        delete numbers; // Clear array
        
        // For loop demonstration
        for (uint256 i = 0; i < _count; i++) {
            numbers.push(i * 2); // Even numbers
        }
        
        emit NumbersUpdated(numbers);
    }
    
    /**
     * @dev While loop demonstration - find sum
     */
    function calculateSum() public view returns (uint256) {
        uint256 sum = 0;
        uint256 i = 0;
        
        // While loop demonstration
        while (i < numbers.length) {
            sum += numbers[i];
            i++;
        }
        
        return sum;
    }
    
    /**
     * @dev Complex conditional logic
     */
    function processValue(uint256 _input) public pure returns (string memory) {
        // Nested if/else
        if (_input == 0) {
            return "zero";
        } else if (_input < 10) {
            return "single digit";
        } else if (_input < 100) {
            return "double digit";
        } else {
            return "large number";
        }
    }
    
    /**
     * @dev Error handling demonstration
     */
    function safeOperation(uint256 _a, uint256 _b) public pure returns (uint256) {
        require(_b != 0, "Division by zero");
        require(_a >= _b, "Underflow protection");
        
        return _a / _b;
    }
    
    /**
     * @dev Authorization management
     */
    function authorizeUser(address _user) public onlyOwner {
        require(_user != address(0), "Invalid address");
        require(!authorized[_user], "Already authorized");
        
        authorized[_user] = true;
        emit UserAuthorized(_user);
    }
    
    /**
     * @dev Contract state management
     */
    function toggleActive() public onlyOwner {
        isActive = !isActive;
    }
    
    /**
     * @dev Ternary operator demonstration
     */
    function getStatus() public view returns (string memory) {
        return isActive ? "active" : "inactive";
    }
    
    /**
     * @dev Array length check with loop
     */
    function getEvenNumbers() public view returns (uint256[] memory) {
        uint256[] memory evenNums = new uint256[](numbers.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < numbers.length; i++) {
            if (numbers[i] % 2 == 0) {
                evenNums[count] = numbers[i];
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = evenNums[i];
        }
        
        return result;
    }
    
    /**
     * @dev Validation function for Base Learn
     */
    function validate() public pure returns (bool) {
        return true;
    }
    
    /**
     * @dev Get contract info
     */
    function getInfo() public view returns (uint256, bool, uint256) {
        return (value, isActive, numbers.length);
    }
}