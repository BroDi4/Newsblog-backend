import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = (req.headers.authorization || '')
			.replace('Bearer', '')
			.trim();

		if (!token) return res.status(403).json({ message: 'Нет доступа' });

		const decodedToken: any = jwt.verify(token, 'secretkey');
		req.body.userId = decodedToken.id;

		next();
	} catch (err) {
		return res.status(403).json({ message: 'Нет доступа' });
	}
};

export default checkAuth;
