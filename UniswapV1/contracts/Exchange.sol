// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange {
    address public tokenAddr;

    constructor(address _tokenAddr) {
        require(_tokenAddr != address(0));
        tokenAddr = _tokenAddr;
    }

    function addLiquidity(uint256 _amount) public payable {
        IERC20 token = IERC20(tokenAddr);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function getReserve() public view returns (uint256) {
        return IERC20(tokenAddr).balanceOf(address(this));
    }
}
