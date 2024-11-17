const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./routers/router'); // Asegúrate de que esta ruta sea correcta

// Crea una instancia de Express
const app = express();
const PORT = process.env.PORT || 3000; // Usar variable de entorno para el puerto

// Configuración de la carpeta de vistas
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que esta línea esté aquí

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Añade soporte para JSON si es necesario
app.use(session({
    secret: 'd3f4u1tS3cretF0rMyApp', // Cambia a un secreto más seguro en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public'))); // Ajusta la ruta para acceder a la carpeta public

// Configuración del motor de plantillas
app.set('view engine', 'ejs'); // Asegúrate de tener EJS instalado

// Rutas
app.use('/', router);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});