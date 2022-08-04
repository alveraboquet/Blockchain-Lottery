import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import usdtabi from "./build/USDT.json";
import blockchainlottery from "./build/BlockchainLottery.json";
import Navbar from "./Navbar";
import Main from "./Main";
function App() {
  const [accounts, setAccounts] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(-1);
  const [pricePool, setPricePool] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [lastWinner, setLastWinner] = useState(null);
  const [isOn, setIsOn] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);
  const [blockchainLotteryContract, setBlockchainLotteryContract] =
    useState(null);
  const [networkErr, setNetworkErr] = useState(null);
  const [amount, setAmount] = useState(null);
  const [symbol, setSymbol] = useState(null);

  // const [usdtAddress, setUsdtAddress] = useState(null)
  // const USDTAddress = "0x7FFB3d637014488b63fb9858E279385685AFc1e2"; //Polygon Mainnet Address For USDT Tokens
  // const USDTAddress = "0xc1ef3d10d02F27Fe16052Aa463DB2C27a7604660"; //Polygon Mumbai Address For USDT Tokens
  const USDTAbi = usdtabi.abi;
  const BlockchainLotteryAddress = "0xC330332351858518Ff61C7d4930780B0d260EDEe";
  const BlockchainLotteryAbi = blockchainlottery.abi;
  const connectWallet = async () => {
    if (window.ethereum) {
      let chainId = await window.ethereum.request({ method: "net_version" });
      console.log(chainId);
      //eslint-disable-next-line
      if (chainId != 80001) {
        setNetworkErr("Please change network to polygon");
      } else {
        setNetworkErr(null);
      }
      let _accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(_accounts);

      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const tempBlockchainLotteryContract = new ethers.Contract(
        BlockchainLotteryAddress,
        BlockchainLotteryAbi,
        tempSigner
      );
      setBlockchainLotteryContract(tempBlockchainLotteryContract);
      let tempAmount = await tempBlockchainLotteryContract.amount();
      setAmount(tempAmount);
      const USDTAddress = await tempBlockchainLotteryContract.USDTAddress();
      // setUsdtAddress(USDTAddress)
      const tempUSDTContract = new ethers.Contract(
        USDTAddress,
        USDTAbi,
        tempSigner
      );
      setUsdtContract(tempUSDTContract);

      let tempdecimals = await tempUSDTContract.decimals();
      // let tempdecimals = 6

      let tempSymbol = await tempUSDTContract.symbol();
      setSymbol(tempSymbol);

      let tempPricePool = await tempUSDTContract.balanceOf(
        BlockchainLotteryAddress
      );
      console.log(tempPricePool.toNumber() / 10 ** tempdecimals);
      setPricePool(tempPricePool.toNumber() / 10 ** tempdecimals);

      let tempUSDTBalance = await tempUSDTContract.balanceOf(
        tempSigner.getAddress()
      );
      console.log(tempUSDTBalance.toNumber() / 10 ** tempdecimals);
      setUsdtBalance(tempUSDTBalance.toNumber() / 10 ** tempdecimals);

      console.log(tempBlockchainLotteryContract);
      let _lastWinner = await tempBlockchainLotteryContract.lastWinner();
      setLastWinner(_lastWinner.toNumber());

      let _isOn = await tempBlockchainLotteryContract.isOn();
      console.log(_isOn);
      setIsOn(_isOn);
      if (_isOn) {
        setTicketNumber(-1);
      } else {
        let _participants = await tempBlockchainLotteryContract.getAllParticipants();
        console.log(_participants);

        let _participantsTicket = await tempBlockchainLotteryContract.addressAndTickets(await tempSigner.getAddress());
        let alltickets = await tempBlockchainLotteryContract.getAllTickets();
        console.log(alltickets);
        
        // eslint-disable-next-line
        if (_participants.indexOf(await tempSigner.getAddress()) == -1) {
          setTicketNumber(-1);
        } else {
          alltickets.map((item) => {
            // eslint-disable-next-line
            if (item.toNumber() == _participantsTicket) {
              setTicketNumber(_participantsTicket.toNumber());
            } else {
              setTicketNumber(-1);
            }
            return null;
          });
        }
      }
    } else {
      setNetworkErr("Please install Metamask");
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      connectWallet();
    });

    window.ethereum.on("networkChanged", function (accounts) {
      connectWallet();
    });
  };
  useEffect(() => {
    connectWallet();
    console.log("connect executed");
    // console.log(ticketNumber);
    // eslint-disable-next-line
  }, []);

  const approve = async () => {
    usdtContract.approve(BlockchainLotteryAddress, amount);
  };
  const depositeUSDT = async () => {
    blockchainLotteryContract.depositeUSDT(amount);
  };
  const getLottery = async () => {
    console.log(await blockchainLotteryContract.getLottery());
  };

  return (
    <div className="App">
      <Navbar
        connectWallet={connectWallet}
        accounts={accounts}
        usdtBalance={usdtBalance}
        symbol={symbol}
      />
      <Main
        approve={approve}
        depositeUSDT={depositeUSDT}
        pricePool={pricePool}
        ticketNumber={ticketNumber}
        lastWinner={lastWinner}
        getLottery={getLottery}
        symbol={symbol}
        isOn={isOn}
      />
      {networkErr ? (
        <h1 style={{ textAlign: "center", color: "red" }}>{networkErr}</h1>
      ) : null}
      {/* <h1>Admin</h1>
      <button onClick={setUsdtAddress}>Update USDT Address</button>
      <button onClick={setFeeAccount}>set fee account</button>
      <button onClick={getTime}>Get Time</button>
      <button onClick={mint}>Mint Tokens</button>
      <button onClick={getAllParticipants}>Get all participants</button>
      <button onClick={setTimeDuration}>Set Time Duration</button>
      <h1>User</h1>
      <button onClick={connectWallet}>Connect Metamask</button>
      <button onClick={approve}>Approve Tokens</button>
      <button onClick={depositeUSDT}>Add money to lottery</button>
      <button onClick={getLottery}>Get Lottery</button> 
      
      #Lottery Contract Address (Mumbai Matic) 
      0xBDf8E38F99E60a839db7bf8CB779ECE832605bf2
        
      # Test Tether (Mumbai Matic)
      0xc1ef3d10d02F27Fe16052Aa463DB2C27a7604660
        
      
      */}
    </div>
  );
}

export default App;
