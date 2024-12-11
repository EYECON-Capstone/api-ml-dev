const { predictClasification } = require("../services/inference");
const axios = require("axios");
const { uploadHandler } = require("../util/multer");
const { v4: uuidv4 } = require("uuid");
const { predictCollection } = require("../services/firestore");

const upload = uploadHandler.single("image");

exports.postPredict = async (req, res) => {
	upload(req, res, async (err) => {
		if (err) {
			// if (err.message === "File too large") {
			// 	return res.status(400).json({
			// 		status: "fail",
			// 		message: "File melebihi 1 MB",
			// 	});
			// }
			return res.status(400).json({
				status: "fail",
				message: err.message,
			});
		}

		try {
		const { linkUrl } = req.file;
		const { model } = await req.app.locals;
		const { id_user } = req.body;
		const id = uuidv4();
		const createdAt = new Date().toISOString();

		const response = await axios.get(linkUrl, {
			responseType: "arraybuffer",
		});

		const imageBuffer = response.data;

		const predict = await predictClasification(model, imageBuffer);

		const label =
			predict == "0"
				? "Mata Juling"
				: predict == "1"
				? "Mata Normal"
				: predict == "2"
				? "Mata Merah"
				: "Kantung Mata";

		let diagnosa = "";

		if (label === "Mata Juling") {
			diagnosa =
				"Strabismus, atau mata juling, adalah kondisi di mana kedua mata tidak sejajar dan mengarah ke arah yang berbeda, misalnya satu mata menghadap lurus ke depan sementara mata lainnya mengarah ke dalam, luar, atas, atau bawah. Kondisi ini dapat terjadi secara terus-menerus atau hanya sesekali, dan biasanya disebabkan oleh ketidakseimbangan otot-otot yang menggerakkan mata, gangguan saraf, atau masalah refraksi. Strabismus dapat mengganggu penglihatan binokular dan menyebabkan ambliopia (mata malas) jika tidak ditangani. Penanganan meliputi penggunaan kacamata, terapi mata, atau operasi otot mata.";
		}else if (label === "Mata Normal") {
			diagnosa = "Mata anda normal.";
		}else if (label === "Mata Merah") {
			diagnosa =
				"Mata merah adalah kondisi di mana pembuluh darah di mata melebar, menyebabkan bagian putih mata (sklera) menjadi merah. Kondisi ini dapat disebabkan oleh berbagai faktor, seperti kelelahan, iritasi, alergi, atau infeksi (seperti konjungtivitis). Faktor lain yang dapat menyebabkan mata merah meliputi paparan debu, asap, atau penggunaan lensa kontak yang tidak tepat. Gejala lain yang mungkin muncul termasuk rasa perih, gatal, atau berair. Perawatan bergantung pada penyebabnya, seperti penggunaan obat tetes mata untuk alergi atau infeksi, serta istirahat yang cukup untuk mengurangi kelelahan mata";
		} else {
			diagnosa = "Kantung mata adalah pembengkakan atau area gelap di bawah mata yang sering disebabkan oleh kurang tidur, penuaan, alergi, atau retensi cairan. Gejala ringan dapat diatasi dengan tidur cukup, kompres dingin, dan pola hidup sehat. Jika disertai nyeri, kemerahan, atau tidak membaik dalam seminggu, segera konsultasikan ke dokter untuk evaluasi lebih lanjut."
		}

			const result = {
			id_user,
			id,
			img_url: linkUrl,
			result: label,
			diagnosa: diagnosa,
			createdAt,
		};

		const docRef = predictCollection.doc(id);
		await docRef.set(result);

		return res.status(201).json({
			status: "success",
			message: "Prediction Success",
			data: result
		});
		} catch (error) {
			return res.status(400).json({
				status: "fail",
				message: "Terjadi kesalahan saat prediksi",
			});
		}
	});
};

exports.getDataPredict = async (req, res) => {
	const { id_user } = req.params;
	const docSnap = await predictCollection.where("id_user", "==", id_user).get();

	const data = [];
	docSnap.forEach((doc) => data.push(doc.data()));

	if (data.length <= 0) {
		return res.json({
			status: "fail",
			message: "Data tidak ditemukan",
		});
	}

	return res.json({
		status: "success",
		data: data,
	});
};

exports.deleteData = async (req, res) => {
	const { id } = req.params;
	try {
		const doc = predictCollection.doc(id);
		const data = await doc.get();
		if (!data.exists) {
			return res.status(404).json({
				status: "fail",
				message: "Data tidak ditemukan",
			});
		}
		await doc.delete();
		return res.json({
			status: "success",
			message: "Data berhasil di hapus",
		});
	} catch {
		res.status(404).json({
			status: "fail",
			message: "Ada Kesalahan",
		});
	}
};

exports.getData = async (req, res) => {
	const { id } = req.params;

	const doc = predictCollection.doc(id);
	const data = await doc.get();

	if (!data.exists) {
		return res.status(404).json({
			status: "fail",
			message: "Data tidak ditemukan",
		});
	}

	return res.json({
		status: "success",
		data: data.data(),
	});
};
