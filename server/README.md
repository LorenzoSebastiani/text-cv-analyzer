# Revisore di testi e CV con AI

Un'applicazione web che analizza testi e CV usando l'intelligenza artificiale, fornendo feedback strutturato, correzioni e suggerimenti di miglioramento.

---

## Indice

- [Come funziona](#come-funziona)
- [Tecnologie usate](#tecnologie-usate)
- [Struttura del progetto](#struttura-del-progetto)
- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Il database](#il-database)
- [Il backend](#il-backend)
- [Autenticazione](#autenticazione)
- [API disponibili](#api-disponibili)

---

## Come funziona

L'utente incolla un testo o carica un PDF, il sistema lo manda a un modello AI (Claude o OpenAI), e riceve in risposta:

- un testo corretto e migliorato
- un punteggio da 1 a 10
- una lista di suggerimenti specifici, ognuno con tipo, estratto originale e spiegazione

Tutto viene salvato nel database così l'utente può ritrovare le revisioni passate.

---

## Tecnologie usate

| Layer | Tecnologia | Perché |
|---|---|---|
| Frontend | React | Costruisce l'interfaccia utente |
| Backend | Express + TypeScript | Gestisce le richieste HTTP |
| Database | PostgreSQL | Salva utenti, documenti e revisioni |
| AI | OpenAI (o-4-mini) | Analizza il testo e genera feedback |
| Auth | JWT + bcrypt | Gestisce login sicuro |

---

## Struttura del progetto

```
progetto/
├── src/
│   ├── db/
│   │   ├── index.ts          # Connessione al database
│   │   └── schema.sql        # Definizione delle tabelle
│   ├── controllers/
│   │   └── auth.controller.ts  # Logica di registrazione e login
│   ├── middleware/
│   │   └── auth.middleware.ts  # Verifica che l'utente sia loggato
│   ├── routes/
│   │   ├── auth.routes.ts    # Percorsi per login/registrazione
│   │   └── review.routes.ts  # Percorsi per le revisioni
│   ├── services/
│   │   ├── ai.service.ts     # Comunicazione con l'AI
│   │   ├── pdf.service.ts    # Estrazione testo da PDF
│   │   └── review.service.ts # Salvataggio revisioni su DB
│   ├── app.ts                # Configurazione Express
│   └── index.ts              # Punto di avvio dell'applicazione
├── .env                      # Variabili d'ambiente (NON committare)
├── .env.example              # Esempio di variabili d'ambiente
├── package.json
└── tsconfig.json
```

---

## Prerequisiti

Prima di iniziare assicurati di avere installato:

- **Node.js** v20 o superiore — [scarica qui](https://nodejs.org)
- **PostgreSQL** v14 o superiore — [scarica qui](https://www.postgresql.org/download)
- Una **API key** di Anthropic o OpenAI

Per verificare le versioni installate:

```bash
node --version
psql --version
```

---

## Installazione

```bash
# 1. Clona il repository
git clone <url-repository>
cd <nome-cartella>

# 2. Installa le dipendenze
npm install

# 3. Copia il file di configurazione
cp .env.example .env

# 4. Modifica .env con i tuoi dati (vedi sezione Configurazione)

# 5. Avvia l'applicazione
npm run dev
```

---

## Configurazione

Crea un file `.env` nella cartella principale con queste variabili:

```env
# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cv_reviewer
DB_USER=postgres
DB_PASSWORD=la_tua_password

# JWT — chiave segreta per firmare i token di autenticazione
# Usa una stringa lunga e casuale, es: openssl rand -base64 32
JWT_SECRET=cambia_questa_stringa_con_qualcosa_di_sicuro

# API Key per l'AI (scegli uno dei due)
ANTHROPIC_API_KEY=sk-ant-...
# oppure
OPENAI_API_KEY=sk-...

# Porta del server
PORT=3000
```

> **Attenzione:** il file `.env` non va mai caricato su Git perché contiene informazioni sensibili. Il file `.gitignore` lo esclude automaticamente.

---

## Il database

### Cos'è un pool di connessioni?

Invece di aprire e chiudere una connessione al database per ogni richiesta (lento e costoso), il **pool** mantiene un insieme di connessioni già aperte e pronte all'uso. Express le prende dal pool quando servono e le restituisce quando ha finito.

```typescript
// db/index.ts
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
})
```

### Le tabelle

Lo schema viene applicato automaticamente all'avvio dell'app. `IF NOT EXISTS` garantisce che le tabelle non vengano ricreate se esistono già.

```
users           → chi usa l'app (email + password cifrata)
  ↓
documents       → i testi caricati dagli utenti
  ↓
reviews         → il risultato dell'analisi AI (testo corretto, punteggio)
  ↓
suggestions     → i singoli suggerimenti della revisione (grammatica, stile, ecc.)
```

Ogni tabella è collegata alla precedente tramite una chiave esterna (`id`). Se cancelli un utente, tutti i suoi documenti e revisioni vengono cancellati automaticamente (`ON DELETE CASCADE`).

---

## Il backend

### Come Express gestisce una richiesta

Quando arriva una richiesta HTTP, Express la passa attraverso una serie di funzioni in sequenza chiamate **middleware**. Ognuna può modificare la richiesta, rispondere, o passare al prossimo step.

```
Richiesta HTTP
      ↓
express.json()        → trasforma il body JSON in oggetto JavaScript
      ↓
authMiddleware        → verifica che l'utente sia loggato (solo route protette)
      ↓
Controller            → esegue la logica (legge DB, chiama AI, risponde)
```

### Perché TypeScript?

TypeScript aggiunge i **tipi** a JavaScript. Invece di scoprire a runtime che una variabile è `undefined`, TypeScript te lo segnala mentre scrivi il codice. Per esempio:

```typescript
// Senza TypeScript — nessun errore finché non esegui
const user = result.rows[0]
console.log(user.Email) // typo: è "email" non "Email"

// Con TypeScript — errore immediato nell'editor
const user: User = result.rows[0]
console.log(user.Email) // ❌ Property 'Email' does not exist
```

---

## Autenticazione

### Come funziona il JWT

JWT (JSON Web Token) è un modo per dimostrare di essere loggati senza dover salvare sessioni sul server.

**Al login**, il server genera un token firmato con una chiave segreta:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.abc123...
        ↑ header              ↑ dati (userId)      ↑ firma
```

**Ad ogni richiesta successiva**, il client manda il token nell'header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Il middleware lo verifica: se la firma è valida e non è scaduto, la richiesta passa. Nessun dato salvato sul server.

### Perché bcrypt per le password?

Le password non vengono mai salvate in chiaro nel database. `bcrypt` le trasforma in una stringa irriconoscibile (hash) che non può essere invertita:

```
"miaPassword123"  →  bcrypt  →  "$2b$10$X9k2mN..."
```

Al login, bcrypt confronta la password inserita con l'hash salvato senza mai "decifrare" nulla.

---

## API disponibili

### Autenticazione

```
POST /auth/register
Body: { "email": "mario@example.com", "password": "sicura123" }
Risposta: { "token": "...", "user": { "id": "...", "email": "..." } }

POST /auth/login
Body: { "email": "mario@example.com", "password": "sicura123" }
Risposta: { "token": "...", "user": { "id": "...", "email": "..." } }
```

### Revisioni (richiede token)

Tutte le richieste seguenti richiedono l'header:
```
Authorization: Bearer <token>
```

```
POST /reviews
Body: { "text": "Il tuo testo da analizzare..." }
Risposta: { "id": "...", "revised_text": "...", "overall_score": 8, "suggestions": [...] }

GET /reviews
Risposta: [ lista di tutte le revisioni dell'utente ]

GET /reviews/:id
Risposta: { revisione completa con tutti i suggerimenti }
```

---

## Prossimi passi

- [ ] `review.controller.ts` — chiamata all'AI e salvataggio risultato
- [ ] `pdf.service.ts` — estrazione testo da file PDF caricati
- [ ] Frontend React — upload, visualizzazione diff e storico