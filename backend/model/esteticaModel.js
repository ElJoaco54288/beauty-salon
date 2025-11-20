import pool from '../db.js';
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

    static async getWorkerById(workerId) {
        try {
            const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [workerId]);
            return rows;
        } catch (error) {
            console.log('Error en consulta getWorkerById:', error);
            throw error;
        }
    }

    static async WorkerServices(workerId){
        try {
            const [rows] = await pool.query('SELECT * FROM servicios WHERE trabajador_id = ?', [workerId]);
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

    static async getServicioTurnero(workerId, serviceName) {
        try {
            const nameNorm = (serviceName || "").toString().trim().toLowerCase();

            const sql = `
            SELECT id_servicio, nombre, precio, trabajador_id
            FROM servicios
            WHERE trabajador_id = ?
                AND LOWER(TRIM(nombre)) = ?
            LIMIT 1
            `;
            const params = [workerId, nameNorm];

            console.log('Model.getServicioTurnero -> SQL params:', params);
            const [rows] = await pool.query(sql, params);
            console.log('Model.getServicioTurnero -> rows:', rows);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error en consulta getServicioTurnero:', error);
            throw error;
        }
    }

    static async getTurnosDisponibles(fecha, serviceId) {
        try {
            const [result] = await pool.query(
                'SELECT hora FROM turnos WHERE fecha = ? AND id_servicio = ? AND estado = "disponible" ORDER BY hora ASC',
                [fecha, serviceId]
            );

            const turnosPorMomento = { Mañana: [], Tarde: [], Noche: [] };

            result.forEach(turno => {
                const hora = turno.hora;
                const horaNum = parseInt(hora.split(":")[0], 10);
                const formattedHora = hora.substring(0, 5);
                if (horaNum >= 8 && horaNum < 12) {
                turnosPorMomento.Mañana.push(formattedHora);
                } else if (horaNum >= 12 && horaNum < 19) {
                turnosPorMomento.Tarde.push(formattedHora);
                } else if (horaNum >= 19 && horaNum <= 23) {
                turnosPorMomento.Noche.push(formattedHora);
                }
            });

            turnosPorMomento.Mañana.sort();
            turnosPorMomento.Tarde.sort();
            turnosPorMomento.Noche.sort();

        return turnosPorMomento;
        } catch (error) {
            console.error('Error en getTurnosDisponibles:', error);
            throw error;
        }
    }


    static async reservarTurno(userId, serviceId, fecha, hora) {
        try {
            const [result] = await pool.query(
                `UPDATE turnos
                SET estado = 'reservado', id_usuario = ?
                WHERE fecha = ? AND hora = ? AND id_servicio = ? AND estado = 'disponible'`,
                [userId, fecha, hora, serviceId]
            );
            return result;
        } catch (error) {
            console.error('Error en reservarTurno:', error);
            throw error;
        }
    }

    static async getServiceById(serviceId) {
        try {
            const sql = `
            SELECT s.*, u.id_usuario AS trabajador_id, u.nombre AS trabajador_nombre
            FROM servicios s
            JOIN usuarios u ON s.trabajador_id = u.id_usuario
            WHERE s.id_servicio = ?
            LIMIT 1
            `;
            const [rows] = await pool.query(sql, [serviceId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error en getServiceById:', error);
            throw error;
        }
    }

    static async definirDisponibles(fecha, hora, serviceId) {
        try {
            const [resultado] = await pool.query(
            `INSERT INTO turnos (fecha, hora, id_servicio, estado) VALUES (?, ?, ?, 'disponible')`,
            [fecha, hora, serviceId]
            );
            return resultado;
        } catch (error) {
            console.error('Error en definirDisponibles:', error);
            throw error;
        }
    }

    static async deleteService(serviceId) {
        try {
            const [result] = await pool.query('DELETE FROM servicios WHERE id_servicio = ?', [serviceId]);
            return result;
        } catch (error) {
            console.error('Error en deleteService:', error);
            throw error;
        }
    }

    static async createService(nombre, precio, trabajador_id) {
        try {
            const [result] = await pool.query(
            'INSERT INTO servicios (nombre, precio, trabajador_id) VALUES (?, ?, ?)',
            [nombre, precio, trabajador_id]
            );
            return result; // result.insertId disponible
        } catch (error) {
            console.error('Error en createService (model):', error);
            throw error;
        }
    }

    static async updateService(serviceId, nombre, precio) {
        try {
            const [result] = await pool.query(
            `UPDATE servicios SET nombre = ?, precio = ? WHERE id_servicio = ?`,
            [nombre, precio, serviceId]
            );
            return result;
        } catch (error) {
            console.error('Error en updateService (model):', error);
            throw error;
        }
    }

    static async getMisReservas(userId) {
        try{
            const [result] = await pool.query(
            `
            SELECT * FROM turnos t
            JOIN servicios s ON t.id_servicio = s.id_servicio
            WHERE t.id_usuario = ?
            ORDER BY t.fecha ASC, t.hora ASC
            `,
            [userId]
            );
            console.log('getMisReservas result:', result);
            return result;
        } catch (error) {
            console.error(
            'Error en getMisReservas (model):', error
            )
        }
    };

    static async cancelarReserva(reservaId) {
        try {
            const [result] = await pool.query(
                'DELETE FROM turnos WHERE id_turno = ?',
                [reservaId]
            );
            return result;
        } catch (error) {
            console.error('Error en cancelarReserva (model):', error);
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