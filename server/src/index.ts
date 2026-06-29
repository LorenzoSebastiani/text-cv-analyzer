import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import pool, { initDb } from './db/index.js'

import authRoutes from './routes/auth.routes.js'
import documentRoutes from './routes/document.routes.js'
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();

app.use(cors())
app.use(express.json())
app.use(authMiddleware)

app.use('/api/auth', authRoutes);
app.use('/api', documentRoutes);

async function main() {
    try {
        await pool.query('SELECT 1');
        await initDb();
        app.listen(process.env.SERVER_PORT, () => console.log('Server avviato sulla porta: ', process.env.SERVER_PORT))
} catch (err) {
        console.error('Avvio fallito:', err)
        process.exit(1)
    }
}

main()