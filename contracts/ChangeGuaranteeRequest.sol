pragma solidity ^0.4.0;


import "./GuaranteeRequestExtender.sol";

contract ChangeGuaranteeRequest is GuaranteeRequestExtender
{
    string public version = "1.00";

    uint  amount;
    uint  endDate;

//    bytes  theproposalIPFSHash;

    address public  changeRequestGuaranteeAdr;

    event ChangeGuaranteeRequestCreated (address guaranteeExtender,uint requestAmount, uint requestEndDate,RequestState   curentstatus,uint timestamp);

    function ChangeGuaranteeRequest(address guaranteeExtender,uint requestAmount, uint requestEndDate){
        DigitalGuaranteeBNHP ge=DigitalGuaranteeBNHP(guaranteeExtender);

        changeRequestGuaranteeAdr=ge.getGuaranteeRequest();
        amount=requestAmount;
        endDate=requestEndDate;
        status=RequestState.waitingtobank;


        changeOwner(GuaranteeRequestExtender(changeRequestGuaranteeAdr).getCustomer());
        ChangeGuaranteeRequestCreated(guaranteeExtender, requestAmount,  requestEndDate,status,now);
    }

    function getId() constant public returns (address _contract_id)
    {
        return this;
    }

    function getAmount() constant public returns (uint )
    {
        return amount;
    }


    function getBank() constant public returns (address)
    {
        return GuaranteeRequestExtender(changeRequestGuaranteeAdr).getBank();
    }
    function getBeneficiary() constant public returns (address)
    {
        return GuaranteeRequestExtender(changeRequestGuaranteeAdr).getBeneficiary();

    }

    function getEndDate() constant public returns (uint)
    {
        return endDate;
    }


    function getGuaranteeRequestData() constant public returns (address _contract_id,address _customer,address _bank, address _beneficiary,
    bytes32 _full_name ,bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,RequestState _status ,bool _isChangeGuarantee,address _changedGuarantee)
    {

        ( , , ,  , _full_name, _purpose , , _startDate, , _indexType, _indexDate, , , ) =GuaranteeRequestExtender(changeRequestGuaranteeAdr).getGuaranteeRequestData();

        _customer=getCustomer();
        _beneficiary=getBeneficiary();
        _bank=getBank();
        _contract_id=getId();
        _amount=amount;
        _status=status;
        _endDate=endDate;
        _isChangeGuarantee=true;
        _changedGuarantee=changeRequestGuaranteeAdr;

    }



    function getProposalIPFSHash() constant public returns (bytes _roposalIPFSHash)
    {
//            _roposalIPFSHash=GuaranteeRequestExtender(getChangeRequestGuarantee()).getProposalIPFSHash();
        return "";

    }



    function getChangeRequestGuarantee() constant public returns (address )
    {
        return changeRequestGuaranteeAdr;
    }

    function isValid() constant public returns (bool) {

        return ( getBank()!= address(0) && getBeneficiary()!= address(0));
    }

}
