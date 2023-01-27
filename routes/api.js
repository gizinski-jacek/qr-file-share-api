const express = require('express');
const router = express.Router();
const multer = require('multer');
const { singleFile, multipleFiles } = require('../multer/multer');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

// Save single uploaded file from PC.
router.post('/send-single-file', (req, res, next) => {
	singleFile.single('file')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(500).json(error.message);
		} else if (error) {
			return res.status(500).json('Error saving file.');
		}
		const fileURL = path.resolve(
			`./public/uploads/${req.body.fileDir}/${req.file.originalname}`
		);
		return res.status(200).json(fileURL);
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
		const filesURLs = req.files.map((file) =>
			path.resolve(`./public/uploads/${req.body.fileDir}/${file.originalname}`)
		);
		return res.status(200).json(filesURLs);
	});
});

// Create directory for phone file(s) uploads.
router.get('/receive-files', (req, res, next) => {
	let newDir = nanoid(6);
	try {
		while (!fs.accessSync(`public/uploads/${newDir}`)) {
			newDir = nanoid(6);
		}
	} catch (err) {
		if (err.code === 'ENOENT') {
			fs.mkdirSync(`public/uploads/${newDir}`);
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
			// Set timer to delete folder.
			// Notify correct socket.io client of uploaded files.
			return res.status(200).json({ success: true });
		}
	});
});

// Check if directory exists.
router.get('/code-dir-check/:dirId', (req, res, next) => {
	const { dirId } = req.params;
	if (!fs.accessSync(`public/uploads/${dirId}`)) {
		return res.status(200).json({ success: true });
	} else {
		return res.status(400).json('No directory.');
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
