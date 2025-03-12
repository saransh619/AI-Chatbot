const axios = require("axios");

if (!process.env.COHERE_API_KEY) {
  console.error("Please set COHERE_API_KEY in your environment variables");
  process.exit(1);
}

const getChatResponse = async (userMessage) => {
  try {
    const isCodeRequest =
      /code|javascript|typescript|python|ruby|php|java|c\+\+|html|css/i.test(
        userMessage
      );

    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        message: userMessage,
        preamble: isCodeRequest
          ? "You are a helpful AI assistant. When providing code examples, format them with markdown code blocks using triple backticks and specify the language."
          : "You are a helpful AI assistant.",
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

// const getChatResponse = async (userMessage) => {
//   // console.log("userMessage", userMessage);
//   try {
//     const response = await axios.post(
//       "https://api.cohere.ai/v1/chat",
//       {
//         message: userMessage,
//         preamble: "You are a helpful AI assistant.",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data.text;
//   } catch (error) {
//     console.error("Error calling Cohere API:", error);
//     throw error;
//   }
// };

module.exports = { getChatResponse };
