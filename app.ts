import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import * as userController from './controllers/userController';
import { registerValidation } from './middleware/validations';
import checkAuth from './middleware/checkAuth';
import multer from 'multer';
import { avatarStorage } from './middleware/multer';

const app = express();
const port = 5000;
export const client = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use('/uploads/useravatar', express.static('uploads/useravatar'));

const avatarUpload = multer({ storage: avatarStorage });

app.post(
	'/user/register',
	avatarUpload.single('avatar'),
	registerValidation,
	userController.register
);
app.post('/user/login', userController.login);
app.get('/user/auth', checkAuth, userController.auth);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
