import express from 'express';
import { createUser, getUsers, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();

//++ un mismo path puede servir para diferentes funciones depende de la accion(GET,POST,PUT,DELETE)
userRouter.get('/user', getUsers);
userRouter.post('/user', createUser);
userRouter.post('/user/login', loginUser);

export default userRouter;
