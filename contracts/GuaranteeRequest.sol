pragma solidity ^0.4.13;

import "./GuaranteeConst.sol";
import "./GuaranteeRequestExtender.sol";
import "./GuaranteeExtender.sol";
import "./DigitalGuaranteeBNHP.sol";

contract GuaranteeRequest is GuaranteeRequestExtender{
    string public version = "1.00";

    address  regulator;
    address  guarantee;
    address  changeRequest;

    //holds the addresses of the participating parties for demo reasons
    struct Addresses {
    address bank;
    address customer;
    address beneficiary;
    }

    Addresses public addresses;

    string  purpose;
    uint  amount;
    uint  startDate;
    uint  endDate;

    IndexType  indexType;
    uint  indexDate;

    bytes  proposalIPFSHash;
    bytes  guaranteeIPFSHash;

    RequestState   status;

    int  stepNumber;

    //describes the customer object
    struct Comment {
        int step;
        string commentline;
    }
    Comment [] comments;


    function GuaranteeRequest(address  _regulator,address _customer ,address _bank ,address _beneficiary ,string _purpose,
    uint _amount, uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate)
    {
        regulator=_regulator;
        //        Addresses memory addresses;
        addresses.bank=_bank;
        addresses.customer=_customer;
        addresses.beneficiary=_beneficiary;
        purpose=_purpose;
        amount=_amount;
        startDate=_startDate;
        endDate=_endDate;
        indexType= _indexType;
        indexDate= _indexDate;
        status=RequestState.created;
        stepNumber=0;
//        GuaranteeRequestCreated(this,msg.sender,_customer , _bank , _beneficiary , _purpose, _amount,  _startDate, _endDate, _indexType, _indexDate,now);
        // log("create request","customer"+_customer+"bank"+_bank+"beneficiary"+_beneficiary+"amount"+amount + "startDate"+startDate+"endDate"+endDate +"...");


    }

    function getId() constant public returns (address _contract_id)
    {
        return this;
    }

    function getCustomer() constant public returns (address _customer)
    {
        return addresses.customer;
    }

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
    string _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,RequestState _status)
    {

        _contract_id=getId();
        _customer=getCustomer();
        _bank=getBank();
        _beneficiary=getBeneficiary();
        _purpose=purpose;
        _amount=amount;
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

    function setProposalIPFSHash(bytes _proposalIPFSHash) onlyCustomer public  returns (bool result)
    {
        require(status==RequestState.created);
        proposalIPFSHash=_proposalIPFSHash;
        return true;
    }

    function getRequestState() public constant returns (RequestState)
    {
        return status;
    }

//    event State(RequestState state);
//    function getRequestStateTranslated() public constant returns (uint _thestate)
//    {
//        State(status);
//        _thestate= uint(status);
//        if (_thestate==0 && status!=RequestState.created)
//        {
//            if  (status==RequestState.waitingtobank) {
//                return 1;
//            }
//            if  (status==RequestState.handling) {
//                return 2;
//            }
//            if  (status==RequestState.waitingtocustomer)
//            {
//                return 3;
//            }
//            if  (status==RequestState.withdrawed)
//            {
//                return 5;
//            }
//
//            if  (status==RequestState.accepted)
//            {
//                return 6;
//            }
//            if  (status==RequestState.rejected)
//            {
//                return 8;
//            }
//
//        //waitingtobank, handling,waitingtocustomer,waitingtobeneficiery, withdrawed, accepted,changeRequested, rejected ,terminationRequest }
//
//        }
//
//    }




function getCommentsForStep(int step) constant returns (string)
    {
        for(uint256 i=0; i<comments.length; i++) {
            if(comments[i].step == step) {
                return comments[i].commentline;

            }
        }

        return "";
    }

    function addCommentsForStep(int _step,string _commentline) public
    {
        Comment memory comment ;
        comment.step   = _step;
        comment.commentline    = _commentline;

        comments.push(comment);

    }




    event Submitted(address  requestId,address msgSender,string comment ,RequestState _newstate);

    //submit function to initiat the request
    function submit(string comment) onlyCustomer public returns (bool result)

    {
        require(status==RequestState.created);
        stepNumber++;
        addCommentsForStep(stepNumber,comment);
        status=RequestState.waitingtobank;

        Submitted(getId(),msg.sender,comment,status);
        //        log("submitted",getId()+"->"+comment);
        return true;
    }


    event Withdrawal(address  requestId,address msgSender,string comment);
    //customer withdrawal request
    function withdrawal(string comment) onlyCustomer public returns (bool result)
    {
        require(status!=RequestState.accepted);
        stepNumber++;
        addCommentsForStep(stepNumber,comment);
        status=RequestState.withdrawed;
        Withdrawal(getId(),msg.sender,comment);
        //        log("withdrawed",getId()+"->"+comment);
        return true;
    }

    event Termination(address  requestId,address msgSender,string comment);
    //bank reject request
    function termination(string _comment) onlyBeneficiary public returns (bool result)
    {
        require(status==RequestState.accepted );
        stepNumber++;
        if (guarantee!= address(0))
        {
            GuaranteeExtender(guarantee).terminate(_comment);
        }
        addCommentsForStep(stepNumber,_comment);
        status=RequestState.terminationRequest;
        Termination(getId(),msg.sender,_comment);
        //         log("rejected",getId()+"->"+comment);
        return true;

    }

    event Rejected(address  requestId,address msgSender,string comment);
    //bank reject request
    function reject(string comment) onlyBank public returns (bool result)
    {
        require(status!=RequestState.accepted);
        stepNumber++;
        addCommentsForStep(stepNumber,comment);
        status=RequestState.rejected;
        Rejected(getId(),msg.sender,comment);
        //         log("rejected",getId()+"->"+comment);
        return true;

    }


    event BankStateChange(address  requestId,address msgSender,string comment,RequestState _newStat);
    //bank reject request
    function bankStateChange(string comment ,RequestState _newState) onlyBank public returns (bool result)
    {
        require((status==RequestState.waitingtobank      ||
                status==RequestState.handling           ) &&
               (_newState==RequestState.handling           ||
                 _newState==RequestState.waitingtocustomer  ||
                 _newState==RequestState.waitingtobeneficiery ));
        stepNumber++;
        addCommentsForStep(stepNumber,comment);
        status=_newState;
        BankStateChange(getId(),msg.sender,comment,_newState);
        //         log("rejected",getId()+"->"+comment);
        return true;

    }


    event Accepted(address  requestId,address msgSender,string comment,bytes _guaranteeIPFSHash);
    //bank accept request
    function accept(string comment,bytes _guaranteeIPFSHash) onlyBank public returns (bool result)
    {
        require((status==RequestState.waitingtobank || status==RequestState.handling || status==RequestState.changeRequested) && _checkArray(_guaranteeIPFSHash) && guarantee==address(0));
        stepNumber++;
        guaranteeIPFSHash=_guaranteeIPFSHash;
        addCommentsForStep(stepNumber,comment);
        status=RequestState.accepted;
        Accepted(getId(),msg.sender,comment,guaranteeIPFSHash);
        guarantee= new DigitalGuaranteeBNHP(this,regulator,guaranteeIPFSHash);
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

    //    event ChangeRequested(address  requestId,address  oldrequestId,address msgSender);
    //    function changeRequested(address _old_request) onlyBank returns (bool result)
    //    {
    //        require((status==RequestState.created ) );
    //        stepNumber++;
    //        status=RequestState.changeRequested;
    //        changeRequest=_old_request;
    //        ChangeRequested(getId(),oldrequestId,msg.sender);
    //        return true;
    //    }


}
