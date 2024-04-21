export const authMiddleware = async (req, res, next) => {
	try {
		//++ verifica si hay un usuario en el objeto de solicitud
		if (req.currentUser) {
			await next(); //si hay un usuario, pasa al siguiente middleware
		} else {
			res.status(405).send('Unauthorized'); //si no hay un usuario, devuelve un código de estado 405 (Unauthorized)
		}
	} catch (error) {
		res.status(500).send('Internal Server Error'); //si hay algún error, devuelve un código de estado 500 (Internal Server Error)
	}
};
