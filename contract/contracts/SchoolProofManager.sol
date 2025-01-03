// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SchoolProofManager
 * @dev 管理学校身份验证的智能合约
 */
contract SchoolProofManager {
    // 定义一个结构体，用于存储每个学校的证明信息
    struct Proof {
        bytes32 proofData;    // 证明数据的哈希值
        uint256 expiryTime;   // 证明的有效期（时间戳）
    }

    // 映射：学校地址 => 其对应的证明信息
    mapping(address => Proof) public proofs;

    // 合约的拥有者（通常为管理员）
    address public owner;

    // 修饰符：仅允许合约拥有者执行的函数
    modifier onlyOwner() {
        require(msg.sender == owner, unicode"不是授权者");
        _;
    }

    // 构造函数，设置合约的拥有者为部署合约的地址
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev 发行学校证明，只有合约拥有者可以调用
     * @param schoolAddress 学校的钱包地址
     * @param proofData 证明数据的哈希值
     * @param expiryTime 证明的有效期（时间戳）
     */
    function issueProof(address schoolAddress, bytes32 proofData, uint256 expiryTime) external onlyOwner {
        require(schoolAddress != address(0), unicode"无效的地址");
        require(expiryTime > block.timestamp, unicode"有效期必须在未来");
        // 将证明信息存储到映射中
        proofs[schoolAddress] = Proof(proofData, expiryTime);
    }

    /**
     * @dev 验证学校的证明是否有效
     * @param schoolAddress 学校的钱包地址
     * @param proofData 提交的证明数据的哈希值
     * @return 是否验证通过
     */
    function verifyProof(address schoolAddress, bytes32 proofData) external view returns (bool) {
        Proof memory proof = proofs[schoolAddress];
        require(block.timestamp <= proof.expiryTime, unicode"证明已过期");
        require(proof.proofData == proofData, unicode"无效的证明数据");
        return true;
    }
}
