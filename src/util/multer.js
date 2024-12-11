const multer = require("multer");
const multerGooleStorage = require("multer-cloud-storage");
const path = require("path");
const key = path.join(__dirname, "../../key.json");
require("dotenv").config();

const { BUCKET, PROJECT_ID } = process.env;

exports.uploadHandler = multer({
	storage: multerGooleStorage.storageEngine({
		autoRetry: true,
		bucket: BUCKET,
		destination: "images/",
		contentType: (req, file) => {
			return file.mimetype;
		},
		projectId: PROJECT_ID,
		keyFilename: key,
		filename: (req, file, cb) => {
			cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '')}`);
		},
        uniformBucketLevelAccess: true,
	}),
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image allowed"));
		}
    }
});
