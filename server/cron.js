const cron = require('node-cron')
const ethers  = require('ethers')

PRIVATEKEY = "PRIVATEKEY"
// const Provider = new ethers.providers.JsonRpcProvider("https://cold-patient-moon.matic-testnet.discover.quiknode.pro/202df11be14be8f724d2fae3995aa0ed8f93448c/")
const PolygonProvider = new ethers.providers.AlchemyProvider('matic', 'Yh3I9yoFwdI62pQjCJ-pTnlCnZ08Bv2i')
console.log(PolygonProvider.connection)
const BNBProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")
console.log(BNBProvider.connection)

const PolygonWallet = new ethers.Wallet(PRIVATEKEY,PolygonProvider)
console.log(PolygonWallet.address)
const BNBWallet = new ethers.Wallet(PRIVATEKEY,BNBProvider)
console.log(BNBWallet.address)

const blockchainLotteryAddress = "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58";
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "lastWinner",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "updateOwner",
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
const blockchainLotteryContractPolygon = new ethers.Contract(blockchainLotteryAddress, blockchainLotteryAbi, PolygonWallet)
const blockchainLotteryContractBNB = new ethers.Contract(blockchainLotteryAddress, blockchainLotteryAbi, BNBWallet)
console.log(process.env.REACT_APP_BLOCKCHAIN_LOTTERY_ADDRESS)


const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}


// 0 55 23 * * * 
// 0 0,15,35,50 * * * *
let polygon = cron.schedule("0 55 23 * * *", async function() {
  let isOn = await blockchainLotteryContractPolygon.isOn()
  if(isOn){
    let gasprice = await Provider.getGasPrice()
    console.log("Gas Price: "+gasprice.toNumber())
    console.log(new Date().toLocaleTimeString())
    let tx = await blockchainLotteryContractPolygon.assignTicket({gasPrice:gasprice.toNumber()})
    console.log(tx)
    let reciept = await tx.wait()
    console.log("Before Wait "+new Date().toLocaleTimeString())
    
    await sleep(300000)
    console.log("After wait "+new Date().toLocaleTimeString())
    isOn = await blockchainLotteryContractPolygon.isOn()
    if(isOn===false){
      console.log(new Date().toLocaleTimeString())
      let gasprice = await Provider.getGasPrice()
      console.log("Gas Price: "+gasprice.toNumber())
      console.log(new Date().toLocaleTimeString())
      let tx = await blockchainLotteryContractPolygon.getLottery({gasPrice:gasprice.toNumber()})
      console.log(tx)
    }
  }
});

// 0 55 23 * * * 
// 0 0,15,35,50 * * * *
let bnb = cron.schedule("0 55 23 * * *", async function() {
  let isOn = await blockchainLotteryContractBNB.isOn()
  if(isOn){
    let gasprice = await Provider.getGasPrice()
    console.log("Gas Price: "+gasprice.toNumber())
    console.log(new Date().toLocaleTimeString())
    let tx = await blockchainLotteryContractBNB.assignTicket({gasPrice:gasprice.toNumber()})
    console.log(tx)
    let reciept = await tx.wait()
    console.log("Before Wait "+new Date().toLocaleTimeString())
    
    await sleep(300000)
    console.log("After wait "+new Date().toLocaleTimeString())
    isOn = await blockchainLotteryContractBNB.isOn()
    if(isOn===false){
      console.log(new Date().toLocaleTimeString())
      let gasprice = await Provider.getGasPrice()
      console.log("Gas Price: "+gasprice.toNumber())
      console.log(new Date().toLocaleTimeString())
      let tx = await blockchainLotteryContractBNB.getLottery({gasPrice:gasprice.toNumber()})
      console.log(tx)
    }
  }
});

polygon.start()
bnb.start()