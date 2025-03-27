const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
// ✅ Add MongoDB session storage


const app = express();
app.use(bodyParser.json({ limit: "50mb" }));  // Increase JSON request size limit
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", require("./routes/certificateRoutes"));
app.use("/api/images", require("./routes/imageRoutes"));
// app.use("/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));