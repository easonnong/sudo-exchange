// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

interface ISudoCallee {
    function sudoCall(
        address sender,
        uint256 amount0Out,
        uint256 amount1Out,
        bytes calldata data
    ) external;
}
