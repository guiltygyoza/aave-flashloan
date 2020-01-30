pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./mocks/tokens/MintableERC20.sol";
import "./flashloan/base/FlashLoanReceiverBase.sol";
import "./configuration/LendingPoolAddressesProvider.sol";

contract FlashLoanReceiverArb is FlashLoanReceiverBase {

    using SafeMath for uint256;

    // Events
    event borrowMade(address _reserve, uint256 _amount , uint256 _value);

    constructor(LendingPoolAddressesProvider _provider) FlashLoanReceiverBase(_provider)
        public {}

    bytes32 public constant SALT = keccak256(abi.encodePacked("FlashLoanReceiver"));
    uint256 public constant TEST = 20200128;
    bytes   public paramFromExecuteOperation;

    /// implementing abstract function "executeOperation()" from IFlashLoanReceiver.sol:
    /// function executeOperation(address _reserve, uint256 _amount, uint256 _fee, bytes calldata _params) external;
    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    ) external {

        require(_amount <= getBalanceInternal(address(this), _reserve),
            "Invalid balance for the contract");

        // DO SOMETHING WITH THE BORROWED LIQUIDITY HERE

        emit borrowMade(_reserve, _amount , balanceAtReserve);

        transferFundsBackToPoolInternal(_reserve, _amount.add(_fee));

        paramFromExecuteOperation = _params;
    }
}
