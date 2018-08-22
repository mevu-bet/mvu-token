pragma solidity ^0.4.18;


import './bancor/LimitedTransferBancorSmartToken.sol';


/**
  A Token which is 'Bancor' compatible and can mint new tokens and pause token-transfer functionality
*/
contract SirinSmartToken is LimitedTransferBancorSmartToken {

    // =================================================================================================================
    //                                         Members
    // =================================================================================================================

    string public name = "Mevu";

    string public symbol = "MVU";

    uint8 public decimals = 18;

    // =================================================================================================================
    //                                         Constructor
    // =================================================================================================================

    constructor() public {
        //Apart of 'Bancor' computability - triggered when a smart token is deployed
        emit NewSmartToken(address(this));
    }
}
