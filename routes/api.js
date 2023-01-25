const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../multer/multer');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

// Save uploaded file from PC.
router.post('/send-single-file', (req, res, next) => {
	uploadFile.single('file')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(error.errno).json(error);
		} else if (error) {
			return res.status(400).json('Error saving file.');
		}
		next();
	});
});

// Return URL to download file with phone.
router.post('/send-single-file', (req, res, next) => {
	const fileURL = `${process.env.API_URI}/api/public/files/${req.body.fileDir}/${req.file.originalname}`;
	// Set timer to delete folder
	return res.status(200).json(fileURL);
});

// Create directory for file.
router.get('/receive-single-file', (req, res, next) => {
	let dir = nanoid(6);
	try {
		while (!fs.accessSync(`public/files/${dir}`)) {
			dir = nanoid(6);
		}
	} catch (err) {
		if (err.code === 'ENOENT') {
			fs.mkdirSync(`public/files/${dir}`, { recursive: true });
			return res.status(200).json(dir);
		} else {
			return res.status(400).json('Error creating directory.');
		}
	}
});

// Save uploaded file from phone.
router.post('/receive-single-file/:dirId', (req, res, next) => {
	uploadFile.single('file')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(error.errno).json(error);
		} else if (error) {
			return res.status(400).json('Error saving file.');
		}
		// Set timer to delete folder
		return res.status(200);
	});
});

// Check if directory exists.
router.get('/code-check-dir/:dirId', (req, res, next) => {
	const { dirId } = req.params;
	if (!fs.accessSync(`public/files/${dirId}`)) {
		return res.status(200);
	} else {
		return res.status(400).json('No directory.');
	}
});

// Return requested file.
router.get('/public/files/:dirId/:fileId', (req, res, next) => {
	const { dirId, fileId } = req.params;
	const file = path.resolve(`./public/files/${dirId}/${fileId}`);
	return res.download(file);
});

module.exports = router;
