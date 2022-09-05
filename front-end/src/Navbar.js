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
            {props.accounts?<p className='navAccountNumber'>{props.accounts[0]}</p>:
            <div className='buttonContainers'>
              <button onClick={props.connectWallet} className="connectBtn">Metamask</button>
              <button onClick={props.walletConnect} className="connectBtn">Wallet Connect</button>
              <button onClick={props.tronWebConnect} className="connectBtn">Tron Link</button>
            </div>}
            </div>
            <div className="usdtBalance">{props.usdtBalance} {props.symbol}</div>
        </nav>
    </div>
  )
}

export default Navbar