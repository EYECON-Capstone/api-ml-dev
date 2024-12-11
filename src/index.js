const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes/router");
const { loadModel } = require("./services/loadModel");

require("dotenv").config();

const { HOST, PORT } = process.env;

(async () => {
    app.locals.model = await loadModel();
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/predict", router);

app.get("/", async (req, res) => {
    if (!app.locals.model) {
        return res.send("Sedang memuat model");
    }
    return res.send("Berhasil memuat model");
});

app.all("*", (req, res) => {
    res.status(404).json({
        status: "fail",
        message: "Not Found"
    })
})

app.listen(PORT, () => {
    console.log(`Running server at ${HOST}:${PORT}`);
});
