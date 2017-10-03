pragma solidity ^0.4.13;

import "./Ownable.sol";
import "./GuaranteeConst.sol";
import "./IssuerManager.sol";
import "./BeneficiaryManager.sol";
import "./CustomerManager.sol";
import "./GuaranteeRequest.sol";
//
////###
//// general contract for better operations of the system
////###
//contract owned {
//    //owner address for ownership validation
//    address owner;
//
//    //constractor to verify real owner assignment
//    function owned() {
//        owner = msg.sender;
//        log("owner=",owner);
//    }
//
//    //owner check modifier
//    modifier onlyOwner {
//        require(msg.sender == owner);
//        _;
//    }
//
//    //contract distruction by owner only
//    function close() onlyOwner {
//        log("##contract closed by owner=",owner);
//        selfdestruct(owner);
//    }
//
//    //constractor to verify real owner assignment
//    function getOwner() constant returns (address){
//        return owner ;
//    }
//    //log event for debug purposes
//    event log(string loga, address logb);
//}


contract Regulator is Ownable,IssuerManager,BeneficiaryManager,CustomerManager,GuaranteeConst{

    //guarantee request states
    address [] public  guaranteeRequests;
    address [] public  guarantees;


    event RegulatoryContractDeployed (address msgSender,string msgstr,uint timestamp);
    function Regulator(){
//        owner = msg.sender;
//

//        submitBeneficiary(msg.sender,"עיריית תל אביב-יפו","אבן גבירול 69 תל אביב-יפו");
//        submitCustomer(msg.sender,"ישראל ישראלי","הרצל 11 ראשון לציון");
//        submitIssuer(msg.sender,"בנק הפועלים","הנגב 11 תל אביב");
        RegulatoryContractDeployed(msg.sender,"Mined",now);
    }


    function getRequestAddressList() public constant returns (address[] )
    {
//         AAA(guaranteeRequests.length);
        return guaranteeRequests;

    }

    function getGuaranteeAddressesList() public constant returns (address[] )
    {
        return guarantees;

    }




//    event AAA(uint length);

    function addGuaranteeRequest(address  _guaranteeRequest)  public
    {
        GuaranteeRequestExtender ge=GuaranteeRequestExtender(_guaranteeRequest);
        require(msg.sender == ge.getCustomer() && ge.isValid());
        ge.setRegulator();
        guaranteeRequests.push(_guaranteeRequest);

    }

    event RequestGuaranteeSign(address  _guaranteeRequest,string path);
    function requestGuaranteeSign(address  _guaranteeRequest)  public
    {
        GuaranteeRequestExtender ge=GuaranteeRequestExtender(_guaranteeRequest);
        require(ge.getRequestState()==RequestState.accepted);
        RequestGuaranteeSign(_guaranteeRequest,"");
    }

    function GuaranteeSignComplite(address  _guaranteeRequest,bytes _guaranteeIPFSHash)  public  returns (address)
    {
        GuaranteeRequestExtender ger=GuaranteeRequestExtender(_guaranteeRequest);
        require( ger.getRequestState()==RequestState.accepted && _checkArray(_guaranteeIPFSHash));

        GuaranteeExtender gr= new DigitalGuaranteeBNHP(_guaranteeRequest,this,_guaranteeIPFSHash);
        guarantees.push(address(gr));
        return address(gr);
    }


    function terminateGuarantee(address  _guaranteeRequest,address  _guarantee)  public
    {

        GuaranteeRequestExtender ger=GuaranteeRequestExtender(_guaranteeRequest);
        require( ger.getRequestState()==RequestState.accepted && msg.sender == ger.getBeneficiary() && _guarantee!= address(0));

        ger.terminate() ;

        GuaranteeExtender(_guarantee).terminate();



    }







    function changeGuarantee(address  _guaranteeRequest,address  _guarantee ,uint _newamount, uint _newendDate, string _comment)  returns (bool)  //onlyBeneficiary
    {
//        if (ge.getBeneficiary()!=msg.sender) throw;
//            GuaranteeExtender ge=GuaranteeExtender(_guaranteeRequest);
//
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
        return true;
    }

//    function submit(string comment) onlyCustomer public returns (bool result) ;
//    function termination(string comment) onlyBeneficiary public returns (bool result);
//    function reject(string comment) onlyBank public returns (bool result);
//    function withdrawal(string comment) onlyCustomer public returns (bool result);
//    function bankStateChange(string comment ,RequestState _newState) onlyBank public returns (bool result);




}
