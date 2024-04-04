import mongoose from 'mongoose';

const { MONGO_URI, MONGO_TEST, NODE_ENV } = process.env;

const connString = NODE_ENV === 'test' ? MONGO_TEST : MONGO_URI;

//++ conectar a mongoDB
mongoose
	.connect(connString)
	.then(() => {
		console.log('Database connected 😎😎!!');
	})
	.catch((err) => {
		console.log('Error ❌' + err.message);
	});
