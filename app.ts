import express from 'express';
import { PrismaClient } from '@prisma/client';

import * as userController from './controllers/userController';
import { registerValidation } from './utils/validations';

const app = express();
const port = 5000;
export const client = new PrismaClient();

app.use(express.json());

app.post('/user/register', registerValidation, userController.register);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
