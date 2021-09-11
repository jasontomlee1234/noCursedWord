import React from "react";
import "./index.css"
import {Layout} from 'antd'
import { Link } from "react-router-dom";
const { Header, Content, Footer } = Layout;
export default class OpenBox extends React.Component {
    
    render() {
        const mock = [
            {url: "/logo192.png", id: "1"},
            {url: "/logo192.png", id: "2"},
            {url: "/logo192.png", id: "3"},
            {url: "/logo192.png", id: "4"},
            {url: "/logo192.png", id: "5"},
            {url: "/logo192.png", id: "6"},
            {url: "/logo192.png", id: "7"},
        ]
        const elements = mock.map(obj => <div id={obj.id}><img src={obj.url}></img></div>);
        // const elements=[]
        if (elements.length === 0) {
            elements.push(<div className="empty-hint">You have no eggs yet.</div>)
        }
        return(
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
                            ()=>{/*这里跳转到市场*/}
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
}