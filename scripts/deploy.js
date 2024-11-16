// scripts/deploy.js

// 从 Hardhat 中导入 ethers
const { ethers } = require("hardhat");

async function main() {
  // 获取部署者的签名
  const [deployer] = await ethers.getSigners();

  console.log("使用账户部署合约:", deployer.address);

  // 部署 ScoinToken 合约
  const initialSupply = ethers.parseEther("1000000"); // 初始供应量：100万个代币
  const ScoinTokenFactory = await ethers.getContractFactory("ScoinToken");
  const scoinToken = await ScoinTokenFactory.deploy(initialSupply);
  const scoinTokenAddr = await scoinToken.getAddress();
  console.log(`ScoinToken 部署在地址: ${scoinTokenAddr}`);

  // 部署 StudentProofManager 合约
  const StudentProofManagerFactory = await ethers.getContractFactory("StudentProofManager");
  const proofManager = await StudentProofManagerFactory.deploy();
  const proofManagerAddr = await proofManager.getAddress();
  //await proofManager.deployed();
  console.log(`StudentProofManager 部署在地址: ${proofManagerAddr}`);

  // 部署 SchoolProofManager 合约
  const SchoolProofManagerFactory = await ethers.getContractFactory("SchoolProofManager");
  const schoolProofManager = await SchoolProofManagerFactory.deploy();
  const schoolProofManagerAddr = await schoolProofManager.getAddress();
  //await proofManager.deployed();
  console.log(`SchoolProofManager 部署在地址: ${schoolProofManagerAddr}`);
  // 部署 MerchantProofManager 合约
  const MerchantProofManagerFactory = await ethers.getContractFactory("MerchantProofManager");
  const merchantProofManager = await MerchantProofManagerFactory.deploy();
  const merchantProofManagerAddr = await merchantProofManager.getAddress();
  //await proofManager.deployed();
  console.log(`MerchantProofManager 部署在地址: ${merchantProofManagerAddr}`);

  // 部署 SchoolActivityPlatform 合约
  const SchoolActivityPlatformFactory = await ethers.getContractFactory("SchoolActivityPlatform");
  const activityPlatform = await SchoolActivityPlatformFactory.deploy(
    proofManagerAddr,
    schoolProofManagerAddr,
    scoinTokenAddr,
  );
  const activityPlatformAddr = await activityPlatform.getAddress();
  //await activityPlatform.deployed();
  console.log(`SchoolActivityPlatform 部署在地址: ${activityPlatformAddr}`);

    // 部署 CampusMutualAidPlatform 合约
    const CampusMutualAidPlatformFactory = await ethers.getContractFactory("CampusMutualAidPlatform");
    const campusMutualAidPlatform = await CampusMutualAidPlatformFactory.deploy(
      proofManagerAddr,
      scoinTokenAddr,
  
    );
    const campusMutualAidPlatformAddr = await campusMutualAidPlatform.getAddress();
    //await activityPlatform.deployed();
    console.log(`campusMutualAidPlatform 部署在地址: ${campusMutualAidPlatformAddr}`);
}

// 执行脚本
main().catch((error) => {
  console.error("部署脚本出错:", error);
  process.exitCode = 1;
});
