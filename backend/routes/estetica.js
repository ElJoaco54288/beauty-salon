import express from 'express';
const router = express.Router();

//importar controllers
import { PeluController } from '../controller/esteticaController.js';

//endpoints
router.get('/ping', PeluController.si) //solo es de prueba

router.post('/login', PeluController.login)

router.get('/home/:fecha', PeluController.getTurnosDisponibles);

router.post('/reservar', PeluController.reservarTurno);

router.post('/admin', PeluController.verTurnos);

router.post('/agregar', PeluController.agregarTurno);

router.post('/borrar', PeluController.borrarTurno);

router.post('/definir-horarios', PeluController.definirDisponibles);


export default router;