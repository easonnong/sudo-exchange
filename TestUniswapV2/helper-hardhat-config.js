const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",
  },
  1331: {
    name: "ganache",
  },
  1: {
    name: "mainnet",
  },
  5: {
    name: "goerli",
  },
  137: {
    name: "polygon",
  },
}

const developmentChains = ["hardhat", "localhost", "ganache"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
}
