const express = require("express");
const path = require("path");
const cron = require('node-cron')
const ethers  = require('ethers')


// const Provider = new ethers.providers.JsonRpcProvider("https://cold-patient-moon.matic-testnet.discover.quiknode.pro/202df11be14be8f724d2fae3995aa0ed8f93448c/")
const Provider = new ethers.providers.AlchemyProvider('maticmum', 'bjMe0YCNyiyfqspS91W1JtoPNzoLh19a')
console.log(Provider.connection)

const Wallet = new ethers.Wallet("ef8ab63dc2488da4a1f2ee779f92aa645b87453df592c616f2dc9a4f8811ba80",Provider)
console.log(Wallet.address)

const blockchainLotteryAddress = "0x29F411Ce98E2339ED6F3AbA6063ef90f188F98cb";
const blockchainLotteryAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "DepositeAmountEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "Winner",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "USDTAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressAndTickets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "amount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isOn",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lastWinner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tickets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ticketsAndAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newAddress",
          "type": "address"
        }
      ],
      "name": "updateUSDTAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getParticipants",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_fee",
          "type": "uint256"
        }
      ],
      "name": "updateFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "setDepositeAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_num",
          "type": "uint256"
        }
      ],
      "name": "setRandNounce",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        }
      ],
      "name": "setFeeAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllParticipants",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllTickets",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getTicket",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_isOn",
          "type": "bool"
        }
      ],
      "name": "setIsOn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "depositeUSDT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "assignTicket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLottery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
const blockchainLotteryContract = new ethers.Contract(blockchainLotteryAddress, blockchainLotteryAbi, Wallet)
console.log(process.env.REACT_APP_BLOCKCHAIN_LOTTERY_ADDRESS)

const news =async ()=>{
	let i = await blockchainLotteryContract.isOn()
	console.log(i)
}

news()
// 0 55 23 * * * 
// 0 0,15,35,50 * * * *
let assigner = cron.schedule("0 0,15,35,50 * * * *", async function() {
  let isOn = await blockchainLotteryContract.isOn()
  if(isOn){
    let gasprice = await Provider.getGasPrice()
    console.log(gasprice.toNumber())
    console.log(new Date().toLocaleTimeString())
    let tx = await blockchainLotteryContract.assignTicket({gasPrice:gasprice.toNumber()})
    console.log(tx)
  }
});

// 0 0 0 * * * 
// 0 10,25,40,55 * * * *
let lotteryopener = cron.schedule("0 10,25,40,55 * * * *", async function() {
	let isOn = await blockchainLotteryContract.isOn()
	console.log(isOn)
	console.log(new Date().toLocaleTimeString())
  if(isOn===false){
    let gasprice = await Provider.getGasPrice()
    console.log(gasprice.toNumber())
    console.log(new Date().toLocaleTimeString())
    let tx = await blockchainLotteryContract.getLottery({gasPrice:gasprice.toNumber()})
    console.log(tx)
  }
});

const app = express();

app.use(express.static(path.join(__dirname, "../front-end/build")));
app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "./index.html")));

const PORT = process.env.PORT || 3000;

lotteryopener.start()
assigner.start()

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));