const express = require('express');
const router = express.Router();
const db = require('../config/mySQL');

// Obtener todas las editoriales
router.get('/', (req, res) => {
  db.query('SELECT * FROM Editoriales', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// Obtener una editorial por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Editoriales WHERE editorial_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Editorial no encontrada' });
    res.json(results[0]);
    });
});

// Crear una nueva editorial
router.post('/', (req, res) => {
    const { nombre, direccion, telefono } = req.body;
    db.query('INSERT INTO Editoriales (nombre, direccion, telefono) VALUES (?, ?, ?)',
    [nombre, direccion, telefono],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, direccion, telefono });
    });
});

// Actualizar una editorial
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;
    db.query('UPDATE Editoriales SET nombre = ?, direccion = ?, telefono = ? WHERE editorial_id = ?',
    [nombre, direccion, telefono, id],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Editorial no encontrada' });
        res.json({ message: 'Editorial actualizada exitosamente' });
    });
});

// Eliminar una editorial
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Editoriales WHERE editorial_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Editorial no encontrada' });
    res.json({ message: 'Editorial eliminada exitosamente' });
    });
});

module.exports = router;
