const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/usuarios', require('./routes/usuarios'));
app.use('/autores', require('./routes/autores'));
app.use('/editoriales', require('./routes/editoriales'));
app.use('/libros', require('./routes/libros'));
app.use('/categorias', require('./routes/categorias'));
app.use('/prestamos', require('./routes/prestamos'));
app.use('/multas', require('./routes/multas'));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
