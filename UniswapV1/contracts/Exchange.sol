// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
  address public tokenAddr;

  constructor(address _tokenAddr) ERC20("Uniswap V1", "UNI_V1") {
    require(_tokenAddr != address(0));
    tokenAddr = _tokenAddr;
  }

  //*******************
  // Liquidity Function
  //*******************
  function addLiquidity(uint256 _amount) public payable returns (uint256) {
    if (getReserve() == 0) {
      IERC20 token = IERC20(tokenAddr);
      token.transferFrom(msg.sender, address(this), _amount);

      uint256 liquidity = address(this).balance;
      _mint(msg.sender, liquidity);
      return liquidity;
    } else {
      uint256 ethReserve = address(this).balance - msg.value;
      uint256 tokenReserve = getReserve();
      uint256 tokenAmount = (msg.value * tokenReserve) / ethReserve;
      require(tokenAmount <= _amount, "Invalid amount");
      IERC20 token = IERC20(tokenAddr);
      token.transferFrom(msg.sender, address(this), tokenAmount);

      uint256 liquidity = (totalSupply() * msg.value) / ethReserve;
      _mint(msg.sender, liquidity);
      return liquidity;
    }
  }

  function removeLiquidity(uint256 _amount) public returns (uint256, uint256) {
    require(_amount > 0, "Invalid amount");
    uint256 ethAmount = (address(this).balance * _amount) / totalSupply();
    uint256 tokenAmount = (getReserve() * _amount) / totalSupply();

    _burn(msg.sender, _amount);

    payable(msg.sender).transfer(ethAmount);
    IERC20(tokenAddr).transfer(msg.sender, tokenAmount);

    return (ethAmount, tokenAmount);
  }

  //*******************
  // Swap Function
  //*******************
  function ethToTokenSwap(uint256 _minTokens) public payable {
    uint256 tokenReserve = getReserve();
    uint256 tokenBought = getAmount(msg.value, address(this).balance - msg.value, tokenReserve);
    require(tokenBought >= _minTokens, "Insufficient output");
    IERC20(tokenAddr).transfer(msg.sender, tokenBought);
  }

  function tokenToEthSwap(uint256 _tokenSold, uint256 _minEth) public {
    uint256 tokenReserve = getReserve();
    uint256 ethBought = getAmount(_tokenSold, tokenReserve, address(this).balance);
    require(ethBought >= _minEth, "Insufficient output");
    IERC20(tokenAddr).transferFrom(msg.sender, address(this), _tokenSold);
    payable(msg.sender).transfer(ethBought);
  }

  //*******************
  // Getting Function
  //*******************

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
    require(_inputAmount > 0 && _inputReserve > 0, "Invalid reserves");
    uint256 inputAmountWithFee = _inputAmount * 99;
    uint256 numerator = inputAmountWithFee * _outputReserve;
    uint256 denominator = inputAmountWithFee + _inputReserve * 100;
    return numerator / denominator;
  }
}
