const express = require('express');
const router = express.Router();
const db = require('../config/mySQL');

// Obtener todas las categorías
router.get('/', (req, res) => {
  db.query('SELECT * FROM Categorías', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// Obtener una categoría por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Categorías WHERE categoria_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(results[0]);
    });
});

// Crear una nueva categoría
router.post('/', (req, res) => {
    const { nombre, descripcion } = req.body;
    db.query('INSERT INTO Categorías (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, descripcion });
    });
});

// Actualizar una categoría
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    db.query('UPDATE Categorías SET nombre = ?, descripcion = ? WHERE categoria_id = ?',
    [nombre, descripcion, id],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json({ message: 'Categoría actualizada exitosamente' });
    });
});

// Eliminar una categoría
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Categorías WHERE categoria_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada exitosamente' });
    });
});

module.exports = router;
