import express from 'express';
import { loginHandler, registerHandler } from '../controllers/AuthController.js';
import { body } from 'express-validator';
import { validateResultMiddle } from '../middlewares/ValidateResultMiddle.js';

const router = express.Router();

router.post(
	'/register',
	[
		body('email', 'Formato de email incorrecto').trim().isEmail().normalizeEmail(),
		body('password', 'Mínimo 6 caracteres').trim().isLength({ min: 6 }),
		body('password', 'Formato de password incorrecto').custom((value, { req }) => {
			if (value !== req.body.confirmPassword) {
				throw new Error('No coinciden la contraseña');
			}
			return value;
		}),
	],
	validateResultMiddle,
	registerHandler
);
router.post(
	'/login',
	[
		body('email', 'Formato de email incorrecto').trim().isEmail().normalizeEmail(),
		body('password', 'Mínimo 6 caracteres').trim().isLength({ min: 6 }),
	],
	validateResultMiddle,
	loginHandler
);

export default router;
