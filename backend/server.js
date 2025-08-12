const express = require("express");
const connectToDatabase = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

connectToDatabase();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/subtopics", require("./routes/subTopics"));
app.use("/api/topics", require("./routes/topics"));

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
