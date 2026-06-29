import { ArrowLeftOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Input, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Title, Text, Paragraph } = Typography

const LoginPage = () => {
    const { login } = useAuth()!
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Compila tutti i campi')
            return
        }

        setLoading(true)
        setError(null)

        const result = await login(email, password)

        if (result) {
            navigate('/home')
        } else {
            setError('Login fallita. Riprova.')
        }

        setLoading(false)
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(ellipse at top, rgba(102,126,234,0.1) 0%, transparent 70%)',
                padding: '24px',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 20,
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 20px 60px rgba(102,126,234,0.15)',
                    padding: '8px',
                }}
            >

                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/')}
                        style={{ color: 'var(--text-muted)', padding: 0, fontWeight: 500 }}
                    >
                        Torna alla home
                    </Button>
                </div>
                {/* Icona */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: 24, color: '#fff',
                    }}>
                        <UserOutlined />
                    </div>
                    <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Accedi
                    </Title>
                    <Paragraph style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 0 }}>
                        Bentornato!
                    </Paragraph>
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <Text style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                            Email
                        </Text>
                        <Input
                            prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />}
                            placeholder="la-tua@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="large"
                            style={{ borderRadius: 10 }}
                        />
                    </div>

                    <div>
                        <Text style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                            Password
                        </Text>
                        <Input.Password
                            autoComplete="new-password"
                            prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                            placeholder="Minimo 8 caratteri"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="large"
                            style={{ borderRadius: 10 }}
                            onPressEnter={handleSubmit}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(255,77,79,0.08)',
                            border: '1px solid rgba(255,77,79,0.2)',
                            borderRadius: 8, padding: '10px 14px',
                            color: '#ff4d4f', fontSize: 13,
                        }}>
                            {error}
                        </div>
                    )}

                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleSubmit}
                        style={{
                            width: '100%', height: 48,
                            borderRadius: 10, fontWeight: 700,
                            fontSize: 15, marginTop: 8,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                        }}
                    >
                        Accedi
                    </Button>
                </div>

                {/* Link register */}
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Text style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                        Ancora non hai un account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            Registrati
                        </Link>
                    </Text>
                </div>
            </Card>
        </div>
    )
}

export default LoginPage