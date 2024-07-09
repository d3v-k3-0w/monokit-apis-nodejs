import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
	email: {
		type: String,
		require: true,
		trim: true,
		unique: true,
		lowercase: true,
		index: { unique: true },
	},
	password: {
		type: String,
		required: true,
	},
});

//++ antes de guardar en la bd hasheara el pass
userSchema.pre('save', async function (next) {
	const user = this;
	//++ va preguntar si esta modificando o si esta creando por primera vez
	if (!user.isModified('password')) return next();

	try {
		const salt = await bcryptjs.genSalt(10);
		user.password = await bcryptjs.hash(user.password, salt);
		next();
	} catch (err) {
		console.log(err);
		throw new Error('Falló el hash de contraseña');
	}
});

userSchema.methods.comparePassword = async function (frontPassword) {
	return await bcryptjs.compare(frontPassword, this.password);
};

export const UserModel = model('User', userSchema);
