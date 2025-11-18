import express from 'express';
const router = express.Router();

//importar controllers
import { EsteticaController } from '../controller/esteticaController.js';

//endpoints
router.get('/ping', EsteticaController.si) //solo es de prueba

router.post('/signin', EsteticaController.SignIn);

router.post('/signup', EsteticaController.SignUp);

router.get('/workers', EsteticaController.WorkerFinder);

router.get('/workerServices/:id', EsteticaController.WorkerServices);

router.get('/getWorkerId', EsteticaController.getWorkerId);

router.get('/serviceTurnero/:workerId/:serviceName', EsteticaController.getServicioTurnero);

router.post('/logout', EsteticaController.SignOut);

router.get('/getSessionUser', EsteticaController.getSessionUser);

router.get('/turnero/:id', EsteticaController.getTurnosDisponibles);

router.get('/getWorkerById/:id', EsteticaController.getWorkerById);

router.post('/reservar', EsteticaController.reservarTurno);

router.get('/service/:id', EsteticaController.getServiceById);

router.post('/agregar/:id', EsteticaController.definirDisponibles);

router.delete('/borrar/:id', EsteticaController.borrarTurno);


// router.post('/login', EsteticaController.login)

// router.get('/home/:fecha', EsteticaController.getTurnosDisponibles);

// router.post('/reservar', EsteticaController.reservarTurno);

// router.post('/admin', EsteticaController.verTurnos);

// router.post('/agregar', EsteticaController.agregarTurno);

// router.post('/borrar', EsteticaController.borrarTurno);

// router.post('/definir-horarios', EsteticaController.definirDisponibles);


export default router;