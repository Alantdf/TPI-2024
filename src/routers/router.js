const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Redirigir la raíz a la página principal
router.get('/', (req, res) => {
    res.redirect('/index'); 
});

// Definir las rutas
router.get('/index', controller.index); 
router.get('/crear_cuenta', controller.crear_cuenta);
router.post('/crear-cuenta', controller.storeUser); // Ruta para la creación de cuentas
router.post('/login', controller.login); // Ruta para el inicio de sesión
router.get('/cursos_carga', controller.cursos_carga);
router.get('/inicio_admin', controller.inicio_admin);
router.get('/inicio_carga', controller.inicio_carga);
router.get('/inicio_usuario', controller.inicio_usuario);
router.get('/notas_71', controller.notas_71);
router.get('/notas_72', controller.notas_72);
router.get('/notas', controller.notas);
router.get('/perfil', controller.perfil);
router.post('/guardar-nota', controller.guardarNota);
router.post('/procesar-redireccion', controller.procesarRedireccion);
router.get('/logo-click', controller.redirigirPorLogo);

module.exports = router;
