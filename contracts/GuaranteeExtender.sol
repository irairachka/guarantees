pragma solidity ^0.4.11;

import "./GuaranteeConst.sol";

contract GuaranteeExtender is GuaranteeConst {

    function getId() constant public returns (address _contract_id);
    // function getCustomer() constant returns (address);
    // function getBank() constant returns (address);
    function getBeneficiary() constant public returns (address);

    //premissions modifier for beneficiary functions
    modifier onlyBeneficiary() {
        if ( msg.sender != getBeneficiary() ) {
            // loga("###ERROR-not performd by BENEFICIERY address",msg.sender);
            throw;
        }
        // loga("#pass BENEFICIERY action check",msg.sender);
        _;
    }


    //    function getPurpose() constant returns (string);
    //    function getAmount() constant returns (uint);
    //    function getStartDate() constant returns (uint);
    function getEndDate() constant public returns (uint);
    //    function getIndexType() constant returns (IndexType);
    //    function getIndexDate() constant returns (uint);

    function getGuaranteeData() constant public returns (address _contract_id,address _guaranteeRequest,address _customer,address _bank ,address _beneficiary,bytes32 _full_name, bytes32 _purpose,uint _amount,uint _startDate,uint _endDate,IndexType _indexType,uint _indexDate , GuaranteeState _gState);
    function getGuaranteeIPFSHash() constant public returns (bytes);


    // function endRequest(string comment) onlyBeneficiary returns (bool);
//    event AAA (uint nowtime,uint enddate,bool isExpired);
    function isExpired() constant public returns (bool) {
//        AAA(now,getEndDate(),getEndDate()<now);
        return (getEndDate()<now);
    }

    function getState() constant public returns (GuaranteeState );

    function getGuaranteeRequest() constant public returns (address requestExtender);


    function terminateGuarantee()  public ;


    event ChangeRequested(address  _requestId,address  _guaranteeId,address _msgSender,uint amount, uint endDate,string commentline,GuaranteeState   curentstatus,uint timestamp);

    function changeRequest(uint _amount, uint _endDate)
    {
        ChangeRequested(getId(),this,msg.sender,_amount,  _endDate, '' ,getState(),now);
    }


}
