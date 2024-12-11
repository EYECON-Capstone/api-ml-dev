const tf = require('@tensorflow/tfjs-node')
require("dotenv").config();

exports.loadModel = async () => {
	const model = await tf.loadLayersModel(process.env.MODEL_URL);
	if (!model || typeof model.predict !== "function") {
		throw new Error(
			"Invalid model: Model is not loaded or does not have a predict method."
		);
	}
	console.log("berhasil");
	return model;
};
