const Usuario = require('../models/usuario'); // Asegúrate de que este archivo esté correctamente configurado

const controller = {};

// Renderiza la página principal (login)
controller.index = async (req, res) => {
    const errorMessage = req.query.error || null; // Captura el mensaje de error si existe
    return res.render('index', { error: errorMessage });
};

// Renderiza la página de creación de cuenta
controller.crear_cuenta = async (req, res) => {
    return res.render('crear_cuenta');
};

// Guarda un nuevo usuario
controller.storeUser = async (req, res, next) => {
    const { nombre, curso_id, correo, contrasena, DNI } = req.body; 
    const tipo_usuario_id = 1; // Valor por defecto

    console.log('Función storeUser ejecutada. Datos recibidos:', req.body);

    // Verifica si todos los campos están definidos
    if (!nombre || !curso_id || !correo || !contrasena || !DNI) {
        console.log('Error: Todos los campos son obligatorios.');
        return res.status(400).send('Todos los campos son obligatorios y deben estar definidos.');
    }

    try {
        // Log para depuración
        console.log('Datos recibidos para crear usuario:', req.body);

        // Verifica si el usuario ya existe
        const existingUser = await Usuario.findByEmail(correo);
        if (existingUser) {
            console.log('Error: El usuario ya existe.');
            return res.status(400).send('El usuario ya existe'); // Puedes cambiar esto por un renderizado si es necesario
        }

        // Crea el nuevo usuario (sin encriptar la contraseña)
        await Usuario.create(nombre, correo, contrasena, tipo_usuario_id, curso_id, DNI);

        console.log('Nuevo usuario creado con éxito:', { nombre, correo });

        // Redirigir a la página principal después de crear la cuenta
        return res.redirect('/'); 
    } catch (error) {
        console.error('Error al crear la cuenta:', error.message);
        next(error); // Pasa el error al middleware de manejo de errores
    }
};

// Función para manejar el inicio de sesión
controller.login = async (req, res, next) => {
    const { correo, contrasena } = req.body;

    try {
        // Log para depuración
        console.log('Datos recibidos para inicio de sesión:', req.body);

        // Busca el usuario por correo
        const usuario = await Usuario.findByEmail(correo);
        if (!usuario) {
            console.log('Error: Usuario no encontrado.');
            return res.redirect('/?error=Correo o contraseña incorrectos'); // Redirige con un mensaje de error
        }

        console.log('Usuario encontrado:', usuario);

        // Compara la contraseña ingresada con la almacenada
        const isMatch = (contrasena === usuario.contrasena); // Compara sin hash
        if (!isMatch) {
            console.log('Error: Contraseña incorrecta.');
            return res.redirect('/?error=Correo o contraseña incorrectos'); // Redirige con un mensaje de error
        }

        // Redirigir según el rol del usuario
        switch (usuario.tipo_usuario_id) {
            case 1:
                console.log('Redirigiendo a inicio de usuario...');
                return res.redirect('/inicio_usuario'); 
            case 2:
                console.log('Redirigiendo a inicio de carga...');
                return res.redirect('/inicio_carga'); 
            case 3:
                console.log('Redirigiendo a inicio de admin...');
                return res.redirect('/inicio_admin'); 
            default:
                console.log('Redirigiendo a página principal por defecto...');
                return res.redirect('/'); // Redirigir a página principal por defecto
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        return res.redirect('/?error=Ocurrió un error al iniciar sesión'); // Redirige con un mensaje de error
    }
};

// Renderiza la página para alumnos de 7° 2ª
controller.alumnos_7_2 = async (req, res) => {
    return res.render('alumnos_7_2'); 
};

// Renderiza la página de carga de cursos
controller.cursos_carga = async (req, res) => {
    return res.render('cursos_carga'); 
};

// Renderiza la página de inicio para administradores
controller.inicio_admin = async (req, res) => {
    return res.render('inicio_admin'); 
};

// Renderiza la página de inicio de carga
controller.inicio_carga = async (req, res) => {
    return res.render('inicio_carga'); 
};

// Renderiza la página de inicio para usuarios
controller.inicio_usuario = async (req, res) => {
    return res.render('inicio_usuario'); 
};

// Renderiza la página de notas para Alan Peralta
controller.notas_Alan_Peralta = async (req, res) => {
    return res.render('notas_Alan_Peralta'); 
};

// Renderiza la página de notas
controller.notas = async (req, res) => {
    return res.render('notas'); 
};

module.exports = controller; // Asegúrate de exportar el controlador
