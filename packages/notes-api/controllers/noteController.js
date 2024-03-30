import UserModel from '../models/UserModel.js';
import NoteModel from '../models/NoteModel.js';

export const createNote = async (req, res, next) => {
	//++ extraer campos del cuerpo de la solicitud
	const { title, content, important = false } = req.body;

	//++ extraer userId de la solicitud, que se estableció en userExtractorMiddle
	const { userId } = req;

	//++ buscar al usuario en la db y almacenarlo en user
	const user = await UserModel.findById(userId);

	//++ verificar que se proporcionó el contenido de la nota
	if (!content) {
		return res.status(400).json({
			error: 'note content is missing',
		});
	}

	//++ crear una nueva nota
	const newNote = new NoteModel({
		title,
		content,
		date: new Date().toISOString(),
		important,
		user: user._id,
	});

	try {
		//++ guardar la nueva nota en la db
		const savedNote = await newNote.save();

		//++ concatenar la nueva nota y como todavia no es JSON accedemos a _id con el guion
		user.notes = user.notes.concat(savedNote._id);

		//++ guardar el usuario despues de crear una nueva nota para actualizar la lista de notas del usuario
		await user.save();

		//++ enviar la nota guardada como respuesta
		res.json(savedNote);
	} catch (err) {
		next(err);
	}

	// newNote
	// 	.save()
	// 	.then((savedNote) => res.json(savedNote))
	// 	.catch((error) => next(error));
};

//++ con el async await la funcion ya esta ejecutando una promesa si o si , independiente como funcione el metodo
export const getAllNotes = async (req, res) => {
	//++ buscar todas las notas y poblar el campo 'user' con los campos 'email' y 'name' del usuario correspondiente (mongoose)
	const notes = await NoteModel.find({}).populate('user', {
		email: 1,
		name: 1,
	});
	res.json(notes);

	// Note.find({}).then((notes) => {
	// 	res.json(notes);
	// });
};

export const findByIdNote = (req, res, next) => {
	const { id } = req.params;

	NoteModel.findById(id)
		.then((note) => {
			if (note) {
				res.json(note);
			} else {
				res.status(404).end(); //404 not found
			}
		})
		.catch((err) => next(err)); //se redirige al siguiente middleware que tengan el parametro error y gestione el error
};

export const updateNote = (req, res, next) => {
	const { id } = req.params;
	const note = req.body;

	const newNoteInfo = {
		title: note.title,
		content: note.content,
		important: note.important,
	};

	//++ findByIdAndUpdate te devuelve la promesa y es lo que a encontrado por id, es por eso que se pasa el new : true
	//   para que te devuelva la nueva nota actualizado y no la nota que encontro por id
	NoteModel.findByIdAndUpdate(id, newNoteInfo, { new: true })
		.then((result) => res.json(result))
		.catch(next);
};

export const deleteNote = async (req, res, next) => {
	const { id } = req.params;

	await NoteModel.findByIdAndDelete(id);

	//++204 No Content la nota se ha eliminado con éxito, no hay contenido adicional para enviar de vuelta al cliente
	res.status(204).end();
};
