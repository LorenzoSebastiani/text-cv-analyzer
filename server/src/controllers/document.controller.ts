import { Request, Response } from 'express';
import { extractText } from '../services/pdf.service';
import pool from '../db';
import jwt from 'jsonwebtoken'
import { analyzeText } from '../services/ai.service';

export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const payload = jwt.verify(token!, process.env.JWT_KEY!) as jwt.JwtPayload;
        const userId = payload.userId;

        // 1. Ricava il testo — da PDF o da body
        let originalText: string;
        let filename: string | null = null;

        if (req.file?.mimetype === 'application/pdf') {
            const result = await extractText(req.file.buffer);
            originalText = result?.text!;
            filename = req.file.originalname;
        } else if (req.body.text) {
            originalText = req.body.text;
        } else {
            return res.status(400).json({ error: 'Nessun testo o PDF fornito' });
        }

        // 2. Salva il documento
        const docResult = await pool.query(
            'INSERT INTO documents (user_id, original_text, filename) VALUES ($1, $2, $3) RETURNING id',
            [userId, originalText, filename]
        );
        const documentId = docResult.rows[0].id;

        // 3. Analisi AI
        const analysis = await analyzeText(originalText);

        // 4. Salva la review
        const reviewResult = await pool.query(
            'INSERT INTO reviews (document_id, revised_text, overall_score, summary) VALUES ($1, $2, $3, $4) RETURNING id',
            [documentId, analysis.revised_text, analysis.overall_score, analysis.summary]
        );
        const reviewId = reviewResult.rows[0].id;

        // 5. Salva i suggerimenti
        for (const s of analysis.suggestions) {
            await pool.query(
                'INSERT INTO suggestions (review_id, type, original_excerpt, suggestion, explanation) VALUES ($1, $2, $3, $4, $5)',
                [reviewId, s.type, s.original_excerpt, s.suggestion, s.explanation]
            );
        }

        // 6. Risposta
        res.status(201).json({
            documentId,
            reviewId,
            overall_score: analysis.overall_score,
            summary: analysis.summary,
            revised_text: analysis.revised_text,
            suggestions: analysis.suggestions
        });

    } catch (error) {
        console.error('Errore uploadDocument:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
}

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const payload = jwt.verify(token!, process.env.JWT_KEY!) as jwt.JwtPayload;
        const userId = payload.userId;

        const result = await pool.query('SELECT * FROM documents WHERE user_id = $1', [userId]);

        return res.status(200).json(result.rows)
    } catch (error) {
        console.error('Errore getDocuments:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
}

export const getDocumentById = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const payload = jwt.verify(token!, process.env.JWT_KEY!) as jwt.JwtPayload;
        const userId = payload.userId;

        const id = req.params.id

        // 1. Documento
        const docResult = await pool.query(
            'SELECT * FROM documents WHERE id = $1',
            [id]
        );

        if (docResult.rows.length === 0) {
            return res.status(404).json({ error: 'Documento non trovato' });
        }

        const document = docResult.rows[0];

        // 2. Ownership check
        if (document.user_id !== userId) {
            return res.status(403).json({ error: 'Accesso negato' });
        }

        // 3. Review
        const reviewResult = await pool.query(
            'SELECT * FROM reviews WHERE document_id = $1',
            [id]
        );
        const review = reviewResult.rows[0] ?? null;

        // 4. Suggestions
        const suggestionsResult = review
            ? await pool.query('SELECT * FROM suggestions WHERE review_id = $1', [review.id])
            : { rows: [] };

        // 5. Risposta
        return res.status(200).json({
            ...document,
            review: review
                ? { ...review, suggestions: suggestionsResult.rows }
                : null
        });

    } catch (error) {
        console.error('Errore getDocumentById:', error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
}