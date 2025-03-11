import React, { useState } from "react";
import { sendMessage } from "../services/api";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const botResponse = await sendMessage(message);
      setConversation([...conversation, { user: message, bot: botResponse }]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {conversation.map((msg, index) => (
          <div key={index} className="message">
            <p>
              <strong>You:</strong> {msg.user}
            </p>
            <p>
              <strong>Bot:</strong> {msg.bot}
            </p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
