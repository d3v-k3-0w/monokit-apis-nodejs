import 'dotenv/config'; // el dotenv se ejecuta al iniciar el servidor y lee los env
import express from 'express';
import './database/conxdb.js';
import authRouter from './routers/AuthRouter.js';

const app = express();

app.use(express.json()); // habilitar que express pueda leer las req en json

app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`🔥🔥🔥 http://localhost:${PORT}`);
});
