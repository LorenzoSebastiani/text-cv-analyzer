import { useEffect, useState } from 'react'
import { Button, Card, Input, Tag, Typography, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  FileTextOutlined,
  SearchOutlined,
  PlusOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { useDocument } from '../../context/DocumentContext'

const { Title, Text, Paragraph } = Typography

const DocumentsPage = () => {
  const navigate = useNavigate()
  const { documentList, getDocuments } = useDocument()!
  const [search, setSearch] = useState('')

  useEffect(() => {
    getDocuments()
  }, [])

  const filtered = documentList.filter((d: any) =>
    d.filename?.toLowerCase().includes(search.toLowerCase()) ||
    d.original_text?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Intestazione */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
            Le mie revisioni
          </Title>
          <Text style={{ color: 'var(--text-muted)' }}>
            {documentList.length} documento{documentList.length !== 1 ? 'i' : ''} analizzat{documentList.length !== 1 ? 'i' : 'o'}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/upload')}
          style={{
            background: 'var(--gradient)',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            height: 46,
            padding: '0 24px',
          }}
        >
          Nuova analisi
        </Button>
      </div>

      {/* Ricerca */}
      <Input
        prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
        placeholder="Cerca per nome file o contenuto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="large"
        style={{ borderRadius: 10, maxWidth: 480 }}
        allowClear
      />

      {/* Lista */}
      {filtered.length === 0 ? (
        <Card style={{ borderRadius: 16, border: '1px solid var(--border)' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              search
                ? 'Nessun documento corrisponde alla ricerca'
                : 'Nessun documento ancora'
            }
          >
            {!search && (
              <Button
                type="primary"
                onClick={() => navigate('/upload')}
                style={{ background: 'var(--gradient)', border: 'none', borderRadius: 8 }}
              >
                Analizza il tuo primo documento
              </Button>
            )}
          </Empty>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map((doc: any) => (
            <Card
              key={doc.id}
              hoverable
              onClick={() => navigate(`/documents/${doc.id}`)}
              style={{
                borderRadius: 14,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
            >
              {/* Icona + nome */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(102,126,234,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileTextOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <Text strong style={{ display: 'block', fontSize: 14 }}>
                    {doc.filename ?? 'Testo libero'}
                  </Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <CalendarOutlined style={{ fontSize: 11, color: 'var(--text-muted)' }} />
                    <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(doc.created_at).toLocaleDateString('it-IT')}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Anteprima testo */}
              <Paragraph
                style={{
                  color: 'var(--text-secondary)', fontSize: 13,
                  lineHeight: 1.6, margin: '0 0 12px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {doc.original_text}
              </Paragraph>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tag
                  color={doc.overall_score >= 7 ? 'green' : doc.overall_score >= 5 ? 'orange' : 'red'}
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  {doc.overall_score ? `${doc.overall_score}/10` : 'N/D'}
                </Tag>
                <Text style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>
                  Vedi dettaglio →
                </Text>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentsPage