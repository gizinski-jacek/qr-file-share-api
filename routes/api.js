const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../multer/multer');

// Save uploaded file.
router.post('/single-file', (req, res, next) => {
	uploadFile.single('file')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(error.errno).json(error);
		} else if (error) {
			return res.status(400).json('Error saving file.');
		}
		next();
	});
});

// Return URL to download file.
router.post('/single-file', (req, res, next) => {
	const fileURL = `${process.env.API_URI}/public/files/${req.body.fileDir}/${req.file.originalname}`;
	// Set timer to delete folder
	return res.status(200).json(fileURL);
});

module.exports = router;
