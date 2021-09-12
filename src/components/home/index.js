import React, { useEffect, useState } from "react";
import "./index.css"
import { Layout, Popover, Button } from 'antd'
import { Link } from "react-router-dom";
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'

import address from "../../address.json"
import lootboxAbi from "../../abis/lootbox.json"


const { Header, Content, Footer } = Layout;

const injected = new InjectedConnector({ supportedChainIds: [4002, 250] })

function getContract(address, abi, library){
    return new Contract(address, abi, library)
}

async function mintLootBox(contract, quantity){
    try{
        const tx = await contract.mintLootBox(quantity)
        await tx.wait()
    }catch(e){
        console.log(e)
        alert(e)
    }
}


export default function Home() {
    const { connector, library, activate, deactivate, active, error, account, chainId } = useWeb3React()

    const [lootboxContract, setLootboxContract] = useState()
    const [quantity, setQuantity] = useState('1')
    const popoverContent = account ? (
        <div className="pop-container">
            <div className="token">Hi, {account}</div>
            <Button onClick={deactivate}>disconnect</Button>
        </div>
        
    ):(
        <div className="pop-container">
            <div className="token">Let's Connect</div>
            <Button onClick={() => { activate(injected)}} type="primary">connect</Button>
        </div>
    )
    useEffect(async()=>{
        const _lootboxContract = getContract(address.lootBox, lootboxAbi, library ? library.getSigner(account).connectUnchecked() : library)
        setLootboxContract(_lootboxContract)
    },[account])
    return (
        <Layout className="layout">
            <Header>
                <div className="logo">
                    <Link to="/"><img src={"/logo192.png"}></img></Link>
                </div>
                <div className="btn-list">
                    <div className="open">
                        <Link to="/OpenBox"><img src={"/logo192.png"}></img></Link>
                    </div>
                    <div className="egg">
                        <Link to="/EggBag"><img src={"/logo192.png"}></img></Link>
                    </div>
                    <div className="account">
                        <Popover content={popoverContent} trigger="click" placement="bottomRight"><img src={"/logo192.png"}></img></Popover>
                    </div>
                </div>
                <div className="title">GET A CURSED EGG IN THE BOX !</div>
            </Header>
            <Content>
                <div className="site-layout-content">
                    <div className="circle-big">
                        <img src={"/logo192.png"}></img>
                        <div className="circle-small">
                            <img src={"/logo192.png"}></img>
                            <div className="box">
                                <div className="btn-box" onClick={
                                    async () => {
                                        if (!account) {
                                            activate(injected)
                                        } else {
                                            await mintLootBox(lootboxContract, quantity)
                                            alert("minted!")
                                        }
                                    }
                                }>{account ? "mint" : "connect"}</div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Fantom × Cursed Egg</Footer>
        </Layout>
    )

}