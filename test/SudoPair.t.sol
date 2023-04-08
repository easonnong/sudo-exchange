// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/SudoPair.sol";
import "./ERC20Mintable.sol";

contract SudoPairTest is Test {
    ERC20Mintable public token0;
    ERC20Mintable public token1;
    SudoPair public pair;

    function setUp() public {
        token0 = new ERC20Mintable("Token A", "TKNA");
        token1 = new ERC20Mintable("Tokn B", "TKNB");
        pair = new SudoPair(address(token0), address(token1));

        token0.mint(10 ether);
        token1.mint(10 ether);
    }

    function testMintBootstrap() public {
        token0.transfer(address(pair), 1 ether);
        token1.transfer(address(pair), 1 ether);

        pair.mint();

        assertEq(pair.balanceOf(address(this)), (1 ether - 1000));
        assertEq(pair.reserve0(), 1 ether);
        assertEq(pair.reserve1(), 1 ether);
        assertEq(pair.totalSupply(), 1 ether);
    }

    function testMintWhenTheresLiquidity() public {
        token0.transfer(address(pair), 1 ether);
        token1.transfer(address(pair), 1 ether);
        pair.mint();

        // ----

        uint256 balanceBefore = pair.balanceOf(address(this));

        token0.transfer(address(pair), 1 ether);
        token1.transfer(address(pair), 1 ether);
        pair.mint();

        uint256 balanceAfter = pair.balanceOf(address(this));
        uint256 balanceDiff = balanceAfter - balanceBefore;

        assertEq(balanceDiff, 1 ether);
        assertEq(pair.reserve0(), 2 ether);
        assertEq(pair.reserve1(), 2 ether);
        assertEq(pair.totalSupply(), 2 ether);
    }
}
