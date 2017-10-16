pragma solidity ^0.4.11;

import "./GuaranteeConst.sol";
import "./GuaranteeExtender.sol";
import "./GuaranteeRequestExtender.sol";

contract DigitalGuaranteeBNHP is Ownable,GuaranteeExtender
{
    address guaranteeRequestExtender;
    address regulator;

    GuaranteeState gstate;
    bytes guaranteeIPFSHash;

    event Issued(address  _requestId,address  _guaranteeId,address _msgSender,bytes _guaranteeIPFSHash);
    event Terminated(address  _requestId,address  _guaranteeId,address _msgSender );

    function getGuaranteeRequest() constant public returns (address requestExtender)
    {
        return guaranteeRequestExtender;
    }


    function DigitalGuaranteeBNHP(address _guaranteeRequestExtender,address _regulator,bytes _guaranteeIPFSHash) {
        guaranteeRequestExtender=_guaranteeRequestExtender;
        regulator=_regulator;
        guaranteeIPFSHash=_guaranteeIPFSHash;
        gstate=GuaranteeState.Valid;
        Issued(_guaranteeRequestExtender,this,msg.sender, _guaranteeIPFSHash);
    }



    function getId() constant public returns (address _contract_id)
    {
        return this;
    }

    function getBeneficiary() constant public returns (address _addr)
    {
        GuaranteeRequestExtender gr= GuaranteeRequestExtender(guaranteeRequestExtender);
        return gr.getBeneficiary();
    }

    function getEndDate() constant public returns (uint _enddate)
    {
        GuaranteeRequestExtender gr= GuaranteeRequestExtender(guaranteeRequestExtender);
        return gr.getEndDate();
    }


    function getGuaranteeData() constant public returns (address _contract_id,address _guaranteeRequest,address _customer,address _bank ,address _beneficiary, bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate , GuaranteeState _guaranteeState)
    {
        GuaranteeRequestExtender gr= GuaranteeRequestExtender(guaranteeRequestExtender);

//        ( , _customer, _bank,  _beneficiary,  _purpose, _amount, _startDate, _endDate, _indexType, _indexDate, ) =gr.getGuaranteeRequestData();
        ( , , ,  _beneficiary, _purpose , _amount, _startDate, _endDate, _indexType, _indexDate, ) =gr.getGuaranteeRequestData();

        _guaranteeRequest=guaranteeRequestExtender;
        _contract_id=getId();
        _customer=gr.getCustomer();
        _bank=gr.getBank();
        _guaranteeState=getGuaranteeState();

    }

    function getGuaranteeIPFSHash() constant public returns (bytes)
    {
        return guaranteeIPFSHash;
    }




    function getGuaranteeState() constant  public returns (GuaranteeState _guaranteeState)
    {
        if (isExpired())
        {
            return  GuaranteeState.Expaired;
        }
        else
        {
            return  gstate;
        }

    }

//    event AAA(GuaranteeState);

    function terminateGuarantee()  public
    {
        gstate=GuaranteeState.Terminated;
//    AAA(gstate);
        Terminated(guaranteeRequestExtender,getId(),msg.sender);


    }



//    event ChangeRequested(address  _requestId,address  _guaranteeId,address _msgSender,uint amount, string endDate,string comment);
//
//    function changeRequest(uint _amount, string _endDate, string _comment) onlyBeneficiary returns (bool)
//    {
//        ChangeRequested(guaranteeRequestExtender,this,msg.sender,_amount,  _endDate, _comment);
//        throw;
//    }


}
