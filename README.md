# SIRIN LABS' Crowdsale Contracts

Please see below Sirin Labs smart contracts' for the [meVu Crowdsale][mevu].

![MEVU Token](images/banner.png)

MVU is an ERC-20 compliant cryptocurrency built on top of the [Ethereum][ethereum] blockchain.

## Contracts

Please see the [contracts/](contracts) directory.

## The Crowdsale Specification
*	MVU token is ERC-20 compliant.
*	MVU Token is [Bancor][bancor] compliant.

## MVU PRICING PROGRAM

*Will be adjusted to reflect prices at time of sale, this chart assumes 1 ETH = $1000 USD

| Duration from token Crowdsale event start	| MVU / ETH |
| :---: | :---: |
| 1st day | 2500 |
| 2nd day | 2500 |
| 3rd day | 2500 |
| 4th day | 2500 |
| 5th day | 2500 |
| 6th day | 2500 |
| 7th day | 2500 |
| 8th day | 2500 |
| 9th day | 2500 |
| 10th day | 2439 |
| 11th day | 2381 |
| 12th day | 2326 |
| 13th day | 2273 |
| 14th day | 2222 |
| 15th day | 2174 |
| 16th day | 2128 |
| 17th day | 2083 |
| 18th day | 2041 |
| 19th day | 2000 |
| 20th day | 2000 |
| 35th day | 2000 | 

#### Refund Route - MVU tokens with guarantee

Investors can choose to buy MVU tokens with guarantee.

refund route rates are 50% of the regular rate (starting from 2500 MVUs for 1 ETH at the first day and ending at 2000 MVUs for 1 ETH at the last day of the crowd sale).

MVU tokens and the ETH funds are deposited to a RefundVault contract owned by the SirinCrowdsale contract.

Investors bought MVUs on the refund route can get refund of their ETH or claim their MVU tokens only after the crowd sale ends.

Refund ETH period is limited to 60 days after the crowd sale ends. MVU token claim is not limited in time.

Any of the actions (refund ETH and MVU token claim) can be executed by the investor directly on the RefundVault contract.

Any of the actions (refund ETH and MVU token claim) can be done on parts of the amount.

* In case of refund ETH, the proportional amount of MVU tokens will be burned.
* In case of MVU token claim, the proportional amount of ETH will be transferred to Mevu ETH Wallet.
* In Case of partial action the remaining ETH and MVU tokens will be available to more refund or claim actions according to the refund period and updated amounts.


## Develop
* Code is from https://github.com/sirin-labs/crowdsale-smart-contract

* Contracts are written in [Solidity][solidity] and tested using [Truffle][truffle] and [testrpc][testrpc].

* Our smart contract is based on [Open Zeppelin][openzeppelin] smart contracts [v1.3.0][openzeppelin_v1.3.0] (latest OZ commit merged is 8e01dd14f9211239213ae7bd4c6af92dd18d4ab7 from 24.10.2017).

* MVU token is a **SmartToken**, implementing Bancor's SmartToken contract.

## Audit

The contract was audited by several Ethereum blockchain experts.

No potential vulnerabilities have been identified in the crowdsale and token contract.

* [Matthew di Ferrante][mattdf] and [Dean Eigenmann][decnus], well-known Ethereum experts who have provided auditing services for many other token sale contracts. 

  The audit report is available here:
     
  https://github.com/sirin-labs/crowdsale-smart-contract/blob/master/audit/sirin-audit.pdf
* [Leonid Beder][leonid], a renowned external security expert.
* [Bokky Poobah][bokk], a well-known cybersecurity auditor that provides auditing services for Ethereum based projects.
  
  The audit report is available here:
  https://github.com/bokkypoobah/SirinLabsCrowdsaleContractAudit/tree/master/bokkyAudit
  
## Code

#### Class Diagram  

![Class Diagram](images/SirinCrowdSale.jpg)


#### SirinCrowdsale Functions

**getRate**
```cs
function getRate() public view returns (uint256)
```
Returns the rate in MVU per 1 ETH according to the time of the tx and the MVU pricing program.

**getTotalFundsRaised**
```cs
function getTotalFundsRaised() public view returns (uint256)
```
Returns the total funds collected in wei(ETH and none ETH).

**addUpdateGrantee**
```cs
function addUpdateGrantee(address _grantee, uint256 _value) external onlyOwner onlyWhileSale
```
Adds/Updates address and token allocation for token grants.

Granted tokens are allocated to non-ether, presale, buyers.

**isActive**
```cs
function isActive() public view returns (bool)
```
Return true if the crowdsale is active, hence users can buy tokens

**deleteGrantee**
```cs
function deleteGrantee(address _grantee) external onlyOwner onlyWhileSale
```
Deletes entries from the grants list.

**setFiatRaisedConvertedToWei**
```cs
function setFiatRaisedConvertedToWei(uint256 _fiatRaisedConvertedToWei) external onlyOwner onlyWhileSale
```
Sets funds collected outside the crowdsale in wei.
funds are converted to wei using the market conversion rate of USD\ETH on the day on the purchase.

**claimTokenOwnership**
```cs
function claimTokenOwnership() external onlyOwner
```
Accepts new ownership on behalf of the SirinCrowdsale contract. This can be used, by the token sale contract itself to claim back ownership of the SirinSmartToken contract.

