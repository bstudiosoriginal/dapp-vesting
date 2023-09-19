import { ethers, Contract } from "ethers";
import React, { useState } from 'react';

import { env } from '../next.config';
import { useMyContext } from '../context/applicationtotalstate';


const WithdrawPage = () => {
  
  const [OrganizationName, setOrganizationName] = useState('');
  const [OrganizationRole, seOrganizationRole] = useState('');
  const [contractLoader, setContractLoader] = useState(false)
  

  const [OrganizationName2, setOrganizationName2] = useState('');
  const [TokenName, setTokenName] = useState('');

  const {provider, updateProvider} = useMyContext();

  const handleOrganizationNameChange = (e) => {
    setOrganizationName(e.target.value);
  };

  const handleOrganizationName2Change = (e) => {
    setOrganizationName2(e.target.value);
  };

  const handleOrganizationRoleChange = (e) => {
    seOrganizationRole(e.target.value);
  };

  const handleTokenNameChange = (e) => {
    setTokenName(e.target.value);
  };

  async function handleUserRole() {
    if (OrganizationName == ""){
      alert('Please enter organization name')
      return
    }
    if (OrganizationRole == "") {
      alert('Please enter organization role')
      return
    }

    await registerUserRole()
  }

  async function registerUserRole () {
    try{
        setContractLoader(true)
        const _signer = provider.getSigner();
        const vestingcontract = new Contract(env.ADDRESS_VESTING_CONTRACT, env.ABI_VESTING_CONTRACT, _signer);
        const writeScheduleTx = await vestingcontract.add_role(OrganizationName, OrganizationRole);
        const UserRoleAdded = "UserRoleAdded";
        vestingcontract.on(UserRoleAdded, (_user_address, _orgname, _role) => {
            console.log('Contract event received:');
            alert('Successfully registered as '+ toString(_role)+' in '+toString(_orgname))
            // Process event data here
          });
        const response = await writeScheduleTx.wait()
        setContractLoader(false)
    } catch (error){
        setContractLoader(false)
        if (error.code === 'CALL_EXCEPTION') {
            alert('Transaction failed:' + toString(error.reason));
          } else {
            alert(error.reason);
          }
    }
  }

  async function handleWithdrawToken() {
    if (OrganizationName2 == ""){
      alert('Please enter organization name')
      return
    }
    if (TokenName == "") {
      alert('Please enter token name')
      return
    }

    await withdrawToken()
  }

  async function withdrawToken () {
    try{
        setContractLoader(true)
        const _signer = provider.getSigner();
        const vestingcontract = new Contract(env.ADDRESS_VESTING_CONTRACT, env.ABI_VESTING_CONTRACT, _signer);
        const writeScheduleTx = await vestingcontract.claimTokens(OrganizationName2, TokenName);
        const response = await writeScheduleTx.wait()
        const TokensClaimed = "TokensClaimed";
        vestingcontract.on(TokensClaimed, (beneficiary, amount) => {
            console.log('Contract event received:');
            alert('Successfully Claimed  '+ toString(amount)+'ETH as '+toString(beneficiary))
            // Process event data here
          });
        setContractLoader(false)
    } catch (error){
        setContractLoader(false)
        if (error.code === 'CALL_EXCEPTION') {
        alert('Transaction failed:' + toString(error.reason));
      } else {
        alert(error.reason);
      }
    }
  }

  return (
    <div className='flex flex-col min-h-screen items-center justify-between pl-10 pr-10  font-mono'>
        <h1 className={`m-0 flex w-full justify-center text-3xl fw-700 opacity-100 pb-8 `}>
        TokenVesting 
        </h1>
        <div className="container flex flex-col lg:flex  lg:flex-row">
            <div className="lg:flex  lg:flex-col w-250 lg:w-full mt-1 mr-8 h-[100%] items-left p-2">
                <h1 className="text-2xl mb-4 font-mono ">User Role</h1>

                <input
                    type="text"
                    placeholder="Organization"
                    value={OrganizationName}
                    onChange={handleOrganizationNameChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13 ld:min-w-65"
                />
                {/* <br></br> */}
                <input
                    type="text"
                    placeholder="Role"
                    value={OrganizationRole}
                    onChange={handleOrganizationRoleChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                {/* <br></br> */}
                
                <button
                    onClick={handleUserRole}
                    className="bg-blue-500 text-white p-2 mt-3 w-[100%] rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>
            <div className="container flex font-mono text-sm pt-5 pb-6 lg:p-12">
                
                <p className=" static flex w-auto justify-center border-b border-gray-300 rounded-xl border bg-gray-200 p-4 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Use this to specify your role in the organization. That is, for example, investor, stakeholder, etc.
                </p>
            </div>
        </div>
        <hr></hr>
        <br></br>
        <div className="container flex flex-col lg:flex  lg:flex-row">
            <div className="lg:flex  lg:flex-col w-250 lg:w-full mt-1 mr-8 h-[100%] items-left p-2">
                <h1 className="text-2xl mb-4">Withdraw funds </h1>
                <input
                    type="text"
                    placeholder="Organization"
                    value={OrganizationName2}
                    onChange={handleOrganizationName2Change}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                
                <input
                    type="text"
                    placeholder="Token name"
                    value={TokenName}
                    onChange={handleTokenNameChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                {/* <br></br>
                <br></br> */}
                <button
                    onClick={handleWithdrawToken}
                    className="bg-blue-500 text-white p-2 mt-3 w-[100%] rounded hover:bg-blue-700"
                >
                    Submit
                </button>
                
            </div>
            <div className="container flex font-mono text-sm pt-5 pb-11 lg:p-12">
                    <p className=" static flex w-auto justify-center border-b border-gray-300 rounded-xl border bg-gray-200 p-4 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                        Specify the organization and token you want to withdraw from. The vesting period might be in your way. Good luck!
                    </p>
                </div>
        </div>
    </div>

  );
};

export default WithdrawPage;
