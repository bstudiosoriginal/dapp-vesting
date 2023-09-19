This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### installing

1. Clone this repository.
```bash
git clone https://github.com/yourusername/vesting-dapp.git
```

2. Install all required packages 
```bash
npm install 
```
### Executing program

1. Deploying on hardhat for testing. 

Deploy the smart contracts using Hardhat

### On localhost

Launch your own local network using hardhat and then deploying the scripts. You will normally deploy in a separate process.
 ```bash
 # process 1
 npx hardhat node  
 # process 2
 npx hardhat run scripts/deploy.js --network localhost
 ```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. Connect to your Ethereum wallet (e.g., MetaMask). You can use any web3 wallet provider but make sure there is no real money in that wallet when testing. For testing please use a testnet.

5. Use the DApp to register organizations, add tokens, create vesting schedules, add user role and claim tokens.


# Help

Help
If you encounter any issues or have questions, please don't hesitate to reach out to our team at imma.adt@gmail.com.

# Authors
1. Immanuel Allotey
2. metacrafters.io

# License
This project is licensed under the MIT License.