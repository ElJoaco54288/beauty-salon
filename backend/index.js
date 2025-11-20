// backend/index.js (cambia la sección CORS por esto, luego reinicia el servidor)
import express from 'express'
import session from 'express-session'
import pool from './db.js'
import cors from 'cors'
import routes from './routes/estetica.js'

const app = express()
const port = 3000

// CORS global (usa esto primero)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manejo explícito y seguro de preflight (OPTIONS)
// NO usar app.options('*', ...) para evitar el error de path-to-regexp en algunas versiones.
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // log para debug
    console.log('--- preflight OPTIONS received for:', req.path);
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204); // No Content
  }
  next();
});

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session
app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// rutas (después de CORS)
app.use('/', routes);

// test DB + start
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS ok');
    console.log(`DB connected (test: ${rows[0].ok})`);
  } catch (err) {
    console.error('DB connection error on startup:', err.message);
  }
})();

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
});
