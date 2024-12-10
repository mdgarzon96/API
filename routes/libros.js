const express = require('express');
const router = express.Router();
const db = require('../config/mySQL');

// Obtener todos los libros
router.get('/', (req, res) => {
    const query = `
    SELECT Libros.*, Autores.nombre AS autor_nombre, Editoriales.nombre AS editorial_nombre
    FROM Libros
    JOIN Autores ON Libros.autor_id = Autores.autor_id
    JOIN Editoriales ON Libros.editorial_id = Editoriales.editorial_id
    `;
    db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    });
});

// Obtener un libro por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT Libros.*, Autores.nombre AS autor_nombre, Editoriales.nombre AS editorial_nombre
    FROM Libros
    JOIN Autores ON Libros.autor_id = Autores.autor_id
    JOIN Editoriales ON Libros.editorial_id = Editoriales.editorial_id
    WHERE Libros.libro_id = ?
    `;
    db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(results[0]);
    });
});

// Crear un nuevo libro
router.post('/', (req, res) => {
    const { titulo, autor_id, editorial_id, ano_publicacion, isbn, disponibilidad } = req.body;
    const query = `
    INSERT INTO Libros (titulo, autor_id, editorial_id, ano_publicacion, isbn, disponibilidad)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [titulo, autor_id, editorial_id, ano_publicacion, isbn, disponibilidad], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, titulo, autor_id, editorial_id, ano_publicacion, isbn, disponibilidad });
    });
});

// Actualizar un libro
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, autor_id, editorial_id, ano_publicacion, isbn, disponibilidad } = req.body;
    const query = `
    UPDATE Libros
    SET titulo = ?, autor_id = ?, editorial_id = ?, ano_publicacion = ?, isbn = ?, disponibilidad = ?
    WHERE libro_id = ?
    `;
    db.query(query, [titulo, autor_id, editorial_id, ano_publicacion, isbn, disponibilidad, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ message: 'Libro actualizado exitosamente' });
    });
});

// Eliminar un libro
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Libros WHERE libro_id = ?';
    db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ message: 'Libro eliminado exitosamente' });
    });
});

module.exports = router;
