const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const ganache = require("ganache")

const { DAI, WBTC, WBTC_WHALE } = require("../config")
const DAI_ABI = require("../ABI/dai_abi.json")
const WBTC_ABI = require("../ABI/wbtc_abi.json")
//const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL)
//const provider = new ethers.providers.Web3Provider(ganache.provider())
const provider = new ethers.providers.JsonRpcProvider()

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Uniswap V2 Unit Tests", function () {
      // async function deployContractLockFixture() {
      //   let testUniswapV2, testUniswapV2Contract
      //   const accounts = await ethers.getSigners()
      //   //const provider = ethers.provider
      //   const deployer = accounts[0]
      //   const user = accounts[1]
      //   await deployments.fixture(["all"])
      //   testUniswapV2Contract = await ethers.getContract("TestUniswapV2")
      //   testUniswapV2 = testUniswapV2Contract.connect(deployer)
      //   const DAIContract = new ethers.Contract(DAI, DAI_ABI, provider)
      //   const WbtcContract = new ethers.Contract(WBTC, WBTC_ABI, provider)
      //   return { testUniswapV2, testUniswapV2Contract, DAIContract, WbtcContract, deployer, user }
      // }

      // describe("swap", function () {
      //   it("swap wbtc for dai successfully", async () => {
      //     let { testUniswapV2, testUniswapV2Contract, DAIContract, WbtcContract, deployer } =
      //       await loadFixture(deployContractLockFixture)

      //     await network.provider.request({
      //       method: "hardhat_impersonateAccount",
      //       params: [WBTC_WHALE],
      //     })

      //     const whale_signer = ethers.provider.getSigner(WBTC_WHALE)
      //     testUniswapV2 = testUniswapV2Contract.connect(whale_signer)

      //     let DeployerDaiBalanceBefore = await DAIContract.balanceOf(deployer.address)
      //     let DeployerWbtcBalanceBefore = await WbtcContract.balanceOf(deployer.address)
      //     console.log(`deployer dai:${DeployerDaiBalanceBefore}`)
      //     console.log(`deployer wbtc:${DeployerWbtcBalanceBefore}`)
      //     let WhaleDaiBalanceBefore = await DAIContract.balanceOf(WBTC_WHALE)
      //     let WhaleWbtcBalanceBefore = await WbtcContract.balanceOf(WBTC_WHALE)
      //     console.log(`whale dai:${WhaleDaiBalanceBefore}`)
      //     console.log(`whale wbtc:${WhaleWbtcBalanceBefore}`)
      //     await testUniswapV2.swap(WBTC, DAI, Wbtc_Input, 1, deployer.address)
      //     let DeployerDaiBalanceAfter = await DAIContract.balanceOf(deployer.address)
      //     let DeployerWbtcBalanceAfter = await WbtcContract.balanceOf(deployer.address)
      //     console.log(`deployer dai:${DeployerDaiBalanceAfter}`)
      //     console.log(`deployer wbtc:${DeployerWbtcBalanceAfter}`)
      //     let WhaleDaiBalanceAfter = await DAIContract.balanceOf(WBTC_WHALE)
      //     let WhaleWbtcBalanceAfter = await WbtcContract.balanceOf(WBTC_WHALE)
      //     console.log(`whale dai:${WhaleDaiBalanceAfter}`)
      //     console.log(`whale wbtc:${WhaleWbtcBalanceAfter}`)
      //   })
      // })
      let testUniswapV2, testUniswapV2Contract, DAIContract, WbtcContract
      let deployer, user
      beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user = accounts[1]
        await deployments.fixture(["all"])
        testUniswapV2Contract = await ethers.getContract("TestUniswapV2")
        testUniswapV2 = testUniswapV2Contract.connect(deployer)
        DAIContract = new ethers.Contract(DAI, DAI_ABI, provider)
        WbtcContract = new ethers.Contract(WBTC, WBTC_ABI, provider)
      })

      describe("swap", function () {
        it("swap wbtc for dai successfully", async () => {
          // create the signer instance
          //const wbtcWhaleSigner = await ethers.getSigner(WBTC_WHALE)
          const wbtcWhaleSigner = provider.getSigner(WBTC_WHALE)
          testUniswapV2 = testUniswapV2Contract.connect(wbtcWhaleSigner)

          let DeployerDaiBalanceBefore = await DAIContract.balanceOf(deployer.address)
          let DeployerWbtcBalanceBefore = await WbtcContract.balanceOf(deployer.address)
          console.log(`deployer dai before:${DeployerDaiBalanceBefore}`)
          console.log(`deployer wbtc before:${DeployerWbtcBalanceBefore}`)
          let WhaleDaiBalanceBefore = await DAIContract.balanceOf(WBTC_WHALE)
          let WhaleWbtcBalanceBefore = await WbtcContract.balanceOf(WBTC_WHALE)
          console.log(`whale dai before:${WhaleDaiBalanceBefore}`)
          console.log(`whale wbtc before:${WhaleWbtcBalanceBefore}`)
          await testUniswapV2.swap(WBTC, DAI, 100000000, 1, deployer.address, {
            gasLimit: 50000000000,
          })
          let DeployerDaiBalanceAfter = await DAIContract.balanceOf(deployer.address)
          let DeployerWbtcBalanceAfter = await WbtcContract.balanceOf(deployer.address)
          console.log(`deployer dai after:${DeployerDaiBalanceAfter}`)
          console.log(`deployer wbtc after:${DeployerWbtcBalanceAfter}`)
          let WhaleDaiBalanceAfter = await DAIContract.balanceOf(WBTC_WHALE)
          let WhaleWbtcBalanceAfter = await WbtcContract.balanceOf(WBTC_WHALE)
          console.log(`whale dai after:${WhaleDaiBalanceAfter}`)
          console.log(`whale wbtc after:${WhaleWbtcBalanceAfter}`)
        })
      })
    })
