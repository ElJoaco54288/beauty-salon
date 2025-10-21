//router: Contiene los endpoints de la aplicacion para que los llamemos aca ;)

import express from 'express'
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

//Puerto en el que se ejecuta el backend
app.listen(port, ()=>{
    console.log(`Example app listening on port: ${port}`)
})
