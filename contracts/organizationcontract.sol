// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./token.sol";


contract OrganizationRegistry {
    // Creation of an organization struct. //
    struct Organization {
        address owner;
        string name;
    }

    uint public i;

    // Creating the mapping for each organization.
    mapping (address => Organization) public organizations;
    mapping (string => Organization) public namedorganizations;

    // This event makes sure that when an organization, an event is triggered.
    event OrganizationRegistered(Organization indexed org);

    // mapping for tokens
    mapping (string => mapping (string => TokenContract)) public tokenContracts;
    mapping (string => mapping (string => bool)) public istokenRegistered;

    // This event makes sure that when an organization, an event is triggered.
    event TokenRegistered(string indexed orgainization, string indexed token_name, string indexed token_symbol);
    

    // this is the only owner modifier to allow only owners to perform a certain task.
    modifier onlyOwner(address organizationAddr) {
        require(msg.sender == organizations[organizationAddr].owner, "Only owner can perform this action");
        _;
    }

    // To register an organisation
    function registerOrganization(string memory _name) external {
        require(organizations[msg.sender].owner == address(0), "Organization already registered");
        Organization memory org = Organization({owner: msg.sender, name: _name});
        organizations[msg.sender] = org;
        namedorganizations[_name] = org;
        emit OrganizationRegistered(org);
    }

    function deleteOrganization() external {
        // unsafe for now
        Organization storage org = organizations[msg.sender];
        Organization storage org2 = namedorganizations[org.name];
        org.owner = address(0);
        org.name = "";
        org2.owner = address(0);
        org2.name = "";
    }

    function isOrganizationRegistered(address _organizationAddr) external view returns (bool) {
        return organizations[_organizationAddr].owner != address(0);
    }

    function getOrganization(address _organizationAddr) external view returns (Organization memory) {
        return organizations[_organizationAddr];
    }

    function registerToken(uint initialSupply, string memory _token_name, string memory _token_symbol) external {
        require(organizations[msg.sender].owner != address(0), "Not registered as an organization");
        string memory org = organizations[msg.sender].name;
        bool mined = istokenRegistered[org][_token_name];
        require(!mined, "Token already exists");

        TokenContract token = new TokenContract(initialSupply, _token_name, _token_symbol);
        // Check if token name exists
        
        tokenContracts[org][_token_name] = token;
        istokenRegistered[org][_token_name] = true;
        // token successfully registered
        emit TokenRegistered(org, _token_name, _token_symbol);
    }

    function getOrgfromName(string memory _name) external view returns (Organization memory){
        return namedorganizations[_name];
    }
   
   function tokenContractExists(string memory tokenName) external view returns (bool){
        return istokenRegistered[organizations[msg.sender].name][tokenName];
    }

    // overridden for non owners
    function tokenContractExists(string memory orgname, string memory tokenName) external view returns (bool){
        return istokenRegistered[orgname][tokenName];
    }
    
}
