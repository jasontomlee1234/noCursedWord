import { useState, useEffect } from "react";
import "./index.css"
import { Layout, Modal, Button, Popover } from 'antd'
import { Link } from "react-router-dom";
import { formatEther, parseEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useHistory } from "react-router-dom";

import address from "../../address.json"
import lootboxAbi from "../../abis/lootbox.json"
import cursedEggAbi from "../../abis/cursedEgg.json"

const { Header, Content, Footer } = Layout;

const injected = new InjectedConnector({ supportedChainIds: [4002, 250] })


function getContract(address, abi, library) {
    return new Contract(address, abi, library)
}

async function getBalance(contract, address) {
    try {
        const balance = await contract.balanceOf(address)
        return parseInt(balance.toString())
    } catch (e) {
        console.log(e)
        alert(e)
    }
}

async function getBoxIds(contract, address) {
    const balance = await getBalance(contract, address)
    console.log(balance)
    const promiseList = []
    for (let i = 0; i < balance; i++) {
        promiseList.push(contract.tokenOfOwnerByIndex(address, i))
    }

    const rst = await Promise.all(promiseList)
    return rst.map(element => element.toString())
}

async function approve(contract, tokenId){
    try{
        const tx = await contract.approve(address.cursedEgg, tokenId)
        await tx.wait()
        return true
    }catch(e){
        console.log(e)
        alert(e.message)
        return false
    }
}

async function mintEgg(contract, tokenId) {
    const tx = await contract.mintEgg(tokenId)
    await tx.wait()
}

export default function OpenBox() {

    const { connector, library, activate, deactivate, active, error, account, chainId } = useWeb3React()
    let history = useHistory();

    const [open, setOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [lootboxContract, setLootboxContract] = useState()
    const [cursedEggContract, setCursedEggContract] = useState()
    const [boxIds, setBoxIds] = useState([])
    const [chosenBox, setChosenBox] = useState()
    const [approved, setApproved] = useState(false)
    const [approving, setApproving] = useState(false)
    const [refreshTime, setRefreshTime] = useState(0)

    useState(async () => {
        const _lootboxContract = getContract(address.lootBox, lootboxAbi, library ? library.getSigner(account).connectUnchecked() : library)
        setLootboxContract(_lootboxContract)
        const _cursedEggContract = getContract(address.cursedEgg, cursedEggAbi, library ? library.getSigner(account).connectUnchecked() : library)
        setCursedEggContract(_cursedEggContract)

        if (account) {
            const ids = await getBoxIds(_lootboxContract, account)
            setBoxIds(ids)
            console.log(ids)
        }else{
            history.push("/");
        }
        console.log("rereshed")
    }, [open])


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

    const count = 10;
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
                <div className="title">OPEN THE BOX AND TAKE THE EGG !</div>
            </Header>
            {
                account ? <Content>
                    <div className="content">
                        <div className="wrap">
                            <div className={open ? "cube quick-rotate" : "cube"}>
                                <div className="front">?</div>
                                <div className="back">?</div>
                                <div className={open ? "open-top" : "top"}>?</div>
                                <div className="bottom">?</div>
                                <div className="left">?</div>
                                <div className="right">?</div>
                            </div>
                        </div>
                        <div className="btn" onClick={
                            //loading结束之后再播放动画，这里为展示效果直接写了
                            async () => { 
                                if(chosenBox){
                                    if (approved){
                                        await mintEgg(cursedEggContract, chosenBox)
                                        setRefreshTime(Date.now())
                                        setOpen(true)
                                    }else{
                                        setApproving(true)
                                        const success = await approve(lootboxContract, chosenBox)
                                        setApproving(false)
                                        if(success){
                                            setApproved(true)
                                        }
                                    }
                                }else{
                                    alert("please choose a box to open")
                                }
                                
                            }
                        }>{approved?"Gacha!":approving?"Approving":"Approve"}</div>
                        
                        <div className={open ? "egg-icon go-up" : "egg-icon"}>
                            <img src={"/egg.png"} onClick={
                                () => { history.push("/EggBag"); }
                            }></img>
                        </div>
                        <div className="box-ids">
                            {
                                boxIds.map(element => {
                                    return <Button onClick={() => { 
                                        setChosenBox(element)
                                        setApproved(false)
                                    }}>Box Id: {element}</Button>
                                })
                            }
                            <div className="hint">chosen box: {chosenBox}</div>
                        </div>
                    </div>

                </Content> : <Content>
                    <div className="content">
                        <div className="wrap">
                            <div className="cube infinite-rotate">
                                <div className="front">?</div>
                                <div className="back">?</div>
                                <div className={open ? "open-top" : "top"}>?</div>
                                <div className="bottom">?</div>
                                <div className="left">?</div>
                                <div className="right">?</div>
                            </div>
                        </div>
                        <div className="btn" onClick={()=>{activate(injected)}}>connect</div>
                    </div>
                </Content>
            }

            <Footer style={{ textAlign: 'center' }}>Fantom × Cursed Egg</Footer>
        </Layout>
    )

}