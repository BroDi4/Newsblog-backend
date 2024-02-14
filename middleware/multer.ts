import multer from 'multer';

export const avatarStorage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads/useravatar');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.random()}-`;
		const filename = uniqueSuffix + file.originalname;
		cb(null, filename);
		req.body.avatarUrl = `/uploads/useravatar/${filename}`;
	},
});
