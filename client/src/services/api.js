import axios from "axios";
import { API_BASE_URL } from "../config";

console.log("API_BASE_URL", API_BASE_URL);

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send`, { message });
    return response.data.botResponse;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
