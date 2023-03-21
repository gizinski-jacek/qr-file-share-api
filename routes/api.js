const express = require('express');
const router = express.Router();
const multer = require('multer');
const { singleFile, multipleFiles } = require('../multer/multer');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const { socketEmits } = require('../socketio/socketio');

const readDirFilesDetails = (dir) => {
	const files = fs.readdirSync(`public/uploads/${dir}`);
	const fileList = files.map((fileName) => {
		const fileSizeInBytes = fs.statSync(
			`public/uploads/${dir}/${fileName}`
		).size;
		const extension = fileName.slice(fileName.lastIndexOf('.'));
		return {
			name: fileName,
			size: fileSizeInBytes,
			extension: extension,
			url: `${process.env.API_URI}/api/public/uploads/${dir}/${fileName}`,
		};
	});
	return fileList;
};

// Save single uploaded file from PC.
router.post('/send-single-file', (req, res, next) => {
	singleFile.single('file')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(500).json(error.message);
		} else if (error) {
			return res.status(500).json('Error saving file.');
		}
		// Set timer to delete folder. !!!
		const { fileDir } = req.body;
		const fileList = readDirFilesDetails(fileDir);
		return res.status(200).json(fileList);
	});
});

// Save multiple uploaded files from PC.
router.post('/send-multiple-files', (req, res, next) => {
	multipleFiles.array('files')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(500).json(error.message);
		} else if (error) {
			return res.status(500).json('Error saving files.');
		}
		// Set timer to delete folder. !!!
		const { fileDir } = req.body;
		const fileList = readDirFilesDetails(fileDir);
		return res.status(200).json(fileList);
	});
});

// Create directory for phone file(s) uploads.
router.get('/receive-files', async (req, res, next) => {
	let newDir = nanoid(6);
	try {
		while (!fs.accessSync(`public/uploads/${newDir}`)) {
			newDir = nanoid(6);
		}
	} catch (err) {
		if (err.code === 'ENOENT') {
			fs.mkdirSync(`public/uploads/${newDir}`);
			// Set timer to delete folder. !!!
			return res.status(200).json(newDir);
		} else {
			return res.status(400).json('Error creating directory.');
		}
	}
});

// Save uploaded file(s) from phone.
router.post('/receive-files/:dirId', (req, res, next) => {
	multipleFiles.array('files')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(500).json(error.message);
		} else if (error) {
			return res.status(500).json('Error saving file(s).');
		} else {
			const { dirId } = req.params;
			const fileList = readDirFilesDetails(dirId);
			socketEmits.new_file_alert(dirId, fileList);
			return res.status(200).json({ success: true });
		}
	});
});

// Check if directory exists, create one if it does not.
router.get('/code-dir-check/:dirId', async (req, res, next) => {
	const { dirId } = req.params;
	try {
		if (!fs.accessSync(`public/uploads/${dirId}`)) {
			const fileList = readDirFilesDetails(dirId);
			return res.status(200).json(fileList);
		}
	} catch (err) {
		if (err.code === 'ENOENT') {
			fs.mkdirSync(`public/uploads/${dirId}`);
			return res.status(200).json({ success: true });
		} else {
			return res.status(400).json('No directory. Error creating directory.');
		}
	}
});

// Return requested file.
router.get('/public/uploads/:dirId/:fileId', (req, res, next) => {
	const { dirId, fileId } = req.params;
	if (!fs.accessSync(`public/uploads/${dirId}`)) {
		const file = path.resolve(`./public/uploads/${dirId}/${fileId}`);
		return res.download(file);
	} else {
		return res.status(400).json('No directory or file.');
	}
});

module.exports = router;
