import PDFParser from 'pdf2json'

interface PDFData {
    text: string
    numpages: number
    info: Record<string, unknown>
}

export const extractText = async (buffer: Buffer): Promise<PDFData> => {
    return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)()

        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            const text = pdfParser.getRawTextContent()
            console.log('Testo estratto:', text?.slice(0, 200))
            console.log('Lunghezza:', text?.length)
            resolve({
                text,
                numpages: pdfData.Pages?.length ?? 0,
                info: {}
            })
        })

        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            const text = pdfParser.getRawTextContent()
            resolve({
                text,
                numpages: pdfData.Pages?.length ?? 0,
                info: {}
            })
        })

        pdfParser.parseBuffer(buffer)
    })
}