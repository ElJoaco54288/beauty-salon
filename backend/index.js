// backend/index.js (o el archivo que uses como entry)
// router: Contiene los endpoints de la aplicacion para que los llamemos aca ;)

import express from 'express'
import pool from './db.js'    // <- ajustá la ruta si tu db.js está en otra carpeta

const app = express()
const port = 3000

//conectar con frontend
import cors from 'cors'

app.use(express.json()); //interpreta el json mandado desde el frontend
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: ["http://localhost:5173"],  //puerto en donde react se aloja
    methods: ["GET", "POST"]
}));

import routes from './routes/estetica.js'
app.use('/', routes);

// probar conexión a la DB al iniciar (no bloqueante)
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS ok');
    console.log(`DB connected (test: ${rows[0].ok})`);
  } catch (err) {
    console.error('DB connection error on startup:', err.message);
    // opcional: si querés abortar el start en caso de error descomenta la siguiente línea
    // process.exit(1);
  }
})();

//Puerto en el que se ejecuta el backend
app.listen(port, ()=>{
    console.log(`Example app listening on port: ${port}`)
})
