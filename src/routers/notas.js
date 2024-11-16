const express = require('express');
const router = express.Router();
const { guardarNota } = require('../models/notas'); // Importa la función del modelo

// Ruta para guardar la nota
router.post('/guardar-nota', async (req, res) => {
    const { alumno_id, materia_id, curso_id, nota, tipo_nota_id } = req.body;

    try {
        const resultado = await guardarNota(alumno_id, materia_id, curso_id, nota, tipo_nota_id);
        if (resultado.success) {
            // Redirigir a la página 'guardado.ejs' si la nota se guarda correctamente
            res.render('guardado', { message: resultado.message });
        } else {
            res.status(500).json({ error: resultado.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la nota' });
    }
});

module.exports = router;
