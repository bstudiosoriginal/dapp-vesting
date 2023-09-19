// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {ethers} = require("hardhat");

async function main() {

  // spin the organization contract
  const organizationContract = await ethers.getContractFactory("OrganizationRegistry")
  const deployedorganizationContract = await organizationContract.deploy()
  await deployedorganizationContract.deployed()
  
  console.log(
    `Org with ETH  deployed to ${deployedorganizationContract.target}`
  );
  // spin the vesting schedule contract
  const vestingScheduleContract = await ethers.getContractFactory("VestingSchedule")
  const deployedVestingScheduleContract = await vestingScheduleContract.deploy(...[deployedorganizationContract.address])
  await deployedVestingScheduleContract.deployed()
  console.log(
    `VS with ETH and unlock timestamp deployed to ${deployedVestingScheduleContract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


