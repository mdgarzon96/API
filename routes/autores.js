const express = require('express');
const router = express.Router();
const db = require('../config/mySQL');

// Obtener todos los autores
router.get('/', (req, res) => {
  db.query('SELECT * FROM Autores', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// Obtener un autor por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Autores WHERE autor_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(results[0]);
    });
});

// Crear un nuevo autor
router.post('/', (req, res) => {
    const { nombre, apellido, fecha_nacimiento, nacionalidad } = req.body;
    db.query('INSERT INTO Autores (nombre, apellido, fecha_nacimiento, nacionalidad) VALUES (?, ?, ?, ?)',
    [nombre, apellido, fecha_nacimiento, nacionalidad],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, apellido, fecha_nacimiento, nacionalidad });
    });
});

// Actualizar un autor
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento, nacionalidad } = req.body;
    db.query('UPDATE Autores SET nombre = ?, apellido = ?, fecha_nacimiento = ?, nacionalidad = ? WHERE autor_id = ?',
    [nombre, apellido, fecha_nacimiento, nacionalidad, id],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Autor no encontrado' });
        res.json({ message: 'Autor actualizado exitosamente' });
    });
});

// Eliminar un autor
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Autores WHERE autor_id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json({ message: 'Autor eliminado exitosamente' });
    });
});

module.exports = router;
