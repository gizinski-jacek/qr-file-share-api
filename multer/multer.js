const fs = require('fs');
const multer = require('multer');
const { directoryExists, nanoidCustom } = require('../lib/utils');

const storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		const dirId = req.params.dirId || req.body.fileDir;
		const dirExists = directoryExists(dirId);
		if (dirExists) {
			cb(null, `public/uploads/${dirExists}`);
		} else {
			let newDir = nanoidCustom();
			const timestamp = Date.now();
			while (directoryExists(newDir)) {
				newDir = nanoidCustom();
			}
			newDir = newDir + '___' + timestamp;
			fs.mkdirSync(`public/uploads/${newDir}`, { recursive: true });

			req.body.fileDir = newDir;
			cb(null, `public/uploads/${newDir}`);
		}
	},
	filename: (req, file, cb) => {
		const dirId = req.params.dirId || req.body.fileDir;
		const dirExists = directoryExists(dirId);
		if (!dirExists) return cb('err');
		let fileName = file.originalname;
		const originalName = file.originalname.slice(
			0,
			file.originalname.lastIndexOf('.')
		);
		const extension = file.originalname.slice(
			file.originalname.lastIndexOf('.')
		);
		let i = 1;
		while (fs.existsSync(`public/uploads/${dirExists}/${fileName}`)) {
			fileName = originalName + `_(${i})` + extension;
			i++;
		}
		cb(null, fileName);
	},
});

const uploadFiles = multer({
	storage: storage,
	limits: { fileSize: 2000000 },
});

module.exports = { uploadFiles };
