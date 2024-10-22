const Usuario = require('../models/usuario'); // Asegúrate de que este archivo esté correctamente configurado
const bcrypt = require('bcrypt');
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

    if (!nombre || !curso_id || !correo || !contrasena || !DNI) {
        console.log('Error: Todos los campos son obligatorios.');
        return res.status(400).send('Todos los campos son obligatorios y deben estar definidos.');
    }

    try {
        console.log('Datos recibidos para crear usuario:', req.body);

        // Verifica si el usuario ya existe
        const existingUser = await Usuario.findByEmail(correo);
        if (existingUser) {
            console.log('Error: El usuario ya existe.');
            return res.status(400).send('El usuario ya existe');
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        await Usuario.create(nombre, correo, hashedPassword, tipo_usuario_id, curso_id, DNI);

        console.log('Nuevo usuario creado con éxito:', { nombre, correo });
        return res.redirect('/'); 
    } catch (error) {
        console.error('Error al crear la cuenta:', error.message);
        next(error);
    }
};

// Función para manejar el inicio de sesión
controller.login = async (req, res, next) => {
    const { correo, contrasena } = req.body;

    try {
        console.log('Datos recibidos para inicio de sesión:', req.body);

        const usuario = await Usuario.findByEmail(correo);
        if (!usuario) {
            console.log('Error: Usuario no encontrado.');
            return res.redirect('/?error=Correo o contraseña incorrectos');
        }

        console.log('Usuario encontrado:', usuario);

        // Comparar la contraseña ingresada con la contraseña hasheada
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!isMatch) {
            console.log('Error: Contraseña incorrecta.');
            return res.redirect('/?error=Correo o contraseña incorrectos');
        }

        req.session.usuario = usuario;

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
                return res.redirect('/');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        return res.redirect('/?error=Ocurrió un error al iniciar sesión');
    }
};


// Renderiza la página para alumnos de 7° 1ª
controller.notas_71 = async (req, res) => {
    return res.render('notas_71'); 
};

// Renderiza la página para alumnos de 7° 2ª
controller.notas_72 = async (req, res) => {
    return res.render('notas_72'); 
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

// Renderiza la página de notas
controller.notas = async (req, res) => {
    return res.render('notas'); 
};

// Renderiza la página de perfil y pasa el objeto usuario a la vista
controller.perfil = async (req, res) => {
    const usuario = req.session.usuario; // Asegúrate de que el usuario está en la sesión

    if (!usuario) {
        return res.redirect('/'); // Redirige a la página principal si no hay usuario en la sesión
    }

    return res.render('perfil', { usuario }); // Pasa el objeto usuario a la vista
};

module.exports = controller; // Asegúrate de exportar el controlador
