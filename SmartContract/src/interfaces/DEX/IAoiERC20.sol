// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAoiERC20 {
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    error InsufficientBalance(address from, uint256 fromBalance, uint256 value);
    error InsufficientAllowance(
        address spender,
        uint256 currentAllowance,
        uint256 value
    );
    error InvalidReceiver(address receiver);
    error InvalidSender(address sender);
    error InvalidApprover(address approver);
    error InvalidSpender(address spender);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function nonces(address owner) external view returns (uint256);

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}
