import 'dotenv/config.js'; //importar el archivo .env
import './database/db-mongo.js'; //importar la conexion a mongodb

import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import noteRouter from './routes/note.route.js';

const app = express();

//++ config cors
app.use(cors());

//++ soportar json parseando en la request body
app.use(express.json());

//++ routes
app.get('/', (req, res) => {
	res.send({ message: 'Server Runing...' });
});

app.use('/api', userRouter);
app.use('/api', noteRouter);

/*
 *no usar userExtractor para todas las rutas '/api'.
 *causa problemas con la creación de usuarios, ya que requiere autenticación.
 *aplicar solo a rutas específicas que necesiten autenticación.*/
// app.use('/api',userExtractor, notesRouter);

//++ obtener el puerto del entorno
const PORT = process.env.PORT;

//++ iniciar el servidor
const server = app.listen(PORT, () => {
	console.log(`Server running on: 'http://localhost:${PORT}' `);
});

export default { app, server };
