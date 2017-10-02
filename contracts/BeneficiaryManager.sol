pragma solidity ^0.4.0;

import "./Ownable.sol";

contract BeneficiaryManager is Ownable{

    //describes the beneficiary object
    struct Beneficiary {
    string name;
    string localAddress;
//    address []   guarantees;
    //    string id;
    }
    //holds all the benefiieries by their address
    mapping (address=>Beneficiary) public beneficiaries;
    address   [] beneficiaryList;



    event AddBeneficiary (address msgSender,string _name,uint timestamp);

    function submitBeneficiary(address _addr , string _name, string _localAddres ) public  onlyOwner {
        Beneficiary beneficiary=beneficiaries[_addr];
        beneficiary.name   = _name;
        beneficiary.localAddress    = _localAddres;
        beneficiaryList.push(_addr);
        //        beneficiary.id = _id;

        AddBeneficiary(_addr,_name,block.timestamp);
    }

    function getBeneficiary(address _addr) public constant returns(string _name, string _localAddress)
    {

        Beneficiary memory beneficiary=beneficiaries[_addr];
        _name = beneficiary.name;
        _localAddress  = beneficiary.localAddress;
        //        _id = beneficiary.id;
    }

    function getBeneficiaryById(uint _id) public constant returns(string _name, string _localAddress)
    {

        if(_id >= beneficiaryList.length) {
            throw;
        }
        Beneficiary memory ci = beneficiaries[beneficiaryList[_id]];

        return (ci.name,ci.localAddress);

    }

    function getBeneficiaryAddresses() public constant returns(address[] )
    {

        return beneficiaryList;

    }

}
