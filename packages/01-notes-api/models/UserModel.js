import mongoose from 'mongoose';
import uniqueValidate from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
	email: { type: String, unique: true },
	name: String,
	passwordHash: String,
	notes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Note',
		},
	],
});

//++ transformar el documento de usuario a JSON, cambiando el nombre de _id a id y excluyendo campos confidenciales
userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

userSchema.plugin(uniqueValidate);

//++ User es el nombre que Mongoose usará para referirse a ese modelo en otras partes de tu app
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
