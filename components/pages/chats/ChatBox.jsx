import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "components/UI";
import API from "helper/apis";
import { useHandleMessage, useInput } from "hooks";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

const ChatBox = ({ user, selectedUser, socket }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const message = useInput("");
  const endRef = useRef(null);
  const handleMessage = useHandleMessage();

  const handleMessageSend = async (e) => {
    e.preventDefault();
    try {
      const data = {
        sender: user._id,
        recipient: selectedUser._id,
        message: message.value.trim(),
        socketID: socket.id,
      };
      message.reset();
      const res = await API.createMessage(data);
      setMessages((prevMessages) => [...prevMessages, res]);
      socket.emit("sendMessage", data);
      scrollToBottom();
    } catch (error) {
      handleMessage(error);
    }
  };

  const handleIncomingMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
    scrollToBottom();
  };
  useEffect(() => {
    if (socket.id) {
      user._id && socket?.emit("newUser", user._id);
      socket.on("getMessage", handleIncomingMessage);
      return () => {
        socket.off("getMessage");
      };
    }
  }, [socket, socket.id]);

  useEffect(() => {
    if (selectedUser?._id) {
      fetchChat();
    }
  }, [selectedUser]);

  const fetchChat = async () => {
    setLoading(true);
    try {
      const res = await API.getAllMessages({
        page: 1,
        limit: 10,
        recipient: selectedUser._id,
      });
      setMessages(res.items);
    } catch (error) {
      handleMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col justify-between h-full p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center pb-4">
        <div className="flex items-center gap-1">
          {!selectedUser?.photo?.secure_url ? (
            <span className="w-6 h-6 md:w-10 md:h-10 dark:bg-gray-500 bg-gray-200 text-gray-900 flex justify-center items-center rounded-full">
              {selectedUser?.name?.slice(0, 1)}
            </span>
          ) : (
            <Image
              src={selectedUser?.photo?.secure_url}
              width={35}
              height={35}
              alt={selectedUser.name}
              className="rounded-full"
            />
          )}
          {selectedUser.name}
        </div>
        <div>{selectedUser.email}</div>
      </div>
      <div className="overflow-auto hide-scroll-bar dark:bg-gray-800 bg-gray-200 rounded-md p-2 h-full my-2">
        {loading ? (
          Array(6)
            .fill({})
            .map((_, index) => (
              <div
                key={index}
                className="mb-2 animate-pulse w-full h-10 rounded-lg dark:bg-gray-700 bg-gray-300"
              />
            ))
        ) : messages.length === 0 ? (
          <p className="text-center pt-4 text-gray-500">no messages yet</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`px-4 py-2 mb-2 dark:bg-gray-700 bg-gray-300 rounded-lg ${message.sender === user._id ? "text-end" : "text-start"
                }`}
            >
              {message.message}
            </div>
          ))
        )}
        <div ref={endRef} className="pt-12" />
      </div>
      <form className="flex items-center" onSubmit={handleMessageSend}>
        <Input
          formGroup={false}
          type="text"
          {...message.bind}
          className="border-gray-600 rounded-l-lg rounded-r-none"
          placeholder="Type your message..."
        />
        <Button
          disabled={!message.value}
          className="rounded-l-none rounded-r-lg btn--primary flex items-center gap-1"
          type="submit"
        >
          Send <PaperAirplaneIcon className="w-6 h-6" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;