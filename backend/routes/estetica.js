import express from 'express';
const router = express.Router();

//importar controllers
import { EsteticaController } from '../controller/esteticaController.js';

//endpoints
router.get('/ping', EsteticaController.si) //solo es de prueba

router.post('/signin', EsteticaController.SignIn);

router.post('/signup', EsteticaController.SignUp);

// router.post('/login', EsteticaController.login)

// router.get('/home/:fecha', EsteticaController.getTurnosDisponibles);

// router.post('/reservar', EsteticaController.reservarTurno);

// router.post('/admin', EsteticaController.verTurnos);

// router.post('/agregar', EsteticaController.agregarTurno);

// router.post('/borrar', EsteticaController.borrarTurno);

// router.post('/definir-horarios', EsteticaController.definirDisponibles);


export default router;