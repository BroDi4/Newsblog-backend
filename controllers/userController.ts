import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { client } from '../app';

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
		const passwordHash = await bcrypt.hash(req.body.password, salt);

		const userData = {
			email: req.body.email,
			name: req.body.name,
			passwordHash: passwordHash,
			avatarUrl: req.body.avatarUrl || '',
		};

		const user = await client.user.create({ data: userData });

		console.log(user);
		res.status(200).json({ message: 'Успешная регистрация' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Ошибка регистрации' });
	}
};
