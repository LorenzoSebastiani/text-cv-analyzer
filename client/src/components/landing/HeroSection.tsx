import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FileTextOutlined, RocketOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <div id='hero'
      style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        background: 'radial-gradient(ellipse at top, rgba(102,126,234,0.12) 0%, transparent 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cerchi decorativi sfondo */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(102,126,234,0.06)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '5%',
        width: 250, height: 250, borderRadius: '50%',
        background: 'rgba(118,75,162,0.06)',
        filter: 'blur(40px)', pointerEvents: 'none'
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(102,126,234,0.1)',
        border: '1px solid rgba(102,126,234,0.2)',
        borderRadius: 999, padding: '6px 16px',
        marginBottom: 32, fontSize: 13, fontWeight: 600,
        color: 'var(--primary)',
      }}>
        <RocketOutlined /> Powered by AI
      </div>

      {/* Titolo */}
      <Title
        style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: 24,
          maxWidth: 800,
        }}
      >
        Il tuo CV,{' '}
        <span style={{
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          migliorato dall'AI
        </span>
      </Title>

      {/* Sottotitolo */}
      <Paragraph
        style={{
          fontSize: 18,
          color: 'var(--text-secondary)',
          maxWidth: 560,
          marginBottom: 48,
          lineHeight: 1.7,
        }}
      >
        Carica il tuo CV o incolla un testo e ricevi in pochi secondi
        feedback dettagliato, correzioni e suggerimenti professionali.
      </Paragraph>

      {/* Bottoni */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          type="primary"
          size="large"
          icon={<RocketOutlined />}
          onClick={() => navigate('/register')}
          style={{
            height: 52, padding: '0 32px',
            fontSize: 16, fontWeight: 700,
            borderRadius: 12,
          }}
        >
          Inizia gratis
        </Button>
        <Button
          size="large"
          icon={<FileTextOutlined />}
          onClick={() => navigate('/login')}
          style={{
            height: 52, padding: '0 32px',
            fontSize: 16, fontWeight: 600,
            borderRadius: 12,
            border: '1.5px solid rgba(102,126,234,0.3)',
            color: 'var(--primary)',
          }}
        >
          Accedi
        </Button>
      </div>

      {/* Social proof */}
      <div style={{
        marginTop: 64, display: 'flex', alignItems: 'center',
        gap: 16, color: 'var(--text-muted)', fontSize: 13,
      }}>
        <div style={{ display: 'flex' }}>
          {['#667eea', '#764ba2', '#f093fb', '#4facfe'].map((color, i) => (
            <div key={i} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: color, border: '2px solid white',
              marginLeft: i === 0 ? 0 : -10,
            }} />
          ))}
        </div>
        <span>Già usato da <strong style={{ color: 'var(--text-primary)' }}>+500 professionisti</strong></span>
      </div>
    </div>
  )
}

export default HeroSection