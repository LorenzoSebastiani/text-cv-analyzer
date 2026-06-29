import { Layout, Menu, Button, Typography } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { BookOutlined, HomeOutlined, UploadOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Text, Title } = Typography

const AppLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout, user } = useAuth()!

    const menuItems = [
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate('/home')
        },
        {
            key: '/upload',
            icon: <UploadOutlined />,
            label: 'Nuova analisi',
            onClick: () => navigate('/upload')
        },
        {
            key: '/documents',
            icon: <BookOutlined />,
            label: 'Le mie revisioni',
            onClick: () => navigate('/documents')
        }
    ]

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={260}
                style={{
                    background: '#fff',
                    borderRight: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    left: 0,
                    top: 0,
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                }} onClick={() => navigate('/home')}>
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        ✦ CV Analyzer
                    </Title>
                </div>

                {/* Menu */}
                <div style={{ flex: 1, padding: '16px 12px' }}>
                    <Menu
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        style={{ border: 'none', background: 'transparent' }}
                    />
                </div>

                {/* User + logout in fondo */}
                <div style={{
                    padding: '16px 20px',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: 10, marginBottom: 12,
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 16, flexShrink: 0,
                        }}>
                            <UserOutlined />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', color: '#1a1a2e' }}>
                                {user?.email ?? 'Utente'}
                            </Text>
                            <Text style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                Account gratuito
                            </Text>
                        </div>
                    </div>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={() => {
                            logout()
                            navigate('/login')
                        }}
                        style={{
                            width: '100%', textAlign: 'left',
                            color: '#ff4d4f', fontWeight: 500,
                            borderRadius: 8,
                        }}
                    >
                        Esci
                    </Button>
                </div>
            </Sider>

            {/* Main */}
            <Layout style={{ marginLeft: 260 }}>
                <Header style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>
                        {menuItems.find(i => i.key === location.pathname)?.label ?? 'Dashboard'}
                    </Text>
                </Header>

                <Content style={{ padding: '32px', minHeight: 'calc(100vh - 128px)' }}>
                    <Outlet />
                </Content>

                <Footer style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                    padding: '16px 32px',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    background: 'transparent',
                }}>
                    © 2026 CV Analyzer — Tutti i diritti riservati
                </Footer>
            </Layout>
        </Layout>
    )
}

export default AppLayout