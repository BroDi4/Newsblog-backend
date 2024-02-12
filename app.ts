import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import * as userController from './controllers/userController';
import { registerValidation } from './utils/validations';
import checkAuth from './utils/checkAuth';

const app = express();
const port = 5000;
export const client = new PrismaClient();

app.use(express.json());
app.use(cors());

app.post('/user/register', registerValidation, userController.register);
app.post('/user/login', userController.login);
app.get('/user/auth', checkAuth, userController.auth);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
