const { db } = require('../database/db'); // Extrae directamente el pool desde el objeto exportado

// Función para guardar una nota en la base de datos
async function guardarNota(alumno_id, materia_id, curso_id, nota, tipo_nota_id) {
    try {
        await db.query(
            'INSERT INTO Nota (alumno_id, materia_id, curso_id, nota, tipo_nota_id) VALUES (?, ?, ?, ?, ?)',
            [alumno_id, materia_id, curso_id, nota, tipo_nota_id]
        );
        return { success: true, message: 'Nota guardada exitosamente' };
    } catch (error) {
        console.error('Error al guardar la nota:', error);
        return { success: false, error: 'Hubo un problema al guardar la nota' };
    }
}

module.exports = {
    guardarNota
};
