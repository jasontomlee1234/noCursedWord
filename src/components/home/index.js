import React, { useEffect, useState } from "react";
import "./index.css"
import { Layout } from 'antd'
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

function mintLootBox(contract, quantity){
    try{
        contract.mintLootBox(quantity)
    }catch(e){
        console.log(e)
        alert(e)
    }
}


export default function Home() {
    const { connector, library, activate, deactivate, active, error, account, chainId } = useWeb3React()

    const [lootboxContract, setLootboxContract] = useState()
    const [quantity, setQuantity] = useState(1)

    useEffect(async()=>{
        const _lootboxContract = getContract(address.lootBox,lootboxAbi, library ? library.getSigner(account).connectUnchecked() : library)
        setLootboxContract(_lootboxContract)
    },[])
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
                        <img src={"/logo192.png"}></img>
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
                                {/* 这里放connect和mint逻辑，为测试方便暂时转跳转 */}
                                <button style={{background:"transparent", border:"none"}} onClick={() => { account ? deactivate() : activate(injected) }}>{account?account:"connect"}</button>
                                {/* <Link to="/OpenBox">Connect!</Link> */}
                                {account?<div>
                                    <button style={{background:"transparent", border:"none"}} onClick={()=>{
                                        mintLootBox(lootboxContract, quantity)
                                    }}>
                                        mint
                                    </button>
                                </div>:null}
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Fantom × Cursed Egg</Footer>
        </Layout>
    )

}