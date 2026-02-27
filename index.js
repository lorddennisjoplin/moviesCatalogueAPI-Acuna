require('dotenv').config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log("Now connected to MongoDB Atlas."))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

// Start server
const port = process.env.PORT || 4000;
if (require.main === module) {
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`);
    });
}

// Optional: Root route to help test deployment
app.get("/", (req, res) => {
    res.status(200).json({ message: "API is working" });
});

module.exports = { app, mongoose };