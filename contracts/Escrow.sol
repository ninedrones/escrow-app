// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title Escrow
 * @dev A demo-only escrow contract for safe in-person swaps between JPY and crypto
 * @notice This contract is designed for hackathon demo purposes only
 */
contract Escrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    
    /// @notice Minimum JPY amount (¥1,000)
    uint256 public constant MIN_JPY_AMOUNT = 1000;
    
    /// @notice Maximum USD equivalent cap ($5,000)
    uint256 public constant MAX_USD_CAP = 5000 * 1e8; // $5,000 in 8 decimals
    
    /// @notice Default deadline duration (30 minutes)
    uint256 public constant DEFAULT_DEADLINE_DURATION = 30 minutes;
    
    /// @notice Maximum deadline duration (24 hours)
    uint256 public constant MAX_DEADLINE_DURATION = 24 hours;
    
    /// @notice Allowed tokens
    address public constant ETH_ADDRESS = address(0);
    address public immutable USDC_ADDRESS;
    address public immutable USDT_ADDRESS;
    
    // ============ State Variables ============
    
    /// @notice Chainlink price feeds
    AggregatorV3Interface public immutable ethUsdFeed;
    AggregatorV3Interface public immutable usdcUsdFeed;
    AggregatorV3Interface public immutable usdJpyFeed;
    
    /// @notice Escrow counter for unique IDs
    uint256 public escrowCounter;
    
    /// @notice Escrow data structure
    struct EscrowData {
        uint256 id;
        address maker;
        address taker;
        address asset;
        uint256 amount;
        uint256 jpyAmount;
        uint256 deadline;
        bytes32 hashOTC;
        bool isReleased;
        bool isRefunded;
        uint256 createdAt;
    }
    
    /// @notice Mapping from escrow ID to escrow data
    mapping(uint256 => EscrowData) public escrows;
    
    /// @notice Mapping from maker address to escrow IDs
    mapping(address => uint256[]) public makerEscrows;
    
    // ============ Events ============
    
    event EscrowCreated(
        uint256 indexed id,
        address indexed maker,
        address indexed taker,
        address asset,
        uint256 amount,
        uint256 jpyAmount,
        uint256 deadline,
        bytes32 hashOTC,
        uint256 priceRefTag
    );
    
    event EscrowReleased(
        uint256 indexed id,
        address indexed maker,
        address indexed taker,
        uint256 amount
    );
    
    event EscrowRefunded(
        uint256 indexed id,
        address indexed maker,
        uint256 amount
    );
    
    // ============ Errors ============
    
    error InvalidJPYAmount();
    error InvalidDeadline();
    error InvalidAsset();
    error EscrowNotFound();
    error EscrowAlreadyReleased();
    error EscrowAlreadyRefunded();
    error DeadlineNotReached();
    error OnlyMaker();
    error InvalidOTC();
    error OracleError();
    error ExceedsUSDCap();
    
    // ============ Constructor ============
    
    constructor(
        address _usdcAddress,
        address _usdtAddress,
        address _ethUsdFeed,
        address _usdcUsdFeed,
        address _usdJpyFeed
    ) {
        USDC_ADDRESS = _usdcAddress;
        USDT_ADDRESS = _usdtAddress;
        ethUsdFeed = AggregatorV3Interface(_ethUsdFeed);
        usdcUsdFeed = AggregatorV3Interface(_usdcUsdFeed);
        usdJpyFeed = AggregatorV3Interface(_usdJpyFeed);
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Create a new escrow
     * @param _taker The address of the taker
     * @param _asset The asset address (ETH = address(0), USDC, USDT)
     * @param _jpyAmount The JPY amount (must be multiple of ¥1,000)
     * @param _deadlineDuration The deadline duration in seconds (max 24h)
     * @param _otcCode The one-time code for verification
     * @return escrowId The created escrow ID
     */
    function createEscrow(
        address _taker,
        address _asset,
        uint256 _jpyAmount,
        uint256 _deadlineDuration,
        string memory _otcCode
    ) external payable nonReentrant returns (uint256 escrowId) {
        // Validate JPY amount (must be multiple of ¥1,000)
        if (_jpyAmount < MIN_JPY_AMOUNT || _jpyAmount % MIN_JPY_AMOUNT != 0) {
            revert InvalidJPYAmount();
        }
        
        // Validate deadline duration
        if (_deadlineDuration == 0) {
            _deadlineDuration = DEFAULT_DEADLINE_DURATION;
        }
        if (_deadlineDuration > MAX_DEADLINE_DURATION) {
            revert InvalidDeadline();
        }
        
        // Validate asset
        if (_asset != ETH_ADDRESS && _asset != USDC_ADDRESS && _asset != USDT_ADDRESS) {
            revert InvalidAsset();
        }
        
        // Get current prices from Chainlink
        (uint256 ethUsdPrice, uint256 usdcUsdPrice, uint256 usdJpyPrice) = _getCurrentPrices();
        
        // Calculate required asset amount
        uint256 requiredAmount = _calculateAssetAmount(
            _asset,
            _jpyAmount,
            ethUsdPrice,
            usdcUsdPrice,
            usdJpyPrice
        );
        
        // Check USD cap
        uint256 usdEquivalent = _calculateUSDEquivalent(
            _asset,
            requiredAmount,
            ethUsdPrice,
            usdcUsdPrice
        );
        if (usdEquivalent > MAX_USD_CAP) {
            revert ExceedsUSDCap();
        }
        
        // Handle asset transfer
        if (_asset == ETH_ADDRESS) {
            if (msg.value != requiredAmount) {
                revert InvalidAsset();
            }
        } else {
            IERC20(_asset).safeTransferFrom(msg.sender, address(this), requiredAmount);
        }
        
        // Generate escrow ID
        escrowId = ++escrowCounter;
        
        // Create escrow data
        escrows[escrowId] = EscrowData({
            id: escrowId,
            maker: msg.sender,
            taker: _taker,
            asset: _asset,
            amount: requiredAmount,
            jpyAmount: _jpyAmount,
            deadline: block.timestamp + _deadlineDuration,
            hashOTC: keccak256(abi.encodePacked(_otcCode, block.timestamp, escrowId)),
            isReleased: false,
            isRefunded: false,
            createdAt: block.timestamp
        });
        
        // Add to maker's escrows
        makerEscrows[msg.sender].push(escrowId);
        
        // Emit event
        emit EscrowCreated(
            escrowId,
            msg.sender,
            _taker,
            _asset,
            requiredAmount,
            _jpyAmount,
            block.timestamp + _deadlineDuration,
            keccak256(abi.encodePacked(_otcCode, block.timestamp, escrowId)),
            block.timestamp
        );
        
        return escrowId;
    }
    
    /**
     * @notice Release escrow funds to taker
     * @param _escrowId The escrow ID
     * @param _otcCode The one-time code for verification
     */
    function release(uint256 _escrowId, string memory _otcCode) external nonReentrant {
        EscrowData storage escrow = escrows[_escrowId];
        
        // Validate escrow exists
        if (escrow.maker == address(0)) {
            revert EscrowNotFound();
        }
        
        // Validate caller is maker
        if (msg.sender != escrow.maker) {
            revert OnlyMaker();
        }
        
        // Validate escrow not already released or refunded
        if (escrow.isReleased) {
            revert EscrowAlreadyReleased();
        }
        if (escrow.isRefunded) {
            revert EscrowAlreadyRefunded();
        }
        
        // Validate OTC code
        bytes32 expectedHash = keccak256(abi.encodePacked(_otcCode, escrow.createdAt, _escrowId));
        if (escrow.hashOTC != expectedHash) {
            revert InvalidOTC();
        }
        
        // Mark as released
        escrow.isReleased = true;
        
        // Transfer funds to taker
        if (escrow.asset == ETH_ADDRESS) {
            (bool success, ) = escrow.taker.call{value: escrow.amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(escrow.asset).safeTransfer(escrow.taker, escrow.amount);
        }
        
        // Emit event
        emit EscrowReleased(_escrowId, escrow.maker, escrow.taker, escrow.amount);
    }
    
    /**
     * @notice Refund escrow funds to maker
     * @param _escrowId The escrow ID
     */
    function refund(uint256 _escrowId) external nonReentrant {
        EscrowData storage escrow = escrows[_escrowId];
        
        // Validate escrow exists
        if (escrow.maker == address(0)) {
            revert EscrowNotFound();
        }
        
        // Validate caller is maker
        if (msg.sender != escrow.maker) {
            revert OnlyMaker();
        }
        
        // Validate deadline has passed
        if (block.timestamp < escrow.deadline) {
            revert DeadlineNotReached();
        }
        
        // Validate escrow not already released or refunded
        if (escrow.isReleased) {
            revert EscrowAlreadyReleased();
        }
        if (escrow.isRefunded) {
            revert EscrowAlreadyRefunded();
        }
        
        // Mark as refunded
        escrow.isRefunded = true;
        
        // Transfer funds back to maker
        if (escrow.asset == ETH_ADDRESS) {
            (bool success, ) = escrow.maker.call{value: escrow.amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(escrow.asset).safeTransfer(escrow.maker, escrow.amount);
        }
        
        // Emit event
        emit EscrowRefunded(_escrowId, escrow.maker, escrow.amount);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get escrow data
     * @param _escrowId The escrow ID
     * @return The escrow data
     */
    function getEscrow(uint256 _escrowId) external view returns (EscrowData memory) {
        return escrows[_escrowId];
    }
    
    /**
     * @notice Get maker's escrow IDs
     * @param _maker The maker address
     * @return Array of escrow IDs
     */
    function getMakerEscrows(address _maker) external view returns (uint256[] memory) {
        return makerEscrows[_maker];
    }
    
    /**
     * @notice Check if refund is available
     * @param _escrowId The escrow ID
     * @return True if refund is available
     */
    function isRefundAvailable(uint256 _escrowId) external view returns (bool) {
        EscrowData memory escrow = escrows[_escrowId];
        return !escrow.isReleased && 
               !escrow.isRefunded && 
               block.timestamp >= escrow.deadline;
    }
    
    /**
     * @notice Get time until refund is available
     * @param _escrowId The escrow ID
     * @return Seconds until refund is available (0 if available now)
     */
    function getTimeUntilRefund(uint256 _escrowId) external view returns (uint256) {
        EscrowData memory escrow = escrows[_escrowId];
        if (block.timestamp >= escrow.deadline) {
            return 0;
        }
        return escrow.deadline - block.timestamp;
    }
    
    // ============ Internal Functions ============
    
    /**
     * @notice Get current prices from Chainlink feeds
     * @return ethUsdPrice ETH/USD price in 8 decimals
     * @return usdcUsdPrice USDC/USD price in 8 decimals
     * @return usdJpyPrice USD/JPY price in 8 decimals
     */
    function _getCurrentPrices() internal view returns (uint256, uint256, uint256) {
        try ethUsdFeed.latestRoundData() returns (
            uint80,
            int256 ethUsdPrice,
            uint256,
            uint256,
            uint80
        ) {
            if (ethUsdPrice <= 0) revert OracleError();
            
            try usdcUsdFeed.latestRoundData() returns (
                uint80,
                int256 usdcUsdPrice,
                uint256,
                uint256,
                uint80
            ) {
                if (usdcUsdPrice <= 0) revert OracleError();
                
                try usdJpyFeed.latestRoundData() returns (
                    uint80,
                    int256 usdJpyPrice,
                    uint256,
                    uint256,
                    uint80
                ) {
                    if (usdJpyPrice <= 0) revert OracleError();
                    
                    return (uint256(ethUsdPrice), uint256(usdcUsdPrice), uint256(usdJpyPrice));
                } catch {
                    revert OracleError();
                }
            } catch {
                revert OracleError();
            }
        } catch {
            revert OracleError();
        }
    }
    
    /**
     * @notice Calculate required asset amount based on JPY amount
     * @param _asset The asset address
     * @param _jpyAmount The JPY amount
     * @param _ethUsdPrice ETH/USD price
     * @param _usdcUsdPrice USDC/USD price
     * @param _usdJpyPrice USD/JPY price
     * @return The required asset amount
     */
    function _calculateAssetAmount(
        address _asset,
        uint256 _jpyAmount,
        uint256 _ethUsdPrice,
        uint256 _usdcUsdPrice,
        uint256 _usdJpyPrice
    ) internal pure returns (uint256) {
        // Convert JPY to USD
        uint256 usdAmount = (_jpyAmount * 1e8) / _usdJpyPrice;
        
        if (_asset == ETH_ADDRESS) {
            // Calculate ETH amount (18 decimals)
            return (usdAmount * 1e18) / _ethUsdPrice;
        } else if (_asset == USDC_ADDRESS) {
            // Calculate USDC amount (6 decimals)
            return (usdAmount * 1e6) / _usdcUsdPrice;
        } else if (_asset == USDT_ADDRESS) {
            // Calculate USDT amount (6 decimals)
            return (usdAmount * 1e6) / _usdcUsdPrice;
        }
        
        revert InvalidAsset();
    }
    
    /**
     * @notice Calculate USD equivalent of asset amount
     * @param _asset The asset address
     * @param _amount The asset amount
     * @param _ethUsdPrice ETH/USD price
     * @param _usdcUsdPrice USDC/USD price
     * @return The USD equivalent in 8 decimals
     */
    function _calculateUSDEquivalent(
        address _asset,
        uint256 _amount,
        uint256 _ethUsdPrice,
        uint256 _usdcUsdPrice
    ) internal pure returns (uint256) {
        if (_asset == ETH_ADDRESS) {
            return (_amount * _ethUsdPrice) / 1e18;
        } else if (_asset == USDC_ADDRESS || _asset == USDT_ADDRESS) {
            return (_amount * _usdcUsdPrice) / 1e6;
        }
        
        revert InvalidAsset();
    }
    
    // ============ Receive Function ============
    
    receive() external payable {
        // Allow contract to receive ETH
    }
}
