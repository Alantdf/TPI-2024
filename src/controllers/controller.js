const Usuario = require('../models/usuario'); // Asegúrate de que este archivo esté correctamente configurado
const bcrypt = require('bcrypt');
const controller = {};
const { guardarNota } = require('../models/notas'); // Importa la función del modelo
const { db } = require('../database/db');

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
    const { nombre, curso_id, correo, contrasena, alumno_id } = req.body; 
    const tipo_usuario_id = 1; // Valor por defecto para usuarios

    console.log('Función storeUser ejecutada. Datos recibidos:', req.body);

    if (!nombre || !curso_id || !correo || !contrasena || !alumno_id) {
        console.log('Error: Todos los campos son obligatorios.');
        return res.status(400).send('Todos los campos son obligatorios y deben estar definidos.');
    }

    try {
        console.log('Datos recibidos para crear usuario:', req.body);

        // Verifica si el usuario ya existe por DNI (alumno_id)
        const existingDNI = await Usuario.findByDNI(alumno_id);
        if (existingDNI) {
            console.log('Error: El usuario ya existe.');
            return res.status(400).send('El usuario ya existe');
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        await Usuario.create(nombre, correo, hashedPassword, tipo_usuario_id, curso_id, alumno_id);

        console.log('Nuevo usuario creado con éxito:', { nombre, correo });
        return res.redirect('/');
    } catch (error) {
        console.error('Error al crear la cuenta:', error.message);
        next(error);
    }
};

// Función para manejar el inicio de sesión
controller.login = async (req, res, next) => {
    const { alumno_id, contrasena } = req.body;

    try {
        console.log('Datos recibidos para inicio de sesión:', req.body);

        // Buscar al usuario por DNI (alumno_id)
        const usuario = await Usuario.findByDNI(alumno_id);

        if (!usuario) {
            console.log('Error: Usuario no encontrado.');
            return res.redirect('/?error=DNI o contraseña incorrectos');
        }

        console.log('Usuario encontrado:', usuario);

        // Comparar la contraseña ingresada con la contraseña hasheada
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!isMatch) {
            console.log('Error: Contraseña incorrecta.');
            return res.redirect('/?error=DNI o contraseña incorrectos');
        }

        // Si la contraseña es correcta, guarda el usuario en la sesión
        req.session.usuario = usuario;
        console.log('Usuario guardado en la sesión:', req.session.usuario); // Muestra el usuario guardado

        // Redirige según el tipo de usuario
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
    const usuario = req.session.usuario;
    
    // Verifica si el usuario está autenticado y si su rol es 2 (carga) o 3 (admin)
    if (!usuario || ![2, 3].includes(usuario.tipo_usuario_id)) {
        // Si no es ni carga ni admin, redirige a la página principal o de error
        return res.redirect('/');
    }
    
    return res.render('notas_71', { usuario }) 
};

// Renderiza la página para alumnos de 7° 2ª
controller.notas_72 = async (req, res) => {
    const usuario = req.session.usuario;
    
    // Verifica si el usuario está autenticado y si su rol es 2 (carga) o 3 (admin)
    if (!usuario || ![2, 3].includes(usuario.tipo_usuario_id)) {
        // Si no es ni carga ni admin, redirige a la página principal o de error
        return res.redirect('/');
    }
    
    return res.render('notas_72', { usuario }) 
};

// Renderiza la página de carga de cursos
controller.cursos_carga = async (req, res) => {
    const usuario = req.session.usuario;
    
    // Verifica si el usuario está autenticado y si su rol es 2 (carga) o 3 (admin)
    if (!usuario || ![2, 3].includes(usuario.tipo_usuario_id)) {
        // Si no es ni carga ni admin, redirige a la página principal o de error
        return res.redirect('/');
    }
    
    return res.render('cursos_carga', { usuario });
};

// Renderiza la página de inicio para administradores
controller.inicio_admin = async (req, res) => {
    const usuario = req.session.usuario;
    
    // Verifica si el usuario está autenticado
    if (!usuario || usuario.tipo_usuario_id !== 3) {
        // Si no es admin, redirige a la página principal o de error
        return res.redirect('/');
    }
    
    return res.render('inicio_admin', { usuario });
};

// Renderiza la página de inicio de carga
controller.inicio_carga = async (req, res) => {
    const usuario = req.session.usuario;
    
    // Verifica si el usuario está autenticado
    if (!usuario || usuario.tipo_usuario_id !== 2) {
        // Si no es admin, redirige a la página principal o de error
        return res.redirect('/');
    }
    
    return res.render('inicio_carga', { usuario }); 
};

