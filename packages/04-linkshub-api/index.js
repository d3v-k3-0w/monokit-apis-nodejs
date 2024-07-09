import 'dotenv/config'; // el dotenv se ejecuta al iniciar el servidor y lee los env
import './database/conxdb.js';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`🔥🔥🔥 http://localhost:${PORT}`);
});
