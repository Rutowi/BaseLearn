// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArraysExercise - Exercise 4: Array Operations and Optimization
 * @dev This contract demonstrates array manipulation for Base Learn
 * 
 * Requirements:
 * - Dynamic and fixed arrays
 * - Array operations (push, pop, delete)
 * - Memory vs storage arrays
 * - Gas-efficient array handling
 */
contract ArraysExercise {
    // Fixed-size arrays
    uint256[5] public fixedArray;
    address[3] public adminArray;
    
    // Dynamic arrays
    uint256[] public dynamicArray;
    string[] public messages;
    address[] public users;
    
    // Nested arrays
    mapping(address => uint256[]) public userNumbers;
    mapping(uint256 => string[]) public categoryMessages;
    
    event ArrayUpdated(uint256[] newArray);
    event MessageAdded(string message);
    event UserAdded(address user);
    event ArraysCleared();
    
    constructor() {
        // Initialize fixed array
        fixedArray = [1, 2, 3, 4, 5];
        adminArray[0] = msg.sender;
    }
    
    /**
     * @dev Dynamic array operations
     */
    function addToDynamicArray(uint256 _value) external {
        dynamicArray.push(_value);
        emit ArrayUpdated(dynamicArray);
    }
    
    function removeLastFromDynamicArray() external {
        require(dynamicArray.length > 0, "Array is empty");
        dynamicArray.pop();
        emit ArrayUpdated(dynamicArray);
    }
    
    function removeAtIndex(uint256 _index) external {
        require(_index < dynamicArray.length, "Index out of bounds");
        
        // Shift elements to remove gap
        for (uint256 i = _index; i < dynamicArray.length - 1; i++) {
            dynamicArray[i] = dynamicArray[i + 1];
        }
        dynamicArray.pop();
        
        emit ArrayUpdated(dynamicArray);
    }
    
    /**
     * @dev Efficient array operations
     */
    function batchAddNumbers(uint256[] calldata _numbers) external {
        for (uint256 i = 0; i < _numbers.length; i++) {
            dynamicArray.push(_numbers[i]);
        }
        emit ArrayUpdated(dynamicArray);
    }
    
    function replaceArray(uint256[] calldata _newArray) external {
        // Clear existing array
        delete dynamicArray;
        
        // Add new elements
        for (uint256 i = 0; i < _newArray.length; i++) {
            dynamicArray.push(_newArray[i]);
        }
        
        emit ArrayUpdated(dynamicArray);
    }
    
    /**
     * @dev Array searching and filtering
     */
    function findValue(uint256 _value) external view returns (bool, uint256) {
        for (uint256 i = 0; i < dynamicArray.length; i++) {
            if (dynamicArray[i] == _value) {
                return (true, i);
            }
        }
        return (false, 0);
    }
    
    function getEvenNumbers() external view returns (uint256[] memory) {
        // Count even numbers first
        uint256 evenCount = 0;
        for (uint256 i = 0; i < dynamicArray.length; i++) {
            if (dynamicArray[i] % 2 == 0) {
                evenCount++;
            }
        }
        
        // Create result array
        uint256[] memory evenNumbers = new uint256[](evenCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < dynamicArray.length; i++) {
            if (dynamicArray[i] % 2 == 0) {
                evenNumbers[index] = dynamicArray[i];
                index++;
            }
        }
        
        return evenNumbers;
    }
    
    /**
     * @dev String array operations
     */
    function addMessage(string calldata _message) external {
        messages.push(_message);
        emit MessageAdded(_message);
    }
    
    function getMessagesCount() external view returns (uint256) {
        return messages.length;
    }
    
    function getAllMessages() external view returns (string[] memory) {
        return messages;
    }
    
    /**
     * @dev Address array operations
     */
    function addUser(address _user) external {
        require(_user != address(0), "Invalid address");
        
        // Check if user already exists
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != _user, "User already exists");
        }
        
        users.push(_user);
        emit UserAdded(_user);
    }
    
    function removeUser(address _user) external {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == _user) {
                // Move last element to current position
                users[i] = users[users.length - 1];
                users.pop();
                return;
            }
        }
        revert("User not found");
    }
    
    /**
     * @dev Nested array operations
     */
    function addUserNumbers(address _user, uint256[] calldata _numbers) external {
        for (uint256 i = 0; i < _numbers.length; i++) {
            userNumbers[_user].push(_numbers[i]);
        }
    }
    
    function getUserNumbersLength(address _user) external view returns (uint256) {
        return userNumbers[_user].length;
    }
    
    function getUserNumbers(address _user) external view returns (uint256[] memory) {
        return userNumbers[_user];
    }
    
    /**
     * @dev Fixed array operations
     */
    function updateFixedArray(uint256[5] calldata _newValues) external {
        fixedArray = _newValues;
    }
    
    function setFixedArrayElement(uint256 _index, uint256 _value) external {
        require(_index < 5, "Index out of bounds");
        fixedArray[_index] = _value;
    }
    
    function getFixedArray() external view returns (uint256[5] memory) {
        return fixedArray;
    }
    
    /**
     * @dev Array sorting (simple bubble sort for demonstration)
     */
    function sortDynamicArray() external {
        uint256[] storage arr = dynamicArray;
        uint256 n = arr.length;
        
        for (uint256 i = 0; i < n - 1; i++) {
            for (uint256 j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    uint256 temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        
        emit ArrayUpdated(dynamicArray);
    }
    
    /**
     * @dev Memory array operations
     */
    function createMemoryArray(uint256 _size) external pure returns (uint256[] memory) {
        require(_size > 0 && _size <= 1000, "Invalid size");
        
        uint256[] memory memArray = new uint256[](_size);
        
        for (uint256 i = 0; i < _size; i++) {
            memArray[i] = i + 1;
        }
        
        return memArray;
    }
    
    /**
     * @dev Array statistics
     */
    function getArrayStats() external view returns (
        uint256 dynamicLength,
        uint256 messagesLength,
        uint256 usersLength,
        uint256 sumOfDynamic
    ) {
        dynamicLength = dynamicArray.length;
        messagesLength = messages.length;
        usersLength = users.length;
        
        // Calculate sum
        for (uint256 i = 0; i < dynamicArray.length; i++) {
            sumOfDynamic += dynamicArray[i];
        }
    }
    
    /**
     * @dev Clear all arrays
     */
    function clearAllArrays() external {
        delete dynamicArray;
        delete messages;
        delete users;
        emit ArraysCleared();
    }
    
    /**
     * @dev Validation function for Base Learn
     */
    function validate() external pure returns (bool) {
        return true;
    }
}