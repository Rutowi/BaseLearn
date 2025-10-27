// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

contract HelloWorld {

    function SayHello() external pure returns (string memory) {
        return "Hello World!";
    }

    function Greeter(string memory _name) external pure returns (string memory, string memory) {
        return ("Hello", _name);
    }
}