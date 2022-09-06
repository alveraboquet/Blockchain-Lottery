import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import usdtabi from "./build/USDT.json";
import blockchainlottery from "./build/BlockchainLottery.json";
import Navbar from "./Navbar";
import Main from "./Main";
function App() {
  const [isTron, setIsTron] = useState(null);
  const [walletType, setWalletType] = useState(null)
  const [accounts, setAccounts] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(-1);
  const [pricePool, setPricePool] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [lastWinner, setLastWinner] = useState(null);
  const [isOn, setIsOn] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);
  const [BlockchainLotteryAddress, setBlockchainLotteryAddress] =
    useState(null);
  const [blockchainLotteryContract, setBlockchainLotteryContract] =
    useState(null);
  const [networkErr, setNetworkErr] = useState(null);
  const [amount, setAmount] = useState(null);
  const [symbol, setSymbol] = useState(null);

  // const [usdtAddress, setUsdtAddress] = useState(null)
  // const USDTAddress = "0x7FFB3d637014488b63fb9858E279385685AFc1e2"; //Polygon Mainnet Address For USDT Tokens
  // const USDTAddress = "0xc1ef3d10d02F27Fe16052Aa463DB2C27a7604660"; //Polygon Mumbai Address For USDT Tokens
  const USDTAbi = usdtabi.abi;

  // const BlockchainLotteryAddress = "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58"; //mumbai
  // const BlockchainLotteryAddress = "0xC330332351858518Ff61C7d4930780B0d260EDEe";
  // const BlockchainLotteryAddress = "0xA9cEa9cD7DB5BB46B636296B008C913047a75E34"// bnb testnet
  const BlockchainLotteryAbi = blockchainlottery.abi;
  const tronWebConnect = async () => {
    if (window.tronWeb) {
      setWalletType("TRON")
      setAccounts([window.tronWeb.defaultAddress.base58]);
      let _BlockchainLotteryAddress = "TW7ocicVeZbCLq1WA5ijrwvk2PUvU2MLsD";
      setBlockchainLotteryAddress(_BlockchainLotteryAddress);
      const tempBlockchainLotteryContract = await window.tronWeb
        .contract(blockchainlottery.abi)
        .at(_BlockchainLotteryAddress);
      console.log(tempBlockchainLotteryContract);
      setBlockchainLotteryContract(tempBlockchainLotteryContract);
      setAmount(
        (await tempBlockchainLotteryContract.amount().call()).toNumber()
      );
      setIsTron(true);
      let _tempUsdtAddress = await tempBlockchainLotteryContract
        .USDTAddress()
        .call();
      let tempUsdtAddress = window.tronWeb.address.fromHex(_tempUsdtAddress);
      const tempUSDTContract = await window.tronWeb
        .contract(usdtabi.abi)
        .at(tempUsdtAddress);
      setUsdtContract(tempUSDTContract);

      let tempdecimals = await tempUSDTContract.decimals().call();
      // let tempdecimals = 6

      let tempSymbol = await tempUSDTContract.symbol().call();
      setSymbol(tempSymbol);

      let tempPricePool = await tempUSDTContract.balanceOf(
        _BlockchainLotteryAddress
      ).call();
      console.log(tempPricePool.toNumber() / 10 ** tempdecimals);
      setPricePool(tempPricePool.toNumber() / 10 ** tempdecimals);

      let tempUSDTBalance = await tempUSDTContract.balanceOf(
        window.tronWeb.defaultAddress.base58
      ).call();
      console.log(tempUSDTBalance.toNumber() / 10 ** tempdecimals);
      setUsdtBalance(tempUSDTBalance.toNumber() / 10 ** tempdecimals);

      console.log(tempBlockchainLotteryContract);
      let _lastWinner = await tempBlockchainLotteryContract.lastWinner().call();
      setLastWinner(_lastWinner.toNumber());

      let _isOn = await tempBlockchainLotteryContract.isOn().call();
      console.log(_isOn);
      setIsOn(_isOn);
      if (_isOn) {
        setTicketNumber(-1);
      } else {
        let _participants =
          await tempBlockchainLotteryContract.getAllParticipants().call();
        console.log(_participants);

        let _participantsTicket =
          await tempBlockchainLotteryContract.addressAndTickets(
            window.tronWeb.defaultAddress.base58
          ).call();
        let alltickets = await tempBlockchainLotteryContract.getAllTickets().call();
        console.log(alltickets);

        // eslint-disable-next-line
        if (_participants.indexOf(window.tronWeb.defaultAddress.hex) == -1) {
          console.log("setting -1 due to no participants");
          setTicketNumber(-1);
        } else {
          for (var i = 0; i < alltickets.length; i++) {
            // eslint-disable-next-line
            if (alltickets[i].toNumber() == _participantsTicket) {
              console.log("setting number");
              setTicketNumber(_participantsTicket.toNumber());
              break;
            } else {
              console.log("setting -1 ");
              setTicketNumber(-1);
            }
          }
        }
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      setWalletType("METAMASK")
      let _BlockchainLotteryAddress;
      let chainId = await window.ethereum.request({ method: "net_version" });
      console.log(chainId);
      //matic mainnet chain id = 137
      //matic testnet chain id = 80001
      //BNB Mainnet chain id = 56
      //BNB testnet chain id = 97
      //rinkeby testnet chain id = 4
      //eslint-disable-next-line
      if (chainId == 137) {
        _BlockchainLotteryAddress =
          "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58";
        setBlockchainLotteryAddress(
          "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58"
        );
        setNetworkErr(null);
        // eslint-disable-next-line
      } else if (chainId == 56) {
        _BlockchainLotteryAddress =
          "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58";
        setBlockchainLotteryAddress(
          "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58"
        );
        setNetworkErr(null);
      } else {
        setNetworkErr("Change network to Polygon or BNB");
      }

      let _accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(_accounts);

      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const tempBlockchainLotteryContract = new ethers.Contract(
        _BlockchainLotteryAddress,
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
        _BlockchainLotteryAddress
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
        let _participants =
          await tempBlockchainLotteryContract.getAllParticipants();
        console.log(_participants);

        let _participantsTicket =
          await tempBlockchainLotteryContract.addressAndTickets(
            await tempSigner.getAddress()
          );
        let alltickets = await tempBlockchainLotteryContract.getAllTickets();
        console.log(alltickets);

        // eslint-disable-next-line
        if (_participants.indexOf(await tempSigner.getAddress()) == -1) {
          console.log("setting -1 due to no participants");
          setTicketNumber(-1);
        } else {
          for (var i = 0; i < alltickets.length; i++) {
            // eslint-disable-next-line
            if (alltickets[i].toNumber() == _participantsTicket) {
              console.log("setting number");
              setTicketNumber(_participantsTicket.toNumber());
              break;
            } else {
              console.log("setting -1 ");
              setTicketNumber(-1);
            }
          }
        }
      }
      console.log(window.location)
    } else {
      let details = navigator.userAgent
      let regexp = /android|iphone|kindle|ipad/i;
      let isMobileDevice = regexp.test(details);
      if (isMobileDevice) {
        // window.location.href = "metamask://dapp/opensea.io";
        // window.location.href = "https://metamask.app.link/dapp/opensea.io";
        window.location.href = "dapp://diablo.bet";
        // window.location.href = "dapp://"+window.location.host;


         
      } else {
        setNetworkErr("Please install Metamask");
      }
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      console.log(accounts);
      connectWallet();
    });

    window.ethereum.on("chainChanged", function (accounts) {
      console.log(accounts);
      connectWallet();
    });
  };

  const walletConnect = async () => {
    const WalletConnectProvider = window.WalletConnectProvider;
    console.log(WalletConnectProvider);
    var provider = new WalletConnectProvider.default({
      rpc: {
        1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
        137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
        80001: "https://matic-mumbai.chainstacklabs.com/",
        // 80001: "https://polygon-mumbai.g.alchemy.com/v2/bjMe0YCNyiyfqspS91W1JtoPNzoLh19a"
        // ...
        56:"https://bsc-dataseed.binance.org/"
      },
      // bridge: 'https://bridge.walletconnect.org',
    });
    setWalletType("WALLETCONNECT")
    console.log(provider.connected);
    await provider.enable();
    const tempProvider = new ethers.providers.Web3Provider(provider);
    const { chainId } = tempProvider.getNetwork();
    console.log("chain id from Wallet Connect" + chainId);
    let _BlockchainLotteryAddress;
    // eslint-disable-next-line
    if (chainId == 137) {
      // Polygon
      _BlockchainLotteryAddress = "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58";
      setBlockchainLotteryAddress("0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58");
      setNetworkErr(null);
      // eslint-disable-next-line
    } else if (chainId == 56) {
      // BNB
      _BlockchainLotteryAddress = "0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58";
      setBlockchainLotteryAddress("0x903F507A8b2887492aBA0fcEcc654b9981e4Cb58");
      setNetworkErr(null);
      // eslint-disable-next-line
    } else if (chainId == 43113) {
      // avalanche
      _BlockchainLotteryAddress = "0xA9cEa9cD7DB5BB46B636296B008C913047a75E34";
      setBlockchainLotteryAddress("0xA9cEa9cD7DB5BB46B636296B008C913047a75E34");
      setNetworkErr(null);
    } else {
      setNetworkErr("Change network to Polygon or BNB");
    }

    const tempSigner = tempProvider.getSigner();
    const tempBlockchainLotteryContract = new ethers.Contract(
      _BlockchainLotteryAddress,
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
    setAccounts([await tempSigner.getAddress()]);
    let tempdecimals = await tempUSDTContract.decimals();
    // let tempdecimals = 6

    let tempSymbol = await tempUSDTContract.symbol();
    setSymbol(tempSymbol);

    let tempPricePool = await tempUSDTContract.balanceOf(
      _BlockchainLotteryAddress
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
      let _participants =
        await tempBlockchainLotteryContract.getAllParticipants();
      console.log(_participants);

      let _participantsTicket =
        await tempBlockchainLotteryContract.addressAndTickets(
          await tempSigner.getAddress()
        );
      let alltickets = await tempBlockchainLotteryContract.getAllTickets();
      console.log(alltickets);

      // eslint-disable-next-line
      if (_participants.indexOf(await tempSigner.getAddress()) == -1) {
        console.log("setting -1 due to no participants");
        setTicketNumber(-1);
      } else {
        for (var i = 0; i < alltickets.length; i++) {
          // eslint-disable-next-line
          if (alltickets[i].toNumber() == _participantsTicket) {
            console.log("setting number");
            setTicketNumber(_participantsTicket.toNumber());
            break;
          } else {
            console.log("setting -1 ");
            setTicketNumber(-1);
          }
        }
      }
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      walletConnect();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      walletConnect();
    });
  };

  useEffect(() => {
    // connectWallet();
    // if(!window.WalletConnectProvider.connected){
    //   walletConnect()
    // }else{
    //   connectWallet()
    // }
    console.log(window.WalletConnectProvider.connected);
    console.log("connect executed");
    // console.log(ticketNumber);
    // eslint-disable-next-line
  }, []);

  const approve = async () => {
    console.log(BlockchainLotteryAddress);
    if (isTron) {
      usdtContract.approve(BlockchainLotteryAddress, amount).send();
    } else {
      const tx = await usdtContract.approve(BlockchainLotteryAddress, amount);
      await tx.wait()
      
      alert("TOKENS APPROVED")
    }
  };
  const depositeUSDT = async () => {
    if (isTron) {
      blockchainLotteryContract.depositeUSDT(amount).send();
    } else {
      // eslint-disable-next-line
      const tx = await blockchainLotteryContract.depositeUSDT(amount);
      await tx.wait()
      if(walletType==="METAMASK"){
        connectWallet()
      }else if(walletType==="WALLETCONNECT"){
        walletConnect()
      }
      alert("TOKENS DEPOSITED")
    }
  };
  const getLottery = async () => {
    console.log(await blockchainLotteryContract.getLottery());
  };

  return (
    <div className="App">
      <Navbar
        connectWallet={connectWallet}
        walletConnect={walletConnect}
        tronWebConnect={tronWebConnect}
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
