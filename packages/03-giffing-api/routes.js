import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const postRegister = async (req, res) => {
	const { username, password } = req.body;

	try {
		//++ verificar si el usuario ya existe en la base de datos
		const existingUserResponse = await axios.get(
			`http://localhost:3000/usuarios?username=${username}`
		);

		if (existingUserResponse.data.length > 0) {
			res.status(409).send('El usuario ya existe');
			return;
		}

		//++ hashear la contraseña antes de guardarla en la base de datos; 10 es el número de rondas de hashing
		const hashedPassword = hashSync(password, 10);

		//++ guardar el usuario en la db.json; guardar con la contraseña hasheada en lugar de la contraseña en texto plano
		await axios.post(`http://localhost:3000/usuarios`, { username, password: hashedPassword });

		//++ inicializar los favoritos del usuario
		// await axios.post(`http://localhost:3000/favs`, { [username]: [] });

		res.status(201).send();
	} catch (error) {
		res.status(500).send('Error registering user');
	}
};

export const postLogin = async (req, res) => {
	const { username, password } = req.body;

	try {
		//++ realiza una solicitud GET a JSON Server para obtener los datos del usuario
		const response = await axios.get(`http://localhost:3000/usuarios?username=${username}`);
		const user = response.data[0]; //el primer usuario que coincida con el nombre de usuario

		//++ verifica si el usuario existe y si la contraseña coincide
		if (!user || !compareSync(password, user.password)) {
			res.status(403).send('Credenciales inválidas');
			return;
		}

		//++ genera el token JWT
		const payload = {
			iss: user.username,
			exp: Math.floor(Date.now() / 1000) + 60 * 60, //token válido por 1 hora
		};
		const token = jwt.sign(payload, process.env.JWT_KEY); //asegúrate de tener configurada la clave JWT

		//++ configura el encabezado de autorización para incluir el token JWT
		res.set('Authorization', `Bearer ${token}`);

		//++ devuelve el token como respuesta
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).send('Error logging in');
	}
};

export const postFav = async (req, res) => {
	try {
		const { id } = req.params;
		const { username } = req.currentUser;

		console.log(username);

		// Agrega el nuevo favorito al estado local de favoritos del usuario
		await axios.post(`http://localhost:3000/favs`, { username, id });

		// Obtiene todos los favoritos del usuario
		const response = await axios.get(`http://localhost:3000/favs`);

		console.log('SOY RESPONSE', response.data);

		const userFavs = response.data
			.filter((fav) => fav.username === username)
			.map((fav) => fav.id);

		console.log({
			username,
			id,
		});

		// Devuelve la respuesta con los favoritos actualizados
		return res.status(201).json({ favs: userFavs });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Error posting fav');
	}
};

export const getFavs = async (req, res) => {
	try {
		const response = await axios.get(`http://localhost:3000/favs`);

		res.status(200).json({ favs: response.data });
	} catch (error) {
		res.status(500).send('Error fetching favs');
	}
};

export const deleteFav = async (req, res) => {
	const { id } = req.params;
	const { username } = req.currentUser;

	try {
		await axios.delete(`http://localhost:3000/favs/${id}`);
		res.status(200).send();
	} catch (error) {
		res.status(500).send('Error deleting fav');
	}
};
