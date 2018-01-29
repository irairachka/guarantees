pragma solidity ^0.4.18;

import "./GuaranteeConst.sol";
import "./DigitalGuaranteeBNHP.sol";
import "./GuaranteeExtender.sol";
import "./Ownable.sol";

contract GuaranteeRequestExtender is Ownable,GuaranteeConst {

    RequestState   status;

    //***
    //*** MODIFIERS
    //***
    //premissions modifier for bank functions
    modifier onlyBank() {
        if ( msg.sender != getBank() ) {
//            loga("###ERROR-not performd by BANK address",msg.sender);
            throw;
        }
//        loga("#pass BANK action check",msg.sender);
        _;
    }

    //premissions modifier for customer functions
    modifier onlyCustomer() {
        if ( msg.sender != getCustomer() ) {
//            loga("###ERROR-not performd by CUSTOMER address",msg.sender);
            throw;
        }
//        loga("#pass CUSTOMER action check",msg.sender);
        _;
    }

    //premissions modifier for beneficiary functions
    modifier onlyBeneficiary() {
        if ( msg.sender != getBeneficiary() ) {
//            loga("###ERROR-not performd by BENEFICIERY address",msg.sender);
            throw;
        }
//        loga("#pass BENEFICIERY action check",msg.sender);
        _;
    }

//    address  changeRequestGuaranteeAdr;


//    function isChangeRequest() public returns (bool);


    function getRequestState() public constant returns (RequestState)
    {
        return status;
    }

    //premissions modifier for beneficiary functions
    modifier onlyRegulator() {
        if ( msg.sender != regulator ) {
//            loga("###ERROR-not performd by BENEFICIERY address",msg.sender);
            throw;
        }
//        loga("#pass BENEFICIERY action check",msg.sender);
        _;
    }

    address  public regulator;
    address  public guaranteel;

    function getGuaranteeAddress() public returns (address)
    {
        return guaranteel;
    }

    function setRegulator() public
    {
        regulator=msg.sender;
    }

    function getRegulator() public returns (address)
    {
        return regulator;
    }


    //    function getId() constant returns (address);
    function getCustomer() constant public returns (address)
    {
        return owner;
    }

    function getBank() constant public returns (address);
    function getBeneficiary() constant public returns (address);
    function getId() constant public returns (address _contract_id);
    function getChangeRequestGuarantee() constant public returns (address );

    function isChangeRequest() public returns (bool)
    {
        return (getChangeRequestGuarantee()!=address(0));
    }
//    function getPurpose() constant public returns (bytes32);

    //    function getPurpose() constant returns (bytes32);
    //    function getAmount() constant returns (uint);
    //    function getStartDate() constant returns (uint);
    function getEndDate() constant public returns (uint);

    //    function getIndexType() constant returns (IndexType);
    //    function getIndexDate() constant returns (uint);


    //    function getAddresses() constant returns (Addresses);
    function getGuaranteeRequestData() constant public returns (address _contract_id,address _customer,address _bank, address _beneficiary,
    bytes32 _full_name,bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,RequestState _status ,bool _isChangeGuarantee,address _changedGuarantee);
//    function getGuaranteeRequestData() constant public returns (address _contract_id,address _customer,address _bank, address _beneficiary,
//    bytes32 _full_name ,bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,RequestState _status);
    function getProposalIPFSHash() constant public returns (bytes );

//    function checkRegulator() constant public returns (bool) {
//        return (getEndDate()>now);
//    }
//    function getRequestState() public constant returns (RequestState);
//    function getCommentsForStep(int step) constant public returns (string);
//    function addCommentsForStep(int _step,string _commentline) public ;
    //    function setRequestState(RequestState)  returns (RequestState);

    function isExpired() constant public returns (bool) {
        return (getEndDate()<now);
    }

    function isValid() constant public returns (bool) {
        return ( getBank()!= address(0) && getBeneficiary()!= address(0));
    }

//    function submit(string comment) onlyCustomer public returns (bool result) ;
//    function reject(string comment)  public returns (bool result);
//    function accept() onlyRegulator public returns (bool result);
//    function withdrawal(string comment) onlyCustomer public returns (bool result);
//    function bankStateChange(string comment ,RequestState _newState) onlyBank public returns (bool result);
//
//    function terminateGuarantee()  public ;
//    function signComplite(bytes _guaranteeIPFSHash) onlyRegulator public returns (address);
//    function change(string comment ,address newRewuestId) onlyRegulator public returns (bool result);

    event GuarantieChangeRequested(address indexed requestId,address indexed  guarantieId,uint newamount, uint newendDate,RequestState   curentstatus,uint timestamp);
    function changeRequested(uint _newamount, uint _newendDate)
    {
        //        changeRequestGuaranteeAdr=guarantee;
        status=RequestState.changeRequested;
        GuarantieChangeRequested(getId(),guaranteel,_newamount,_newendDate,   status,now);

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
    function reject(string comment)  public returns (bool result)
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

        require((status==RequestState.waitingtobank || status==RequestState.handling )  && guaranteel==address(0));

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

    function signComplite(bytes _guaranteeIPFSHash) public returns (address) //onlyRegulator public returns (address)
    {
        require( getRequestState()==RequestState.accepted && _checkArray(_guaranteeIPFSHash) && msg.sender == getRegulator());
        GuaranteeExtender gr= new DigitalGuaranteeBNHP(address(this),getRegulator(),_guaranteeIPFSHash);
        guaranteel=address(gr);

        if (isChangeRequest())
        {
            GuarantieChangeSigned(address(this) ,guaranteel,   status,now);
        }
        else
        {
            GuarantieSigned(address(this) ,guaranteel,   status,now);
        }

        return guaranteel;

    }


}