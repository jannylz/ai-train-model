import { Layout, Menu } from 'antd';
import { UserOutlined, DesktopOutlined, PieChartOutlined} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { NavLink,useLocation } from 'react-router-dom';
import './App.css';
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

const SiderDemo = (props) => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [curNavContent] = useState(props.content);
  const [activeMenu,setActiveMenu] = useState(['/myproject']);

  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  };
  
  useEffect(() => {
   pathname === '/'?setActiveMenu(['/myproject']):setActiveMenu([pathname])
  }, [pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Header className="header">
          <div className="logo" >无码化训练工具</div>
        </Header>
        <Menu theme="dark" selectedKeys={activeMenu} mode="inline">
          <Menu.Item key="/myproject" icon={<PieChartOutlined />}>
              我的项目
              <NavLink to="/myproject"  exact>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/mytask" icon={<DesktopOutlined />} disabled={true}>
             我的任务
            <NavLink to="/mytask"   exact></NavLink>
          </Menu.Item>
          <Menu.Item key="/configTrain" icon={<DesktopOutlined />} disabled={true}>
             训练参数配置
            <NavLink to="/configTrain"   exact></NavLink>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="模型管理">
            <Menu.Item key="3">已发布模型</Menu.Item>
            <Menu.Item key="4">预训练模型</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>
            {curNavContent}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>AI LAB 无码化训练工具</Footer>
      </Layout>
    </Layout>
  );
}
export default SiderDemo;
