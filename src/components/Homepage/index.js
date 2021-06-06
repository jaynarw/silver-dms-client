import React from 'react';
import {
  Layout, Menu,
} from 'antd';
import 'antd/dist/antd.css';
import {
  UserOutlined, FolderFilled, FolderOutlined, InfoOutlined,
} from '@ant-design/icons';
import styles from './styles.module.css';
import FileContainer from '../FileViewer';
import Logo from '../Logo';

const { Content, Header, Sider } = Layout;
function HomePage() {
  return (
    <Layout>
      <Header className={styles.header}>
        <Logo />
      </Header>
      <Layout>
        <Sider className="sub-pages">
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['item1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="item1" icon={<UserOutlined />}> Admin Home </Menu.Item>
            <Menu.Item key="item2" icon={<FolderFilled />}> Accpeted Files </Menu.Item>
            <Menu.Item key="item3" icon={<FolderOutlined />}> Rejected Files </Menu.Item>
            <Menu.Item key="item4" icon={<InfoOutlined />}> About </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content
            className="main-content"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <FileContainer />

          </Content>
        </Layout>
      </Layout>

    </Layout>
  );
}
export default HomePage;
