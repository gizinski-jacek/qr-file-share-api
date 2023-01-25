const fs = require('fs');
const multer = require('multer');
const { nanoid } = require('nanoid');

const userFile = multer.diskStorage({
	destination: async (req, file, cb) => {
		const { dirId } = req.body;
		if (dirId) {
			cb(null, `public/files/${dirId}`);
		} else {
			let newDir = nanoid(6);
			try {
				while (!fs.accessSync(`public/files/${newDir}`)) {
					newDir = nanoid(6);
				}
			} catch (err) {
				if (err.code === 'ENOENT') {
					fs.mkdirSync(`public/files/${newDir}`, { recursive: true });
				} else {
					cb(err);
				}
			}
			req.body.fileDir = newDir;
			cb(null, `public/files/${newDir}`);
		}
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
