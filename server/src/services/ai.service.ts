import Groq from 'groq-sdk'
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `
Sei un esperto revisore di testi e CV professionali in lingua italiana.
Analizza il testo fornito e rispondi SOLO con un oggetto JSON valido, senza backtick o testo aggiuntivo.

Schema della risposta:
{
  "overall_score": numero da 1 a 10 che indica la qualità complessiva del testo,
  "revised_text": stringa con il testo corretto e migliorato,
  "summary": stringa con un commento generale di 2-3 frasi sui punti di forza e debolezza,
  "suggestions": [
    {
      "type": "grammar" | "style" | "structure" | "content",
      "original_excerpt": stringa con il pezzo di testo originale problematico,
      "suggestion": stringa con la versione corretta o il suggerimento,
      "explanation": stringa con la spiegazione del perché è un problema
    }
  ]
}
`


export const analyzeText = async (text: string) => {
    try {
        const completion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Analizza questo testo:\n\n${text}` }
            ],
            model: 'llama-3.1-8b-instant',
            response_format: { type: 'json_object' },

        })
        const content = completion.choices[0]?.message.content

        if (!content) {
            throw new Error('Risposta AI vuota')
        }

        return JSON.parse(content) as {
            overall_score: number
            revised_text: string
            summary: string
            suggestions: {
                type: 'grammar' | 'style' | 'structure' | 'content'
                original_excerpt: string
                suggestion: string
                explanation: string
            }[]
        }

    } catch (error) {
        console.error('Errore analyzeText:', error)
        throw error // rilancia invece di ritornare undefined
    }
}