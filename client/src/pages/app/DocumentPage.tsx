import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Tag, Typography, Divider, Progress, Spin, message } from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  BulbOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { useDocument } from '../../context/DocumentContext'

const { Title, Text, Paragraph } = Typography

const typeConfig: Record<string, { color: string; label: string }> = {
  grammar: { color: 'red', label: 'Grammatica' },
  style: { color: 'blue', label: 'Stile' },
  structure: { color: 'orange', label: 'Struttura' },
  content: { color: 'purple', label: 'Contenuto' },
}

const DocumentPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentDocument, getDocumentById } = useDocument()!

  useEffect(() => {
    console.log('id:', id)
    if (id) getDocumentById(id)
  }, [id])


  console.log('currentDocument:', currentDocument)

  if (!currentDocument) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  const review = (currentDocument as any).review
  const suggestions = review?.suggestions ?? []
  const score = review?.overall_score ?? 0

  const scoreColor = score >= 7 ? '#52c41a' : score >= 5 ? '#faad14' : '#ff4d4f'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Torna indietro */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/home')}
        style={{ color: 'var(--text-muted)', padding: 0, width: 'fit-content', fontWeight: 500 }}
      >
        Torna alla home
      </Button>

      {/* Header con punteggio */}
      <Card style={{ borderRadius: 16, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
              {(currentDocument as any).filename ?? 'Testo libero'}
            </Title>
            <Text style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {new Date((currentDocument as any).created_at).toLocaleDateString('it-IT', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </Text>
            {review?.summary && (
              <Paragraph style={{ marginTop: 12, marginBottom: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {review.summary}
              </Paragraph>
            )}
          </div>

          {/* Punteggio circolare */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <Progress
              type="circle"
              percent={score * 10}
              size={100}
              strokeColor={scoreColor}
              format={() => (
                <span style={{ fontSize: 22, fontWeight: 800, color: scoreColor }}>
                  {score}
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/10</span>
                </span>
              )}
            />
            <Text style={{ display: 'block', marginTop: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              Punteggio qualità
            </Text>
          </div>
        </div>
      </Card>

      {/* Testo originale vs revisionato */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card
          title={
            <span style={{ fontWeight: 700 }}>
              <FileTextOutlined style={{ marginRight: 8, color: 'var(--text-muted)' }} />
              Testo originale
            </span>
          }
          style={{ borderRadius: 14, border: '1px solid var(--border)' }}
        >
          <Paragraph
            style={{
              whiteSpace: 'pre-wrap', lineHeight: 1.8,
              color: 'var(--text-secondary)', margin: 0, fontSize: 13,
            }}
          >
            {(currentDocument as any).original_text}
          </Paragraph>
        </Card>

        <Card
          title={
            <div >
              <span style={{ fontWeight: 700 }}>
                <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Testo revisionato
              </span>
              <Button
                icon={<CopyOutlined />}
                size="small"
                onClick={() =>
                  navigator.clipboard
                    .writeText(review.revised_text)
                    .then(() => message.success('Testo copiato!'))
                }
                style={{
                  marginLeft: 12,
                  borderRadius: 6,
                  border: '1px solid rgba(82,196,26,0.3)',
                  color: '#52c41a',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Copia
              </Button>
            </div>

          }
          style={{
            borderRadius: 14,
            border: '1px solid rgba(82,196,26,0.3)',
            background: 'rgba(82,196,26,0.02)',
          }}
        >
          <Paragraph
            style={{
              whiteSpace: 'pre-wrap', lineHeight: 1.8,
              color: 'var(--text-primary)', margin: 0, fontSize: 13,
            }}
          >
            {review?.revised_text ?? '—'}
          </Paragraph>
        </Card>
      </div>

      {/* Suggerimenti */}
      <Card
        title={
          <span style={{ fontWeight: 700 }}>
            <BulbOutlined style={{ marginRight: 8, color: '#faad14' }} />
            Suggerimenti ({suggestions.length})
          </span>
        }
        style={{ borderRadius: 16, border: '1px solid var(--border)' }}
      >
        {suggestions.length === 0 ? (
          <Text style={{ color: 'var(--text-muted)' }}>Nessun suggerimento disponibile.</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {suggestions.map((s: any, i: number) => {
              const config = typeConfig[s.type] ?? { color: 'default', label: s.type }
              return (
                <div key={i}>
                  {i > 0 && <Divider style={{ margin: '0 0 16px' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Tag color={config.color} style={{ fontWeight: 600, borderRadius: 6 }}>
                        {config.label}
                      </Tag>
                    </div>

                    {/* Estratto originale */}
                    <div style={{
                      background: 'rgba(255,77,79,0.06)',
                      border: '1px solid rgba(255,77,79,0.15)',
                      borderRadius: 8, padding: '10px 14px',
                    }}>
                      <Text style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                        Originale
                      </Text>
                      <Text style={{ fontSize: 13, fontStyle: 'italic' }}>"{s.original_excerpt}"</Text>
                    </div>

                    {/* Suggerimento */}
                    <div style={{
                      background: 'rgba(82,196,26,0.06)',
                      border: '1px solid rgba(82,196,26,0.15)',
                      borderRadius: 8, padding: '10px 14px',
                    }}>
                      <Text style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                        Suggerimento
                      </Text>
                      <Text style={{ fontSize: 13 }}>{s.suggestion}</Text>
                    </div>

                    {/* Spiegazione */}
                    <Text style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 4 }}>
                      💡 {s.explanation}
                    </Text>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

export default DocumentPage