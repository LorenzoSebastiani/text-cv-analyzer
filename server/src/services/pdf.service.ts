import pdf from 'pdf-parse-fork'

interface PDFData {
    text: string
    numpages: number
    info: Record<string, unknown>
}

export const extractText = async (buffer: Buffer): Promise<PDFData> => {
    try {
        return await pdf(buffer);
    } catch (error) {
        console.error('Errore durante il parsing del PDF:', error);
        throw error
    }
}