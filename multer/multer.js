const fs = require('fs');
const multer = require('multer');
const { nanoid } = require('nanoid');

const storage = multer.diskStorage({
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
		const uidName = Date.now() + '___' + file.originalname;
		cb(null, uidName);
	},
});

const uploadFiles = multer({
	storage: storage,
	limits: { fileSize: 2000000 },
});

module.exports = { uploadFiles };
