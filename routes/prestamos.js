const express = require('express');
const router = express.Router();
const db = require('../config/mySQL');

// Obtener todos los préstamos
router.get('/', (req, res) => {
    const query = `
    SELECT Prestamos.*, Usuarios.nombre AS usuario_nombre, Libros.titulo AS libro_titulo
    FROM Prestamos
    JOIN Usuarios ON Prestamos.usuario_id = Usuarios.usuario_id
    JOIN Libros ON Prestamos.libro_id = Libros.libro_id
    `;
    db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// Obtener un préstamo por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT Prestamos.*, Usuarios.nombre AS usuario_nombre, Libros.titulo AS libro_titulo
    FROM Prestamos
    JOIN Usuarios ON Prestamos.usuario_id = Usuarios.usuario_id
    JOIN Libros ON Prestamos.libro_id = Libros.libro_id
    WHERE Prestamos.prestamo_id = ?
    `;
    db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json(results[0]);
    });
});

// Crear un nuevo préstamo
router.post('/', (req, res) => {
    const { usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado } = req.body;
    db.query('INSERT INTO Prestamos (usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado) VALUES (?, ?, ?, ?, ?)',
    [usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado });
    });
});

// Actualizar un préstamo
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado } = req.body;
    db.query('UPDATE Prestamos SET usuario_id = ?, libro_id = ?, fecha_prestamo = ?, fecha_devolucion = ?, estado = ? WHERE prestamo_id = ?',
    [usuario_id, libro_id, fecha_prestamo, fecha_devolucion, estado, id],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Préstamo no encontrado' });
        res.json({ message: 'Préstamo actualizado exitosamente' });
    });
});

// Eliminar un préstamo
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Prestamos WHERE prestamo_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Préstamo no encontrado' });
    res.json({ message: 'Préstamo eliminado exitosamente' });
    });
});

module.exports = router;
