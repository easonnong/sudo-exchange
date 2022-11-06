const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { CustomError } = require("hardhat/internal/hardhat-network/stack-traces/model")
const { developmentChains } = require("../../helper-hardhat-config")
const { DAI, WBTC, WBTC_WHALE } = require("../config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Uniswap V2 Unit Tests", function () {
      const Dai_Input = ethers.utils.parseEther("10000")

      async function deployContractLockFixture() {
        let testUniswapV2, testUniswapV2Contract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["all"])
        testUniswapV2Contract = await ethers.getContract("TestUniswapV2")
        testUniswapV2 = testUniswapV2Contract.connect(deployer)
        return { testUniswapV2, testUniswapV2Contract, deployer, user }
      }

      describe("swap", function () {
        it("swap wbtc for dai successfully", async () => {
          let { testUniswapV2 } = await loadFixture(deployContractLockFixture)
          console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
          //testUniswapV2 = testUniswapV2Contract.connect(WBTC_WHALE)
          //await testUniswapV2.swap(DAI, WBTC, Dai_Input, 1, deployer.address)
        })
      })
    })
