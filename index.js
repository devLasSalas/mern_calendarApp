const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { dbConnection } = require('./database/config');

//*Creacion del servidor de express
const app = express();

//*Base de datos
dbConnection();

//*Variables de entorno - Puerto
const PORT = process.env.PORT || 4000;

//*Ruta publica
app.use(express.static('public'));

//*Cors
app.use( cors() );

//* Permitir json
app.use( express.json() );

//*Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


app.listen(PORT, () => {
    console.log('Servidor levantado en el puerto' + PORT)
});