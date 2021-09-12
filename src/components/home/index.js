import React, { useEffect, useState } from "react";
import "./index.css"
import { Layout, Popover, Button } from 'antd'
import { Link } from "react-router-dom";
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'

import { useInterval } from './useInterval'


import address from "../../address.json"
import lootboxAbi from "../../abis/lootbox.json"


const { Header, Content, Footer } = Layout;

const injected = new InjectedConnector({ supportedChainIds: [4002, 250] })

function getContract(address, abi, library) {
    return new Contract(address, abi, library)
}

async function getTotalSupply(contract) {
    const totalSupply = await contract.totalSupply()
    return parseInt(totalSupply.toString())
}

async function mintLootBox(contract, quantity) {
    try {
        console.log(quantity * 280 + "000000000000000000")
        const tx = await contract.mintLootBox(quantity, {
            value: quantity * 280 + "000000000000000000"
        })
        await tx.wait()
        alert("minted!")
    } catch (e) {
        console.log(e)
        alert(e.data.message)
    }
}


export default function Home() {
    const { connector, library, activate, deactivate, active, error, account, chainId } = useWeb3React()

    const [lootboxContract, setLootboxContract] = useState()
    const [quantity, setQuantity] = useState(1)
    const [totalSupply, setTotalSupply] = useState(0)

    const popoverContent = account ? (
        <div className="pop-container">
            <div className="token">Hi, {account}</div>
            <Button onClick={deactivate}>disconnect</Button>
        </div>

    ) : (
        <div className="pop-container">
            <div className="token">Let's Connect</div>
            <Button onClick={() => { activate(injected) }} type="primary">connect</Button>
        </div>
    )
    useEffect(async () => {
        const _lootboxContract = getContract(address.lootBox, lootboxAbi, library ? library.getSigner(account).connectUnchecked() : library)
        setLootboxContract(_lootboxContract)
        if (account) {
            const supply = await getTotalSupply(_lootboxContract)
            setTotalSupply(supply)
            console.log("total supply: ", supply)
        }
    }, [account])

    useInterval(async () => {
        if (account && lootboxContract) {
            const supply = await getTotalSupply(lootboxContract)
            setTotalSupply(supply)
            console.log("total supply: ", supply)
        }
    }, 1000)

    return (
        <Layout className="layout">
            <Header>
                <div className="logo">
                    <Link to="/"><img src={"/logo.png"}></img></Link>
                </div>
                <div className="btn-list">
                    <div className="open">
                        <Link to="/OpenBox"><img src={"/box.png"}></img></Link>
                    </div>
                    <div className="egg">
                        <Link to="/EggBag"><img src={"/egg.png"}></img></Link>
                    </div>
                    <div className="account">
                        <Popover content={popoverContent} trigger="click" placement="bottomRight"><img src={"/fox.png"}></img></Popover>
                    </div>
                </div>
                <div className="title">GET A CURSED EGG IN THE BOX !</div>
            </Header>
            <Content>
                <div className="site-layout-content">
                    <div className="circle-big">
                        <div className="circle-small">
                            <div className="box">
                                {account ? 
                                    <div className="mint-box">
                                    {/* <input type="number"></input> */}
                                    <div className="amount-left">{300 - totalSupply}/300 left</div>
                                    <input type="number" placeholder="Quantity" onChange={(event) => {
                                        setQuantity(parseInt(event.target.value))
                                    }}></input>
                                    
                                    

                                    <div className="mint" onClick={
                                        async () => {
                                            await mintLootBox(lootboxContract, quantity)
                                        }
                                    }>mint</div>

                                    <div className="amount-left">280 FTM</div>

                                    </div> : <div onClick={
                                        async () => {
                                            if (!account) {
                                                activate(injected)
                                            }
                                        }
                                    }>connect</div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Fantom × Cursed Egg</Footer>
        </Layout>
    )

}