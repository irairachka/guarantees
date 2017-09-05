pragma solidity ^0.4.11;

import "./GuaranteeConst.sol";
import "./GuaranteeExtender.sol";
import "./GuaranteeRequestExtender.sol";

contract DigitalGuaranteeBNHP is GuaranteeExtender
{
    address guaranteeRequestExtender;
    address regulator;

    GuaranteeState state;
    bytes guaranteeIPFSHash;

    event Issued(address  _requestId,address  _guaranteeId,address _msgSender,bytes _guaranteeIPFSHash);
    event Terminated(address  _requestId,address  _guaranteeId,address _msgSender , string _comment);



    function DigitalGuaranteeBNHP(address _guaranteeRequestExtender,address _regulator,bytes _guaranteeIPFSHash) {
        guaranteeRequestExtender=_guaranteeRequestExtender;
        regulator=_regulator;
        guaranteeIPFSHash=_guaranteeIPFSHash;
        state=GuaranteeState.Valid;
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


    function getGuaranteeData() constant public returns
    (address _contract_id,address _customer,address _bank ,address _beneficiary, string _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate , GuaranteeState _guaranteeState)
    {
        GuaranteeRequestExtender gr= GuaranteeRequestExtender(guaranteeRequestExtender);

//        ( , _customer, _bank,  _beneficiary,  _purpose, _amount, _startDate, _endDate, _indexType, _indexDate, ) =gr.getGuaranteeRequestData();
        ( , , ,  _beneficiary,  , _amount, _startDate, _endDate, _indexType, _indexDate, ) =gr.getGuaranteeRequestData();

        _contract_id=getId();
        _customer=gr.getCustomer();
        _bank=gr.getBank();
        _purpose="Test";
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
            return  state;
        }

    }



    function terminate(string _comment) onlyBeneficiary public returns (bool)
    {
        Terminated(guaranteeRequestExtender,this,msg.sender, _comment);
        state=GuaranteeState.Terminated;
        //        GuaranteeRequestExtender(guaranteeRequestExtender).
        return true;
    }


    //
    //
    //    function changeRequest(uint amount, string endDate, string comment) onlyBeneficiary returns (bool)
    //    {
    //
    //    }


}
