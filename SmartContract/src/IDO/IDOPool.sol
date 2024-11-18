//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IIDOPool} from "../interfaces/IIDOPool.sol";
import {IIDOFactory} from "../interfaces/IIDOFactory.sol";
import {IAoiFactory} from "../interfaces/DEX/IAoiFactory.sol";
import {IAoiPair} from "../interfaces/DEX/IAoiPair.sol";
import {IAoiRouter} from "../interfaces/DEX/IAoiRouter.sol";
import {IDOPoolState} from "./IDOPoolState.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {FixedPointMathLib} from "@solady/utils/FixedPointMathLib.sol";

contract IDOPool is IDOPoolState, IIDOPool, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using FixedPointMathLib for uint256;
    using SafeTransferLib for address;
    using MerkleProof for bytes32[];

    IDOPoolDetails internal poolDetail;

    IDOType internal idoType;

    mapping(address => Investor) internal investors;

    // MODIFIER

    modifier notZeroAddress(address _address) {
        if (_address == address(0)) {
            revert ZeroAddress();
        }
        _;
    }

    modifier isInIDOTimeFrame() {
        uint256 currentTime = block.timestamp;
        if (currentTime < poolDetail.startTime) {
            revert IDOIsNotStarted();
        }
        if (currentTime > poolDetail.endTime) {
            revert IDOIsEnded();
        }
        _;
    }

    modifier isIDOFinished() {
        if (block.timestamp <= poolDetail.endTime) {
            revert IDOPoolStillActive();
        }
        _;
    }

    modifier softCapReached() {
        if (poolDetail.softCap > poolDetail.raisedAmount) {
            revert SoftCapNotReached();
        }
        _;
    }

    modifier softCapNotReached() {
        if (poolDetail.softCap <= poolDetail.raisedAmount) {
            revert SoftCapReached();
        }
        _;
    }

    modifier notListedDex() {
        if (hasListedDex) {
            revert AlreadyListedDex();
        }
        _;
    }

    constructor(
        address _WETH,
        address _AOI_DEX_FACTORY,
        address _AOI_DEX_ROUTER
    )
        IDOPoolState(_WETH, _AOI_DEX_FACTORY, _AOI_DEX_ROUTER)
        Ownable(msg.sender)
    {}

    function initialize(
        IDOPoolDetails memory _poolDetail,
        address _poolOwner
    ) external override onlyOwner {
        if (initialized) {
            revert IDOPoolInitialized();
        }
        if (_poolDetail.tokenAddress == address(0)) {
            revert ZeroAddress();
        }
        if (_poolDetail.pricePerToken == 0) {
            revert InvalidTokenPrice();
        }
        if (
            _poolDetail.startTime < block.timestamp ||
            _poolDetail.startTime > _poolDetail.endTime
        ) {
            revert InvalidPoolTimeFrame();
        }
        if (_poolDetail.startTime < MIN_DELAY_STARTING + block.timestamp) {
            revert InvalidPoolDelayTime();
        }
        if (
            _poolDetail.maxInvest == 0 ||
            _poolDetail.maxInvest >= _poolDetail.hardCap ||
            _poolDetail.maxInvest < _poolDetail.minInvest
        ) {
            revert InvalidPoolMaxInvestment();
        }
        if (_poolDetail.minInvest <= 0) {
            revert InvalidPoolMinInvestment();
        }
        if (
            _poolDetail.hardCap <= 0 ||
            _poolDetail.hardCap <= _poolDetail.softCap
        ) {
            revert InvalidPoolSoftCap();
        }
        if (_poolDetail.softCap <= 0) {
            revert InvalidPoolHardCap();
        }
        if (_poolDetail.liquidityWETH9 < MIN_WETH) {
            revert InvalidLiquidityAmount();
        }
        poolDetail = _poolDetail;
        idoType = _poolDetail.whitelistedRoot == bytes32(0)
            ? IDOType.PUBLIC_SALE
            : IDOType.PRIVATE_SALE;
        poolOwner = _poolOwner;
        initialized = true;
    }

    function listInDex(
        address to
    )
        external
        override
        onlyOwner
        nonReentrant
        returns (address liquidityPoolAddress)
    {
        IERC20(poolDetail.tokenAddress).approve(
            AOI_DEX_ROUTER,
            poolDetail.liquidityToken
        );
        // Create LP & Add liquidityPool
        (, , uint liquidity) = IAoiRouter(AOI_DEX_ROUTER).addLiquidityETH{
            value: poolDetail.liquidityWETH9
        }(
            poolDetail.tokenAddress,
            poolDetail.liquidityToken,
            poolDetail.liquidityToken,
            poolDetail.liquidityWETH9,
            to,
            block.timestamp
        );
        // Get the LP address
        liquidityPoolAddress = IAoiFactory(AOI_DEX_FACTORY).getPair(
            poolDetail.tokenAddress,
            WETH
        );
        require(liquidityPoolAddress != address(0));

        emit IDOPoolListed(
            poolDetail.tokenAddress,
            liquidityPoolAddress,
            poolDetail.liquidityWETH9,
            poolDetail.liquidityToken,
            liquidity
        );
    }

    function investPrivatePool(
        bytes32[] memory proof,
        bytes32 leaf
    ) external payable override isInIDOTimeFrame {
        IDOPoolDetails memory _poolDetail = poolDetail;
        address investorAddress = _msgSender();

        // Check whether ido is private sales
        if (
            (idoType == IDOType.PRIVATE_SALE &&
                _verifyProof(
                    proof,
                    _poolDetail.whitelistedRoot,
                    investorAddress
                ) ==
                false) || idoType == IDOType.PUBLIC_SALE
        ) {
            revert IDOPoolIsPrivate();
        }
        _invest(investorAddress, msg.value);
    }

    function investPublicPool() external payable override isInIDOTimeFrame {
        address investorAddress = _msgSender();
        if (idoType == IDOType.PRIVATE_SALE) {
            revert IDOPoolIsPublic();
        }
        _invest(investorAddress, msg.value);
    }

    // Cancel whole invested amount.
    function cancelInvestment() external override isInIDOTimeFrame {
        address investorAddress = _msgSender();

        Investor memory investor = investors[investorAddress];
        uint256 investedAmount = investor.depositedAmount;
        uint256 tokenAmount = investor.tokenAmount;
        if (investedAmount == 0 || tokenAmount == 0) {
            revert NotEnoughBalance();
        }

        // Save state
        investors[investorAddress].depositedAmount = 0;
        investors[investorAddress].tokenAmount = 0;
        poolDetail.raisedAmount -= investedAmount; // TODO: need to check again to avoid lacking of token amount
        poolDetail.raisedTokenAmount -= tokenAmount;

        // Transfer whole invested amount back to investor
        investorAddress.safeTransferETH(investedAmount);

        emit IDOPoolWithdrawn(investorAddress, investedAmount);
    }

    // Redeem token after IDO finished
    function claimToken() external override isIDOFinished softCapReached {
        address investorAddress = _msgSender();
        Investor memory investor = investors[investorAddress];
        if (investor.claimed) {
            revert InvestorClaimed();
        }
        uint256 claimAmount = investors[investorAddress].tokenAmount;
        if (claimAmount == 0) {
            revert NotEnoughBalance();
        }

        // Transfer token to investor
        IERC20(poolDetail.tokenAddress).safeTransfer(
            investorAddress,
            claimAmount
        );

        // Save state
        investors[investorAddress].claimed = true;

        emit IDOPoolClaimed(investorAddress, claimAmount);
    }

    // Refund when the pool has not reached soft cap
    function refundToken() external override isIDOFinished softCapNotReached {
        address investorAddress = _msgSender();
        Investor memory investor = investors[investorAddress];
        if (investor.claimed) {
            revert InvestorClaimed();
        }
        uint256 investedAmount = investor.depositedAmount;
        if (investedAmount == 0) {
            revert NotEnoughBalance();
        }
        // Save state
        investors[investorAddress].claimed = true;
        // Transfer ETH back to investor
        investorAddress.safeTransferETH(investedAmount);

        emit IDOPoolRefunded(investorAddress, investedAmount);
    }

    function withdrawRemainingToken() external payable override {}

    // Only used when ido type is private and cannot change back to private type again
    function changeToPublicSale() external override onlyOwner {
        IDOPoolDetails memory pool = poolDetail;
        if (idoType == IDOType.PUBLIC_SALE) {
            revert IDOIsAlreadyPublicSale();
        }
        uint256 currentTime = block.timestamp;
        if (currentTime >= pool.startTime) {
            revert IDOIsAlreadyStarted();
        }

        idoType = IDOType.PUBLIC_SALE;

        emit IDOPoolChangedToPublic();
    }

    // INTERNAL FUCNTIONS
    function _verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        address addr
    ) internal view returns (bool) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr))));
        return proof.verify(root, leaf);
    }

    function _invest(
        address investorAddress,
        uint256 amountInvestment
    ) internal {
        IDOPoolDetails memory _poolDetail = poolDetail;
        Investor memory investor = investors[investorAddress];
        if (_poolDetail.hardCap < _poolDetail.raisedAmount + amountInvestment) {
            revert HardCapExceeded();
        }
        if (
            amountInvestment + investor.depositedAmount < _poolDetail.minInvest
        ) {
            revert MinInvestmentNotReached();
        }
        if (
            amountInvestment + investor.depositedAmount > _poolDetail.maxInvest
        ) {
            revert MaxInvestmentExceeded();
        }
        uint256 amountToken = poolDetail.pricePerToken.mulWad(amountInvestment);
        require(amountToken > 0);

        // Save state
        poolDetail.raisedAmount += amountInvestment;
        poolDetail.raisedTokenAmount += amountToken;
        investors[investorAddress].depositedAmount += amountInvestment;
        investors[investorAddress].tokenAmount += amountToken;

        emit IDOPoolInvested(investorAddress, amountInvestment);
    }
    // PUBLIC FUCNTIONS

    function getPoolDetails()
        external
        view
        override
        returns (IDOPoolDetails memory)
    {
        return poolDetail;
    }

    function getPoolRaisedAmount() external view override returns (uint256) {
        return poolDetail.raisedAmount;
    }

    function getPoolSoftCap() external view override returns (uint256) {
        return poolDetail.softCap;
    }

    function getPoolHardCap() external view override returns (uint256) {
        return poolDetail.hardCap;
    }

    function isWhitelisted(
        address _address
    ) external pure override returns (bool) {
        // TODO: implement internal function to check whitelisted
        return _address == address(0);
    }

    function getPoolMinInvest() external view override returns (uint256) {
        return poolDetail.minInvest;
    }

    function getPoolMaxInvest() external view override returns (uint256) {
        return poolDetail.maxInvest;
    }

    function isPoolActive() external view override returns (bool) {
        return block.timestamp < poolDetail.endTime;
    }

    function getTimeLeftEnding() external view override returns (uint256) {
        uint256 currentTime = block.timestamp;
        return
            poolDetail.endTime > currentTime
                ? poolDetail.endTime - currentTime
                : 0;
    }

    function getUserDepositAmount(
        address _address
    ) external view override returns (uint256) {
        Investor memory investor = investors[_address];
        return investor.depositedAmount;
    }

    function getPoolOwner() external view override returns (address) {
        return poolOwner;
    }

    function getAmountToTopUp() external view override returns (uint256) {
        uint256 hardCap = poolDetail.hardCap;
        uint8 poolTokenDecimals = IERC20Metadata(poolDetail.tokenAddress)
            .decimals();
        uint256 toBeToppedUp = (hardCap * (10 ** poolTokenDecimals)) /
            poolDetail.pricePerToken;
        return toBeToppedUp;
    }

    function getPoolTokenAddress() external view override returns (address) {
        return poolDetail.tokenAddress;
    }

    function getPoolTokenToppedUpAmount()
        external
        view
        override
        returns (uint256)
    {
        return IERC20(poolDetail.tokenAddress).balanceOf(address(this));
    }

    function getPoolStartTime() external view override returns (uint256) {
        return poolDetail.startTime;
    }

    function getPoolEndTime() external view override returns (uint256) {
        return poolDetail.endTime;
    }

    function getPoolSoftCapReached() external view override returns (bool) {
        uint256 raisedAmount = poolDetail.raisedAmount;
        uint256 softCap = poolDetail.softCap;
        return softCap == 0 ? false : raisedAmount >= softCap;
    }

    function getPricePerToken() external view override returns (uint256) {
        return poolDetail.pricePerToken;
    }

    function getLiquidityTokenAmount()
        external
        view
        override
        returns (uint256)
    {
        return poolDetail.liquidityToken;
    }

    function getLiquidityWETH9Amount()
        external
        view
        override
        returns (uint256)
    {
        return poolDetail.liquidityWETH9;
    }

    function getPoolTokenAmount() external view override returns (uint256) {
        return poolDetail.raisedTokenAmount;
    }

    // RECEIVE FUNCTIONS
    receive() external payable {}
}
