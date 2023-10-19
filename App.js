// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './Chat'; // Assuming you have a Chat component
import TaskBoard from './TaskBoard'; // Assuming you have a TaskBoard component

const socket = io('http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });

  useEffect(() => {
    // Socket.io event listener for receiving chat messages
    socket.on('chat message', (msg) => {
      setMessages([...messages, msg]);
    });

    // Socket.io event listener for updating tasks
    socket.on('update tasks', (updatedTasks) => {
      setTasks(updatedTasks);
    });

    // Fetch initial tasks when component mounts
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:5000/tasks');
      const initialTasks = await response.json();
      setTasks(initialTasks);
    };

    fetchTasks();

    return () => {
      socket.disconnect();
    };
  }, [messages, tasks]);

  const sendMessage = () => {
    // Emit a chat message event to the server
    socket.emit('chat message', newMessage);
    setNewMessage('');
  };

  const addTask = () => {
    // Emit an add task event to the server
    socket.emit('add task', newTask);
    setNewTask({ title: '', description: '', status: 'To Do' });
  };

  const onDragEnd = (result) => {
    // Handle task reordering logic here
    // Emit an update task event to the server
    if (result.destination) {
      const updatedTask = {
        ...tasks.find((task) => task._id === result.draggableId),
        status: result.destination.droppableId,
      };
      socket.emit('update task', updatedTask);
    }
  };

  const deleteTask = (taskId) => {
    // Emit a delete task event to the server
    socket.emit('delete task', taskId);
  };

  return (
    <div>
      <Chat messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />
      <TaskBoard tasks={tasks} newTask={newTask} setNewTask={setNewTask} addTask={addTask} onDragEnd={onDragEnd} deleteTask={deleteTask} />
    </div>
  );
}

export default App;