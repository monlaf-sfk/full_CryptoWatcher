import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LineChartOutlined, PieChartOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const AppLayout = () => {
    const location = useLocation();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <div style={{
                    height: '32px',
                    margin: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}>
                    CryptoWatcher
                </div>

                <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline">
                    <Menu.Item key="/" icon={<LineChartOutlined />}>
                        <Link to="/">Markets</Link>
                    </Menu.Item>
                    <Menu.Item key="/portfolio" icon={<PieChartOutlined />}>
                        <Link to="/portfolio">Portfolio</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Content style={{ margin: '16px' }}>
                    <div className="bg-white p-6 shadow rounded" style={{ minHeight: 'calc(100vh - 100px)' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;