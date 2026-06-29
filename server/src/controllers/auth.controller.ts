import { json, Request, Response } from 'express';
import pool from '../db/index.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Credenziali mancanti' })
        }

        const exsistingEmail = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        if (exsistingEmail.rows.length > 0) {
            return res.status(409).json({ error: 'Email già in uso' })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at', [email, passwordHash]);

        const user = result.rows[0];

        const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY!, { expiresIn: '2d' })

        res.status(201).json({ token, user })
    } catch (error) {
        console.error('Errore register:', error)
        res.status(500).json({ error: 'Errore interno del server' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Credenziali mancanti' })
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenziali non valide' })
        }

        const user = result.rows[0]
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {
            return res.status(401).json({ error: 'Credenziali non valide' })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_KEY!,
            { expiresIn: '2d' }
        )

        const { password_hash, ...safeUser } = user
        res.json({ token, user: safeUser })
    } catch (error) {
        console.log('Errore login: ', error);
        res.status(500).json({error: 'Errore interno del server'})
    }
}