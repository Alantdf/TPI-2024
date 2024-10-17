const { db } = require('../database/db'); // Asegúrate de tener configurada la conexión a la base de datos

const Usuario = {};

// Función para encontrar un usuario por correo
Usuario.findByEmail = async (correo) => {
    try {
        const query = 'SELECT * FROM usuario WHERE correo = ?';
        const [rows] = await db.execute(query, [correo]);
        
        // Aquí se muestra el resultado de la consulta
        console.log('Filas encontradas:', rows); // Mover esta línea aquí para acceder a 'rows'
        
        return rows.length > 0 ? rows[0] : null; // Devuelve el primer usuario encontrado o null
    } catch (error) {
        console.error('Error al buscar el usuario por correo:', error.message); // Muestra el mensaje de error
        throw new Error(`No se pudo buscar el usuario: ${error.message}`); // Lanza un error más específico si falla la consulta
    }
};

// Función para crear un nuevo usuario
Usuario.create = async (nombre, correo, contrasena, tipo_usuario_id, curso_id, DNI) => {
    try {
        // Verificar si los parámetros están definidos
        if (!nombre || !correo || !contrasena || tipo_usuario_id === undefined || curso_id === undefined || !DNI) {
            throw new Error('Todos los campos son obligatorios y deben estar definidos.');
        }

        // Imprime los valores que se intentarán insertar
        console.log('Intentando crear usuario con los siguientes datos:', {
            nombre,
            correo,
            tipo_usuario_id,
            curso_id,
            DNI
        });

        // Verificar si el correo ya está en uso
        const existingUser = await Usuario.findByEmail(correo);
        if (existingUser) {
            throw new Error('El correo ya está registrado.'); // Lanza un error si el correo ya existe
        }

        // No se hashéa la contraseña, se almacena como texto claro
        console.log('Contraseña sin hash:', contrasena); // Imprime la contraseña sin hash

        const query = 'INSERT INTO usuario (nombre, correo, contrasena, tipo_usuario_id, curso_id, DNI) VALUES (?, ?, ?, ?, ?, ?)';
        await db.execute(query, [nombre, correo, contrasena, tipo_usuario_id, curso_id, DNI]); // Guarda la contraseña como texto claro
        console.log('Usuario creado exitosamente'); // Confirma la creación del usuario
    } catch (error) {
        console.error('Error al crear un nuevo usuario:', error.message); // Muestra el mensaje de error
        throw new Error(`No se pudo crear el usuario: ${error.message}`); // Lanza un error más descriptivo
    }
};

module.exports = Usuario;
