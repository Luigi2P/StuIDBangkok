// test/SchoolActivityPlatform.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("SchoolActivityPlatform", function () {
  let owner;
  let student1;
  let student2;
  let organizer;
  let scoinToken;
  let proofManager;
  let activityPlatform;

  beforeEach(async function () {
    // 获取测试账户
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    student1 = accounts[1];
    student2 = accounts[2];
    organizer = accounts[3];

    // 部署 ScoinToken 合约
    const ScoinToken = await ethers.getContractFactory("ScoinToken");
    scoinToken = await ScoinToken.deploy(ethers.utils.parseEther("1000000"));
    await scoinToken.deployed();

    // 分发代币给学生和组织者
    await scoinToken.transfer(student1.address, ethers.utils.parseEther("1000"));
    await scoinToken.transfer(student2.address, ethers.utils.parseEther("1000"));
    await scoinToken.transfer(organizer.address, ethers.utils.parseEther("10000"));

    // 部署 StudentProofManager 合约
    const StudentProofManager = await ethers.getContractFactory("StudentProofManager");
    proofManager = await StudentProofManager.deploy();
    await proofManager.deployed();

    // 部署 SchoolActivityPlatform 合约
    const SchoolActivityPlatform = await ethers.getContractFactory("SchoolActivityPlatform");
    activityPlatform = await SchoolActivityPlatform.deploy(proofManager.address, scoinToken.address);
    await activityPlatform.deployed();

    // 学生设置证明数据
    await proofManager.connect(student1).setProof(ethers.utils.formatBytes32String("proof1"));
    await proofManager.connect(student2).setProof(ethers.utils.formatBytes32String("proof2"));
  });

  it("组织者可以创建活动", async function () {
    // 组织者批准合约转移代币
    await scoinToken.connect(organizer).approve(
      activityPlatform.address,
      ethers.utils.parseEther("1000")
    );

    // 创建活动
    await expect(
      activityPlatform
        .connect(organizer)
        .createActivity("Test Activity", ethers.utils.parseEther("1000"), 0)
    )
      .to.emit(activityPlatform, "ActivityCreated")
      .withArgs(0, organizer.address, ethers.utils.parseEther("1000"));
  });

  it("学生可以参与活动", async function () {
    // 前置条件：组织者创建活动
    await scoinToken.connect(organizer).approve(
      activityPlatform.address,
      ethers.utils.parseEther("1000")
    );
    await activityPlatform
      .connect(organizer)
      .createActivity("Test Activity", ethers.utils.parseEther("1000"), 0);

    // 学生1参与活动
    await expect(
      activityPlatform
        .connect(student1)
        .participate(0, ethers.utils.formatBytes32String("proof1"))
    )
      .to.emit(activityPlatform, "Participated")
      .withArgs(0, student1.address);

    // 学生2参与活动
    await expect(
      activityPlatform
        .connect(student2)
        .participate(0, ethers.utils.formatBytes32String("proof2"))
    )
      .to.emit(activityPlatform, "Participated")
      .withArgs(0, student2.address);
  });

  it("组织者可以完成活动并分发奖励", async function () {
    // 组织者创建活动
    await scoinToken.connect(organizer).approve(
      activityPlatform.address,
      ethers.utils.parseEther("1000")
    );
    await activityPlatform
      .connect(organizer)
      .createActivity("Test Activity", ethers.utils.parseEther("1000"), 0);

    // 学生参与活动
    await activityPlatform
      .connect(student1)
      .participate(0, ethers.utils.formatBytes32String("proof1"));
    await activityPlatform
      .connect(student2)
      .participate(0, ethers.utils.formatBytes32String("proof2"));

    // 组织者完成活动
    await expect(activityPlatform.connect(organizer).completeActivity(0))
      .to.emit(activityPlatform, "ActivityCompleted")
      .withArgs(0);

    // 分发奖励
    await expect(activityPlatform.connect(organizer).distributeReward(0))
      .to.emit(activityPlatform, "RewardDistributed")
      .withArgs(0);

    // 检查学生的代币余额是否增加
    const balance1 = await scoinToken.balanceOf(student1.address);
    const balance2 = await scoinToken.balanceOf(student2.address);

    expect(balance1).to.equal(ethers.utils.parseEther("1500")); // 1000 + 500
    expect(balance2).to.equal(ethers.utils.parseEther("1500")); // 1000 + 500
  });

  it("活动参与人数限制生效", async function () {
    // 创建限制为1人的活动
    await scoinToken.connect(organizer).approve(
      activityPlatform.address,
      ethers.utils.parseEther("1000")
    );
    await activityPlatform
      .connect(organizer)
      .createActivity("Limited Activity", ethers.utils.parseEther("1000"), 1);

    // 学生1参与活动
    await activityPlatform
      .connect(student1)
      .participate(0, ethers.utils.formatBytes32String("proof1"));

    // 学生2尝试参与活动，应失败
    await expect(
      activityPlatform
        .connect(student2)
        .participate(0, ethers.utils.formatBytes32String("proof2"))
    ).to.be.revertedWith("活动参与人数已满");
  });
});
