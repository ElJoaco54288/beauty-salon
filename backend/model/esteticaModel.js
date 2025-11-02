import mysql from "mysql2/promise";
// import { v4 as uuidv4 } from 'uuid'; //uuid >>>> id

// Configuración de conexión con pool (a diferencia de createConection este es mas eficiente)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'esteticabd',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export class EsteticaModel{

    static async aaa(req,res){
        const [rows] = await pool.query('SELECT * FROM usuarios');
        return rows;
    }

    static async accountExists(username, password) {
        try {
            const [result] = await pool.query(
                'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?',
                [username, password]
            );
            if (result.length > 0) {
                return result[0]; // Usuario encontrado
            } else {
                return null; // No encontrado
            }
        } catch (error) {
            console.log('Error en consulta AccountExists', error);
            return null;
        }
    }

    static async createUser(username, password, contact, role, image) {
        try {
            const [result] = await pool.query(
                'INSERT INTO usuarios (nombre, contraseña, telefono, rol, imagen_url) VALUES (?, ?, ?, ?, ?)',
                [username, password, contact, role, image]
            );
            return result;
        } catch (error) {
            console.log('Error en consulta createUser:', error);
            throw error;
        }
    }

    static async WorkerFinder(){
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE rol = "trabajador"');
            return rows;
        } catch (error) {
            console.log('Error en consulta WorkerFinder:', error);
            throw error;
        }
    }

    static async WorkerServices(workerId){
        try {
            const [rows] = await pool.query('SELECT * FROM Servicios WHERE trabajador_id = ?', [workerId]);
            return rows;
        } catch (error) {
            console.log('Error en consulta WorkerServices:', error);
            throw error;
        }
    }

    static async getWorkerId(username){
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [username]);
            console.log(rows);
            if (rows.length > 0) {
                return rows[0].id_usuario;
            } else {
                return null; // No encontrado
            }
        } catch (error) {
            console.log('Error en consulta getWorkerId:', error);
            throw error;
        }
    }

    // static async accountExists(username, password) {
    //     try {
    //         const [result] = await pool.query(
    //             'SELECT * FROM Login WHERE Username = ? AND Password = ?',
    //             [username, password]
    //         );
    
    //         if (result.length > 0) {
    //             return result[0]; // Usuario encontrado
    //         } else {
    //             return null; // No encontrado
    //         }
    //     } catch (error) {
    //         console.log('Error en accountExists:', error);
    //         return null;
    //     }
    // }

    // static async getTurnosDisponibles(fecha) {
    //     try {
    //         const [result] = await pool.query(
    //             'SELECT Hora FROM Turnos WHERE Fecha = ? AND Estado = "Disponible" ORDER BY Hora ASC',
    //             [fecha]
    //         );
    
    //         // Clasificar los horarios en Mañana, Tarde, Noche
    //         const turnosPorMomento = {
    //             Mañana: [],
    //             Tarde: [],
    //             Noche: []
    //         };
    
    //         // Clasificar y formatear las horas
    //         result.forEach(turno => {
    //             const hora = turno.Hora;
    //             const horaNum = parseInt(hora.split(":")[0]);
    
    //             // Formatear la hora para mostrar solo hh:mm
    //             const formattedHora = hora.substring(0, 5); // Extrae hh:mm
    
    //             if (horaNum >= 8 && horaNum < 12) {
    //                 turnosPorMomento.Mañana.push(formattedHora);
    //             } else if (horaNum >= 12 && horaNum < 19) {
    //                 turnosPorMomento.Tarde.push(formattedHora);
    //             } else if (horaNum >= 19 && horaNum <= 23) {
    //                 turnosPorMomento.Noche.push(formattedHora);
    //             }
    //         });
    
    //         // Asegurarse de que los horarios estén ordenados
    //         turnosPorMomento.Mañana.sort();
    //         turnosPorMomento.Tarde.sort();
    //         turnosPorMomento.Noche.sort();
    
    //         return turnosPorMomento;
    
    //     } catch (error) {
    //         console.error('Error en getTurnosDisponibles:', error);
    //         throw error;
    //     }
    // }
    

    // static async reservarTurno(fecha, hora) {
    //     try {
    //       const [result] = await pool.query(
    //         `UPDATE Turnos
    //          SET Estado = 'Reservado'
    //          WHERE Fecha = ? AND Hora = ? AND Estado = 'Disponible'`,
    //         [fecha, hora]
    //       );
      
    //       return result;
    //     } catch (error) {
    //       console.error('Error en reservarTurnoPorFechaHora:', error);
    //       throw error;
    //     }
    // }      

    // static async verTurnos(fecha) {
    //     try {
    //         const [result] = await pool.query(
    //             `SELECT * FROM Turnos 
    //              WHERE Fecha = ? AND Estado = 'Reservado'
    //              ORDER BY Hora ASC`,
    //             [fecha]
    //         );
    //         return result;
    //     } catch (error) {
    //         console.error('Error en verTurnosPorFecha:', error);
    //         throw error;
    //     }
    // }     

    // static async agregarTurno(fecha, hora, cliente) {
    //     const [resultado] = await pool.query(
    //         `INSERT INTO turnos (Fecha, Hora, Cliente, Estado) VALUES (?, ?, ?, 'Reservado')`,
    //         [fecha, hora, cliente]
    //     );
    //     return resultado;
    // }

    // static async borrarTurno(fecha, hora){
    //     const [resultado] = await pool.query(
    //         'DELETE FROM turnos WHERE Fecha = ? AND Hora = ?',
    //         [fecha, hora]
    //     );
    //     return resultado;
    // }

    // static async definirDisponibles(fecha, hora) {
    //     const [resultado] = await pool.query(
    //         `INSERT INTO turnos (Fecha, Hora) VALUES (?, ?)`,
    //         [fecha, hora]
    //     );
    //     return resultado;
    // }
    
    
    

}