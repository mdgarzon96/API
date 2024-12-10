const express = require('express');
const router = express.Router();
const db = require('../config/mySQL');

// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.query('SELECT * FROM Usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Usuarios WHERE usuario_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
    });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
    const { nombre, email, telefono, direccion, fecha_registro } = req.body;
    db.query('INSERT INTO Usuarios (nombre, email, telefono, direccion, fecha_registro) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, telefono, direccion, fecha_registro],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, email, telefono, direccion, fecha_registro });
    });
});

// Actualizar un usuario
router.put('/:id', (req, res) => {
    const { nombre, email, telefono, direccion, fecha_registro } = req.body;
    db.query('UPDATE Usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ?, fecha_registro = ? WHERE usuario_id = ?',
    [nombre, email, telefono, direccion, fecha_registro, req.params.id],
    (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario actualizado exitosamente' });
    });
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Usuarios WHERE usuario_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado exitosamente' });
    });
});

module.exports = router;
