import React, {useState, useEffect} from "react";
import "./index.css"
import { Layout, Popover, Button } from 'antd'
import { Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { useHistory } from "react-router-dom";
import { InjectedConnector } from '@web3-react/injected-connector'
import address from "../../address.json"
import cursedEggAbi from "../../abis/cursedEgg.json"
const { Header, Content, Footer } = Layout;


function getContract(address, abi, library) {
    return new Contract(address, abi, library)
}

const injected = new InjectedConnector({ supportedChainIds: [4002, 250] })


async function getBalance(contract, address) {
    try {
        const balance = await contract.balanceOf(address)
        return parseInt(balance.toString())
    } catch (e) {
        console.log(e)
        alert(e)
    }
}

async function getEggIds(contract, address) {
    const balance = await getBalance(contract, address)
    console.log(balance)
    const promiseList = []
    for (let i = 0; i < balance; i++) {
        promiseList.push(contract.tokenOfOwnerByIndex(address, i))
    }

    const rst = await Promise.all(promiseList)
    return rst.map(element => element.toString())
}


export default function OpenBox() {
    const {connector, library, activate, deactivate, active, error, account, chainId} = useWeb3React()
    let history = useHistory();

    const [cursedEggContract, setCursedEggContract] = useState()
    const [eggIds, setEggIds] = useState([])

    useEffect(async()=>{
        const _cursedEggContract = getContract(address.cursedEgg, cursedEggAbi, library ? library.getSigner(account).connectUnchecked() : library)
        setCursedEggContract(_cursedEggContract)

        if(account){
            const ids = await getEggIds(_cursedEggContract, account)
            console.log("egg ids:", ids)
            setEggIds(ids)
        }else{
            history.push("/");
        }
    },[account])

    const mock = [
        { url: "/logo192.png", id: "1" },
        { url: "/logo192.png", id: "2" },
        { url: "/logo192.png", id: "3" },
        { url: "/logo192.png", id: "4" },
        { url: "/logo192.png", id: "5" },
        { url: "/logo192.png", id: "6" },
        { url: "/logo192.png", id: "7" },
    ]
    // This is the real implementation, but files are not yet on the ipfs, so comment out for now
const elements = eggIds.map(id => <div class="egg-div"><img src={`https://gateway.pinata.cloud/ipfs/QmcfzKiFMHDXuDxeZ9oKU5qwHBe4Qb5kG2Z5VzzQruKp4Z/${id}.png`}></img>ID: #{id}</div>)
    // const elements = mock.map(obj => <div id={obj.id}><img src={obj.url}></img></div>);
    // const elements=[]

    if (elements.length === 0) {
        elements.push(<div className="empty-hint">You have no eggs yet.</div>)
    }
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
                <div className="title">←MINT MORE BOX TO OPEN!</div>
            </Header>
            { account ? <Content>
                <div className="content-eggs">
                    <div className="egg-title" onClick={
                        () => {/*这里跳转到市场*/ }
                    }>
                        Go to the market!
                    </div>
                    <div className="eggs">
                        {elements}
                    </div>
                </div>
            </Content> : <Content>
                    <div className="content">
                        <div className="wrap">
                            <div className="cube infinite-rotate">
                                <div className="front">?</div>
                                <div className="back">?</div>
                                <div className="top">?</div>
                                <div className="bottom">?</div>
                                <div className="left">?</div>
                                <div className="right">?</div>
                            </div>
                        </div>
                        <div className="btn" onClick={()=>{activate(injected)}}>connect</div>
                    </div>
                </Content>}
            <Footer style={{ textAlign: 'center' }}>Fantom × Cursed Egg</Footer>
        </Layout>
    )

}