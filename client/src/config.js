const config = {
  development: {
    API_BASE_URL: "http://localhost:5000/api/chat",
  },
  production: {
    API_BASE_URL: "https://ai-chatbot-8snz.onrender.com/api/chat",
  },
};

const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

console.log("isDevelopment", isDevelopment);

export const API_BASE_URL = isDevelopment
  ? config.development.API_BASE_URL
  : config.production.API_BASE_URL;
