const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const { DAI, WBTC, WBTC_WHALE } = require("../config")
const ERC20ABI = require("../../node_modules/@openzeppelin/contracts/build/contracts/ERC20.json")
const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL)

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Uniswap V2 Unit Tests", function () {
      const Wbtc_Input = ethers.utils.parseEther("10")

      async function deployContractLockFixture() {
        let testUniswapV2, testUniswapV2Contract
        const accounts = await ethers.getSigners()
        const deployer = accounts[0]
        const user = accounts[1]
        await deployments.fixture(["all"])
        testUniswapV2Contract = await ethers.getContract("TestUniswapV2")
        testUniswapV2 = testUniswapV2Contract.connect(deployer)
        console.log(`1`)
        const DAIContract = new ethers.Contract(DAI, ERC20ABI, provider)
        console.log(`2`)
        const WbtcContract = new ethers.Contract(WBTC, ERC20ABI, provider)
        return { testUniswapV2, testUniswapV2Contract, DAIContract, WbtcContract, deployer, user }
      }

      describe("swap", function () {
        it("swap wbtc for dai successfully", async () => {
          let { testUniswapV2, testUniswapV2Contract, DAIContract, WbtcContract, deployer } =
            await loadFixture(deployContractLockFixture)

          const whale_signer = ethers.provider.getSigner(WBTC_WHALE)
          testUniswapV2 = testUniswapV2Contract.connect(whale_signer)

          let DeployerDaiBalanceBefore = await DAIContract.balanceOf(deployer)
          let DeployerWbtcBalanceBefore = await WbtcContract.balanceOf(deployer)
          console.log(`deployer dai:${DeployerDaiBalanceBefore}`)
          console.log(`deployer wbtc:${DeployerWbtcBalanceBefore}`)
          let WhaleDaiBalanceBefore = await DAIContract.balanceOf(deployer)
          let WhaleWbtcBalanceBefore = await WbtcContract.balanceOf(deployer)
          console.log(`whale dai:${WhaleDaiBalanceBefore}`)
          console.log(`whale wbtc:${WhaleWbtcBalanceBefore}`)
          await testUniswapV2.swap(WBTC, DAI, Wbtc_Input, 1, deployer.address)
          let DeployerDaiBalanceAfter = await DAIContract.balanceOf(deployer)
          let DeployerWbtcBalanceAfter = await WbtcContract.balanceOf(deployer)
          console.log(`deployer dai:${DeployerDaiBalanceAfter}`)
          console.log(`deployer wbtc:${DeployerWbtcBalanceAfter}`)
          let WhaleDaiBalanceAfter = await DAIContract.balanceOf(deployer)
          let WhaleWbtcBalanceAfter = await WbtcContract.balanceOf(deployer)
          console.log(`whale dai:${WhaleDaiBalanceAfter}`)
          console.log(`whale wbtc:${WhaleWbtcBalanceAfter}`)
        })
      })
    })
