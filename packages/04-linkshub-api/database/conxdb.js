import mongoose from 'mongoose';

try {
	await mongoose.connect(process.env.URI_MONGO);
	console.log('connect successfully!!😎');
} catch (err) {
	console.log('error fatality 💣 ' + err);
}
