import express from 'express';

// ../ -> Salir de una carpeta y entrar a otra
import userExtractorMiddle from '../middlewares/userExtractorMiddle.js';
import {
	createNote,
	deleteNote,
	findByIdNote,
	getAllNotes,
	updateNote,
} from '../controllers/noteController.js';

const noteRouter = express.Router();

noteRouter.post('/note', userExtractorMiddle, createNote);
noteRouter.get('/notes', getAllNotes);
noteRouter.get('/note/:id', findByIdNote);
noteRouter.put('/note/:id', userExtractorMiddle, updateNote);
noteRouter.delete('/note/:id', userExtractorMiddle, deleteNote);

export default noteRouter;
