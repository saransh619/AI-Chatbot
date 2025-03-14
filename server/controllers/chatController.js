const Chat = require("../models/ChatModel");
const { getChatResponse } = require("../services/ai.services");

const sendMessage = async (req, res) => {
  const { message } = req.body;

  try {
    const botResponse = await getChatResponse(message);

    // Save chat to MongoDB
    const chat = new Chat({ userMessage: message, botResponse });
    await chat.save();

    res.status(200).json({ botResponse });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

module.exports = { sendMessage };
