const express = require('express');
const router = express.Router();
const db = require('../config/mySQL');

// Obtener todas las multas
router.get('/', (req, res) => {
    const query = `
    SELECT Multas.*, Prestamos.prestamo_id, Prestamos.fecha_prestamo
    FROM Multas
    JOIN Prestamos ON Multas.prestamo_id = Prestamos.prestamo_id
    `;
    db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// Obtener una multa por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT Multas.*, Prestamos.prestamo_id, Prestamos.fecha_prestamo
    FROM Multas
    JOIN Prestamos ON Multas.prestamo_id = Prestamos.prestamo_id
    WHERE Multas.multa_id = ?
    `;
    db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Multa no encontrada' });
    res.json(results[0]);
    });
});

// Crear una nueva multa
router.post('/', (req, res) => {
    const { prestamo_id, cantidad, fecha_multa, estado } = req.body;
    db.query('INSERT INTO Multas (prestamo_id, cantidad, fecha_multa, estado) VALUES (?, ?, ?, ?)',
    [prestamo_id, cantidad, fecha_multa, estado],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, prestamo_id, cantidad, fecha_multa, estado });
    });
});

// Actualizar una multa
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { prestamo_id, cantidad, fecha_multa, estado } = req.body;
    db.query('UPDATE Multas SET prestamo_id = ?, cantidad = ?, fecha_multa = ?, estado = ? WHERE multa_id = ?',
    [prestamo_id, cantidad, fecha_multa, estado, id],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Multa no encontrada' });
        res.json({ message: 'Multa actualizada exitosamente' });
    });
});

// Eliminar una multa
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Multas WHERE multa_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Multa no encontrada' });
    res.json({ message: 'Multa eliminada exitosamente' });
    });
});

module.exports = router;
