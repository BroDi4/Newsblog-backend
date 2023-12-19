import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { client } from '../app';
import { createJwtToken } from '../utils/jwtToken';

export const register = async (req: any, res: any) => {
	try {
		//validation check
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });

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

		const token = createJwtToken({ id: user.id }, 'secretkey', '30d');

		const { passwordHash, ...userData } = user;
		res.status(200).json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Ошибка регистрации' });
	}
};

export const login = async (req: any, res: any) => {
	const errRes = () => {
		res.status(403).json({ error: 'Неверный логин или пароль' });
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

		const token = createJwtToken({ id: user.id }, 'secretkey', '30d');

		const { passwordHash, ...userData } = user;
		res.status(200).json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Ошибка авторизации' });
	}
};
