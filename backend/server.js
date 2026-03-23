const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 MAIN ROUTE
app.post("/analyze", async (req, res) => {
    try {
        const { resumeText } = req.body;

        // Call FastAPI
        const response = await axios.post("http://127.0.0.1:8000/analyze", {
            resume_text: resumeText
        });

        res.json(response.data);

    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});