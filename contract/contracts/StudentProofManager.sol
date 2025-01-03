// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title StudentProofManager
 * @dev 管理学生证明的智能合约，不涉及学生的真实身份信息。
 */
contract StudentProofManager {
    // 定义一个结构体，用于存储每个学生的证明信息
    struct Proof {
        bytes32 proofData;    // 证明数据的哈希值
        uint256 expiryTime;   // 证明的有效期（时间戳）
    }

    // 映射：学生地址 => 其对应的证明信息
    mapping(address => Proof) public proofs;

    // 合约的拥有者（通常为管理员）
    address public owner;

    // 修饰符：仅允许合约拥有者执行的函数
    modifier onlyOwner() {
        require(msg.sender == owner,unicode"不是授权者");
        _;
    }

    // 构造函数，设置合约的拥有者为部署合约的地址
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev 发行学生证明，只有合约拥有者可以调用
     * @param studentAddress 学生的钱包地址
     * @param proofData 证明数据的哈希值
     * @param expiryTime 证明的有效期（时间戳）
     */
    function issueProof(address studentAddress, bytes32 proofData, uint256 expiryTime) external onlyOwner {
        require(studentAddress != address(0), unicode"无效的地址");
        require(expiryTime > block.timestamp, unicode"有效期必须在未来");
        // 将证明信息存储到映射中
        proofs[studentAddress] = Proof(proofData, expiryTime);
    }

    /**
     * @dev 验证学生的证明是否有效
     * @param studentAddress 学生的钱包地址
     * @param proofData 提交的证明数据的哈希值
     * @return 是否验证通过
     */
    function verifyProof(address studentAddress, bytes32 proofData) external view returns (bool) {
        Proof memory proof = proofs[studentAddress];
        require(block.timestamp <= proof.expiryTime, unicode"证明已过期");
        require(proof.proofData == proofData, unicode"无效的证明数据");
        return true;
    }
}
