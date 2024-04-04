import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const createToken = (id) => {
	//++ retornar el token firmado con el secret magic
	return jwt.sign({ id }, process.env.SECRET_MAGIC, {
		expiresIn: 60 * 60 * 24 * 7, // (seg,ms,hs,di) -> 7 días de expiracion del token
	});
};

export const createUser = async (req, res) => {
	try {
		const { email, name, password } = req.body;

		const saltRounds = 10; //complejidad algoritmica
		const passwordHash = await bcrypt.hash(password, saltRounds);

		// console.log('passwordHash:', passwordHash);

		const user = new UserModel({
			email,
			name,
			passwordHash,
		});

		const savedUser = await user.save();

		res.status(201).json(savedUser);
	} catch (err) {
		res.status(400).json(err.message);
	}
};

export const loginUser = async (req, res) => {
	//++ recuperamos el username y password de la peticion en body
	const { email, password } = req.body;

	//++ buscar al usuario en la db que este asociado con el email que se pasa en la req
	const user = await UserModel.findOne({ email });

	//++ si no se encontro al user (false) y si se encontro al user comparamos los pass
	const passwordCorrect =
		user === null ? false : await bcrypt.compare(password, user.passwordHash);

	//++ si el user y el pass no son correctos(no damos mucha info para que puedan encontrar las credenciales)
	if (!(user && passwordCorrect)) {
		//++ el uso del 'return' es crucial para segurarnos de no crear un token de nuevo y enviar otra res despues de esta
		return res.status(401).json({
			error: 'invalid user or password',
		});
	}

	const token = createToken(user._id);

	res.send({
		name: user.name,
		email: user.email,
		token,
	});
};

export const getUsers = async (req, res) => {
	//++ recuperar un usuario con todas su notas populadas(no es TRANSACTIONAL, no se bloquea,
	// esta operacion se hace mientras pueden ocurrir otras operaciones)
	const users = await UserModel.find({}).populate('notes', {
		content: 1,
		date: 1,
	});

	res.json(users);
};
