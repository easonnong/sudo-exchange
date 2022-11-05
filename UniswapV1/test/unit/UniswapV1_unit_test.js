const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { CustomError } = require("hardhat/internal/hardhat-network/stack-traces/model")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Uniswap V1 Unit Tests", function () {
      const PRICE = ethers.utils.parseEther("0.1")
      const TOKEN_ID = 0

      async function deployContractLockFixture() {
        let exchange, exchangeContract, token, tokenContract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["all"])
        exchangeContract = await ethers.getContract("Exchange")
        exchange = exchangeContract.connect(deployer)
        tokenContract = await ethers.getContract("Token")
        token = tokenContract.connect(deployer)
        return { exchange, exchangeContract, token, deployer, user }
      }

      describe("Exchange", function () {
        describe("addLiquidity", function () {
          it("add liquidity successfully", async () => {
            let { exchange, token } = await loadFixture(deployContractLockFixture)
            await token.approve(exchange.address, "100")
            await exchange.addLiquidity("100")
            let reserve = await exchange.getReserve()
            assert.equal(reserve.toString(), "100")
          })
        })
      })
    })
