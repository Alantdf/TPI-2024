const { db } = require('../database/db'); // Asegúrate de tener configurada la conexión a la base de datos

const Usuario = {};

// Función para encontrar un usuario por alumno_id
Usuario.findByDNI = async (alumno_id) => {
    try {
        const query = 'SELECT * FROM usuario WHERE alumno_id = ?';
        const [rows] = await db.execute(query, [alumno_id]);

        if (rows.length > 0) {
            return rows[0]; // Devuelve el primer usuario encontrado
        }
        return null; // Si no hay coincidencia, devuelve null
    } catch (error) {
        console.error('Error al buscar el usuario por DNI:', error.message);
        throw new Error(`No se pudo buscar el usuario: ${error.message}`);
    }
};

// Función para crear un nuevo usuario
Usuario.create = async (nombre, correo, contrasena, tipo_usuario_id, curso_id, alumno_id) => {
    try {
        // Verificar si los parámetros están definidos
        if (!nombre || !correo || !contrasena || tipo_usuario_id === undefined || curso_id === undefined || !alumno_id) {
            throw new Error('Todos los campos son obligatorios y deben estar definidos.');
        }

        // Imprime los valores que se intentarán insertar
        console.log('Intentando crear usuario con los siguientes datos:', {
            nombre,
            correo,
            tipo_usuario_id,
            curso_id,
            alumno_id
        });

        const query = 'INSERT INTO usuario (nombre, correo, contrasena, tipo_usuario_id, curso_id, alumno_id) VALUES (?, ?, ?, ?, ?, ?)';
        await db.execute(query, [nombre, correo, contrasena, tipo_usuario_id, curso_id, alumno_id]); // Guarda la contraseña como texto claro
        console.log('Usuario creado exitosamente'); // Confirma la creación del usuario
    } catch (error) {
        console.error('Error al crear un nuevo usuario:', error.message); // Muestra el mensaje de error
        throw new Error(`No se pudo crear el usuario: ${error.message}`); // Lanza un error más descriptivo
    }
};

module.exports = Usuario;
