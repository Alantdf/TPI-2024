const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos
const db = mysql.createPool({
    host: 'localhost', // Cambia esto si tu base de datos está en otro servidor
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'techfix', // Cambia esto por el nombre de tu base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para cerrar la conexión (opcional, dependiendo de tu uso)
const closeConnection = async () => {
    try {
        await db.end(); // Cierra el grupo de conexiones
        console.log('Conexiones a la base de datos cerradas.');
    } catch (error) {
        console.error('Error al cerrar las conexiones a la base de datos:', error);
    }
};

// Exporta la conexión y la función de cierre
module.exports = {
    db, // Exporta la conexión
    closeConnection // Exporta la función de cierre si decides usarla en el futuro
};
