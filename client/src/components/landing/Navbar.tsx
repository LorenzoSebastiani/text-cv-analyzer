import { Button } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import { Link, useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Funzionalità', id: 'features' },
  { label: 'Prezzi', id: 'cta' },
]

const Navbar = () => {
  const navigate = useNavigate()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
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
      </Link>

      <div style={{ display: 'flex', gap: '32px' }}>
        {navLinks.map((item) => (
          <span
            key={item.label}
            onClick={() => scrollTo(item.id)}
            style={{ color: '#555', fontSize: '15px', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#667eea')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
          >
            {item.label}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button type="text" onClick={() => navigate('/login')} style={{ fontWeight: 500, color: '#555' }}>
          Accedi
        </Button>
        <Button
          type="primary"
          onClick={() => navigate('/register')}
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', fontWeight: 600, borderRadius: '8px', padding: '0 20px' }}
        >
          Inizia gratis
        </Button>
      </div>
    </Header>
  )
}

export default Navbar