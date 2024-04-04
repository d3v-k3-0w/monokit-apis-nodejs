import jwt from 'jsonwebtoken';

export default (req, res, next) => {
	//++ recuperar el header authorization de la petición
	const auth = req.get('authorization');

	let token = null;

	//++ si hay autorization y ademas estamos utilizando el esquema de autenticacion que empiece con la palabra bearer
	if (auth && auth.toLowerCase().startsWith('bearer')) {
		//++ recuperamos el token que empieza a partir del septimo caracter ("Bearer .sdfjkdsd3rf412df")
		token = auth.substring(7);
	}

	//++ decodificar y verificar el token con el secret magic
	const decodedToken = jwt.verify(token, process.env.SECRET_MAGIC);

	// ++ si no tenemos el token o del token decodificado no tenemos el id del usuario
	if (!token || !decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}

	//++ destructuro la prop id del decodedToken y le pongo un Alias userId
	const { id: userId } = decodedToken;

	//++ adjuntar userId a la solicitud, para acceder al userId sin tener que decodificar de nuevo el token
	req.userId = userId;

	//++ avanzar al siguiente middleware/controlador
	next();
};
