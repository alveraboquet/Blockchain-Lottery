import React from 'react'
import logo from './static/logo.png'
import './Navbar.css'
function Navbar(props) {
  
  return (
    <div className='navbarContainer'>
        <nav className='navbar'>
            <div className='navLogoContainer'>
                <img src={logo} alt="NO IMG FOUND" style={{ height:"100px", width:"100px" }}></img>
            </div>
            <div className='connectBtnContainer'>
            {props.accounts?<p className='navAccountNumber'>{props.accounts[0]}</p>:<button onClick={props.connectWallet} className="connectBtn">Connect Wallet</button>}
            </div>
            <div className="usdtBalance">{props.usdtBalance} {props.symbol}</div>
        </nav>
    </div>
  )
}

export default Navbar