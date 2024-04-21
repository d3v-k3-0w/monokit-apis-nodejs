import jwt from 'jsonwebtoken';
import axios from 'axios';

export const userMiddleware = async (req, res, next) => {
	try {
		//++ obtiene el token JWT del encabezado de autorización
		const token = req.headers.authorization.replace('Bearer ', ''); // remueve 'Bearer ' del token

		//++ verifica y valida el token JWT
		const decoded = jwt.verify(token, process.env.JWT_KEY);

		//++ realiza una solicitud GET a JSON Server para obtener los datos del usuario
		const response = await axios.get(`http://localhost:3000/usuarios?username=${decoded.iss}`);
		const user = response.data[0]; // el primer usuario que coincida con el nombre de usuario en el token

		if (user) {
			//++ si se encuentra el usuario, lo adjunta al objeto de solicitud y continúa con el siguiente middleware
			req.currentUser = user;
			next();
		} else {
			//++ si no se encuentra el usuario, devuelve un error de acceso no autorizado (401)
			res.status(401).send('Unauthorized');
		}
	} catch (error) {
		//++ si hay algún error al verificar el token o al hacer la solicitud a JSON Server, devuelve un error de acceso no autorizado (401)
		res.status(401).send('Unauthorized');
	}
};
