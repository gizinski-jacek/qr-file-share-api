const fs = require('fs');
const multer = require('multer');
const { nanoid } = require('nanoid');

const storageSingleFile = multer.diskStorage({
	destination: async (req, file, cb) => {
		const { dirId } = req.body;
		if (dirId) {
			cb(null, `public/uploads/${dirId}`);
		} else {
			let newDir = nanoid(6);
			try {
				while (!fs.accessSync(`public/uploads/${newDir}`)) {
					newDir = nanoid(6);
				}
			} catch (err) {
				if (err.code === 'ENOENT') {
					fs.mkdirSync(`public/uploads/${newDir}`, { recursive: true });
				} else {
					cb(err);
				}
			}
			req.body.fileDir = newDir;
			cb(null, `public/uploads/${newDir}`);
		}
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const storageMultipleFiles = multer.diskStorage({
	destination: async (req, file, cb) => {
		const { dirId } = req.params;
		const { fileDir } = req.body;
		if (fileDir) {
			cb(null, `public/uploads/${fileDir}`);
		} else if (dirId) {
			cb(null, `public/uploads/${dirId}`);
		} else {
			let newDir = nanoid(6);
			try {
				while (!fs.accessSync(`public/uploads/${newDir}`)) {
					newDir = nanoid(6);
				}
			} catch (err) {
				if (err.code === 'ENOENT') {
					fs.mkdirSync(`public/uploads/${newDir}`, { recursive: true });
				} else {
					cb(err);
				}
			}
			req.body.fileDir = newDir;
			cb(null, `public/uploads/${newDir}`);
		}
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const singleFile = multer({
	storage: storageSingleFile,
	limits: { fileSize: 2000000 },
});

const multipleFiles = multer({
	storage: storageMultipleFiles,
	limits: { fileSize: 2000000 },
});

module.exports = { singleFile, multipleFiles };
