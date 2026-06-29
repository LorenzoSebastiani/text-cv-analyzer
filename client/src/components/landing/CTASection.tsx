import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RocketOutlined, ArrowRightOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const CTASection = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '80px 48px' }} id='cta'>
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          borderRadius: 24,
          padding: '80px 48px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cerchi decorativi */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -40,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        {/* Icona */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          fontSize: 32,
        }}>
          <RocketOutlined style={{ color: '#fff' }} />
        </div>

        {/* Testo */}
        <Title
          level={2}
          style={{
            color: '#fff',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            marginBottom: 16,
          }}
        >
          Pronto a migliorare il tuo CV?
        </Title>

        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 18,
            maxWidth: 480,
            margin: '0 auto 48px',
            lineHeight: 1.7,
          }}
        >
          Inizia gratis oggi. Nessuna carta di credito richiesta.
          Analizza il tuo primo documento in meno di 30 secondi.
        </Paragraph>

        {/* Bottoni */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            size="large"
            onClick={() => navigate('/register')}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            style={{
              height: 52, padding: '0 36px',
              fontSize: 16, fontWeight: 700,
              borderRadius: 12,
              background: '#fff',
              color: '#667eea',
              border: 'none',
            }}
          >
            Crea account gratuito
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/login')}
            style={{
              height: 52, padding: '0 32px',
              fontSize: 16, fontWeight: 600,
              borderRadius: 12,
              background: 'transparent',
              color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.4)',
            }}
          >
            Ho già un account
          </Button>
        </div>

        {/* Note */}
        <div style={{
          marginTop: 32,
          display: 'flex', gap: 24, justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {['✓ Gratuito', '✓ Nessuna carta', '✓ Risultati immediati'].map((item) => (
            <span key={item} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CTASection