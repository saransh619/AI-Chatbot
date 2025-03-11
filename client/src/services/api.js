import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/chat";

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send`, { message });
    return response.data.botResponse;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
