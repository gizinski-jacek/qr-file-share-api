const fs = require('fs');

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

module.exports = { readDirFilesDetails, directoryExists };
