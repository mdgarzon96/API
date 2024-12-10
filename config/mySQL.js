const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: '127.0.0.1',       // tu host de MySQL
    user: 'root',       // Usuario de MySQL
    password:'r00t1234', // Contraseña de MySQL
    database: 'biblioteca_gestion', // Nombre de la base de datos
    port: 3306                 
});

// Verificar conexión
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1);
    } else {
        console.log('Conexión exitosa a la base de datos.');
    }
});

module.exports = connection;
