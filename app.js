const express = require("express");
const cors = require("cors");
const dbConnection = require("./db/dbConfig");
const createTables = require("./db/dbSchema");

const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoute");

const app = express();
const port = process.env.PORT || 5500;

// ✅ Allow frontend domains in CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173"              // for local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answers", answerRoutes);

// Endpoint to create tables
app.get("/create-table", createTables);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Evangadi Forum backend" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await dbConnection.execute("select 'test'");
    console.log("Database connection established");
  } catch (error) {
    console.log("Database connection failed:", error.message);
  } finally {
    // Always start the server to avoid Render killing the process
    app.listen(port, () => {
      console.log(`✅ Server listening on port ${port}`);
    });
  }
}

startServer();
