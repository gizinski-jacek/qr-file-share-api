const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFiles } = require('../multer/multer');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const { socketEmits } = require('../socketio/socketio');
const { readDirFilesDetails, directoryExists } = require('../lib/utils');

// Save uploads from PC.
router.post('/send-files', (req, res, next) => {
	uploadFiles.array('files')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(500).json(error.message);
		} else if (error) {
			return res.status(500).json('Error saving files.');
		}
		const { fileDir } = req.body;
		const fileList = readDirFilesDetails(fileDir);
		const code = fileDir.split('___')[0];
		return res.status(200).json({ fileList, code: code });
	});
});

// Create directory for uploads from phone.
router.get('/receive-files', (req, res, next) => {
	let newDir = nanoid(6);
	while (directoryExists(newDir)) {
		newDir = nanoid(6);
	}
	const timestamp = Date.now();
	fs.mkdirSync(`public/uploads/${newDir + '___' + timestamp}`, {
		recursive: true,
	});
	return res.status(200).json(newDir);
});

// Save uploads from phone.
router.post('/receive-files/:dirId', (req, res, next) => {
	uploadFiles.array('files')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(500).json(error.message);
		} else if (error) {
			return res.status(500).json('Error saving file(s).');
		} else {
			const { dirId } = req.params;
			const dirExists = directoryExists(dirId);
			const fileList = readDirFilesDetails(dirExists);
			socketEmits.new_file_alert(dirExists.split('___')[0], fileList);
			return res.status(200).json({ success: true });
		}
	});
});

// Check if directory exists and return file list, create one if it does not exist.
router.get('/code-dir-check/:dirId', (req, res, next) => {
	const { dirId } = req.params;
	const dirExists = directoryExists(dirId);
	if (dirExists) {
		const fileList = readDirFilesDetails(dirExists);
		return res.status(200).json(fileList);
	} else {
		const timestamp = Date.now();
		fs.mkdirSync(`public/uploads/${dirId + '___' + timestamp}`, {
			recursive: true,
		});
		return res.status(200).json({ success: true });
	}
});

// Return requested file.
router.get('/public/uploads/:dirId/:fileName', (req, res, next) => {
	const { dirId, fileName } = req.params;
	const dirExists = directoryExists(dirId);
	if (dirExists) {
		const file = path.resolve(`./public/uploads/${dirExists}/${fileName}`);
		return res.download(file);
	} else {
		return res.status(400).json('Directory or file does not exist.');
	}
});

module.exports = router;
