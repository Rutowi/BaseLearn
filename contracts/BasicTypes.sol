// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

/**
 * @title BasicTypes
 * @dev Contrat démonstratif des types de base selon Base Learn curriculum
 * @author Base Learn - Module 2
 */
contract BasicTypes {
    
    // ==== INTEGERS ====
    
    // uint (unsigned integer) - valeurs positives seulement
    uint public defaultUint; // Valeur par défaut = 0
    uint256 public largeNumber = 1000000;
    uint8 public smallNumber = 255; // Max value for uint8
    
    // int (signed integer) - peut être négatif
    int public temperature = -10;
    int256 public signedNumber = -1000;
    
    // Constantes et immutables
    uint constant public NUMBER_OF_TEAMS = 10;
    uint immutable public contractCreationTime;
    
    // ==== BOOLEAN ====
    
    bool public isActive = true;
    bool public isComplete; // Valeur par défaut = false
    
    // ==== ADDRESS ====
    
    address public owner;
    address payable public treasury;
    
    // ==== STRINGS ET BYTES ====
    
    string public contractName = "BasicTypes Demo";
    bytes32 public hashedData;
    bytes public dynamicData;
    
    // ==== ENUMS ====
    
    enum Status { Pending, Active, Completed, Cancelled }
    Status public currentStatus = Status.Pending;
    
    enum Flavors { Vanilla, Chocolate, Strawberry, Coffee }
    Flavors public chosenFlavor = Flavors.Coffee;
    
    // ==== EVENTS ====
    
    event NumberUpdated(uint256 newNumber, address updater);
    event StatusChanged(Status oldStatus, Status newStatus);
    event FlavorChosen(Flavors flavor, address chooser);
    
    // ==== CONSTRUCTOR ====
    
    constructor() {
        owner = msg.sender;
        treasury = payable(msg.sender);
        contractCreationTime = block.timestamp;
        hashedData = keccak256(abi.encodePacked("Basic Types Contract"));
    }
    
    // ==== FUNCTIONS POUR DÉMONTRER LES TYPES ====
    
    /**
     * @dev Démonstration des opérations avec uint
     */
    function updateLargeNumber(uint256 _newNumber) external {
        require(_newNumber > 0, "Number must be positive");
        largeNumber = _newNumber;
        emit NumberUpdated(_newNumber, msg.sender);
    }
    
    /**
     * @dev Démonstration des comparaisons d'entiers
     */
    function compareNumbers(uint256 _number1, uint256 _number2) external pure returns (string memory) {
        if (_number1 > _number2) {
            return "First number is larger";
        } else if (_number1 < _number2) {
            return "Second number is larger";
        } else {
            return "Numbers are equal";
        }
    }
    
    /**
     * @dev Démonstration des opérations arithmétiques
     */
    function mathOperations(uint256 a, uint256 b) external pure returns (
        uint256 sum,
        uint256 difference,
        uint256 product,
        uint256 quotient,
        uint256 remainder
    ) {
        require(b > 0, "Division by zero");
        
        sum = a + b;
        difference = a > b ? a - b : 0; // Éviter underflow
        product = a * b;
        quotient = a / b;
        remainder = a % b;
    }
    
    /**
     * @dev Démonstration des opérations boolean
     */
    function booleanOperations(bool _input1, bool _input2) external pure returns (
        bool andResult,
        bool orResult,
        bool notResult1,
        bool equalResult
    ) {
        andResult = _input1 && _input2;
        orResult = _input1 || _input2;
        notResult1 = !_input1;
        equalResult = _input1 == _input2;
    }
    
    /**
     * @dev Démonstration des fonctions d'address
     */
    function getAddressInfo(address _addr) external view returns (
        uint256 balance,
        bool isContract,
        bool isZeroAddress
    ) {
        balance = _addr.balance;
        isContract = _addr.code.length > 0;
        isZeroAddress = _addr == address(0);
    }
    
    /**
     * @dev Démonstration des opérations sur les strings
     */
    function updateContractName(string memory _newName) external {
        require(bytes(_newName).length > 0, "Name cannot be empty");
        contractName = _newName;
    }
    
    /**
     * @dev Concaténation de strings (Solidity 0.8.12+)
     */
    function concatenateStrings(string memory _first, string memory _second) 
        external 
        pure 
        returns (string memory) 
    {
        return string.concat(_first, " ", _second);
    }
    
    /**
     * @dev Démonstration des enums
     */
    function changeStatus(Status _newStatus) external {
        Status oldStatus = currentStatus;
        currentStatus = _newStatus;
        emit StatusChanged(oldStatus, _newStatus);
    }
    
    /**
     * @dev Conversion enum vers uint
     */
    function getStatusAsNumber() external view returns (uint8) {
        return uint8(currentStatus);
    }
    
    /**
     * @dev Démonstration du choix de saveur
     */
    function chooseFlavor(Flavors _flavor) external {
        chosenFlavor = _flavor;
        emit FlavorChosen(_flavor, msg.sender);
    }
    
    /**
     * @dev Démonstration du casting de types
     */
    function typeCasting(uint256 _largeNumber) external pure returns (
        uint8 smallCasted,
        int256 signedCasted
    ) {
        // Attention : casting peut causer overflow/underflow
        smallCasted = uint8(_largeNumber); // Peut perdre des données si > 255
        signedCasted = int256(_largeNumber);
    }
    
    /**
     * @dev Vérification des limites de type
     */
    function getTypeLimits() external pure returns (
        uint256 maxUint256,
        uint256 minUint256,
        int256 maxInt256,
        int256 minInt256,
        uint8 maxUint8
    ) {
        maxUint256 = type(uint256).max;
        minUint256 = type(uint256).min;
        maxInt256 = type(int256).max;
        minInt256 = type(int256).min;
        maxUint8 = type(uint8).max;
    }
    
    /**
     * @dev Démonstration des bytes
     */
    function storeDynamicBytes(bytes memory _data) external {
        dynamicData = _data;
    }
    
    /**
     * @dev Hachage de données
     */
    function hashString(string memory _input) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(_input));
    }
    
    /**
     * @dev Fonction pour recevoir des ETH
     */
    function deposit() external payable {
        require(msg.value > 0, "Must send ETH");
        // ETH est automatiquement ajouté au balance du contrat
    }
    
    /**
     * @dev Obtenir le balance du contrat
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Modifier pour restreindre l'accès au propriétaire
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Changer le propriétaire (seulement par le propriétaire actuel)
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
    
    /**
     * @dev Fonction d'urgence pour retirer les fonds
     */
    function emergencyWithdraw() external onlyOwner {
        treasury.transfer(address(this).balance);
    }
}