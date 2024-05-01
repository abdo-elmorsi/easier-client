import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "components/UI";
import API from "helper/apis";
import { useHandleMessage, useInput } from "hooks";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const ChatBox = ({ user, selectedUser, users, setUsers, socket }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const message = useInput("");
  const endRef = useRef(null);
  const handleMessage = useHandleMessage();

  const handleMessageSend = async (e) => {
    e.preventDefault();
    try {
      const messageContent = message.value.trim();
      if (!messageContent) return;
      const data = {
        sender: user._id,
        recipient: selectedUser?._id,
        message: messageContent,
        socketID: socket.id,
      };
      message.reset();
      const newMessage = await API.createMessage(data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("sendMessage", data);
      scrollToBottom();
    } catch (error) {
      handleMessage(error);
    }
  };

  const handleIncomingMessage = (data) => {
    if (data?.sender !== selectedUser?._id) {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (user._id === data.sender) {
            return {
              ...user,
              onLine: true,
              lastMessage: data.message,
              updatedAt: new Date(),
            };
          }
          return user;
        });
        return updatedUsers;
      });

      toast.success(`New message from ${users.find(user => user?._id == data?.sender)?.name}`);
      return;
    }
    setMessages((prevMessages) => [...prevMessages, data]);
    scrollToBottom();
  };

  useEffect(() => {
    if (socket.id) {
      socket.on("getMessage", handleIncomingMessage);
      return () => {
        socket.off("getMessage", handleIncomingMessage);
      };
    }
  }, [socket, socket.id, selectedUser._id]);

  useEffect(() => {
    fetchChat();
  }, [selectedUser._id]);

  const fetchChat = async () => {
    setLoading(true);
    try {
      const chatData = await API.getAllMessages({
        page: 1,
        limit: 1000,
        sort: "createdAt",
        recipient: selectedUser._id,
      });
      setMessages(chatData.items);
    } catch (error) {
      handleMessage(error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
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
              alt={selectedUser?.name}
              className="rounded-full"
            />
          )}
          {selectedUser?.name}
        </div>
        <div>{selectedUser?.email}</div>
      </div>
      <div className="overflow-auto hide-scroll-bar dark:bg-gray-800 bg-gray-200 rounded-md p-2 h-full my-2">
        {loading ? (
          Array(3)
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
              className={`px-4 flex flex-col gap-0 py-2 mb-2 dark:bg-gray-700 bg-gray-300 rounded-lg ${message.sender === user._id ? "text-end" : "text-start"
                }`}
            >
              <p className="m-0 p-0">{message.message}</p>
              <span className="opacity-50  duration-500 transition-all text-xs font-thin">{moment(message.createdAt).fromNow()}</span>
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