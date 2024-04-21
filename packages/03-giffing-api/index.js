import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { authMiddleware } from './middlewares/authMiddle.js';
import { userMiddleware } from './middlewares/userMiddle.js';
import { deleteFav, getFavs, postFav, postLogin, postRegister } from './routes.js';

//++ config puerto
const DEFAULT_PORT = 8080;
const port = process.env.PORT || DEFAULT_PORT;

//++ configurar dotenv
dotenv.config();

//++ crear una instancia de la app Express
const app = express();

//++ middlewares
app.use(express.json());
app.use(cors());

//++ rutas
app.post('/register', postRegister);
app.post('/login', postLogin);

app.use(userMiddleware); // middleware para adjuntar el usuario a req.currentUser mover después del login y register para que funcione
//++ rutas protegidas por autenticación
app.post('/favs/:id', authMiddleware, postFav);
app.get('/favs', authMiddleware, getFavs);
app.delete('/favs/:id', authMiddleware, deleteFav);

//++ manejar errores
// app.use((err, req, res, next) => {
// 	console.error(err.stack);
// 	res.status(500).send('Something broke!');
// });

//++ iniciar el servidor
app.listen(port, () => {
	console.log(`Server running in http://localhost:${port}`);
});
