pragma solidity ^0.4.11;

import "./GuaranteeConst.sol";
import "./GuaranteeExtender.sol";
import "./GuaranteeRequestExtender.sol";
import "./Ownable.sol";

contract DigitalGuaranteeBNHP is Ownable,GuaranteeExtender
{
    address guaranteeRequestExtender;
    address regulator;

    GuaranteeState gstate;
    bytes guaranteeIPFSHash;

    event Issued(address  _requestId,address  _guaranteeId,address _msgSender,bytes _guaranteeIPFSHash,GuaranteeState   curentstatus,uint timestamp);
    event Terminated(address  _requestId,address  _guaranteeId,address _msgSender ,GuaranteeState   curentstatus,uint timestamp);

    function getGuaranteeRequest() constant public returns (address requestExtender)
    {
        return guaranteeRequestExtender;
    }


    function DigitalGuaranteeBNHP(address _guaranteeRequestExtender,address _regulator,bytes _guaranteeIPFSHash) {
        guaranteeRequestExtender=_guaranteeRequestExtender;
        regulator=_regulator;
        guaranteeIPFSHash=_guaranteeIPFSHash;
        gstate=GuaranteeState.Valid;
        Issued(_guaranteeRequestExtender,this,msg.sender, _guaranteeIPFSHash,gstate,now);
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


    function getGuaranteeData() constant public returns (address _contract_id,address _guaranteeRequest,address _customer,address _bank ,address _beneficiary,bytes32 _full_name, bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate , GuaranteeState _gState)
    {
        GuaranteeRequestExtender gr= GuaranteeRequestExtender(guaranteeRequestExtender);

//        ( , _customer, _bank,  _beneficiary,  _purpose, _amount, _startDate, _endDate, _indexType, _indexDate, ) =gr.getGuaranteeRequestData();
        ( , , ,  , _full_name, _purpose , _amount, _startDate, _endDate, _indexType, _indexDate, ) =gr.getGuaranteeRequestData();

        _guaranteeRequest=guaranteeRequestExtender;
        _contract_id=getId();
        _customer=gr.getCustomer();
        _bank=gr.getBank();
        _beneficiary=gr.getBeneficiary();
        _gState=getState();

    }

    function getGuaranteeIPFSHash() constant public returns (bytes)
    {
        return guaranteeIPFSHash;
    }



    event AAA (uint nowtime,uint enddate,bool isExpired,GuaranteeState state);
    event BBB (uint nowtime,uint enddate,bool isExpired,GuaranteeState state);
    event CCC (uint nowtime,uint enddate,bool isExpired,GuaranteeState state);


    function getState() constant  public returns (GuaranteeState )
    {
        AAA(now,getEndDate(),getEndDate()<now,gstate);

    if (gstate==GuaranteeState.Valid)
        {
            BBB(now,getEndDate(),getEndDate()<now,gstate);

        if (isExpired())
            {
                CCC(now,getEndDate(),getEndDate()<now,gstate);

            return  GuaranteeState.Expaired;
            }
        }

            return  gstate;


    }

//    event AAA(GuaranteeState);

    function terminateGuarantee()  public
    {
        gstate=GuaranteeState.Terminated;
//    AAA(gstate);
        Terminated(guaranteeRequestExtender,getId(),msg.sender,gstate,now);

    }



   event ChangeRequested(address  _requestId,address  _guaranteeId,address _msgSender,uint amount, string endDate,string commentline,GuaranteeState   curentstatus,uint timestamp);

    function changeRequest(uint _amount, string _endDate, string _comment)
    {
        ChangeRequested(guaranteeRequestExtender,this,msg.sender,_amount,  _endDate, _comment,gstate,now);
    }


}
