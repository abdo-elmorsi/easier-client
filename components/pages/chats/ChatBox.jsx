import { Button, Input } from "components/UI";
import React, { useState } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleMessageSend = (e) => {
    e.preventDefault()
    if (newMessage.trim() !== "") {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-4 rounded-lg shadow-md">
      <div className="mb-5 overflow-auto hide-scroll-bar">
        {messages.map((message, index) => (
          <div key={index} className="px-4 py-2 mb-2 bg-gray-800 rounded-lg">
            {message}
          </div>
        ))}
      </div>
    
      <form className="flex items-center " onSubmit={handleMessageSend}>
        <Input
        formGroup={false}
          type="text"
          value={newMessage}
          className="border-gray-600 rounded-l-lg rounded-r-none"
          onChange={(e) => setNewMessage(e.target.value)}
          // className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-l-lg focus:outline-none"
          placeholder="Type your message..."
        />
        <Button
        className="rounded-l-none rounded-r-lg btn--primary"
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;