import { body } from 'express-validator';

export const registerValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('name', 'Минимальная длина имени 2 символа').isLength({ min: 2 }),
	body('password', 'Минимальная длина пароля 5 символов').isLength({ min: 5 }),
];
