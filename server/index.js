const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cors({ origin: "https://ai-chatbot-talk.netlify.app" }));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is working perfectly fine!");
});

app.use("/api/chat", require("./routes/chatRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
