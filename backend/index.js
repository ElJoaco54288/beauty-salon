// backend/index.js
import express from 'express'
import session from 'express-session'
import pool from './db.js'
import cors from 'cors'
import routes from './routes/estetica.js'

const app = express()
const port = 3000

// 1️⃣ CORS PRIMERO, con credentials habilitados
app.use(cors({
  origin: 'http://localhost:5173',  // frontend Vite
  credentials: true,                // NECESARIO para cookies / sesiones
  methods: ['GET', 'POST']
}));

// 2️⃣ Luego el body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3️⃣ Luego la sesión (con opciones correctas)
app.use(session({
  secret: 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: false, // mejor false que true
  cookie: {
    secure: false,   // en dev con HTTP → false; en prod con HTTPS → true
    httpOnly: true,
    sameSite: 'lax'  // evita que el navegador bloquee la cookie
  }
}));

// 4️⃣ Tus rutas
app.use('/', routes);

// 5️⃣ Test DB
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS ok');
    console.log(`DB connected (test: ${rows[0].ok})`);
  } catch (err) {
    console.error('DB connection error on startup:', err.message);
  }
})();

// 6️⃣ Iniciar servidor
app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`)
});
