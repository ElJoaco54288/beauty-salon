//importar models
import { EsteticaModel } from '../model/esteticaModel.js';

export class EsteticaController{

    static async si(req,res){
        try {
            const data = await EsteticaModel.aaa();
            console.log(data);
            res.send(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    }

    static async SignIn(req, res) {
    try {
        const { username, password } = req.body;
        const user = await EsteticaModel.accountExists(username, password);

        if (!user) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Guardar en sesión ANTES de responder
        req.session.user = user;

        // Asegurarnos de que la sesión se haya guardado en el store
        req.session.save(err => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ message: 'Error guardando la sesión' });
        }
        console.log('Usuario logueado y sesión guardada:', user.username || user);
        // ahora respondemos con la seguridad de que la sesión existe
        res.status(200).json({ message: 'Login correcto', user });
        });
    } catch (error) {
        console.error('Error en SignIn:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
    }


    static async SignUp(req,res){
        const { username, password, contact, role, image } = req.body;
        const user = await EsteticaModel.accountExists(username, password);
        if (user) {
            res.status(400).json({ message: 'El usuario ya existe' });
        } else {
            await EsteticaModel.createUser(username, password, contact, role, image);
            res.status(201).json({ message: 'Usuario creado correctamente' });
        }

    }

    static async SignOut(req,res){
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }
            res.clearCookie('connect.sid'); // Limpiar la cookie de sesión
            res.status(200).json({ message: 'Sesión cerrada correctamente' });
        }
    );
    }

    static async getSessionUser(req, res) {
    console.log('--- getSessionUser called ---');
    console.log('req.headers.cookie:', req.headers.cookie);  // ¿llega la cookie?
    console.log('req.session:', req.session);                // ¿qué tiene la sesión?
    if (req.session && req.session.user) {
        return res.status(200).json({ user: req.session.user });
    } else {
        return res.status(401).json({ message: 'No hay usuario en sesión' });
    }
    }


    // Obtener lista de trabajadores (desde /workerFinder)
    static async WorkerFinder(req,res){
        try {
            const workers = await EsteticaModel.WorkerFinder();
            res.status(200).json(workers);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    }

    static async getWorkerById(req, res) {
        try {
            const workerId = req.params.id;
            if (!workerId) return res.status(400).json({ message: 'Falta id' });

            const workers = await EsteticaModel.getWorkerById(workerId);
            return res.status(200).json({ worker: workers });
        } catch (err) {
            console.error('Error getWorkerById:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    // Obtener servicios de un trabajador específico (desde /workerServices?workerId=)
    static async WorkerServices(req,res){
        const id = req.params.id;
        try {
            const services = await EsteticaModel.WorkerServices(id);
            res.status(200).json(services);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    }

    // Obtener ID de un trabajador por su nombre de usuario (desde /catalogo)
    static async getWorkerId(req,res){
        const { username } = req.body;
        try {
            const worker = await EsteticaModel.getWorkerId(username);
            res.status(200).json(worker);
        }
        catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    }

    // backend/controller/esteticaController.js (dentro EsteticaController)
    static async getServicioTurnero(req, res) {
        try {
            const workerId = req.params.workerId;
            const rawName = req.params.serviceName || '';
            const serviceName = decodeURIComponent(rawName).trim();

            console.log('Controller.getServicioTurnero -> workerId:', workerId, 'serviceName:', serviceName);

            if (!workerId || !serviceName) {
            return res.status(400).json({ message: 'Falta workerId o serviceName' });
            }

            const servicio = await EsteticaModel.getServicioTurnero(workerId, serviceName);

            if (!servicio) {
            console.log('Controller.getServicioTurnero -> no encontrado', { workerId, serviceName });
            return res.status(404).json({ message: 'Servicio no encontrado para ese trabajador' });
            }

            return res.status(200).json({ serviceId: servicio.id_servicio, service: servicio });
        } catch (error) {
            console.error('Error en getServicioTurnero:', error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }



    static async getTurnosDisponibles(req, res) {
        try {
            const serviceId = req.params.id;
            let { fecha } = req.query; // ahora por query ?fecha=YYYY-MM-DD

            if (!serviceId) return res.status(400).json({ message: 'Falta id del servicio' });

            if (!fecha) {
                // default: fecha de hoy en YYYY-MM-DD
                const d = new Date();
                fecha = d.toISOString().split('T')[0];
            }

            console.log("getTurnosDisponibles -> serviceId:", serviceId, "fecha:", fecha);

            const turnos = await EsteticaModel.getTurnosDisponibles(fecha, serviceId);
            return res.status(200).json(turnos);
        } catch (error) {
            console.error('Error al obtener turnos:', error);
            return res.status(500).json({ message: 'Error al obtener turnos' });
        }
    }

    static async reservarTurno(req, res) {
        try {
            const { userId, serviceId, fecha, hora } = req.body;

            if (!userId || !serviceId || !fecha || !hora) {
                return res.status(400).json({ message: 'Faltan datos para reservar (userId, serviceId, fecha, hora)' });
            }

            const resultado = await EsteticaModel.reservarTurno(userId, serviceId, fecha, hora);

            if (resultado.affectedRows > 0) {
                return res.status(200).json({ message: 'Turno reservado correctamente' });
            } else {
                return res.status(404).json({ message: 'Turno no disponible o inexistente' });
            }
        } catch (error) {
            console.error('Error al reservar turno:', error);
            return res.status(500).json({ message: 'Error al reservar turno' });
        }
    } 

    static async getServiceById(req, res) {
        try {
            const serviceId = req.params.id;
            if (!serviceId) return res.status(400).json({ message: 'Falta id del servicio' });

            const servicio = await EsteticaModel.getServiceById(serviceId);
            if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });

            // devolvemos el servicio con el nombre del trabajador incluido
            return res.status(200).json({ service: servicio });
        } catch (err) {
            console.error('Error en getServiceById:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    static async definirDisponibles(req, res) {
        const { fecha, horariosDisponibles } = req.body;
        const { id } = req.params.id; // id del servicio
        try {
            for (const horario of horariosDisponibles) {
                await EsteticaModel.definirDisponibles(fecha, horario, id);
            }
            res.status(201).json({ message: 'Turnos agregados correctamente' });
        } catch (error) {
            console.error('Error al definir horarios disponibles:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    static async borrarTurno(req, res){
        const { id } = req.params;
        try {
            const resultado = await EsteticaModel.borrarTurno(id);
            if (resultado.affectedRows > 0) {
                res.status(201).json({ message: 'Turno borrado correctamente' });
            } else {
                res.status(400).json({ message: 'No se pudo borrar el turno' });
            }
        } catch (error) {
            console.error('Error al borrar turno:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }


    // static async login(req, res) {
    //     const { username, password } = req.body;
    
    //     const user = await PeluModel.accountExists(username, password);
    
    //     if (user) {
    //         const token = jwt.sign({username}, "Stack", {
    //             expiresIn: '2h'
    //         });

    //         res.status(200).json({ message: 'Login correcto', user, token});
    //     } else {
    //         res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    //     }
    // }    

    // static async getTurnosDisponibles(req, res) {
    //     const { fecha } = req.params;
    
    //     try {
    //         const turnos = await PeluModel.getTurnosDisponibles(fecha);
    //         res.status(200).json(turnos);
    //     } catch (error) {
    //         console.error('Error al obtener turnos:', error);
    //         res.status(500).json({ message: 'Error al obtener turnos' });
    //     }
    // }

    // static async reservarTurno(req, res) {
    //     const { fecha, hora } = req.body;
      
    //     try {
    //       const resultado = await PeluModel.reservarTurno(fecha, hora);
      
    //       if (resultado.affectedRows > 0) {
    //         res.status(200).json({ message: 'Turno reservado correctamente' });
    //       } else {
    //         res.status(404).json({ message: 'Turno no disponible o inexistente' });
    //       }
    //     } catch (error) {
    //       console.error('Error al reservar turno:', error);
    //       res.status(500).json({ message: 'Error al reservar turno' });
    //     }
    // } 
    
    // static async verTurnos(req, res) {
    //     const { fecha } = req.body;
    
    //     if (!fecha) {
    //         return res.status(400).json({ message: 'Falta la fecha' });
    //     }
    
    //     try {
    //         const turnos = await PeluModel.verTurnos(fecha);
    
    //         res.status(200).json(turnos); // SIEMPRE 200
    
    //     } catch (error) {
    //         console.error('Error al obtener turnos para admin:', error);
    //         res.status(500).json({ message: 'Error en el servidor' });
    //     }
    // }

    // static async agregarTurno(req, res) {
    //     const { fecha, hora, cliente } = req.body;
    
    //     try {
    //         const resultado = await PeluModel.agregarTurno(fecha, hora, cliente);
    
    //         if (resultado.affectedRows > 0) {
    //             res.status(201).json({ message: 'Turno agregado correctamente' });
    //         } else {
    //             res.status(400).json({ message: 'No se pudo agregar el turno' });
    //         }
    //     } catch (error) {
    //         console.error('Error al agregar turno:', error);
    //         res.status(500).json({ message: 'Error en el servidor' });
    //     }
    // }

    // static async borrarTurno(req, res){
    //     const { fecha, hora } = req.body;

    //     try {
    //         const resultado = await PeluModel.borrarTurno(fecha, hora);
    
    //         if (resultado.affectedRows > 0) {
    //             res.status(201).json({ message: 'Turno agregado correctamente' });
    //         } else {
    //             res.status(400).json({ message: 'No se pudo agregar el turno' });
    //         }
    //     } catch (error) {
    //         console.error('Error al borrar turno:', error);
    //         res.status(500).json({ message: 'Error en el servidor' });
    //     }

    // }

    // static async definirDisponibles(req, res) {
    //     const { fecha, horariosDisponibles } = req.body;
    
    //     try {
    //         for (const horario of horariosDisponibles) {
    //             await PeluModel.definirDisponibles(fecha, horario);
    //         }
    
    //         res.status(201).json({ message: 'Turnos agregados correctamente' });
    //     } catch (error) {
    //         console.error('Error al definir horarios disponibles:', error);
    //         res.status(500).json({ message: 'Error en el servidor' });
    //     }
    // }

}