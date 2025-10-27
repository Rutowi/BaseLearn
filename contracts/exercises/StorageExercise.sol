// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title StorageExercise - Exercise 3: Storage vs Memory vs Calldata
 * @dev This contract demonstrates storage optimization for Base Learn
 * 
 * Requirements:
 * - Storage vs memory vs calldata usage
 * - Gas optimization techniques
 * - Proper data location handling
 * - State variable management
 */
contract StorageExercise {
    // Storage variables
    uint256 public totalValue;
    address public owner;
    mapping(address => UserData) public users;
    uint256[] public storageArray;
    
    struct UserData {
        string name;
        uint256 balance;
        uint256[] transactions;
        bool isActive;
    }
    
    event DataUpdated(address user, string name);
    event ArrayModified(uint256[] newArray);
    event ValueCalculated(uint256 result);
    
    constructor() {
        owner = msg.sender;
        totalValue = 0;
    }
    
    /**
     * @dev Storage vs Memory demonstration
     */
    function updateUserData(
        address _user,
        string calldata _name,
        uint256 _balance
    ) external {
        // Using storage reference for efficiency
        UserData storage userData = users[_user];
        userData.name = _name;
        userData.balance = _balance;
        userData.isActive = true;
        
        emit DataUpdated(_user, _name);
    }
    
    /**
     * @dev Calldata usage for read-only arrays
     */
    function processTransactions(
        address _user,
        uint256[] calldata _transactions
    ) external {
        require(_transactions.length > 0, "Empty transactions");
        
        // Store in storage
        users[_user].transactions = _transactions;
        
        // Calculate sum using memory for temporary processing
        uint256 sum = calculateSum(_transactions);
        users[_user].balance += sum;
        
        totalValue += sum;
    }
    
    /**
     * @dev Memory usage for temporary calculations
     */
    function calculateSum(uint256[] calldata _numbers) 
        public 
        pure 
        returns (uint256) 
    {
        uint256 sum = 0;
        
        // Using calldata directly (most gas efficient)
        for (uint256 i = 0; i < _numbers.length; i++) {
            sum += _numbers[i];
        }
        
        return sum;
    }
    
    /**
     * @dev Storage array manipulation
     */
    function updateStorageArray(uint256[] calldata _newArray) external {
        // Clear existing storage array
        delete storageArray;
        
        // Copy from calldata to storage
        for (uint256 i = 0; i < _newArray.length; i++) {
            storageArray.push(_newArray[i]);
        }
        
        emit ArrayModified(storageArray);
    }
    
    /**
     * @dev Memory array creation and processing
     */
    function createProcessedArray(uint256 _length) 
        external 
        view 
        returns (uint256[] memory) 
    {
        require(_length > 0 && _length <= 100, "Invalid length");
        
        // Create memory array
        uint256[] memory processed = new uint256[](_length);
        
        // Fill with processed values
        for (uint256 i = 0; i < _length; i++) {
            processed[i] = i * i; // Square numbers
        }
        
        return processed;
    }
    
    /**
     * @dev Storage optimization - batch operations
     */
    function batchUpdateUsers(
        address[] calldata _users,
        uint256[] calldata _balances
    ) external {
        require(_users.length == _balances.length, "Array length mismatch");
        
        // Batch update to minimize storage writes
        for (uint256 i = 0; i < _users.length; i++) {
            users[_users[i]].balance = _balances[i];
            users[_users[i]].isActive = true;
        }
    }
    
    /**
     * @dev Gas-efficient string operations
     */
    function updateUserName(address _user, string calldata _name) external {
        // Direct assignment to storage (gas efficient)
        users[_user].name = _name;
        emit DataUpdated(_user, _name);
    }
    
    /**
     * @dev Memory vs Storage comparison
     */
    function getProcessedUserData(address _user) 
        external 
        view 
        returns (string memory, uint256, uint256) 
    {
        // Load storage data into memory for processing
        UserData storage userData = users[_user];
        
        // Process in memory
        string memory name = userData.name;
        uint256 balance = userData.balance;
        uint256 transactionCount = userData.transactions.length;
        
        return (name, balance, transactionCount);
    }
    
    /**
     * @dev Efficient array access
     */
    function getStorageArraySlice(uint256 _start, uint256 _length) 
        external 
        view 
        returns (uint256[] memory) 
    {
        require(_start < storageArray.length, "Start index out of bounds");
        require(_start + _length <= storageArray.length, "Length exceeds array");
        
        // Create memory array for return
        uint256[] memory slice = new uint256[](_length);
        
        // Copy specific elements from storage
        for (uint256 i = 0; i < _length; i++) {
            slice[i] = storageArray[_start + i];
        }
        
        return slice;
    }
    
    /**
     * @dev Complex storage operations
     */
    function complexStorageOperation(
        address _user,
        uint256[] calldata _newTransactions
    ) external returns (uint256) {
        UserData storage userData = users[_user];
        
        // Add new transactions to existing ones
        for (uint256 i = 0; i < _newTransactions.length; i++) {
            userData.transactions.push(_newTransactions[i]);
        }
        
        // Calculate new balance (using storage)
        uint256 newBalance = 0;
        for (uint256 i = 0; i < userData.transactions.length; i++) {
            newBalance += userData.transactions[i];
        }
        
        userData.balance = newBalance;
        
        emit ValueCalculated(newBalance);
        return newBalance;
    }
    
    /**
     * @dev Validation function for Base Learn
     */
    function validate() external pure returns (bool) {
        return true;
    }
    
    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (uint256, uint256, uint256) {
        return (totalValue, storageArray.length, address(this).balance);
    }
}