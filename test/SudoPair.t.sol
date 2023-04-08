// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/SudoPair.sol";

contract SudoPairTest is Test {
    SudoPair public pair;

    function setUp() public {
        pair = new SudoPair();
    }
}
