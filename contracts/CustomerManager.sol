pragma solidity ^0.4.0;

import "./Ownable.sol";

contract CustomerManager  is Ownable{


    //describes the customer object
    struct Customer {
    string name;
    string localAddress;
    bool isdefined;
//    address []   guaranteeRequests;
    //    string id;
    }
    //holds all customers by their address
    mapping (address=>Customer) public customers;


    event AddCustomer (address msgSender,string msgstr,uint timestamp);
    function submitCustomer(address _addr , string _name, string _localAddres ) onlyOwner public {
        Customer  customer=customers[_addr];
        if(customer.isdefined == false){
            AddCustomer(msg.sender,_name,block.timestamp);
            customer.isdefined=true;
        }

        customer.name   = _name;
        customer.localAddress    = _localAddres;

        //        customer.id = _id;


    }

    function getCustomer(address _addr) constant public returns(string _name, string _localAddress) //, string  _id)
    {

        Customer memory ci = customers[_addr];
        _name = ci.name;
        _localAddress  = ci.localAddress;
        //        _id = ci.id;
    }


    //    //premissions modifier for customer functions
    //    modifier onlyCustomer() {
    //        if (!_checkString(customers[msg.sender].name))
    //        {
    //            loga("###ERROR-not performd by CUSTOMER address",msg.sender);
    //            throw;
    //        }
    //        loga("#pass CUSTOMER action check",msg.sender);
    //        _;
    //    }


}
