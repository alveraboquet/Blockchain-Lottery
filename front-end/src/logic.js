const connectWallet = async () => {
    if (window.ethereum) {
      let chainId = await window.ethereum.request({ method: "net_version" });
      console.log(chainId);
      //matic mainnet chain id = 137
      //matic testnet chain id = 80001
      //eslint-disable-next-line
      if (chainId != 137) {
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
          console.log("setting -1 due to no participants")
          setTicketNumber(-1);
        } else {
          for(var i=0;i<alltickets.length;i++){
            // eslint-disable-next-line
            if (alltickets[i].toNumber() == _participantsTicket) {
              console.log("setting number")
              setTicketNumber(_participantsTicket.toNumber());
              break
            } else {
              console.log("setting -1 ")
              setTicketNumber(-1);
            }
          }
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