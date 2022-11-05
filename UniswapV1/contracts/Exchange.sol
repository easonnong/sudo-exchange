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

  function getEthAmount(uint256 _tokenSold) public view returns (uint256) {
    require(_tokenSold > 0, "Invalid amount");
    uint256 tokenReserve = getReserve();
    return getAmount(_tokenSold, tokenReserve, address(this).balance);
  }

  function getTokenAmount(uint256 _ethSold) public view returns (uint256) {
    require(_ethSold > 0, "Invalid amount");
    uint256 tokenReserve = getReserve();
    return getAmount(_ethSold, address(this).balance, tokenReserve);
  }

  function getAmount(
    uint256 _inputAmount,
    uint256 _inputReserve,
    uint256 _outputReserve
  ) private pure returns (uint256) {
    // x * y = k
    // (x+dx) * (y+dy) = k
    // dy = (x*y / (x+dx)) - y
    // dy = (x*y / (x+dx)) - (xy+ydx)/(x+dx)
    // dy = (-ydx)/(x+dx)
    return (_outputReserve * _inputReserve) / (_inputAmount + _inputReserve);
  }
}
