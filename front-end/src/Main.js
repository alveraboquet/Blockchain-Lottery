import React,{useState} from "react";
import "./Main.css";
function Main(props) {
    const [time, setTime] = useState(null)
    const updateTime = ()=>{
        setTime(new Date().toLocaleTimeString())
    }
    setInterval(updateTime,1000)
    return (
        <div className="mainContainer">
            <div className="div1">
                {props.isOn===false?<h1 style={{ color:"red" }}>Deposite Period is over</h1>:null}
                <h1>{time}</h1>
                <h1>Current Price Pool {props.pricePool} {props.symbol}</h1>
                <h2>Lottery at every Night 12:00</h2>
                <div className="lotteryButtons">
                    <button className="buyTicketButton" onClick={props.approve}>
                        Approve Tokens
                    </button>
                     <p>and</p>
                    <button className="buyTicketButton" onClick={props.depositeUSDT}>
                        Buy Ticket Now
                    </button>
                </div>
                {props.ticketNumber === -1 ? null : (
                    <h3>Your Ticket Number is {props.ticketNumber}</h3>
                )}
                <h4>Last Winner: {props.lastWinner}</h4>
            </div>
            <div className="div2">
                <div className="headingContainer">
                    <h1 className="heading">Blockchain Lottery</h1>
                </div>
                <div className="TnCContainer">
                    <p className="TnC">
                        Blockchain Lottery is based on a smart contract deployed on Polygon
                        mainnet. You can use your Tether Tokens to participate in Lottery,<br/>
                        Buy a Lottery ticket with a 10 USDT and Wait for the lottery to
                        open, you'll get your lottery ticket 5 minutes before the lottery time <br/> and if you are the lucky one the price Pool will be air droped
                        at your address. as a Commission we take 0.5 USDT from your
                        Deposite.
                        <br />
                        An inbuilt smart contract function determines the Lottery Winner.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Main;
