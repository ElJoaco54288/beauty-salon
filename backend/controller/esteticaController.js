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

    static async SignIn(req,res){
        const { username, password } = req.body;
        const user = await EsteticaModel.accountExists(username, password);

        if (user) {
            res.status(200).json({ message: 'Login correcto', user});
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
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