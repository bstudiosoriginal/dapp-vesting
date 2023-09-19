// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./organizationcontract.sol";
import "./token.sol";


contract VestingSchedule {

    struct VestingDetails {
        uint256 vestingPeriod; // In seconds
        uint256 startTime;
    }
    // org > token > beneficiary : claimed
    mapping (string => mapping (string => mapping (address => bool))) public isClaimed;

    OrganizationRegistry public organizationRegistry;
    
    mapping( string => mapping(string => mapping(string => VestingDetails))) public vestingSchedules;
    
    mapping (string => mapping (address => string)) public user_role;

    event VestingScheduled(string indexed beneficiary, uint256 vestingPeriod, uint256 startTime);
    event TokensClaimed(address indexed beneficiary, uint256 amount);
    event VestingUnScheduled(string indexed beneficiary, uint256 startTime);
    event UserRoleAdded(address indexed _user_address, string indexed _orgname, string indexed _role);

    constructor(address _organizationRegistryAddr) {
        organizationRegistry = OrganizationRegistry(_organizationRegistryAddr);
    }

    modifier onlyRegisteredOrganization() {
        require(organizationRegistry.isOrganizationRegistered(msg.sender), "Only registered organization can perform this action");
        _;
    }

    // Process of whitelisting a beneficiary
    function addVestingSchedule(string memory _token_name, string memory _role, uint256 _vestingPeriod) external onlyRegisteredOrganization {
        // require(isClaimed[orgname][_token_name], "Vesting already claimed");
        require(_vestingPeriod > 0, "Vesting period must be greater than zero");
        // Only Whitelisted organization 
        require(organizationRegistry.isOrganizationRegistered(msg.sender), "Organization not registered");
        require(organizationRegistry.tokenContractExists(organizationRegistry.getOrganization(msg.sender).name, _token_name), "No such token registered for your organization");
        string memory orgname = organizationRegistry.getOrganization(msg.sender).name;
        vestingSchedules[orgname][_token_name][_role] = VestingDetails({
            vestingPeriod: _vestingPeriod,
            startTime: block.timestamp
        });
        emit VestingScheduled(_role, _vestingPeriod, block.timestamp);
    }

    function removeVestingSchedule(string memory _token_name, string memory _role) external onlyRegisteredOrganization {
        // require(isClaimed[orgname][_token_name], "Vesting already claimed");
        string memory orgname = organizationRegistry.getOrganization(msg.sender).name;
        require(organizationRegistry.isOrganizationRegistered(msg.sender), "Organization not registered");
        require(organizationRegistry.tokenContractExists(organizationRegistry.getOrganization(msg.sender).name, _token_name), "No such token exists");
        vestingSchedules[orgname][_token_name][_role] = VestingDetails(0, 0);
        emit VestingUnScheduled(_role, block.timestamp);
    }

    function add_role(string memory orgname, string memory _role) external {
        require(organizationRegistry.getOrgfromName(orgname).owner != address(0), "Organization does not exist");
        user_role[orgname][msg.sender] = _role;
        // isClaimed[orgname][_token_name][msg.sender] = false;
        emit UserRoleAdded(msg.sender, orgname, _role);
    }

    function claimTokens(string memory orgname, string memory _token_name) external {
        
        require(organizationRegistry.getOrgfromName(orgname).owner != address(0), "Organization does not exist");
        require(organizationRegistry.tokenContractExists(orgname, _token_name), "No such token exists");
        // User role
        string memory s = user_role[orgname][msg.sender];
        require(((vestingSchedules[orgname][_token_name][s].startTime > 0) || (organizationRegistry.getOrgfromName(orgname).owner == msg.sender)), "User role not whitelisted");
        // assert if owner claimed token
        bool _isClaimed = isClaimed[orgname][_token_name][msg.sender];
        require(!_isClaimed, "Tokens already claimed");
        VestingDetails memory vesting = vestingSchedules[orgname][_token_name][s];
        require(block.timestamp >= vesting.startTime + vesting.vestingPeriod, "Vesting period not completed yet");
        TokenContract token = organizationRegistry.tokenContracts(orgname, _token_name);
        
        uint256 balance = token.balanceOf(address(this));
        uint256 claimable = (balance * vesting.vestingPeriod) / vestingSchedules[orgname][_token_name][s].vestingPeriod;

        isClaimed[orgname][_token_name][msg.sender] = true;
        token.transfer(msg.sender, claimable);

        emit TokensClaimed(msg.sender, claimable);
    }
}
