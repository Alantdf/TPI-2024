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
router.get('/notas_Alan_Peralta', controller.notas_Alan_Peralta);
router.get('/notas', controller.notas);
router.get('/alumnos_7_2', controller.alumnos_7_2);
router.get('/perfil', controller.perfil);

module.exports = router;
