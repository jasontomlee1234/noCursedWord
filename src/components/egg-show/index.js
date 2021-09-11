import React, {useState, useEffect} from "react";
import "./index.css"
import { Layout, Popover, Button } from 'antd'
import { Link } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { useHistory } from "react-router-dom";

import address from "../../address.json"
import cursedEggAbi from "../../abis/cursedEgg.json"
const { Header, Content, Footer } = Layout;


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
    const {library, account} = useWeb3React()
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
    // const elements = eggIds.map(id => <div id={id}><img src={`some-url/${id}.jpg`}></img></div>)
    const elements = mock.map(obj => <div id={obj.id}><img src={obj.url}></img></div>);
    // const elements=[]

    if (elements.length === 0) {
        elements.push(<div className="empty-hint">You have no eggs yet.</div>)
    }
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
                <div className="title">GET MORE EGGS IN THE BOX OR MARKET!</div>
            </Header>
            <Content>
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
            </Content>
            <Footer style={{ textAlign: 'center' }}>Fantom × Cursed Egg</Footer>
        </Layout>
    )

}