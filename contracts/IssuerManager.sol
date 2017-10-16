pragma solidity ^0.4.0;

import "./Ownable.sol";

contract IssuerManager  is Ownable {
    enum issuerStatus { submited,  accepted, rejected }

    //describes the customer object
    struct Issuer {
    string name;
    string localAddress;
    address addr;
//    issuerStatus status;
//    address []   guaranteeRequests;
    }
    //holds all customers by their address
    mapping (address=>Issuer) public issuers;
    address   [] issuerList;


    event AddIssuer (address msgSender,address issuerAdr,string msgstr,uint timestamp);

    function submitIssuer(address _addr , string _name, string _localAddres) onlyOwner public {

        Issuer  issuer = issuers[_addr];
        issuer.name   = _name;
        issuer.localAddress    = _localAddres;
        issuer.addr = _addr;
//        issuer.status = issuerStatus.accepted;
        issuerList.push(_addr);

        AddIssuer(msg.sender, _addr ,_name,block.timestamp);
    }

//    event UpdateIssuersStatus(address msgSender,string msgstr,uint timestamp);
//
//    function changeIssuerStatus(address _addr, issuerStatus _status) onlyOwner public{
//        for(uint32 i=0; i<issuerList.length; i++) {
//            if(issuers[i].addr == _addr) {
//                issuers[i].status = _status;
//                // if(issuers[i].status == issuerStatus)
//                // {
//                //     UpdateIssuersStatus(msg.sender,"Approved",block.timestamp);
//                // }
//                // else
//                // {
//                //     UpdateIssuersStatus(msg.sender,"Rejected",block.timestamp);
//                // }
//                break;
//            }
//        }
//
//    }

    function getIssuerCounter() public constant returns (uint ) {
        return issuerList.length;
    }

    function getIssuerAddressesList() public constant returns (address[] )
    {
        return issuerList;

    }

    function getIssuerById(uint _id) constant public returns(string , string , address )  {

        if(_id >= issuerList.length) {
            throw;
        }
        Issuer memory ci = issuers[issuerList[_id]];

        return (ci.name,ci.localAddress,ci.addr);
    }

    function getIssuer(address _addr) constant public returns(string , string  )  {

        Issuer memory ci = issuers[_addr];

        return (ci.name,ci.localAddress);

    }


    //    modifier issuersOnly {
    //        bool found = false;
    //        for(uint32 i=0; i<issuers.length; i++) {
    //            if(issuers[i].addr == msg.sender && issuers[i].status == issuerStatus.accepted) {
    //                found = true;
    //                break;
    //            }
    //        }
    //        if(!found) throw;
    //        _;
    //    }


}
