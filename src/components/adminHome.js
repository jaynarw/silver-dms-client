import React from 'react';
import {Button, Input,Layout,Menu,Breadcrumb} from "antd";
import "antd/dist/antd.css";
import {UserOutlined, FolderFilled, FolderOutlined, InfoOutlined} from "@ant-design/icons";
import FileContainer from './FileViewer';
const {Content, Header, Sider} = Layout;
function HomePage(){
    return(
        <Layout>
            <Header className="header" >
                <h1 className="portal-name" style={{color:'red',
                                                    textDecoration:'Uppercase',
                                                    textAlign:'center',
                                                    textTransform:'uppercase'
                                                    }}>
                    Admin Portal
                </h1>

            </Header>
            <Layout>
                <Sider className="sub-pages">
                    <Menu 
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={['item1']}
                        style={{height:'100%', borderRight:0}}
                    >
                        <Menu.Item key="item1" icon={<UserOutlined/>} > Admin Home </Menu.Item>
                        <Menu.Item key="item2" icon ={<FolderFilled/>}> Accpeted Files </Menu.Item>
                        <Menu.Item key="item3" icon={<FolderOutlined/>} > Rejected Files </Menu.Item>
                        <Menu.Item key="item4" icon={<InfoOutlined/>}> About </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content
                        className='main-content'
                        style={{
                            padding:24,
                            margin:0,
                            minHeight:280,
                        }}
                    >
                        <FileContainer/>
                        
                    </Content>
                </Layout>
            </Layout>
            
        </Layout>
    );
}
export default HomePage;