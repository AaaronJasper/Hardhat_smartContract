require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks:{
    ganache: {
      url: 'http://127.0.0.1:8545',
    },
    hardhat: {
      forking: {
        url: "https://goerli.infura.io/v3/64cea5a323e44db19dcfd86784cb5947",
        blockNumber: 9900427
      }
    },
    goerli: {
      url: "https://goerli.infura.io/v3/64cea5a323e44db19dcfd86784cb5947",
      accounts: ['0x']
    }
  }
};
