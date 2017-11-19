pragma solidity ^0.4.13;

import "./Ownable.sol";
import "./GuaranteeConst.sol";
import "./IssuerManager.sol";
import "./BeneficiaryManager.sol";
import "./CustomerManager.sol";
import "./GuaranteeRequest.sol";
import "./ChangeGuaranteeRequest.sol";

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



        submitBeneficiary(msg.sender,"עיריית ראשון לציון","הכרמל 20, ראשון לציון");
        submitCustomer(msg.sender,"ישראל ישראלי","הרצל 11 ראשון לציון");
        submitIssuer(msg.sender,"בנק הפועלים","הנגב 11 תל אביב");
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
//        AAA(1);

    }

    event GuaranteeSign(address  _guaranteeRequest);
    function acceptGuaranteeRequest(address  _guaranteeRequest)  public
    {
        GuaranteeRequestExtender ge=GuaranteeRequestExtender(_guaranteeRequest);
        require(msg.sender == ge.getBank() && ge.isValid());


        if (ge.accept()) {
            if (ge.isChangeRequest())
            {
                terminateGuarantee(GuaranteeRequestExtender(ge.getChangeRequestGuarantee()).getGuaranteeAddress());
            }
            GuaranteeSign(_guaranteeRequest);
        }
        else
            throw;
    }

    function GuaranteeSignComplite(address  _guaranteeRequest,bytes _guaranteeIPFSHash)  public  returns (address)
    {
        GuaranteeRequestExtender ge=GuaranteeRequestExtender(_guaranteeRequest);
        require( ge.getRequestState()==RequestState.accepted && _checkArray(_guaranteeIPFSHash) && msg.sender == ge.getBank());


        address gra=ge.signComplite(_guaranteeIPFSHash);
        guarantees.push(gra);

        return gra;

    }





    function terminateGuarantee(address  _guarantee)  public
    {



        GuaranteeExtender ge= GuaranteeExtender(_guarantee);
        GuaranteeRequestExtender ger=GuaranteeRequestExtender(ge.getGuaranteeRequest());
        require( _guarantee!= address(0) && ger.getGuaranteeAddress()!= address(0) && msg.sender == ger.getBeneficiary() );

        ge.terminateGuarantee() ;
        ger.terminateGuarantee();


    }





    function changeGuarantee(address  _guarantee ,uint _newamount, uint _newendDate)  returns (bool)  //onlyBeneficiary
    {
//        GuaranteeExtender ge= GuaranteeExtender(_guarantee);
//        GuaranteeRequestExtender ger=GuaranteeRequestExtender(ge.getGuaranteeRequest());
//        require( ger.getRequestState()==RequestState.accepted && msg.sender == ger.getBeneficiary() && _guarantee!= address(0));
//
//        ger.changeRequested( _newamount,  _newendDate);
//        ChangeGuaranteeRequest newger=new ChangeGuaranteeRequest(ge.getGuaranteeRequest(),_newamount, _newendDate);
//        guaranteeRequests.push(newger.getId());

//        guaranteeRequests.push( new ChangeGuaranteeRequest(ge.getGuaranteeRequest(),_newamount, _newendDate).getId());
//        return true;
    }

    function changeGuaranteeM(address  _changeGuaranteeRequest )  public  returns (address)//onlyBeneficiary
    {
        ChangeGuaranteeRequest newger=ChangeGuaranteeRequest(_changeGuaranteeRequest);
        require(msg.sender == newger.getBeneficiary() && newger.isValid() && newger.isChangeRequest());
//        GuaranteeExtender(GuaranteeExtender(newger.getChangeRequestGuarantee())
//            .getChangeRequestGuarantee()).
        newger.setRegulator();
        guaranteeRequests.push(_changeGuaranteeRequest);
        return _changeGuaranteeRequest;
    }



}
