import { useEffect } from 'react'
import { Button, Card, Table, Tag, Typography, Statistic } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  FileTextOutlined,
  PlusOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useDocument } from '../../context/DocumentContext'
import { useAuth } from '../../context/AuthContext'

const { Title, Text } = Typography

const HomePage = () => {
  const navigate = useNavigate()
  const { documentList, getDocuments } = useDocument()!
  const { user } = useAuth()!

  useEffect(() => {
    getDocuments()
  }, [])

  const avgScore = documentList.length > 0
    ? (documentList.reduce((acc: number, d: any) => acc + (d.overall_score ?? 0), 0) / documentList.length).toFixed(1)
    : '—'

  const lastDate = documentList.length > 0
    ? new Date(documentList[0].created_at).toLocaleDateString('it-IT')
    : '—'

  const columns = [
    {
      title: 'Documento',
      dataIndex: 'original_text',
      key: 'original_text',
      render: (text: string, record: any) => (
        <div>
          <Text strong style={{ display: 'block', fontSize: 14 }}>
            {record.filename ?? 'Testo libero'}
          </Text>
          <Text style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {text?.slice(0, 60)}...
          </Text>
        </div>
      ),
    },
    {
      title: 'Punteggio',
      dataIndex: 'overall_score',
      key: 'overall_score',
      render: (score: number) =>
        score ? (
          <Tag color={score >= 7 ? 'green' : score >= 5 ? 'orange' : 'red'}>
            {score}/10
          </Tag>
        ) : (
          <Tag color="default">N/D</Tag>
        ),
    },
    {
      title: 'Data',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('it-IT'),
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => navigate(`/documents/${record.id}`)}
          style={{ color: 'var(--primary)', fontWeight: 600, padding: 0 }}
        >
          Vedi dettaglio →
        </Button>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Intestazione */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
            Benvenuto 👋
          </Title>
          <Text style={{ color: 'var(--text-muted)' }}>{user?.email}</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
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

      {/* Statistiche */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Card style={{ borderRadius: 14, border: '1px solid var(--border)' }}>
          <Statistic
            title={<Text style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Documenti analizzati</Text>}
            value={documentList.length}
            prefix={<FileTextOutlined style={{ color: 'var(--primary)' }} />}
            valueStyle={{ color: 'var(--text-primary)', fontWeight: 800 }}
          />
        </Card>
        <Card style={{ borderRadius: 14, border: '1px solid var(--border)' }}>
          <Statistic
            title={<Text style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Punteggio medio</Text>}
            value={avgScore}
            suffix="/10"
            prefix={<StarOutlined style={{ color: '#faad14' }} />}
            valueStyle={{ color: 'var(--text-primary)', fontWeight: 800 }}
          />
        </Card>
        <Card style={{ borderRadius: 14, border: '1px solid var(--border)' }}>
          <Statistic
            title={<Text style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Ultima analisi</Text>}
            value={lastDate}
            prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 20 }}
          />
        </Card>
      </div>

      {/* Tabella documenti */}
      <Card
        title={<Text strong style={{ fontSize: 16 }}>Revisioni recenti</Text>}
        style={{ borderRadius: 14, border: '1px solid var(--border)' }}
        extra={
          <Button type="link" onClick={() => navigate('/documents')} style={{ color: 'var(--primary)' }}>
            Vedi tutte →
          </Button>
        }
      >
        {documentList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <FileTextOutlined style={{ fontSize: 48, color: 'var(--text-muted)', marginBottom: 16 }} />
            <br />
            <Text style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Nessun documento ancora. Inizia con una nuova analisi!
            </Text>
            <br />
            <Button
              type="primary"
              style={{ marginTop: 16, background: 'var(--gradient)', border: 'none', borderRadius: 8 }}
              onClick={() => navigate('/upload')}
            >
              Analizza il tuo primo documento
            </Button>
          </div>
        ) : (
          <Table
            dataSource={documentList}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            style={{ borderRadius: 8 }}
          />
        )}
      </Card>
    </div>
  )
}

export default HomePage