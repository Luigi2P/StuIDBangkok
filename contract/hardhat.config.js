/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
module.exports = {
  solidity: "0.8.20",
  networks: {
    // 示例：本地网络
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
