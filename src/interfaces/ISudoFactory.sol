// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface ISudoFactory {
    function pairs(address, address) external pure returns (address);

    function createPair(address, address) external returns (address);
}
