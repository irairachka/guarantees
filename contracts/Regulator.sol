pragma solidity ^0.4.13;

import "./GuaranteeRequest.sol";

//###
// general contract for better operations of the system
//###
contract owned {
    //owner address for ownership validation
    address owner;

    //constractor to verify real owner assignment
    function owned() {
        owner = msg.sender;
        log("owner=",owner);
    }

    //owner check modifier
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    //contract distruction by owner only
    function close() onlyOwner {
        log("##contract closed by owner=",owner);
        selfdestruct(owner);
    }

    //constractor to verify real owner assignment
    function getOwner() constant returns (address){
        return owner ;
    }
    //log event for debug purposes
    event log(string loga, address logb);
}


contract Regulator is owned,GuaranteeConst{

    //guarantee request states
    enum issuerStatus { submited,  accepted, rejected }

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



    //describes the customer object
    struct Customer {
        string name;
        string localAddress;
        address []   guaranteeRequests;
//    string id;
    }
    //holds all customers by their address
    mapping (address=>Customer) public customers;

    //describes the beneficiary object
    struct Beneficiary {
        string name;
        string localAddress;
        address []   guarantees;
//    string id;
    }
    //holds all the benefiieries by their address
    mapping (address=>Beneficiary) public beneficiaries;

    //describes the customer object
    struct Issuer {
        string name;
        string localAddress;
        address addr;
        issuerStatus status;
        address []   guaranteeRequests;
    }
    //holds all customers by their address
    Issuer   [] issuers;

    event RegulatoryContractDeployed (address msgSender,string msgstr,uint timestamp);
    function Regulator(){
        owner = msg.sender;


        submitBeneficiary(msg.sender,"עיריית תל אביב-יפו","אבן גבירול 69 תל אביב-יפו");
        submitCustomer(msg.sender,"ישראל ישראלי","הרצל 11 ראשון לציון");
        submitIssuer(msg.sender,"בנק הפועלים","הנגב 11 תל אביב");

        RegulatoryContractDeployed(msg.sender,"Mined",now);
    }


    event AddBeneficiary (address msgSender,string _name,uint timestamp);

    function submitBeneficiary(address _addr , string _name, string _localAddres ) public  onlyOwner {
        Beneficiary beneficiary=beneficiaries[_addr];
        beneficiary.name   = _name;
        beneficiary.localAddress    = _localAddres;
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

    event AddCustomer (address msgSender,string msgstr,uint timestamp);
    function submitCustomer(address _addr , string _name, string _localAddres ) onlyOwner public {
        Customer  customer=customers[_addr];
        customer.name   = _name;
        customer.localAddress    = _localAddres;
//        customer.id = _id;

        AddCustomer(msg.sender,_name,block.timestamp);
    }

    function getCustomer(address _addr) constant public returns(string _name, string _localAddress) //, string  _id)
    {

        Customer memory ci = customers[_addr];
        _name = ci.name;
        _localAddress  = ci.localAddress;
//        _id = ci.id;
    }

    event AddIssuer (address msgSender,string msgstr,uint timestamp);

    function submitIssuer(address _addr , string _name, string _localAddres) onlyOwner public {
        Issuer memory issuer;
        issuer.name   = _name;
        issuer.localAddress    = _localAddres;
        issuer.addr = _addr;
        issuer.status = issuerStatus.accepted;
        issuers.push(issuer);

        AddIssuer(msg.sender,_name,block.timestamp);
    }

    event UpdateIssuersStatus(address msgSender,string msgstr,uint timestamp);

    function changeIssuerStatus(address _addr, issuerStatus _status) onlyOwner public{
        for(uint32 i=0; i<issuers.length; i++) {
            if(issuers[i].addr == _addr) {
                issuers[i].status = _status;
                // if(issuers[i].status == issuerStatus)
                // {
                //     UpdateIssuersStatus(msg.sender,"Approved",block.timestamp);
                // }
                // else
                // {
                //     UpdateIssuersStatus(msg.sender,"Rejected",block.timestamp);
                // }
                break;
            }
        }

    }

    function getIssuerCounter() public constant returns (uint ) {
        return issuers.length;
    }

    function getIssuerById(uint _id) constant public returns(string , string , address , issuerStatus )  {

        if(_id >= issuers.length) {
            throw;
        }
        Issuer memory ci = issuers[_id];

        return (ci.name,ci.localAddress,ci.addr,ci.status);
//        _name = ci.name;
//        _localAddress  = ci.localAddress;
//        _addr = ci.addr;
//        _status = ci.status;
    }


    //describes the customer object
//    address [] public  guaranteeRequests;

    function getRequestsAddressForCustomer() public constant returns (address[])
    {
        return customers[msg.sender].guaranteeRequests;

    }

    function getRequestsAddressForIssuer() public constant returns (address[])
    {
        return Issuer[msg.sender].guaranteeRequests;

    }


//    function getActiveGuaranteesAddress() constant returns (string[])
//    {
//        string[] memory _guarantees = new string();
//
//                for(uint32 i=0; i<guaranteeRequests.length; i++) {
//                    if(GuaranteeRequestExtender(guaranteeRequests[i]).getRequestState()==RequestState.accepted)
//                    _guarantees.push(guaranteeRequests[i]);
//                }
//                return _guarantees;
//
//    }

    event GuaranteeRequestCreated (address  requestId,address msgSender,address _customer ,address _bank ,address _beneficiary ,string _purpose,
        uint _amount, uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,uint timestamp);

    function createGuaranteeRequest(address _customer ,address _bank ,address _beneficiary ,string _purpose,
    uint _amount, uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate)  public returns (address)
    {
        GuaranteeRequest greq=new  GuaranteeRequest(this,_customer,_bank ,_beneficiary,_purpose,_amount,_startDate,_endDate,_indexType ,_indexDate);
        guaranteeRequests.push(address(greq));
        GuaranteeRequestCreated(address(greq),msg.sender,_customer , _bank,_beneficiary , _purpose,  _amount,  _startDate, _endDate, _indexType, _indexDate , now);

        return address(greq);
    }


    function terminateGuarantee(address  _guaranteeRequest,string comment)  returns (bool)
    {
        GuaranteeRequestExtender ge=GuaranteeRequestExtender(_guaranteeRequest);
        if ( msg.sender == ge.getBeneficiary() )
        {
            ge.termination(comment) ;
            return true;
        }


        throw;


    }

    //    function changeGuarantee(address  _guaranteeRequest ,uint _newamount, uint _newendDate, string _comment) onlyBeneficiary returns (bool)
    //    {
    //        GuaranteeExtender ge=GuaranteeExtender(_guaranteeRequest);
    //        if (ge.getBeneficiary()==msg.sender)
    //        {
    //            ( address _contract_id,address _customer,address _bank, address _beneficiary,
    //            string _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,
    //            uint _indexDate,RequestState _status) = ge.getGuaranteeRequestData();
    //            if (_status==RequestState.accepted && _amount>=_newamount && _newendDate<=_endDate)
    //            {
    //                address addr=new GuaranteeRequest(this,_customer,_bank ,_beneficiary,_purpose,_amount,_startDate,_endDate,_indexType ,_indexDate);
    //                ge.
    //                guaranteeRequests.push(addr);
    //                return addr;
    //            }
    //
    //        }
    //
    //
    //
    //    .endRequest(_comment)
    //        guaranteeRequests.push(addr);
    //        return addr;
    //
    //        return true;
    //    }

}
