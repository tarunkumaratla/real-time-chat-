// Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = ({ messages, newMessage, setNewMessage, sendMessage }) => {
  useEffect(() => {
    // Socket.io event listener for receiving chat messages
    socket.on('chat message', (msg) => {
      setMessages([...messages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;