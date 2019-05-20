pragma solidity ^0.4.18;

import './crowdsale/RefundVault.sol';
import './crowdsale/FinalizableCrowdsale.sol';
import './math/SafeMath.sol';
import './SirinSmartToken.sol';


contract SirinCrowdsale is FinalizableCrowdsale {

    // =================================================================================================================
    //                                      Constants
    // =================================================================================================================
    // Max amount of known addresses of which will get MVU by 'Grant' method.
    //
    // grantees addresses will be Mevu wallets addresses.
    // these wallets will contain MVU tokens that will be used for 2 purposes only -
    // 1. MVU tokens against raised fiat money
    // 2. MVU tokens for presale bonus and FIFA Campaign.
    // we set the value to 10 (and not to 2) because we want to allow some flexibility for cases like fiat money that is raised close to the crowdsale.
    // we limit the value to 10 (and not larger) to limit the run time of the function that process the grantees array.
    //uint8 public constant MAX_TOKEN_GRANTEES = 10;

    // MVU to ETH base rate
    uint256 public constant EXCHANGE_RATE = 625;

    // Refund division rate
    uint256 public constant REFUND_DIVISION_RATE = 2;

    uint256 public founderGrant = 45000000000000000000000000;

  

    // =================================================================================================================
    //                                      Modifiers
    // =================================================================================================================

    /**
     * @dev Throws if called not during the crowdsale time frame
     */
    modifier onlyWhileSale() {
        require(isActive());
        _;
    }

    // =================================================================================================================
    //                                      Members
    // =================================================================================================================

   
    address public walletFounders;  //multi-sig wallet controlled by founding team


    // Funds collected outside the crowdsale in wei
    uint256 public fiatRaisedConvertedToWei;

    //Grantees - used for non-ether and presale bonus token generation
    //address[] public presaleGranteesMapKeys;
    //mapping (address => uint256) public presaleGranteesMap;  //address=>wei token amount

    // The refund vault
    RefundVault public refundVault;
    SirinSmartToken public token;

    // =================================================================================================================
    //                                      Events
    // =================================================================================================================
    // event GrantAdded(address indexed _grantee, uint256 _amount);

    // event GrantUpdated(address indexed _grantee, uint256 _oldAmount, uint256 _newAmount);

    // event GrantDeleted(address indexed _grantee, uint256 _hadAmount);

    event FiatRaisedUpdated(address indexed _address, uint256 _fiatRaised);

    event TokenPurchaseWithGuarantee(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    // =================================================================================================================
    //                                      Constructors
    // =================================================================================================================

    constructor(uint256 _startTime,
    uint256 _endTime,    
    address _walletFounders,
    address _sirinSmartToken,
    address _refundVault)
    public
    Crowdsale(_startTime, _endTime, EXCHANGE_RATE, _walletFounders, SirinSmartToken(_sirinSmartToken)) {
      
        require(_walletFounders != address(0));      
        require(_sirinSmartToken != address(0));
        require(_refundVault != address(0));
   
        walletFounders = _walletFounders;      

        token = SirinSmartToken(_sirinSmartToken);
        refundVault  = RefundVault(_refundVault);

        
    }

    // =================================================================================================================
    //                                      Impl Crowdsale
    // =================================================================================================================

    // @return the rate in MVU per 1 ETH according to the time of the tx and the MVU pricing program.
    // @Override
    function getRate() public view returns (uint256) {
        if (now < (startTime.add(9 days))) {return 808;}
        if (now < (startTime.add(10 days))) {return 797;}
        if (now < (startTime.add(11 days))) {return 785;}
        if (now < (startTime.add(12 days))) {return 774;}
        if (now < (startTime.add(13 days))) {return 763;}
        if (now < (startTime.add(14 days))) {return 753;}
        if (now < (startTime.add(15 days))) {return 743;}
        if (now < (startTime.add(16 days))) {return 733;}
        if (now < (startTime.add(17 days))) {return 723;}
        if (now < (startTime.add(18 days))) {return 714;}
        if (now < (startTime.add(19 days))) {return 705;}
        if (now < (startTime.add(20 days))) {return 696;}
        if (now < (startTime.add(21 days))) {return 687;}
        if (now < (startTime.add(22 days))) {return 679;}
        if (now < (startTime.add(23 days))) {return 670;}
        if (now < (startTime.add(24 days))) {return 662;}
        if (now < (startTime.add(25 days))) {return 654;}
        if (now < (startTime.add(26 days))) {return 647;}
        if (now < (startTime.add(27 days))) {return 639;}
        if (now < (startTime.add(28 days))) {return 632;}
     
        return EXCHANGE_RATE;
    }

    // =================================================================================================================
    //                                      Impl FinalizableCrowdsale
    // =================================================================================================================

    //@Override
    function finalization() internal onlyOwner {
        super.finalization();

        // granting bonuses for the pre crowdsale grantees:
        // for (uint256 i = 0; i < presaleGranteesMapKeys.length; i++) {
        //     token.issue(presaleGranteesMapKeys[i], presaleGranteesMap[presaleGranteesMapKeys[i]]);
        // }

        // // Adding approx 14% of the total token supply
        // // 40 * 2.5 = 100
        // uint256 newTotalSupply = token.totalSupply().mul(250).div(100);

        // // 10% of the total number of SRN tokens will be allocated to the team
        // token.issue(walletTeam, newTotalSupply.mul(10).div(100));

        // // 10% of the total number of SRN tokens will be allocated to OEM’s, Operating System implementation,
        // // SDK developers and rebate to device and Sirin OS™ users
        // token.issue(walletOEM, newTotalSupply.mul(10).div(100));

        // // 5% of the total number of SRN tokens will be allocated to professional fees and Bounties
        // token.issue(walletBounties, newTotalSupply.mul(5).div(100));

        // // 35% of the total number of SRN tokens will be allocated to SIRIN LABS,
        // // and as a reserve for the company to be used for future strategic plans for the created ecosystem
        // token.issue(walletReserve, newTotalSupply.mul(35).div(100));

        // Issue tokens to founder MultiSig so they can disperse to advisors, presale, airdrop
        token.issue(walletFounders, founderGrant);

        // Re-enable transfers after the token sale.
        token.disableTransfers(false);

        // Re-enable destroy function after the token sale.
        token.setDestroyEnabled(true);

        // Enable ETH refunds and token claim.
        refundVault.enableRefunds();

        // transfer token ownership to crowdsale owner
        token.transferOwnership(owner);

        // transfer refundVault ownership to crowdsale owner
        refundVault.transferOwnership(owner);
    }

    // =================================================================================================================
    //                                      Public Methods
    // =================================================================================================================
    // @return the total funds collected in wei(ETH and none ETH).
    function getTotalFundsRaised() public view returns (uint256) {
        return fiatRaisedConvertedToWei.add(weiRaised);
    }

    // @return true if the crowdsale is active, hence users can buy tokens
    function isActive() public view returns (bool) {
        return now >= startTime && now < endTime;
    }

    // =================================================================================================================
    //                                      External Methods
    // =================================================================================================================
    // @dev Adds/Updates address and token allocation for token grants.
    // Granted tokens are allocated to non-ether, presale, buyers.
    // @param _grantee address The address of the token grantee.
    // @param _value uint256 The value of the grant in wei token.
    // function addUpdateGrantee(address _grantee, uint256 _value) external onlyOwner onlyWhileSale{
    //     require(_grantee != address(0));
    //     require(_value > 0);

    //     // Adding new key if not present:
    //     if (presaleGranteesMap[_grantee] == 0) {
    //         require(presaleGranteesMapKeys.length < MAX_TOKEN_GRANTEES);
    //         presaleGranteesMapKeys.push(_grantee);
    //         emit GrantAdded(_grantee, _value);
    //     }
    //     else {
    //         emit GrantUpdated(_grantee, presaleGranteesMap[_grantee], _value);
    //     }

    //     presaleGranteesMap[_grantee] = _value;
    // }

    // // @dev deletes entries from the grants list.
    // // @param _grantee address The address of the token grantee.
    // function deleteGrantee(address _grantee) external onlyOwner onlyWhileSale {
    //     require(_grantee != address(0));
    //     require(presaleGranteesMap[_grantee] != 0);

    //     //delete from the map:
    //     delete presaleGranteesMap[_grantee];

    //     //delete from the array (keys):
    //     uint256 index;
    //     for (uint256 i = 0; i < presaleGranteesMapKeys.length; i++) {
    //         if (presaleGranteesMapKeys[i] == _grantee) {
    //             index = i;
    //             break;
    //         }
    //     }
    //     presaleGranteesMapKeys[index] = presaleGranteesMapKeys[presaleGranteesMapKeys.length - 1];
    //     delete presaleGranteesMapKeys[presaleGranteesMapKeys.length - 1];
    //     presaleGranteesMapKeys.length--;

    //     emit GrantDeleted(_grantee, presaleGranteesMap[_grantee]);
    // }

    // @dev Set funds collected outside the crowdsale in wei.
    //  note: we not to use accumulator to allow flexibility in case of humane mistakes.
    // funds are converted to wei using the market conversion rate of USD\ETH on the day on the purchase.
    // @param _fiatRaisedConvertedToWei number of none eth raised.
    function setFiatRaisedConvertedToWei(uint256 _fiatRaisedConvertedToWei) external onlyOwner onlyWhileSale {
        fiatRaisedConvertedToWei = _fiatRaisedConvertedToWei;
        emit FiatRaisedUpdated(msg.sender, fiatRaisedConvertedToWei);
    }

    function addToPrivateAllocation(uint256 amount) external onlyOwner  {
        uint256 totalTokenSupply = token.totalSupply();
        uint256 mintHardCap =  token.mintHardCap();
        require(totalTokenSupply + amount < mintHardCap);        
        founderGrant += amount;
        saleHardCap -= amount;
    }

    function addToPublicAllocation(uint256 amount) external onlyOwner  {
        uint256 totalTokenSupply = token.totalSupply();
        uint256 mintHardCap =  token.mintHardCap();
        require(totalTokenSupply + amount < mintHardCap); 
        require(founderGrant > amount);       
        founderGrant -= amount;
        saleHardCap += amount;
    }

    /// @dev Accepts new ownership on behalf of the SirinCrowdsale contract. This can be used, by the token sale
    /// contract itself to claim back ownership of the SirinSmartToken contract.
    function claimTokenOwnership() external onlyOwner {
        token.claimOwnership();
    }

    /// @dev Accepts new ownership on behalf of the SirinCrowdsale contract. This can be used, by the token sale
    /// contract itself to claim back ownership of the refundVault contract.
    function claimRefundVaultOwnership() external onlyOwner {
        refundVault.claimOwnership();
    }

    // @dev Buy tokes with guarantee
    function buyTokensWithGuarantee() public payable {    
   

        uint256 weiAmount = msg.value;
        _preValidatePurchase(msg.sender, weiAmount);

        // calculate token amount to be created
        uint256 tokens = weiAmount.mul(getRate());
        tokens = tokens.div(REFUND_DIVISION_RATE);    

        require(validPurchase(tokens));

        // update state
        weiRaised = weiRaised.add(weiAmount);

        token.issue(address(refundVault), tokens);

        refundVault.deposit.value(msg.value)(msg.sender, tokens);

        emit TokenPurchaseWithGuarantee(msg.sender, address(refundVault), weiAmount, tokens);
    }
}
