// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

/**
 * @title DataStorage
 * @author Base Learn Student
 * @notice Module 4: Demonstrating Solidity data storage concepts
 * @dev Educational contract following docs.base.org/learn/storage/simple-storage-sbs and how-storage-works
 * 
 * This contract demonstrates:
 * ✅ Storage vs Memory vs Stack data locations
 * ✅ Variable packing optimization
 * ✅ Gas-efficient storage patterns
 * ✅ Arrays and Mappings storage
 * ✅ State variable initialization
 * ✅ Constructor with parameters
 * ✅ Storage slots and layout
 */
contract DataStorage {
    
    // =================================
    // OPTIMIZED VARIABLE PACKING
    // =================================
    
    // Packed in slot 0 (32 bytes total)
    uint8 public age;           // 1 byte
    uint8 public cars;          // 1 byte  
    bool public isActive;       // 1 byte
    address public owner;       // 20 bytes
    // Total: 23 bytes - fits in one slot with 9 bytes remaining
    
    // Packed in slot 1 (32 bytes total)
    uint16 public score;        // 2 bytes
    uint32 public timestamp;    // 4 bytes
    uint128 public balance;     // 16 bytes
    uint64 public id;          // 8 bytes
    // Total: 30 bytes - fits in one slot with 2 bytes remaining
    
    // Slot 2 - full 32 bytes
    uint256 public largeNumber; // 32 bytes
    
    // Slot 3 - full 32 bytes  
    string public name;         // Dynamic size, uses one slot for length + additional slots for data
    
    // =================================
    // INEFFICIENT PACKING EXAMPLE (for educational purposes)
    // =================================
    
    // These variables are intentionally poorly ordered to show inefficiency
    uint8 public badExample1;   // Slot 4: 1 byte + 31 wasted
    uint256 public badExample2; // Slot 5: 32 bytes (full slot)
    uint8 public badExample3;   // Slot 6: 1 byte + 31 wasted
    // This could have been optimized to use only 2 slots instead of 3
    
    // =================================
    // ARRAYS AND MAPPINGS
    // =================================
    
    uint256[] public numbers;                    // Dynamic array
    mapping(address => uint256) public balances; // Mapping
    mapping(uint256 => string) public names;     // Another mapping
    
    // Nested mapping
    mapping(address => mapping(uint256 => bool)) public permissions;
    
    // Array of structs
    struct Person {
        string firstName;   // Slot n
        string lastName;    // Slot n+1
        uint8 age;         // Slot n+2 (packed with other small variables if any)
        bool isVerified;   // Packed with age
        address wallet;    // Packed with age and isVerified
    }
    
    Person[] public people;
    
    // =================================
    // CONSTANTS AND IMMUTABLES
    // =================================
    
    uint256 public constant MAX_SUPPLY = 1000000;     // Stored in bytecode, not storage
    uint256 public immutable deploymentTime;          // Set once in constructor
    address public immutable deployer;               // Set once in constructor
    
    // =================================
    // EVENTS
    // =================================
    
    event StorageUpdated(string indexed variableName, uint256 oldValue, uint256 newValue);
    event PersonAdded(uint256 indexed index, string firstName, string lastName);
    event ArrayUpdated(string operation, uint256 index, uint256 value);
    event MappingUpdated(address indexed user, uint256 oldBalance, uint256 newBalance);
    
    // =================================
    // MODIFIERS
    // =================================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validAge(uint8 _age) {
        require(_age > 0 && _age <= 150, "Invalid age range");
        _;
    }
    
    // =================================
    // CONSTRUCTOR
    // =================================
    
    constructor(
        string memory _name,
        uint8 _age,
        uint8 _cars,
        uint256 _initialBalance
    ) {
        // Set immutable values (these don't use storage slots)
        deploymentTime = block.timestamp;
        deployer = msg.sender;
        
        // Initialize packed variables in slot 0
        owner = msg.sender;
        age = _age;
        cars = _cars;
        isActive = true;
        
        // Initialize packed variables in slot 1
        score = 100;
        timestamp = uint32(block.timestamp);
        balance = uint128(_initialBalance);
        id = uint64(block.number);
        
        // Initialize slot 2
        largeNumber = 999999999999999999999;
        
        // Initialize slot 3
        name = _name;
        
        // Initialize inefficient examples
        badExample1 = 1;
        badExample2 = 123456789;
        badExample3 = 3;
        
        console.log("DataStorage deployed by:", msg.sender);
        console.log("Initial name:", _name);
        console.log("Initial age:", _age);
    }
    
    // =================================
    // STORAGE OPERATIONS
    // =================================
    
    /**
     * @notice Update age (demonstrates storage write)
     */
    function incrementAge() external onlyOwner {
        uint8 oldAge = age;
        age++;
        emit StorageUpdated("age", oldAge, age);
    }
    
    /**
     * @notice Set age to specific value with admin function
     * @param _newAge New age value
     */
    function adminSetAge(uint8 _newAge) external onlyOwner validAge(_newAge) {
        uint8 oldAge = age;
        age = _newAge;
        emit StorageUpdated("age", oldAge, _newAge);
    }
    
    /**
     * @notice Update number of cars
     * @param _numberOfCars New car count
     */
    function updateCars(uint8 _numberOfCars) external onlyOwner {
        uint8 oldCars = cars;
        cars = _numberOfCars;
        emit StorageUpdated("cars", oldCars, _numberOfCars);
    }
    
    /**
     * @notice Update multiple packed variables in same slot (gas efficient)
     * @param _newAge New age
     * @param _newCars New car count
     * @param _active New active status
     */
    function updatePackedVariables(
        uint8 _newAge,
        uint8 _newCars,
        bool _active
    ) external onlyOwner validAge(_newAge) {
        // This updates multiple variables in the same storage slot
        // More gas efficient than updating individually
        age = _newAge;
        cars = _newCars;
        isActive = _active;
        
        console.log("Updated packed variables - Age:", _newAge, "Cars:", _newCars);
        console.log("Active status:", _active);
    }
    
    /**
     * @notice Update large number (demonstrates full 32-byte storage write)
     * @param _newNumber New large number
     */
    function updateLargeNumber(uint256 _newNumber) external onlyOwner {
        uint256 oldNumber = largeNumber;
        largeNumber = _newNumber;
        emit StorageUpdated("largeNumber", oldNumber, _newNumber);
    }
    
    // =================================
    // MEMORY vs STORAGE DEMONSTRATIONS
    // =================================
    
    /**
     * @notice Demonstrates memory usage for temporary calculations
     * @param _numbers Array of numbers to process
     * @return sum Total sum
     * @return average Average value
     */
    function processNumbersInMemory(uint256[] memory _numbers) 
        external 
        pure 
        returns (uint256 sum, uint256 average) 
    {
        // Working with memory array - temporary, no storage writes
        require(_numbers.length > 0, "Array cannot be empty");
        
        sum = 0;
        for (uint256 i = 0; i < _numbers.length; i++) {
            sum += _numbers[i];
        }
        
        average = sum / _numbers.length;
        
        return (sum, average);
    }
    
    /**
     * @notice Demonstrates storage vs memory difference
     * @param _newNumbers Array to store permanently
     */
    function storeNumbersArray(uint256[] memory _newNumbers) external onlyOwner {
        // Clear existing storage array
        delete numbers;
        
        // Copy from memory to storage (expensive)
        for (uint256 i = 0; i < _newNumbers.length; i++) {
            numbers.push(_newNumbers[i]);
            emit ArrayUpdated("push", i, _newNumbers[i]);
        }
        
        console.log("Stored numbers in storage, count:", _newNumbers.length);
    }
    
    /**
     * @notice Add single number to storage array
     * @param _number Number to add
     */
    function addNumber(uint256 _number) external onlyOwner {
        numbers.push(_number);
        emit ArrayUpdated("push", numbers.length - 1, _number);
    }
    
    /**
     * @notice Remove last number from storage array
     */
    function removeLastNumber() external onlyOwner {
        require(numbers.length > 0, "Array is empty");
        uint256 removedValue = numbers[numbers.length - 1];
        numbers.pop();
        emit ArrayUpdated("pop", numbers.length, removedValue);
    }
    
    /**
     * @notice Get all numbers (returns memory copy)
     * @return Array of all stored numbers
     */
    function getAllNumbers() external view returns (uint256[] memory) {
        return numbers; // Returns memory copy of storage array
    }
    
    // =================================
    // MAPPING OPERATIONS
    // =================================
    
    /**
     * @notice Set balance for an address
     * @param _user User address
     * @param _balance New balance
     */
    function setBalance(address _user, uint256 _balance) external onlyOwner {
        uint256 oldBalance = balances[_user];
        balances[_user] = _balance;
        emit MappingUpdated(_user, oldBalance, _balance);
    }
    
    /**
     * @notice Transfer balance between addresses
     * @param _from Source address
     * @param _to Destination address
     * @param _amount Amount to transfer
     */
    function transferBalance(address _from, address _to, uint256 _amount) external onlyOwner {
        require(balances[_from] >= _amount, "Insufficient balance");
        
        balances[_from] -= _amount;
        balances[_to] += _amount;
        
        emit MappingUpdated(_from, balances[_from] + _amount, balances[_from]);
        emit MappingUpdated(_to, balances[_to] - _amount, balances[_to]);
    }
    
    /**
     * @notice Set permission for user and ID
     * @param _user User address
     * @param _id Permission ID
     * @param _granted Whether permission is granted
     */
    function setPermission(address _user, uint256 _id, bool _granted) external onlyOwner {
        permissions[_user][_id] = _granted;
        console.log("Permission set for user:", _user);
        console.log("ID:", _id, "Granted:", _granted);
    }
    
    // =================================
    // STRUCT AND ARRAY OPERATIONS
    // =================================
    
    /**
     * @notice Add person to people array
     * @param _firstName First name
     * @param _lastName Last name
     * @param _personAge Person's age
     * @param _isVerified Verification status
     * @param _wallet Wallet address
     */
    function addPerson(
        string memory _firstName,
        string memory _lastName,
        uint8 _personAge,
        bool _isVerified,
        address _wallet
    ) external onlyOwner {
        Person memory newPerson = Person({
            firstName: _firstName,
            lastName: _lastName,
            age: _personAge,
            isVerified: _isVerified,
            wallet: _wallet
        });
        
        people.push(newPerson);
        emit PersonAdded(people.length - 1, _firstName, _lastName);
    }
    
    /**
     * @notice Get person details by index
     * @param _index Array index
     * @return person Person struct
     */
    function getPerson(uint256 _index) external view returns (Person memory person) {
        require(_index < people.length, "Index out of bounds");
        return people[_index];
    }
    
    /**
     * @notice Update person verification status
     * @param _index Person index
     * @param _verified New verification status
     */
    function updatePersonVerification(uint256 _index, bool _verified) external onlyOwner {
        require(_index < people.length, "Index out of bounds");
        people[_index].isVerified = _verified;
        console.log("Updated verification for person at index:", _index);
        console.log("New verification status:", _verified);
    }
    
    // =================================
    // GAS OPTIMIZATION EXAMPLES
    // =================================
    
    /**
     * @notice Batch operations to save gas
     * @param _users Array of user addresses
     * @param _balancesToSet Array of balances to set
     */
    function batchSetBalances(
        address[] memory _users,
        uint256[] memory _balancesToSet
    ) external onlyOwner {
        require(_users.length == _balancesToSet.length, "Arrays length mismatch");
        require(_users.length <= 50, "Too many operations");
        
        for (uint256 i = 0; i < _users.length; i++) {
            uint256 oldBalance = balances[_users[i]];
            balances[_users[i]] = _balancesToSet[i];
            emit MappingUpdated(_users[i], oldBalance, _balancesToSet[i]);
        }
        
        console.log("Batch updated balances, count:", _users.length);
    }
    
    /**
     * @notice Efficient packed variable reading
     * @return _age Age value
     * @return _cars Cars count
     * @return _isActive Active status
     * @return _owner Owner address
     */
    function getPackedVariables() external view returns (
        uint8 _age,
        uint8 _cars,
        bool _isActive,
        address _owner
    ) {
        // Reading multiple variables from same slot is gas efficient
        return (age, cars, isActive, owner);
    }
    
    // =================================
    // STORAGE ANALYSIS FUNCTIONS
    // =================================
    
    /**
     * @notice Get storage usage statistics
     * @return numbersLength Length of numbers array
     * @return peopleCount Count of people
     * @return currentBalance Balance of caller
     * @return contractDeploymentTime Deployment timestamp
     * @return contractDeployer Deployer address
     */
    function getStorageStats() external view returns (
        uint256 numbersLength,
        uint256 peopleCount,
        uint256 currentBalance,
        uint256 contractDeploymentTime,
        address contractDeployer
    ) {
        return (
            numbers.length,
            people.length,
            balances[msg.sender],
            deploymentTime, // immutable, no storage cost after deployment
            deployer       // immutable, no storage cost after deployment
        );
    }
    
    /**
     * @notice Compare storage vs memory operations (view function for testing)
     * @param _testArray Array to test with
     * @return storageGasCost Estimated storage operations
     * @return memoryGasCost Estimated memory operations  
     */
    function compareStorageVsMemory(uint256[] memory _testArray) 
        external 
        view 
        returns (string memory storageGasCost, string memory memoryGasCost) 
    {
        // This function demonstrates the difference conceptually
        // In reality, you'd measure actual gas usage
        
        if (_testArray.length > 10) {
            storageGasCost = "High - each storage write costs ~20,000 gas";
            memoryGasCost = "Low - memory operations cost ~3 gas per word";
        } else {
            storageGasCost = "Medium - storage writes for small arrays";
            memoryGasCost = "Very Low - minimal memory usage";
        }
        
        return (storageGasCost, memoryGasCost);
    }
    
    // =================================
    // HELPER FUNCTIONS
    // =================================
    
    /**
     * @notice Get array length
     */
    function getNumbersLength() external view returns (uint256) {
        return numbers.length;
    }
    
    /**
     * @notice Get people count
     */
    function getPeopleCount() external view returns (uint256) {
        return people.length;
    }
    
    /**
     * @notice Check if user has specific permission
     */
    function hasPermission(address _user, uint256 _id) external view returns (bool) {
        return permissions[_user][_id];
    }
    
    /**
     * @notice Get contract basic info
     */
    function getContractInfo() external view returns (
        string memory contractName,
        address contractOwner,
        bool contractActive,
        uint256 deployTime
    ) {
        return (name, owner, isActive, deploymentTime);
    }
    
    // =================================
    // EMERGENCY FUNCTIONS
    // =================================
    
    /**
     * @notice Clear all storage arrays (emergency function)
     */
    function clearAllArrays() external onlyOwner {
        delete numbers;
        delete people;
        console.log("All arrays cleared");
    }
    
    /**
     * @notice Transfer ownership
     * @param _newOwner New owner address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
        console.log("Ownership transferred to:", _newOwner);
    }
}