import { Card, Typography } from 'antd'
import {
  FileSearchOutlined,
  BulbOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  BarChartOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const features = [
  {
    icon: <FileSearchOutlined style={{ fontSize: 28 }} />,
    title: 'Analisi AI del testo',
    description: 'Il nostro modello AI analizza il tuo CV in profondità, individuando punti di forza e aree di miglioramento.',
    color: '#667eea',
    bg: 'rgba(102,126,234,0.08)',
  },
  {
    icon: <BulbOutlined style={{ fontSize: 28 }} />,
    title: 'Suggerimenti mirati',
    description: 'Ricevi suggerimenti specifici su grammatica, stile, struttura e contenuto per ogni sezione del documento.',
    color: '#f093fb',
    bg: 'rgba(240,147,251,0.08)',
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: 28 }} />,
    title: 'Risultati in secondi',
    description: 'Niente attese. Il feedback è immediato e disponibile direttamente nel browser.',
    color: '#4facfe',
    bg: 'rgba(79,172,254,0.08)',
  },
  {
    icon: <HistoryOutlined style={{ fontSize: 28 }} />,
    title: 'Storico revisioni',
    description: 'Tutte le tue revisioni vengono salvate. Puoi confrontare le versioni e monitorare i progressi nel tempo.',
    color: '#43e97b',
    bg: 'rgba(67,233,123,0.08)',
  },
  {
    icon: <BarChartOutlined style={{ fontSize: 28 }} />,
    title: 'Punteggio qualità',
    description: 'Ogni revisione include un punteggio da 1 a 10 che ti dà una misura immediata della qualità del testo.',
    color: '#fa8231',
    bg: 'rgba(250,130,49,0.08)',
  },
  {
    icon: <SafetyOutlined style={{ fontSize: 28 }} />,
    title: 'Dati al sicuro',
    description: 'I tuoi documenti sono protetti e accessibili solo da te. Nessuna condivisione con terze parti.',
    color: '#764ba2',
    bg: 'rgba(118,75,162,0.08)',
  },
]

const FeaturesSection = () => {
  return (
    <div id='features'
      style={{
        padding: '100px 48px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      {/* Header sezione */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--primary)',
          }}
        >
          Funzionalità
        </Text>
        <Title
          level={2}
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            marginTop: 12,
            marginBottom: 16,
          }}
        >
          Tutto quello che ti serve
        </Title>
        <Paragraph
          style={{
            fontSize: 17,
            color: 'var(--text-secondary)',
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          Uno strumento completo per migliorare i tuoi testi professionali
          con il supporto dell'intelligenza artificiale.
        </Paragraph>
      </div>

      {/* Grid features */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 8,
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow)'
            }}
          >
            {/* Icona */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: feature.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: feature.color,
                marginBottom: 20,
              }}
            >
              {feature.icon}
            </div>

            <Title level={5} style={{ marginBottom: 8, fontWeight: 700 }}>
              {feature.title}
            </Title>
            <Paragraph style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
              {feature.description}
            </Paragraph>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FeaturesSection