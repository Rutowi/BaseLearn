// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

/**
 * @title ControlStructures
 * @author Base Learn Student
 * @notice Module 3: Demonstrating all Solidity control structures
 * @dev Educational contract following docs.base.org/learn/control-structures/control-structures
 * 
 * This contract demonstrates:
 * ✅ Conditional structures: if, else if, else
 * ✅ Iterative structures: for, while, do-while
 * ✅ Flow control: continue, break, return
 * ✅ Error handling: require, revert, custom errors, assert
 * ✅ Modifiers for access control and validation
 */
contract ControlStructures {
    // State variables for demonstration
    address public owner;
    bool public contractActive;
    uint256 public counter;
    uint256[] public numbers;
    mapping(address => bool) public authorizedUsers;
    
    // Custom errors (gas efficient)
    error OddNumberSubmitted(uint256 _first, uint256 _second);
    error UnauthorizedAccess(address caller);
    error ContractNotActive();
    error InvalidRange(uint256 min, uint256 max);
    error ArrayEmpty();
    
    // Events for logging
    event NumberProcessed(uint256 indexed number, string result);
    event UserAuthorized(address indexed user);
    event ContractStatusChanged(bool active);
    event CounterUpdated(uint256 oldValue, uint256 newValue);
    
    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert UnauthorizedAccess(msg.sender);
        }
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "User not authorized");
        _;
    }
    
    modifier contractMustBeActive() {
        if (!contractActive) {
            revert ContractNotActive();
        }
        _;
    }
    
    modifier validNumber(uint256 _number) {
        require(_number > 0, "Number must be positive");
        require(_number <= 1000, "Number too large");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        contractActive = true;
        counter = 0;
        authorizedUsers[msg.sender] = true;
        
        console.log("ControlStructures deployed by:", msg.sender);
    }
    
    // =================================
    // CONDITIONAL CONTROL STRUCTURES
    // =================================
    
    /**
     * @notice Demonstrates if, else if, else statements
     * @param _number Number to analyze
     * @return description of the number
     */
    function conditionalExample(uint256 _number) external pure returns (string memory) {
        if (_number == 0) {
            return "The number is zero.";
        } else if (_number % 2 == 0) {
            return "The number is even and greater than zero.";
        } else {
            return "The number is odd and is greater than zero.";
        }
    }
    
    /**
     * @notice Complex conditional logic with multiple conditions
     * @param _age Age to check
     * @param _hasLicense Whether person has license
     * @return eligibility status
     */
    function checkDrivingEligibility(uint256 _age, bool _hasLicense) 
        external 
        pure 
        returns (string memory) 
    {
        if (_age < 16) {
            return "Too young to drive";
        } else if (_age >= 16 && _age < 18) {
            if (_hasLicense) {
                return "Can drive with restrictions";
            } else {
                return "Needs license for restricted driving";
            }
        } else if (_age >= 18) {
            if (_hasLicense) {
                return "Can drive without restrictions";
            } else {
                return "Needs license to drive";
            }
        }
        
        return "Invalid age"; // Should never reach here
    }
    
    /**
     * @notice Grade calculator using nested conditionals
     * @param _score Test score (0-100)
     * @return letter grade
     */
    function calculateGrade(uint256 _score) external pure returns (string memory) {
        require(_score <= 100, "Score cannot exceed 100");
        
        if (_score >= 90) {
            return "A";
        } else if (_score >= 80) {
            return "B";
        } else if (_score >= 70) {
            return "C";
        } else if (_score >= 60) {
            return "D";
        } else {
            return "F";
        }
    }
    
    // =================================
    // ITERATIVE CONTROL STRUCTURES
    // =================================
    
    /**
     * @notice Demonstrates for loops with different patterns
     * @param _times Number of iterations
     * @return sum of numbers from 0 to _times
     */
    function forLoopDemo(uint256 _times) external view returns (uint256) {
        require(_times <= 100, "Too many iterations");
        
        uint256 sum = 0;
        
        // Basic for loop
        for (uint256 i = 0; i <= _times; i++) {
            console.log("For loop iteration:", i);
            sum += i;
        }
        
        return sum;
    }
    
    /**
     * @notice Demonstrates for loop with continue statement
     * @param _times Number to iterate through
     * @return sum of even numbers only
     */
    function forLoopWithContinue(uint256 _times) external view returns (uint256) {
        require(_times <= 100, "Too many iterations");
        
        uint256 sum = 0;
        
        for (uint256 i = 0; i <= _times; i++) {
            // Skip odd numbers
            if (i % 2 == 1) {
                continue;
            }
            console.log("Processing even number:", i);
            sum += i;
        }
        
        return sum;
    }
    
    /**
     * @notice Demonstrates for loop with break statement
     * @param _times Number to iterate through
     * @return sum until number 7 is reached
     */
    function forLoopWithBreak(uint256 _times) external view returns (uint256) {
        uint256 sum = 0;
        
        for (uint256 i = 0; i <= _times; i++) {
            // Always stop at 7
            if (i == 7) {
                console.log("Breaking at:", i);
                break;
            }
            console.log("Adding to sum:", i);
            sum += i;
        }
        
        return sum;
    }
    
    /**
     * @notice Demonstrates while loop
     * @param _start Starting number
     * @param _limit Maximum number
     * @return sum of numbers from start to limit
     */
    function whileLoopDemo(uint256 _start, uint256 _limit) 
        external 
        view 
        returns (uint256) 
    {
        require(_limit > _start, "Limit must be greater than start");
        require(_limit - _start <= 50, "Range too large");
        
        uint256 sum = 0;
        uint256 current = _start;
        
        while (current <= _limit) {
            console.log("While loop - current:", current);
            sum += current;
            current++;
        }
        
        return sum;
    }
    
    /**
     * @notice Demonstrates do-while loop (Note: Solidity doesn't have do-while, so using while)
     * @param _number Number to process
     * @return factorial of the number
     */
    function calculateFactorial(uint256 _number) external view returns (uint256) {
        require(_number <= 10, "Number too large for factorial");
        
        if (_number == 0) return 1;
        
        uint256 result = 1;
        uint256 i = 1;
        
        while (i <= _number) {
            result *= i;
            console.log("Factorial step - i:", i, "result:", result);
            i++;
        }
        
        return result;
    }
    
    // =================================
    // ARRAY PROCESSING WITH LOOPS
    // =================================
    
    /**
     * @notice Add numbers to array using loop
     * @param _count How many numbers to add
     */
    function populateArray(uint256 _count) external onlyAuthorized {
        require(_count <= 20, "Too many numbers");
        
        // Clear existing numbers
        delete numbers;
        
        for (uint256 i = 1; i <= _count; i++) {
            numbers.push(i * 2); // Add even numbers
            console.log("Added to array:", i * 2);
        }
    }
    
    /**
     * @notice Find maximum number in array
     * @return maximum value found
     */
    function findMaxInArray() external view returns (uint256) {
        if (numbers.length == 0) {
            revert ArrayEmpty();
        }
        
        uint256 max = numbers[0];
        
        for (uint256 i = 1; i < numbers.length; i++) {
            if (numbers[i] > max) {
                max = numbers[i];
            }
        }
        
        return max;
    }
    
    /**
     * @notice Calculate sum of array elements with conditional logic
     * @return sum of even numbers in array
     */
    function sumEvenNumbers() external view returns (uint256) {
        uint256 sum = 0;
        
        for (uint256 i = 0; i < numbers.length; i++) {
            if (numbers[i] % 2 == 0) {
                sum += numbers[i];
            }
        }
        
        return sum;
    }
    
    // =================================
    // ERROR HANDLING DEMONSTRATIONS
    // =================================
    
    /**
     * @notice Demonstrates custom error with revert (modern approach)
     * @param _first First number
     * @param _second Second number
     * @return sum of two even numbers
     */
    function onlyAddEvenNumbers(uint256 _first, uint256 _second) 
        public 
        pure 
        returns (uint256) 
    {
        if (_first % 2 != 0 || _second % 2 != 0) {
            revert OddNumberSubmitted(_first, _second);
        }
        return _first + _second;
    }
    
    /**
     * @notice Demonstrates require statements (legacy but still common)
     * @param _first First number
     * @param _second Second number  
     * @return sum of two even numbers
     */
    function requireAddEvenNumbers(uint256 _first, uint256 _second) 
        public 
        pure 
        returns (uint256) 
    {
        require(_first % 2 == 0, "First number is not even");
        require(_second % 2 == 0, "Second number is not even");
        
        return _first + _second;
    }
    
    /**
     * @notice Demonstrates assert for internal errors
     * @param _validatedInput Input that should already be validated
     */
    function processEvenNumber(uint256 _validatedInput) public pure {
        // If assert triggers, input validation has failed - this should never happen!
        assert(_validatedInput % 2 == 0);
        // Do something with the validated even number...
        console.log("Processing validated even number:", _validatedInput);
    }
    
    /**
     * @notice Safe division with error handling
     * @param _dividend Number to divide
     * @param _divisor Number to divide by
     * @return result of division
     */
    function safeDivision(uint256 _dividend, uint256 _divisor) 
        external 
        pure 
        returns (uint256) 
    {
        require(_divisor != 0, "Cannot divide by zero");
        return _dividend / _divisor;
    }
    
    // =================================
    // COMPLEX CONTROL FLOW EXAMPLES
    // =================================
    
    /**
     * @notice Complex algorithm using multiple control structures
     * @param _numbers Array of numbers to process
     * @return processedNumbers Modified array
     */
    function complexProcessing(uint256[] memory _numbers) 
        external 
        view 
        returns (uint256[] memory processedNumbers) 
    {
        require(_numbers.length > 0, "Array cannot be empty");
        require(_numbers.length <= 50, "Array too large");
        
        processedNumbers = new uint256[](_numbers.length);
        
        for (uint256 i = 0; i < _numbers.length; i++) {
            uint256 num = _numbers[i];
            
            // Skip zero values
            if (num == 0) {
                processedNumbers[i] = 0;
                continue;
            }
            
            // Different processing based on number properties
            if (num % 3 == 0 && num % 5 == 0) {
                // FizzBuzz case
                processedNumbers[i] = 999;
            } else if (num % 3 == 0) {
                // Fizz case
                processedNumbers[i] = num * 2;
            } else if (num % 5 == 0) {
                // Buzz case
                processedNumbers[i] = num * 3;
            } else if (num > 100) {
                // Large numbers - process differently
                processedNumbers[i] = num / 2;
            } else {
                // Regular numbers
                processedNumbers[i] = num + 10;
            }
        }
        
        return processedNumbers;
    }
    
    /**
     * @notice Prime number checker using loops and conditionals
     * @param _number Number to check
     * @return whether number is prime
     */
    function isPrime(uint256 _number) external view returns (bool) {
        if (_number < 2) return false;
        if (_number == 2) return true;
        if (_number % 2 == 0) return false;
        
        // Check odd divisors up to sqrt of number
        for (uint256 i = 3; i * i <= _number; i += 2) {
            if (_number % i == 0) {
                console.log("Found divisor:", i);
                return false;
            }
        }
        
        return true;
    }
    
    // =================================
    // STATE MANAGEMENT WITH CONTROL
    // =================================
    
    /**
     * @notice Update counter with conditional logic
     * @param _increment Amount to increment
     */
    function updateCounter(uint256 _increment) 
        external 
        contractMustBeActive 
        validNumber(_increment) 
    {
        uint256 oldValue = counter;
        
        // Conditional increment based on current value
        if (counter < 10) {
            counter += _increment * 2; // Double increment for small values
        } else if (counter < 50) {
            counter += _increment; // Normal increment
        } else {
            counter += _increment / 2; // Half increment for large values
        }
        
        emit CounterUpdated(oldValue, counter);
    }
    
    /**
     * @notice Batch process with early termination
     * @param _values Array of values to process
     * @return processedCount How many were processed
     */
    function batchProcess(uint256[] memory _values) 
        external 
        onlyAuthorized 
        returns (uint256 processedCount) 
    {
        processedCount = 0;
        
        for (uint256 i = 0; i < _values.length; i++) {
            // Stop processing if we hit a zero
            if (_values[i] == 0) {
                console.log("Stopping batch at zero value, index:", i);
                break;
            }
            
            // Skip negative numbers (represented as very large uint)
            if (_values[i] > type(uint256).max / 2) {
                console.log("Skipping large value at index:", i);
                continue;
            }
            
            // Process the value
            console.log("Processing value:", _values[i]);
            processedCount++;
            
            // Emit event for processed number
            emit NumberProcessed(_values[i], "Processed");
        }
        
        return processedCount;
    }
    
    // =================================
    // ACCESS CONTROL AND MODIFIERS
    // =================================
    
    /**
     * @notice Authorize a user (owner only)
     * @param _user User to authorize
     */
    function authorizeUser(address _user) external onlyOwner {
        require(_user != address(0), "Invalid address");
        authorizedUsers[_user] = true;
        emit UserAuthorized(_user);
    }
    
    /**
     * @notice Toggle contract active status
     */
    function toggleContractStatus() external onlyOwner {
        contractActive = !contractActive;
        emit ContractStatusChanged(contractActive);
    }
    
    /**
     * @notice Get array length
     * @return length of numbers array
     */
    function getArrayLength() external view returns (uint256) {
        return numbers.length;
    }
    
    /**
     * @notice Get number at specific index with bounds checking
     * @param _index Index to retrieve
     * @return number at index
     */
    function getNumberAt(uint256 _index) external view returns (uint256) {
        require(_index < numbers.length, "Index out of bounds");
        return numbers[_index];
    }
    
    /**
     * @notice Get all numbers in array
     * @return copy of numbers array
     */
    function getAllNumbers() external view returns (uint256[] memory) {
        return numbers;
    }
}