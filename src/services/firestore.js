const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

const key = path.join(__dirname, "../../key.json");

const { DB, PROJECT_ID } = process.env;

const db = new Firestore({
	projectId: PROJECT_ID,
	keyFilename: key,
	databaseId: DB,
});

exports.predictCollection = db.collection("predictions");