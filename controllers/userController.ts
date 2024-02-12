import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { client } from '../app';

//register user
export const register = async (req: Request, res: Response) => {
	try {
		//validation check
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ message: errors.array() });

		//email in db check

		const emailInDb = await client.user.findUnique({
			where: { email: req.body.email },
		});

		if (emailInDb) {
			return res.status(400).json({
				errors: [{ path: 'email', msg: 'Такой e-mail уже существует!' }],
			});
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);

		const doc = {
			email: req.body.email,
			name: req.body.name,
			passwordHash: password,
			avatarUrl: req.body.avatarUrl || null,
		};

		const user = await client.user.create({ data: doc });

		const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '30d' });

		const { passwordHash, ...userData } = user;
		res.status(200).json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Ошибка регистрации' });
	}
};

//login user
export const login = async (req: Request, res: Response) => {
	const errRes = () => {
		res.status(403).json({ message: 'Неверный логин или пароль' });
	};

	try {
		const user = await client.user.findUnique({
			where: { email: req.body.email },
		});
		if (!user) return errRes();

		const isValidPassword = await bcrypt.compare(
			req.body.password,
			user.passwordHash
		);
		if (!isValidPassword) return errRes();

		const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '30d' });

		const { passwordHash, ...userData } = user;
		res.status(200).json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Ошибка авторизации' });
	}
};

export const auth = async (req: Request, res: Response) => {
	try {
		const user = await client.user.findUnique({
			where: { id: req.body.userId },
		});
		if (!user) return res.status(403).json({ message: 'Нет доступа' });
		const { passwordHash, ...userData } = user;

		res.status(200).json({ ...userData });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Ошибка авторизации' });
	}
};
