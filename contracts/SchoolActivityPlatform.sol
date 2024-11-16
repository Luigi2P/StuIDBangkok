// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 引入学生证明管理合约、学校证明管理合约和 Scoin 代币合约
import "./StudentProofManager.sol";
import "./SchoolProofManager.sol";
import "./ScoinToken.sol";
// 引入 OpenZeppelin 的防重入攻击保护
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SchoolActivityPlatform
 * @dev 学校活动平台智能合约
 */
contract SchoolActivityPlatform is ReentrancyGuard {
    // 定义活动的结构体
    struct Activity {
        address organizer;        // 活动组织者（学校）地址
        string description;       // 活动描述
        uint256 reward;           // 总奖励金额（Scoin 代币数量）
        uint256 participantLimit; // 参与者数量限制（0 表示无限制）
        address[] participants;   // 参与者地址列表
        bool isCompleted;         // 活动是否已完成
        bool isRewardDistributed; // 奖励是否已分发
    }

    uint256 public activityCount = 0;                   // 活动计数器
    mapping(uint256 => Activity) public activities;     // 活动 ID => 活动详情的映射

    StudentProofManager public proofManager;            // 学生证明管理合约的实例
    SchoolProofManager public schoolProofManager;       // 学校证明管理合约的实例
    ScoinToken public scoinToken;                       // Scoin 代币合约的实例

    // 定义事件，用于日志记录
    event ActivityCreated(uint256 activityId, address indexed organizer, uint256 reward);
    event Participated(uint256 activityId, address indexed participant);
    event ActivityCompleted(uint256 activityId);
    event RewardDistributed(uint256 activityId);

    /**
     * @dev 构造函数，初始化证明管理合约和 Scoin 代币合约的地址
     * @param _proofManagerAddress 学生证明管理合约地址
     * @param _schoolProofManagerAddress 学校证明管理合约地址
     * @param _scoinTokenAddress Scoin 代币合约地址
     */
    constructor(
        address _proofManagerAddress,
        address _schoolProofManagerAddress,
        address _scoinTokenAddress
    ) {
        proofManager = StudentProofManager(_proofManagerAddress);
        schoolProofManager = SchoolProofManager(_schoolProofManagerAddress);
        scoinToken = ScoinToken(_scoinTokenAddress);
    }

    // 修饰符：仅允许已验证的学生调用的方法
    modifier onlyVerifiedStudent(bytes32 proofData) {
        require(
            proofManager.verifyProof(msg.sender, proofData),
            unicode"未验证的学生或证明已过期"
        );
        _;
    }

    // 修饰符：仅允许已验证的学校调用的方法
    modifier onlyVerifiedSchool(bytes32 proofData) {
        require(
            schoolProofManager.verifyProof(msg.sender, proofData),
            unicode"未验证的学校或证明已过期"
        );
        _;
    }

    // 修饰符：仅允许组织者调用的方法
    modifier onlyOrganizer(uint256 activityId) {
        require(
            activities[activityId].organizer == msg.sender,
            unicode"只有活动组织者可以执行此操作"
        );
        _;
    }

    /**
     * @dev 创建活动，只有已验证的学校可以调用
     * @param description 活动描述
     * @param reward 总奖励金额（Scoin 代币数量）
     * @param participantLimit 参与者数量限制（0 表示无限制）
     * @param proofData 学校证明数据的哈希值
     */
    function createActivity(
        string memory description,
        uint256 reward,
        uint256 participantLimit,
        bytes32 proofData
    ) external onlyVerifiedSchool(proofData) nonReentrant {
        require(reward > 0, unicode"奖励必须大于零");

        // 将奖励金额的代币从组织者转移到合约
        require(
            scoinToken.transferFrom(msg.sender, address(this), reward),
            unicode"奖励转移失败，可能是余额不足或未批准"
        );

        // 创建新活动并添加到映射中
        activities[activityCount] = Activity({
            organizer: msg.sender,
            description: description,
            reward: reward,
            participantLimit: participantLimit,
            participants: new address[](0),
            isCompleted: false,
            isRewardDistributed: false
        });

        // 触发活动创建事件
        emit ActivityCreated(activityCount, msg.sender, reward);

        // 增加活动计数器
        activityCount++;
    }

    /**
     * @dev 参与活动
     * @param activityId 要参与的活动 ID
     * @param proofData 学生证明数据的哈希值
     */
    function participate(uint256 activityId, bytes32 proofData)
        external
        onlyVerifiedStudent(proofData)
        nonReentrant
    {
        Activity storage activity = activities[activityId];
        require(activity.organizer != address(0), unicode"活动不存在");
        require(!activity.isCompleted, unicode"活动已结束");
        require(
            activity.participantLimit == 0 ||
                activity.participants.length < activity.participantLimit,
            unicode"活动参与人数已满"
        );

        // 检查是否已参与
        for (uint256 i = 0; i < activity.participants.length; i++) {
            require(activity.participants[i] != msg.sender, unicode"已参与该活动");
        }

        // 将参与者添加到活动中
        activity.participants.push(msg.sender);

        // 触发参与事件
        emit Participated(activityId, msg.sender);
    }

    /**
     * @dev 标记活动为完成
     * @param activityId 要标记的活动 ID
     */
    function completeActivity(uint256 activityId)
        external
        onlyOrganizer(activityId)
        nonReentrant
    {
        Activity storage activity = activities[activityId];
        require(!activity.isCompleted, unicode"活动已标记为完成");

        // 将活动状态更新为已完成
        activity.isCompleted = true;

        // 触发活动完成事件
        emit ActivityCompleted(activityId);
    }

    /**
     * @dev 分发奖励给参与者
     * @param activityId 要分发奖励的活动 ID
     */
    function distributeReward(uint256 activityId)
        external
        onlyOrganizer(activityId)
        nonReentrant
    {
        Activity storage activity = activities[activityId];
        require(activity.isCompleted, unicode"活动未完成");
        require(!activity.isRewardDistributed, unicode"奖励已分发");

        uint256 participantCount = activity.participants.length;
        require(participantCount > 0, unicode"没有参与者可分发奖励");

        uint256 rewardPerParticipant = activity.reward / participantCount;

        // 分发奖励给每个参与者
        for (uint256 i = 0; i < participantCount; i++) {
            require(
                scoinToken.transfer(activity.participants[i], rewardPerParticipant),
                unicode"奖励转移失败"
            );
        }

        // 如果有剩余的代币，退还给组织者
        uint256 remaining = activity.reward % participantCount;
        if (remaining > 0) {
            require(
                scoinToken.transfer(activity.organizer, remaining),
                unicode"剩余奖励退还失败"
            );
        }

        // 将奖励状态更新为已分发
        activity.isRewardDistributed = true;

        // 触发奖励分发事件
        emit RewardDistributed(activityId);
    }
}
