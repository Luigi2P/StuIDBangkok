// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 引入学生证明管理合约和 Scoin 代币合约
import "./StudentProofManager.sol";
import "./ScoinToken.sol";
// 引入 OpenZeppelin 的防重入攻击保护
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CampusMutualAidPlatform
 * @dev 校园互助平台智能合约
 */
contract CampusMutualAidPlatform is ReentrancyGuard {
    // 定义任务的结构体
    struct Task {
        address poster;         // 发布者地址
        string description;     // 任务描述
        uint256 reward;         // 奖励金额（Scoin 代币数量）
        address acceptor;       // 接取者地址
        bool isCompleted;       // 任务是否被标记为完成
        bool isApproved;        // 任务是否被批准
    }

    uint256 public taskCount = 0;                // 任务计数器
    mapping(uint256 => Task) public tasks;       // 任务 ID => 任务详情的映射

    StudentProofManager public proofManager;     // 学生证明管理合约的实例
    ScoinToken public scoinToken;                // Scoin 代币合约的实例

    // 定义事件，用于日志记录
    event TaskPosted(uint256 taskId, address indexed poster, uint256 reward);
    event TaskAccepted(uint256 taskId, address indexed acceptor);
    event TaskCompleted(uint256 taskId, address indexed acceptor);
    event TaskApproved(uint256 taskId, address indexed poster, address indexed acceptor);

    /**
     * @dev 构造函数，初始化学生证明管理合约和 Scoin 代币合约的地址
     * @param _proofManagerAddress 学生证明管理合约地址
     * @param _scoinTokenAddress Scoin 代币合约地址
     */
    constructor(address _proofManagerAddress, address _scoinTokenAddress) {
        proofManager = StudentProofManager(_proofManagerAddress);
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

    /**
     * @dev 发布任务
     * @param description 任务描述
     * @param reward 奖励金额（Scoin 代币数量）
     * @param proofData 学生证明数据的哈希值
     */
    function postTask(string memory description, uint256 reward, bytes32 proofData)
        external
        onlyVerifiedStudent(proofData)
        nonReentrant
    {
        require(reward > 0, unicode"奖励必须大于零");

        // 将奖励金额的代币从发布者转移到合约
        require(
            scoinToken.transferFrom(msg.sender, address(this), reward),
            unicode"奖励转移失败，可能是余额不足或未批准"
        );

        // 创建新任务并添加到映射中
        tasks[taskCount] = Task({
            poster: msg.sender,
            description: description,
            reward: reward,
            acceptor: address(0),
            isCompleted: false,
            isApproved: false
        });

        // 触发任务发布事件
        emit TaskPosted(taskCount, msg.sender, reward);

        // 增加任务计数器
        taskCount++;
    }

    /**
     * @dev 接取任务
     * @param taskId 要接取的任务 ID
     * @param proofData 学生证明数据的哈希值
     */
    function acceptTask(uint256 taskId, bytes32 proofData)
        external
        onlyVerifiedStudent(proofData)
        nonReentrant
    {
        Task storage task = tasks[taskId];
        require(task.poster != address(0), unicode"任务不存在");
        require(task.acceptor == address(0), unicode"任务已被接取");
        require(task.poster != msg.sender, unicode"不能接取自己发布的任务");

        // 将接取者地址记录到任务中
        task.acceptor = msg.sender;

        // 触发任务接取事件
        emit TaskAccepted(taskId, msg.sender);
    }

    /**
     * @dev 标记任务为完成
     * @param taskId 要标记的任务 ID
     */
    function completeTask(uint256 taskId)
        external
        nonReentrant
    {
        Task storage task = tasks[taskId];
        require(task.acceptor == msg.sender, unicode"只有接取者可以标记任务完成");
        require(!task.isCompleted, unicode"任务已标记为完成");

        // 将任务状态更新为已完成
        task.isCompleted = true;

        // 触发任务完成事件
        emit TaskCompleted(taskId, msg.sender);
    }

    /**
     * @dev 批准任务并发放奖励
     * @param taskId 要批准的任务 ID
     */
    function approveTask(uint256 taskId)
        external
        nonReentrant
    {
        Task storage task = tasks[taskId];
        require(task.poster == msg.sender, unicode"只有发布者可以批准任务");
        require(task.isCompleted, unicode"任务未被标记为完成");
        require(!task.isApproved, unicode"任务已被批准");

        // 将任务状态更新为已批准
        task.isApproved = true;

        // 将奖励金额的代币从合约转移给接取者
        require(
            scoinToken.transfer(task.acceptor, task.reward),
            unicode"奖励转移失败"
        );

        // 触发任务批准事件
        emit TaskApproved(taskId, msg.sender, task.acceptor);
    }
}
