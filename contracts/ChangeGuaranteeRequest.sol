pragma solidity ^0.4.0;


import "./GuaranteeRequestExtender.sol";

contract ChangeGuaranteeRequest is GuaranteeRequestExtender
{
    string public version = "1.00";

    uint  amount;
    uint  endDate;

//    bytes  theproposalIPFSHash;

    address  changeRequestGuaranteeAdr;


    function ChangeGuaranteeRequest(address guaranteeRequestExtender,uint requestAmount, uint requestEndDate){
        changeRequestGuaranteeAdr=guaranteeRequestExtender;
//        GuaranteeRequestExtender ger=GuaranteeRequestExtender(guaranteeRequestExtender);
        amount=requestAmount;
        endDate=requestEndDate;
        status=RequestState.created;


        changeOwner(GuaranteeRequestExtender(guaranteeRequestExtender).getCustomer());
    }

    function getId() constant public returns (address _contract_id)
    {
        return this;
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
    bytes32 _full_name ,bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate,RequestState _status)
    {

        ( , , , _beneficiary , _full_name, _purpose , , _startDate, , _indexType, _indexDate, _status) =GuaranteeRequestExtender(changeRequestGuaranteeAdr).getGuaranteeRequestData();

        _customer=getCustomer();
        _bank=getBank();
        _contract_id=getId();
        _amount=amount;
        _endDate=endDate;

    }

    function getProposalIPFSHash() constant public returns (bytes )
    {
    //        bytes propIPFS=GuaranteeRequestExtender(getChangeRequestGuarantee()).getProposalIPFSHash();
        return "";

    }





    function getChangeRequestGuarantee() constant public returns (address )
    {
        return changeRequestGuaranteeAdr;
    }

}
