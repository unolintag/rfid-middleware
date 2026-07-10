require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());

app.use("/rfid", require("./routes/rfid"));

app.listen(3000, () => {
    console.log("Server running");
});

app.get("/", (req, res) => {
    res.send("Server is running");
});