// Renderiza la página de inicio para usuarios
controller.inicio_usuario = async (req, res) => {
    const usuario = req.session.usuario;
    
    // Verifica si el usuario está autenticado
    if (!usuario || usuario.tipo_usuario_id !== 1) {
        // Si no es admin, redirige a la página principal o de error
        return res.redirect('/');
    }
    
    return res.render('inicio_usuario', { usuario }); 
};

// Renderiza la página de notas
controller.notas = async (req, res) => {
    const usuario = req.session.usuario;

    // Verifica si el usuario está en la sesión
    if (!usuario || usuario.tipo_usuario_id !== 1) {
        // Si no es admin, redirige a la página principal o de error
        return res.redirect('/');
    }

    const alumno_id = usuario.alumno_id;  // Asegúrate de obtener el DNI del usuario desde la sesión

    try {
        // Llama a la función para obtener las notas
        const notas = await getNotasAlumno(alumno_id);
        console.log("Notas obtenidas:", notas);

        // Renderiza la vista pasando las notas obtenidas
        return res.render('notas', { notas });
    } catch (error) {
        console.error("Error al obtener las notas:", error.message);
        return res.status(500).send("Error al obtener las notas");
    }
};

// Renderiza la página de perfil y pasa el objeto usuario a la vista
controller.perfil = async (req, res) => {
    const usuario = req.session.usuario; // Asegúrate de que el usuario está en la sesión

    if (!usuario) {
        return res.redirect('/'); // Redirige a la página principal si no hay usuario en la sesión
    }

    return res.render('perfil', { usuario }); // Pasa el objeto usuario a la vista
};

// Función para manejar la inserción de notas
controller.guardarNota = async (req, res) => {
    const { alumno_id, materia_id, curso_id, nota, tipo_nota_id } = req.body;

    try {
        const resultado = await guardarNota(alumno_id, materia_id, curso_id, nota, tipo_nota_id);
        if (resultado.success) {
            res.render('guardado', { message: resultado.message });
        } else {
            res.status(500).json({ error: resultado.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la nota' });
    }
};

// Función para procesar la redirección después de guardar la nota
controller.procesarRedireccion = async (req, res) => {
    const { accion } = req.body;

    // Verifica si el usuario está autenticado
    if (!req.session.usuario) {
        console.log('Error: Usuario no autenticado');
        return res.redirect('/login');
    }

    const usuario = req.session.usuario;

    // Si la acción es "Sí", redirige a cargar otra nota
    if (accion === 'si') {
        console.log('Redirigiendo a cursos_carga...');
        return res.redirect('/cursos_carga');
    } 
    
    // Si la acción es "No", redirige según el rol del usuario
    if (accion === 'no') {
        switch (usuario.tipo_usuario_id) {
            case 2:
                console.log('Redirigiendo a inicio de carga...');
                return res.redirect('/inicio_carga');
            case 3:
                console.log('Redirigiendo a inicio de admin...');
                return res.redirect('/inicio_admin');
            default:
                console.log('Redirigiendo a inicio de usuario...');
                return res.redirect('/inicio_usuario');
        }
    }
};

// Función para manejar la redirección al hacer clic en el logo
controller.redirigirPorLogo = (req, res) => {
    // Verifica si el usuario está autenticado
    if (!req.session.usuario) {
        console.log('Error: Usuario no autenticado');
        return res.redirect('/');
    }

    const usuario = req.session.usuario;

    // Redirige según el tipo de usuario
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
};

const getNotasAlumno = async (alumno_id) => {
    try {
        const query = `
            SELECT 
                n.nota, 
                m.nombre_materia AS materia, 
                t.tipo_nota
            FROM 
                nota n
            JOIN 
                materia m ON n.materia_id = m.materia_id
            JOIN 
                tipo_nota t ON n.tipo_nota_id = t.tipo_nota_id
            WHERE 
                n.alumno_id = ?
        `;
        const [rows] = await db.execute(query, [alumno_id]);
        return rows; // Devolver todas las notas correspondientes al alumno
    } catch (error) {
        console.error("Error al obtener las notas:", error.message);
        throw new Error("No se pudieron cargar las notas.");
    }
};

module.exports = { getNotasAlumno };
module.exports = controller; // Asegúrate de exportar el controlador
