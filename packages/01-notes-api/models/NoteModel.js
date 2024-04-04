import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
	title: String,
	content: String,
	date: Date,
	important: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const NoteModel = mongoose.model('Note', noteSchema);

export default NoteModel;
