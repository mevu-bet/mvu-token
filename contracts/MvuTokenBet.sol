pragma solidity ^0.4.18;
import '../zeppelin-solidity/contracts/ownership/Ownable.sol';

contract MvuTokenBet is Ownable {
    mapping (address => bool) public betMade;
    mapping (address => bool) public betSettled;
    mapping (address => uint256) public tokensPurchased;
    mapping (address => uint) public betChoice;
    uint public eventWinner;   
    
    function makeBet (address bettor, uint winnerChoice, uint numTokensPurchased) onlyOwner {
        betMade[bettor] = true;
        betChoice[bettor] = winnerChoice;
        tokensPurchased[bettor] = numTokensPurchased;
    }

    function checkWin (address bettor) public view returns (bool) {
        require (betMade[bettor]);
        if (betChoice[bettor] == eventWinner) {
            return true;
        } else {    
            return false;
        }
    }

    function checkSettled (address bettor) external view returns (bool) { 
        return betSettled[bettor];
    }

    function checkMade (address bettor) external view returns (bool) {
        return betMade[bettor];
    }

    function settle (address bettor) external onlyOwner {         
        betSettled[bettor] = true;
    }

    function getTokensPurchased (address bettor) external view returns (uint)  {
        return tokensPurchased[bettor];
    }

    function setEventWinner (uint winner) onlyOwner {
        eventWinner = winner;
    }

}