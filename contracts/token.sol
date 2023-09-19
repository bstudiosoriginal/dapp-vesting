// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenContract is ERC20 {

    bool public _isSupplied = false;

    
    constructor(uint initialSupply, string memory token_name, string memory token_symbol) 
        ERC20(token_name, token_symbol) {
        _isSupplied = true;
        _mint(msg.sender, initialSupply);
    }

    function isSupplied() public view returns(bool){
        return _isSupplied;
    }
}