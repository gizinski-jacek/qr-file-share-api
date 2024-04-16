const fs = require('fs');
const { customAlphabet } = require('nanoid');

const directoryLifespan = 5 * 60 * 1000;

const nanoidCustom = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	6
);

const readDirFilesDetails = (directory) => {
	const files = fs.readdirSync(`public/uploads/${directory}`);
	const fileList = files.map((fileName) => {
		const fileSizeInBytes = fs.statSync(
			`public/uploads/${directory}/${fileName}`
		).size;
		const extension = fileName.slice(fileName.lastIndexOf('.'));
		return {
			name: fileName,
			size: fileSizeInBytes,
			extension: extension,
			url: `${process.env.API_URI}/api/public/uploads/${directory}/${fileName}`,
		};
	});
	return fileList;
};

const readDirectories = () => {
	const directoriesList = fs
		.readdirSync('public/uploads', { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
	return directoriesList;
};

const directoryExists = (directory) => {
	if (!directory) return undefined;
	const dirsList = readDirectories();
	const dirExists = dirsList.find(
		(dir) => dir.split('___')[0] === directory.split('___')[0]
	);
	return dirExists;
};

const cleanupDirectories = (seconds = 15) => {
	setInterval(() => {
		const dirList = readDirectories();
		if (dirList.length <= 0) return;
		let i = 0;
		dirList.forEach((dir) => {
			if (Date.now() > parseInt(dir.split('___')[1]) + 5 * 60 * 1000) {
				fs.rmSync(`public/uploads/${dir}`, { recursive: true, force: true });
				i++;
			}
		});
		console.log(`Number of deleted directories: ${i}`);
	}, seconds * 1000);
};

module.exports = {
	readDirFilesDetails,
	directoryExists,
	cleanupDirectories,
	nanoidCustom,
	directoryLifespan,
};
