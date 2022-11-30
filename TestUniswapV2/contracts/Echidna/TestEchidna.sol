// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Counter {
  uint public count;

  function inc() external {
    count++;
  }

  function dec() external {
    count--;
  }
}

// echidna-test TestEchidna.sol --contract TestCounter --test-limit 5000
contract TestCounter is Counter {
  function echidna_test_pass() public pure returns (bool) {
    return true;
  }

  function echidna_test_false() public pure returns (bool) {
    return false;
  }

  function echidna_test_count() public view returns (bool) {
    return count <= 5;
  }
}

// echidna-test TestEchidna.sol --contract TestAssert --test-mode assertion
contract TestAssert {
  function test_assert(uint _i) external pure {
    assert(_i > 10);
  }

  function abs(uint x, uint y) private pure returns (uint) {
    if (x >= y) {
      return x - y;
    }
    return y - x;
  }

  function test_abs(uint x, uint y) external pure {
    uint z = abs(x, y);
    if (x >= y) {
      assert(z <= x);
    } else {
      assert(z <= y);
    }
  }
}
