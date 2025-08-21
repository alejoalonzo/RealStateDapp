// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface IERCC721 {
    function transferFrom(address from, address to, uint256 id) external;
}

contract Escrow {
    address public nftAddress;
    address payable public seller;
    address public inspector;
    address public lender;
    //*******************User Accounts *******************/
    struct user {
        string username;
        string lastName;
        string email;
    }

    struct allUserStruct {
        string name;
        string lastName;
        string email;
        address accountAddress;
    }

    allUserStruct[] getAllUsers;

    mapping(address => user) userList;

    //*******************Transfers *******************/
    modifier onlyBuyer(uint256 _nftId) {
        require(
            msg.sender == buyer[_nftId],
            "Only buyer can perform this action"
        );
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can perform this action");
        _;
    }

    modifier onlyInspector() {
        require(
            msg.sender == inspector,
            "Only inspector can perform this action"
        );
        _;
    }

    // State variables to track the listing status and details
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionIsPassed;
    //master mapping
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor(
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    //*******************User Accounts *******************/

    // Evento para notificar la creación de usuario
    event UserCreated(
        address indexed user,
        string username,
        string lastName,
        string email
    );

    //Check User Existence
    function userExists(address _user) public view returns (bool) {
        return bytes(userList[_user].username).length > 0;
    }

    //Create Account
    function createAccount(
        string calldata _username,
        string calldata _lastName,
        string calldata _email
    ) external {
        require(!userExists(msg.sender), "User already exists");
        //username cannot be empty
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_lastName).length > 0, "Last name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");

        userList[msg.sender].username = _username;
        userList[msg.sender].lastName = _lastName;
        userList[msg.sender].email = _email;

        getAllUsers.push(
            allUserStruct(_username, _lastName, _email, msg.sender)
        );
        emit UserCreated(msg.sender, _username, _lastName, _email);
    }

    //Get UserName
    function getUserName(address _user) external view returns (string memory) {
        require(userExists(_user), "User does not exist");
        return userList[_user].username;
    }

    //Get User Last Name
    function getUserLastName(
        address _user
    ) external view returns (string memory) {
        require(userExists(_user), "User does not exist");
        return userList[_user].lastName;
    }

    //Get User Email
    function getUserEmail(address _user) external view returns (string memory) {
        require(userExists(_user), "User does not exist");
        return userList[_user].email;
    }

    //Get Complete User Info
    function getUserInfo(
        address _user
    ) external view returns (string memory, string memory, string memory) {
        require(userExists(_user), "User does not exist");
        return (
            userList[_user].username,
            userList[_user].lastName,
            userList[_user].email
        );
    }

    //*******************Transfers *******************/
    function list(
        uint256 _nftId,
        address _buyer,
        uint256 _purchasePrice,
        uint256 _escrowAmount
    ) public payable onlySeller {
        // Transfer the NFT from seller to the escrow contract
        IERCC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);

        isListed[_nftId] = true;
        purchasePrice[_nftId] = _purchasePrice;
        escrowAmount[_nftId] = _escrowAmount;
        buyer[_nftId] = _buyer;
    }

    //Put under contract Escrow, only buyer can call this function
    function depositEarnest(uint256 _nftId) public payable onlyBuyer(_nftId) {
        require(msg.value >= escrowAmount[_nftId], "Incorrect escrow amount");
    }

    function updateInspectionStatus(
        uint256 _nftId,
        bool _passed
    ) public onlyInspector {
        //require(isListed[_nftId], "NFT is not listed");
        inspectionIsPassed[_nftId] = _passed;
    }

    // Approve the transaction by the buyer
    function approveTransaction(uint256 _nftId) public {
        approval[_nftId][msg.sender] = true;
    }

    receive() external payable {
        // Accept ether deposits
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function finalizeSale(uint256 _nftId) public {
        require(inspectionIsPassed[_nftId], "Inspection not passed");
        require(approval[_nftId][buyer[_nftId]], "Buyer not approved");
        require(approval[_nftId][seller], "Seller not approved");
        require(approval[_nftId][lender], "Lender not approved");
        require(
            address(this).balance >= purchasePrice[_nftId],
            "Insufficient funds in escrow"
        );

        // Transfer NFT to buyer
        IERCC721(nftAddress).transferFrom(address(this), buyer[_nftId], _nftId);

        // Transfer funds to seller
        (bool sent, ) = payable(seller).call{value: address(this).balance}("");
        require(sent, "Transfer failed");

        // Reset the listing
        isListed[_nftId] = false;
    }

    function cancelSale(uint256 _nftId) public {
        require(isListed[_nftId], "NFT is not listed");
        require(
            msg.sender == seller || msg.sender == buyer[_nftId],
            "Only seller or buyer can cancel the sale"
        );

        // Save buyer address before resetting
        address currentBuyer = buyer[_nftId];

        // Transfer NFT back to seller
        IERCC721(nftAddress).transferFrom(address(this), seller, _nftId);

        // If there are funds in escrow, return them to the buyer
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool sent, ) = payable(currentBuyer).call{value: balance}("");
            require(sent, "Refund failed");
        }

        // Reset approvals first (before resetting buyer address)
        approval[_nftId][currentBuyer] = false;
        approval[_nftId][seller] = false;
        approval[_nftId][lender] = false;

        // Reset all mappings for this NFT
        isListed[_nftId] = false;
        purchasePrice[_nftId] = 0;
        escrowAmount[_nftId] = 0;
        buyer[_nftId] = address(0);
        inspectionIsPassed[_nftId] = false;
    }
}
