import { useState } from 'react'
import { Button, Card, Input, Tabs, Typography, Upload } from 'antd'
import { InboxOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDocument } from '../../context/DocumentContext'

const { Title, Text, Paragraph } = Typography
const { Dragger } = Upload
const { TextArea } = Input

const UploadPage = () => {
    const navigate = useNavigate()
    const { uploadDocument } = useDocument()!
    const [text, setText] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleTextSubmit = async () => {
        if (!text.trim()) {
            setError('Inserisci del testo da analizzare')
            return
        }

        setError(null)
        setLoading(true)

        const result = await uploadDocument(text)

        setLoading(false)

        if (result) {
            navigate(`/documents/${result.documentId}`)
        } else {
            setError('Analisi fallita. Riprova.')
        }
    }

    const handleFileSubmit = async () => {
        if (!file) {
            setError('Seleziona un file PDF')
            return
        }

        setError(null)
        setLoading(true)

        const formData = new FormData()
        formData.append('document', file)

        const result = await uploadDocument(undefined, formData)
        setLoading(false)

        if (result?.error) {
            setError(result.error)
        } else if (result?.documentId) {
            navigate(`/documents/${result.documentId}`)
        } else {
            setError('Analisi fallita. Riprova.')
        }
    }

    const tabs = [
        {
            key: 'text',
            label: (
                <span style={{ fontWeight: 600 }}>
                    <FileTextOutlined /> Testo libero
                </span>
            ),
            children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <TextArea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Incolla qui il tuo CV o testo da analizzare..."
                        autoSize={{ minRows: 12, maxRows: 20 }}
                        style={{ borderRadius: 10, fontSize: 14, lineHeight: 1.7 }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                            {text.length} caratteri
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SendOutlined />}
                            loading={loading}
                            onClick={handleTextSubmit}
                            style={{
                                background: 'var(--gradient)',
                                border: 'none',
                                borderRadius: 10,
                                fontWeight: 700,
                                height: 46,
                                padding: '0 28px',
                            }}
                        >
                            Analizza testo
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            key: 'pdf',
            label: (
                <span style={{ fontWeight: 600 }}>
                    <InboxOutlined /> Carica PDF
                </span>
            ),
            children: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Dragger
                        accept=".pdf"
                        maxCount={1}
                        beforeUpload={(f) => {
                            setFile(f)
                            return false // blocca upload automatico
                        }}
                        onRemove={() => setFile(null)}
                        style={{ borderRadius: 12 }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ fontSize: 48, color: 'var(--primary)' }} />
                        </p>
                        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                            Trascina il PDF qui
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                            oppure clicca per selezionarlo — solo file .pdf
                        </p>
                    </Dragger>

                    {file && (
                        <div style={{
                            background: 'rgba(102,126,234,0.06)',
                            border: '1px solid rgba(102,126,234,0.2)',
                            borderRadius: 10, padding: '12px 16px',
                            display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                            <FileTextOutlined style={{ color: 'var(--primary)', fontSize: 18 }} />
                            <Text style={{ fontWeight: 600 }}>{file.name}</Text>
                            <Text style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 'auto' }}>
                                {(file.size / 1024).toFixed(1)} KB
                            </Text>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<SendOutlined />}
                            loading={loading}
                            disabled={!file}
                            onClick={handleFileSubmit}
                            style={{
                                background: 'var(--gradient)',
                                border: 'none',
                                borderRadius: 10,
                                fontWeight: 700,
                                height: 46,
                                padding: '0 28px',
                            }}
                        >
                            Analizza PDF
                        </Button>
                    </div>
                </div>
            ),
        },
    ]

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Intestazione */}
            <div style={{ marginBottom: 32 }}>
                <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                    Nuova analisi
                </Title>
                <Paragraph style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 0 }}>
                    Incolla un testo o carica un PDF — l'AI lo analizzerà in pochi secondi.
                </Paragraph>
            </div>

            <Card style={{ borderRadius: 16, border: '1px solid var(--border)' }}>
                {error && (
                    <div style={{
                        background: 'rgba(255,77,79,0.08)',
                        border: '1px solid rgba(255,77,79,0.2)',
                        borderRadius: 8, padding: '10px 14px',
                        color: '#ff4d4f', fontSize: 13, marginBottom: 20,
                    }}>
                        {error}
                    </div>
                )}
                <Tabs items={tabs} size="large" />
            </Card>
        </div>
    )
}

export default UploadPage