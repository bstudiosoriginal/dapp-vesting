import { ethers, Contract } from "ethers";
import React, { useState } from 'react';

import { env } from '../next.config';
import { useMyContext } from '../context/applicationtotalstate';


const OrganizationPage = (props) => {
  const [contractLoader, setContractLoader] = useState(false)
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, seTokenSymbol] = useState('');
  const [InitialQuantity, setInitialQuantity] = useState('');

  const [tokenName2, setTokenName2] = useState('');
  const [role, setRole] = useState('');
  const [vestingPeriod, setVestingPeriod] = useState('');

  const {organizationName} = props

  const {provider, updateProvider} = useMyContext();


  const handleTokenNameChange = (e) => {
    setTokenName(e.target.value);
  };

  const handleTokenName2Change = (e) => {
    setTokenName2(e.target.value);
  };

  const handleTokenSymbolChange = (e) => {
    seTokenSymbol(e.target.value);
  };

  const handleInitialQuantityChange = (e) => {
    setInitialQuantity(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleVestingPeriodChange = (e) => {
    setVestingPeriod(e.target.value);
  };

  async function handleSubmitToken() {
    if (tokenName == ""){
      alert('Please enter token name')
      return
    }
    if (tokenSymbol == "") {
      alert('Please enter token symbol')
      return
    }
    if (InitialQuantity == ""){
      alert('Please enter initial quantity')
      return
    }
    await registerToken()
  }

  async function handleSubmit() {
    // You can implement logic to save organization details
    // For now, let's just log them
    console.log('Token Name:', tokenName);
    console.log('Role:', role);
    console.log('Vesting Period:', vestingPeriod);
    if (tokenName2 == ""){
      alert('Please enter token name2')
      return
    }
    if (role == "") {
      alert('Please enter role')
      return
    }
    if (vestingPeriod == ""){
      alert('Please enter vesting schedule')
      return
    }
    await addVestingSchedule()
  };

  async function addVestingSchedule () {
    try{
        setContractLoader(true)
        const _signer = provider.getSigner();
        const vestingcontract = new Contract(env.ADDRESS_VESTING_CONTRACT, env.ABI_VESTING_CONTRACT, _signer);
        const writeScheduleTx = await vestingcontract.addVestingSchedule(tokenName, role, parseInt(vestingPeriod));
        const response = await writeScheduleTx.wait()
        const VestingScheduled = "VestingScheduled";
        vestingcontract.on(VestingScheduled, (beneficiary, vestingPeriod, startTime) => {
            console.log('Contract event received:');
            alert('Successfully scheduled vesting for '+ toString(beneficiary)+'for '+toString(vestingPeriod) + ' seconds starting '+ toString(startTime))
            // Process event data here
          });
        setContractLoader(false)
    } catch (error){
      if (error.code === 'CALL_EXCEPTION') {
        alert('Transaction failed:' + toString(error.reason));
      } else {
        alert(error.reason);
      }
        setContractLoader(false)
    }
  }

  async function registerToken () {
    try{
        setContractLoader(true)
        
        try{
          // const _provider = provider.getSigner();
          console.log(typeof provider)
          const signer = provider.getSigner();
            const orgcontract = new Contract(
            env.ADDRESS_ORGANIZATION_CONTRACT,
            env.ABI_ORGANIZATION_CONTRACT,
            signer
          );
          const tx = await orgcontract.registerToken(parseInt(InitialQuantity), tokenName, tokenSymbol)
          await tx.wait()
          const TokenRegistered = "TokenRegistered";
          orgcontract.on(TokenRegistered, (org, token_name, token_symbol) => {
            console.log('Contract event received:');
            alert('Successfully registered token '+ toString(token_name)+' '+toString(token_symbol)+' At '+ toString(org))
            // Process event data here
          });
        
        } catch (error) {
          if (error.code === 'CALL_EXCEPTION') {
            alert('Transaction failed:' + toString(error.reason));
          } else {
            alert(error.reason);
          }
        }
        setContractLoader(false)
    } catch (error){
      if (error.code === 'CALL_EXCEPTION') {
        alert('Transaction failed:' + toString(error.reason));
      } else {
        alert(error.reason);
      }
        setContractLoader(false)
    }
  }

  return (
    <div className='flex flex-col min-h-screen items-center justify-between pl-10 pr-10  font-mono'>
        <h1 className={`m-0 flex w-full justify-center text-3xl fw-700 opacity-100 pb-8 `}>
        TokenVesting 
        </h1>

        <div className="container flex flex-col lg:flex  lg:flex-row">
            <div className="lg:flex  lg:flex-col w-250 lg:w-full mt-1 mr-8 h-[100%] items-left p-2">
                <h1 className="text-2xl mb-4 font-mono ">Register Token for {organizationName}</h1>

                <input
                    type="text"
                    placeholder="Token Name"
                    value={tokenName}
                    onChange={handleTokenNameChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13 ld:min-w-65"
                />
                {/* <br></br> */}
                <input
                    type="text"
                    placeholder="Token Symbol"
                    value={tokenSymbol}
                    onChange={handleTokenSymbolChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                {/* <br></br> */}
                <input
                    type="number"
                    placeholder="Initial Quantity"
                    value={InitialQuantity}
                    onChange={handleInitialQuantityChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                {/* <br></br>
                <br></br> */}
                <button
                    onClick={handleSubmitToken}
                    className="bg-blue-500 text-white p-2 mt-3 w-[100%] rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>
            <div className="container flex font-mono text-sm pt-5 pb-6 lg:p-12">
                
                <p className=" static flex w-auto justify-center border-b border-gray-300 rounded-xl border bg-gray-200 p-4 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Add a token to your organization's collection. Specify the name, symbol and initial Quantity.
                </p>
            </div>
        </div>
        <hr></hr>
        <br></br>
        <div className="container flex flex-col lg:flex  lg:flex-row">
            <div className="lg:flex  lg:flex-col w-250 lg:w-full mt-1 mr-8 h-[100%] items-left p-2">
                <h1 className="text-2xl mb-4">Add Vesting Period </h1>
                <input
                    type="text"
                    placeholder="Token Name"
                    value={tokenName2}
                    onChange={handleTokenName2Change}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                {/* <br></br> */}
                <input
                    type="text"
                    placeholder="Role"
                    value={role}
                    onChange={handleRoleChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                {/* <br></br> */}
                <input
                    type="text"
                    placeholder="Vesting Period"
                    value={vestingPeriod}
                    onChange={handleVestingPeriodChange}
                    className="border rounded p-2  w-[100%] mt-3  h-13"
                />
                {/* <br></br>
                <br></br> */}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white p-2 mt-3 w-[100%] rounded hover:bg-blue-700"
                >
                    Submit
                </button>
                
            </div>
            <div className="container flex font-mono text-sm pt-5 pb-11 lg:p-12">
                    <p className=" static flex w-auto justify-center border-b border-gray-300 rounded-xl border bg-gray-200 p-4 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                        Add a vestingPeriod to your token. Enter the token name, role of individuals that can withdraw and the vesting period in seconds.
                    </p>
                </div>
        </div>
    </div>

  );
};

export default OrganizationPage;
