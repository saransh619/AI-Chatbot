import React, { useState, useRef } from "react";
import { sendMessage } from "../services/api";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const formatMessageWithCodeBlocks = (text) => {
  if (!text) return "";

  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;

  if (!codeBlockRegex.test(text)) {
    return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  }

  const parts = [];
  let lastIndex = 0;
  let match;

  codeBlockRegex.lastIndex = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block with line breaks preserved
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} style={{ whiteSpace: "pre-wrap" }}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    const language = match[1] || "javascript";
    const code = match[2];

    const highlightedCode = hljs.highlight(code, { language }).value;

    parts.push(
      <div key={`code-${match.index}`} className="code-block">
        <div className="code-header">
          <span className="code-language">{language}</span>
          <CopyButton code={code} />
        </div>
        <pre className="hljs">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last code block with line breaks preserved
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`} style={{ whiteSpace: "pre-wrap" }}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return <>{parts}</>;
};

// CopyButton component to handle copy functionality
const CopyButton = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1200);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button className="copy-button" onClick={handleCopy}>
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const chatHistoryRef = useRef(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // Add user message to conversation immediately
      setConversation([...conversation, { user: message, bot: null }]);
      setMessage("");
      setIsLoading(true);

      // Get bot response
      const botResponse = await sendMessage(message);

      // Update conversation with bot response
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = botResponse;
        return updated;
      });

      // Scroll to the bottom of the chat history after the update
      setTimeout(() => {
        if (chatHistoryRef.current) {
          chatHistoryRef.current.scrollTop =
            chatHistoryRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot =
          "Sorry, I encountered an error processing your request.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
    // Reset textarea height after sending message
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);

    // Auto-expand textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`; // Expand up to 120px, then scroll
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history" ref={chatHistoryRef}>
        {conversation.map((msg, index) => (
          <div key={index} className="message-group">
            <div className="user-message">
              <div className="avatar user-avatar">You</div>
              <div className="message-content">
                {formatMessageWithCodeBlocks(msg.user)}
              </div>
            </div>

            <div className="bot-message">
              <div className="avatar bot-avatar">AI</div>
              <div className="message-content">
                {msg.bot ? (
                  formatMessageWithCodeBlocks(msg.bot)
                ) : isLoading && index === conversation.length - 1 ? (
                  <div className="loading-indicator">Thinking...</div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isLoading}
          className="chat-textarea"
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
