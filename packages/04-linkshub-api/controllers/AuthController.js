import { UserModel } from '../schemas/UserSchema.js';
import jwt from 'jsonwebtoken';

export const registerHandler = async (req, res) => {
	// console.log(req.body);

	const { email, password } = req.body;

	try {
		//++ buscamos al usuario por su email
		let user = await UserModel.findOne({ email });

		if (user) throw { code: 11000 };

		user = new UserModel({ email, password });

		await user.save();

		return res.status(201).json({ ok: 'registred' });
	} catch (err) {
		console.log(err.code);
		//++ alternativa por defecto mongoose
		if (err.code === 11000) {
			return res.status(400).json({ error: 'Ya existe este usuario' });
		}
		return res.status(500).json({ error: 'Error de servidor' });
	}
};

export const loginHandler = async (req, res) => {
	try {
		const { email, password } = req.body;

		let user = await UserModel.findOne({ email });

		if (!user) return res.status(403).json({ error: 'No existe este usuario' });

		//++ si los password coinciden devuelve true de lo contrario false
		const rptaPassword = await user.comparePassword(password);

		if (!rptaPassword) {
			return res.status(403).json({ error: 'Contraseña incorrecta' });
		}

		//++ generar el token JWT
		const token = jwt.sign({ uid: user._id }, process.env.KEY_SECRET);

		return res.json({ ok: 'loged', token });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Error de servidor' });
	}
};
