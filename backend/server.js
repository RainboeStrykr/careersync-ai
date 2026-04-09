const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// 🔥 MAIN ROUTE
app.post("/analyze", async (req, res) => {
    try {
        const { resumeText, timeline, targetDomain } = req.body;

        const response = await axios.post("http://127.0.0.1:8000/analyze", {
            resume_text: resumeText,
            timeline: timeline || "2 days",
            target_domain: targetDomain || "Healthcare IT"
        });

        res.json(response.data);

    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({ error: "Something went wrong", detail: error.message });
    }
});

// 🗺️ DETAILED ROADMAP ROUTE
app.post("/roadmap/detailed", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/roadmap/detailed", req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Roadmap Error:", error.message);
        res.status(500).json({ error: "Roadmap generation failed", detail: error.message });
    }
});

// 🎤 INTERVIEW ROUTES
app.post("/interview/start", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/interview/start", req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Interview Start Error:", error.message);
        res.status(500).json({ error: "Failed to start interview", detail: error.message });
    }
});

app.post("/interview/answer", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/interview/answer", req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Interview Answer Error:", error.message);
        res.status(500).json({ error: "Failed to submit answer", detail: error.message });
    }
});

app.get("/interview/report", async (req, res) => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/interview/report");
        res.json(response.data);
    } catch (error) {
        console.error("Interview Report Error:", error.message);
        res.status(500).json({ error: "Failed to get report", detail: error.message });
    }
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});