**claimRefundVaultOwnership**
```cs
function claimRefundVaultOwnership() external onlyOwner
```
Accepts new ownership on behalf of the SirinCrowdsale contract. This can be used, by the token sale contract itself to claim back ownership of the refundVault contract.

**buyTokensWithGuarantee**
```cs
function buyTokensWithGuarantee() public payable
```
Buy tokes with guarantee, these tokens and the ETH are saved in refundVault, so investor can refund them up to 60 days after the crowdsale ends.

#### SirinCrowdsale Events

**GrantAdded**
```cs
event GrantAdded(address indexed _grantee, uint256 _amount);
```


**GrantUpdated**
```cs
event GrantUpdated(address indexed _grantee, uint256 _oldAmount, uint256 _newAmount);
```


**GrantDeleted**
```cs
event GrantDeleted(address indexed _grantee, uint256 _hadAmount);
```


**FiatRaisedUpdated**
```cs
event FiatRaisedUpdated(address indexed _address, uint256 _fiatRaised)
```


**TokenPurchaseWithGuarantee**
```cs
event TokenPurchaseWithGuarantee(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);
```

#### RefundVault Functions

**deposit**
```cs
function deposit(address investor, uint256 tokensAmount) onlyOwner public payable
```
Adds Investor tokens and ETH to the vault.

**close**
```cs
function close() onlyOwner public
```
Closes the refunds, all ETH is transfered to Mevu ETH wallet.
After this function is called investors cannot refund their ETH anymore but can claim their tokens.

**enableRefunds**
```cs
function enableRefunds() onlyOwner public
```
Start the refunding. Should be called after the crowdsale.

**refundETH**
```cs
function refundETH(uint256 ETHToRefundAmountWei) isInRefundTimeFrame isRefundingState public
```
Refund ETH back to the investor in return of proportional amount of MVU back to Mevu wallet.

**claimTokens**
```cs
function claimTokens(address investor, uint256 tokensToClaim) isRefundingOrCloseState public
```
Transfer tokens from the vault to the investor while transferring proportional amount of ETH to Mevu ETH wallet.

Can be triggered by the investor only.

**claimAllTokens**
```cs
function claimAllTokens() public
```
Investors can claim all remaining tokens from the vault.

#### RefundVault Events

**Active**
```cs
event Active();
```


**Deposit**
```cs
event Deposit(address indexed beneficiary, uint256 etherWeiAmount, uint256 tokenWeiAmount);
```    

**Closed**
```cs
event Closed();
```


**RefundsEnabled**
```cs
event RefundsEnabled();
```


**RefundedETH**
```cs
event RefundedETH(address indexed beneficiary, uint256 weiAmount);
```


**TokensClaimed**
```cs
event TokensClaimed(address indexed beneficiary, uint256 weiAmount);
```

#### SirinVestingTrustee Functions

Vesting trustee contract for Sirin Labs token.

**grant**
```cs
function grant(address _to, uint256 _value, uint256 _start, uint256 _cliff, uint256 _end, bool _revokable)
    public onlyOwner 
```
Grant tokens to a specified address.

**revoke**
```cs
function revoke(address _holder) public onlyOwner
```
Revoke the grant of tokens of a specifed address.

**vestedTokens**
```cs
 function vestedTokens(address _holder, uint256 _time) public constant returns (uint256)
```
Calculate the total amount of vested tokens of a holder at a given time.

**unlockVestedTokens**
```cs
 function unlockVestedTokens() public 
```
Unlock vested tokens and transfer them to their holder.

#### SirinVestingTrustee Events


**NewGrant**
```cs
event NewGrant(address indexed _from, address indexed _to, uint256 _value);
```


**UnlockGrant**
```cs
event UnlockGrant(address indexed _holder, uint256 _value);
```


**RevokeGrant**
```cs
event RevokeGrant(address indexed _holder, uint256 _refund);
```

### Dependencies

```bash
# Install Truffle and testrpc packages globally:
$ npm install -g truffle ethereumjs-testrpc

# Install local node dependencies:
$ npm install
```

### Test

```bash
$ ./scripts/test.sh
```


### Code Coverage

```bash
$ ./scripts/coverage.sh
```

## Collaborators

* **[Yossi Gruner](https://github.com/yossigruner)**
* **[Gilad Or](https://github.com/gilador)**
* **[Yaron Shlomo](https://github.com/yaronshlomo)**
* **[Lior David](https://github.com/liordavid)**




## License

Apache License v2.0

[mevu]: https://mevu.bet
[sirinlabs]: https://www.sirinlabs.com
[ethereum]: https://www.ethereum.org/

[solidity]: https://solidity.readthedocs.io/en/develop/
[truffle]: http://truffleframework.com/
[testrpc]: https://github.com/ethereumjs/testrpc
[bancor]: https://github.com/bancorprotocol/contracts
[openzeppelin]: https://openzeppelin.org
[openzeppelin_v1.3.0]: https://github.com/OpenZeppelin/zeppelin-solidity/releases/tag/v1.3.0
[mattdf]: http://github.com/mattdf
[decnus]: http://github.com/decanus
[leonid]: https://www.linkedin.com/in/leonidb/
[bokk]: https://github.com/bokkypoobah/
