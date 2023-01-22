const fs = require('fs');
const multer = require('multer');
const { nanoid } = require('nanoid');

const userFile = multer.diskStorage({
	destination: async (req, file, cb) => {
		let dir = nanoid(6);
		try {
			while (!fs.accessSync(`public/files/${dir}`)) {
				dir = nanoid(6);
			}
		} catch (err) {
			if (err.code === 'ENOENT') {
				fs.mkdirSync(`public/files/${dir}`, { recursive: true });
			} else {
				cb(err);
			}
		}
		req.body.fileDir = dir;
		cb(null, `public/files/${dir}`);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const uploadFile = multer({
	storage: userFile,
	limits: { fileSize: 2000000 },
	// fileFilter: (req, file, cb) => {
	// 	const ext = path.extname(file.originalname);
	// 	if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
	// 		let error = new Error('Only images (png, jpg, jpeg) are allowed');
	// 		error.status = 415;
	// 		return cb(error);
	// 	}
	// 	cb(null, true);
	// },
});

module.exports = { uploadFile };
