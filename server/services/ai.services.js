const axios = require("axios");

if (!process.env.COHERE_API_KEY) {
  console.error("Please set COHERE_API_KEY in your environment variables");
  process.exit(1);
}

const getChatResponse = async (userMessage) => {
  console.log("userMessage", userMessage);
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        message: userMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.text;
  } catch (error) {
    console.error("Error calling Cohere API:", error);
    throw error;
  }
};

module.exports = { getChatResponse };

// getChatResponse("Hello, how are you?")
//   .then((response) => console.log(response))
//   .catch((error) => console.error(error));
