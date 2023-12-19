import jwt from 'jsonwebtoken';

export const createJwtToken = (data: object, key: string, exp: string) => {
	const token = jwt.sign(data, key, { expiresIn: exp });
	return token;
};
