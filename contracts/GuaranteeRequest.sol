pragma solidity ^0.4.13;

import "./GuaranteeConst.sol";
import "./GuaranteeRequestExtender.sol";
import "./GuaranteeExtender.sol";
import "./DigitalGuaranteeBNHP.sol";

contract GuaranteeRequest is GuaranteeRequestExtender{
    string public version = "1.00";

    //holds the addresses of the participating parties for demo reasons
    struct Addresses {

    address bank;
//    address customer;
    address beneficiary;

    }

    Addresses public addresses;

    bytes32  full_name;

    bytes32  purpose;
    uint  amount;
    uint  startDate;
    uint  endDate;

    IndexType  indexType;
    uint  indexDate;

    bytes  proposalIPFSHash;
//    bytes  guaranteeIPFSHash;

    RequestState   status;

//    int  stepNumber;



//    event Comment(address indexed requestId,int  numberOfStep,RequestState requestState,string commentline,uint timestamp) ;


    event GuaranteeRequestCreated (address indexed requestId,address indexed customer ,address indexed bank ,address  beneficiary ,RequestState   curentstatus,bytes32 guarantyPurpose,
    uint requestAmount, uint requestStartDate,uint requestEndDate,IndexType requestIndexType,uint requestIndexDate,uint timestamp,bytes  proposalIPFSHash);

//    function GuaranteeRequest(address  _regulator,address _customer ,address _bank ,address _beneficiary ,bytes32 _purpose,
//    uint _amount, uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate)
//    {
//        regulator=_regulator;
//        //        Addresses memory addresses;
//        addresses.bank=_bank;
//        addresses.customer=_customer;
//        addresses.beneficiary=_beneficiary;
//        purpose=_purpose;
//        amount=_amount;
//        startDate=_startDate;
//        endDate=_endDate;
//        indexType= _indexType;
//        indexDate= _indexDate;
//        status=RequestState.created;
//        stepNumber=0;
//        GuaranteeRequestCreated(getId(),_customer , _bank,_beneficiary , _purpose,  _amount,  _startDate, _endDate, _indexType, _indexDate , now);
//        Comment( getId(), stepNumber, status,"");
//        // log("create request","customer"+_customer+"bank"+_bank+"beneficiary"+_beneficiary+"amount"+amount + "startDate"+startDate+"endDate"+endDate +"...");
//
//
//    }

    function GuaranteeRequest(address _bank ,address _beneficiary ,bytes32 _full_name ,bytes32 _purpose,
    uint _amount, uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,bytes  _proposalIPFSHash)
    {
        addresses.bank=_bank;
        addresses.beneficiary=_beneficiary;
        purpose=_purpose;
        amount=_amount;
        full_name=_full_name;
        startDate=_startDate;
        endDate=_endDate;
        indexType= _indexType;
        indexDate= _indexDate;
        status=RequestState.created;

        proposalIPFSHash=  _proposalIPFSHash ;
//        stepNumber=0;
        GuaranteeRequestCreated(getId(),getCustomer() , _bank,_beneficiary ,   status, _purpose,  _amount,  _startDate, _endDate, _indexType, _indexDate , now ,_proposalIPFSHash);
//        Comment( getId(), stepNumber, status,"");

        // log("create request","customer"+_customer+"bank"+_bank+"beneficiary"+_beneficiary+"amount"+amount + "startDate"+startDate+"endDate"+endDate +"...");

    }

    function getId() constant public returns (address _contract_id)
    {
        return this;
    }

//    function getCustomer() constant public returns (address _customer)
//    {
//        return addresses.customer;
//    }

    function getBank() constant public returns (address _bank)
    {
        return addresses.bank;
    }
    function getBeneficiary() constant public returns (address _beneficiary)
    {
        return addresses.beneficiary;
    }

    function getEndDate() constant public returns (uint _date)
    {
        return endDate;
    }



    function getGuaranteeRequestData() constant public returns (address _contract_id,address _customer,address _bank, address _beneficiary,
    bytes32 _full_name,bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,RequestState _status)
    {

        _contract_id=getId();
        _customer=getCustomer();
        _bank=getBank();
        _beneficiary=getBeneficiary();
        _purpose=purpose;
        _amount=amount;
        _full_name=full_name;
        _startDate=startDate;
        _endDate=endDate;
        _indexType=indexType;
        _indexDate=indexDate;
        _status=status;
    }
    function getProposalIPFSHash() public constant returns (bytes _proposalIPFSHash)
    {
        return proposalIPFSHash;
    }

//    function setProposalIPFSHash(bytes _proposalIPFSHash) onlyCustomer public  returns (bool result)
//    {
//        require(status==RequestState.created);
//        proposalIPFSHash=_proposalIPFSHash;
//        return true;
//    }

    function getRequestState() public constant returns (RequestState)
    {
        return status;
    }


    event Submitted(address indexed requestId,address indexed msgSender,RequestState   curentstatus,string commentline ,uint timestamp);

    //submit function to initiat the request
    function submit(string comment) onlyCustomer public returns (bool result)

    {
        require(status==RequestState.created);
//        stepNumber++;
        status=RequestState.waitingtobank;

        Submitted(getId(),msg.sender,   status,comment, now);
        //        log("submitted",getId()+"->"+comment);
//        Comment( getId(),stepNumber, status,comment);

        return true;
    }


    event Withdrawal(address indexed requestId,address indexed msgSender,RequestState   curentstatus,string commentline,uint timestamp);
    //customer withdrawal request
    function withdrawal(string comment) onlyCustomer public returns (bool result)
    {
        require(status!=RequestState.accepted);
//        stepNumber++;
       status=RequestState.withdrawed;
        Withdrawal(getId(),msg.sender,   status,comment,now);
        //        log("withdrawed",getId()+"->"+comment);
//        Comment(getId(), stepNumber, status,comment);

        return true;
    }

    event Termination(address indexed  requestId,address indexed msgSender,RequestState   curentstatus,uint timestamp);
    //bank reject request
    function terminateGuarantee()  public
    {
        require(status==RequestState.accepted );
//        stepNumber++;

        status=RequestState.terminationRequest;
        Termination(getId(),msg.sender,   status,now);
//        Comment( getId(),stepNumber, status,_comment);
        //         log("rejected",getId()+"->"+comment);

    }

    event Rejected(address indexed requestId,address indexed msgSender,   RequestState   curentstatus,string commentline,uint timestamp);
    //bank reject request
    function reject(string comment) onlyBank public returns (bool result)
    {
        require(status!=RequestState.accepted);

        status=RequestState.rejected;
        Rejected(getId(),msg.sender,   status,comment,now);
//        Comment( getId(),stepNumber, status,comment);

        //         log("rejected",getId()+"->"+comment);
        return true;

    }


    event BankStateChange(address indexed requestId,address indexed msgSender,RequestState   curentstatus,string commentline,uint timestamp);
    //bank reject request
    function bankStateChange(string comment ,RequestState _newState) onlyBank public returns (bool result)
    {
        require((status==RequestState.waitingtobank      ||

        status==RequestState.handling           ) &&
        (_newState==RequestState.handling           ||
        _newState==RequestState.waitingtocustomer  ||
        _newState==RequestState.waitingtobeneficiery ));
//        stepNumber++;
        //        addCommentsForStep(stepNumber,comment);

        status=_newState;
        BankStateChange(getId(),msg.sender,_newState,comment,now);
//        Comment( getId(),stepNumber, status,comment);

        //         log("rejected",getId()+"->"+comment);
        return true;

    }


    event Accepted(address indexed requestId,address indexed msgSender ,RequestState   curentstatus,uint timestamp);
    //bank accept request
    function accept() onlyRegulator public returns (bool result)
    {

        require((status==RequestState.waitingtobank || status==RequestState.handling || status==RequestState.changeRequested)  && guarantee==address(0));

        status=RequestState.accepted;
        Accepted(getId(),msg.sender,   status,now);
//        Comment( getId(),stepNumber, status,comment);
        //        if (status!=RequestState.changeRequested)
        //        {
        //            GuaranteeRequest(changeRequest).
        //            if (guarantee!= address(0))
        //            {
        //            GuaranteeExtender(guarantee).terminate();
        //            }
        //            addCommentsForStep(stepNumber,comment);
        //            status=RequestState.terminationRequest;
        //            Termination(getId(),msg.sender,comment);
        //
        //
        //        }
        return true;
    }


    event GuarantieSigned(address indexed requestId,address indexed  guarantieId,RequestState   curentstatus,uint timestamp);
    event GuarantieChangeSigned(address indexed requestId,address indexed  guarantieId,RequestState   curentstatus,uint timestamp);

    function signComplite(bytes _guaranteeIPFSHash) onlyRegulator public returns (address)
    {
        require( getRequestState()==RequestState.accepted && _checkArray(_guaranteeIPFSHash) && msg.sender == getRegulator());
        GuaranteeExtender gr= new DigitalGuaranteeBNHP(getId(),getRegulator(),_guaranteeIPFSHash);
        guarantee=gr.getId();
        if (isChangeRequest())
        {
            GuarantieChangeSigned(getId(),gr.getId(),   status,now);
            GuaranteeExtender(changeRequestGuaranteeAdr).terminateGuarantee();
        }
    else
        {
            GuarantieSigned(getId(),gr.getId(),   status,now);
        }

        return guarantee;
    }

    event GuarantieChangeRequested(address indexed requestId,address indexed  guarantieId,uint newamount, uint newendDate,RequestState   curentstatus,uint timestamp);

    function changeRequested(uint _newamount, uint _newendDate) onlyRegulator returns (bool result)
    {
        changeRequestGuaranteeAdr=guarantee;
        status=RequestState.waitingtobank;
        GuarantieChangeRequested(getId(),guarantee,_newamount,_newendDate,   status,now);

    return true;
    }


}
