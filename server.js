// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5000;

// MongoDB connection setup
mongoose.connect('your-mongodb-uri', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB schema for tasks
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
});

const Task = mongoose.model('Task', taskSchema);

// Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle chat events
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle task board events
  socket.on('add task', async (task) => {
    try {
      const newTask = new Task(task);
      await newTask.save();
      io.emit('update tasks', await Task.find());
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('update task', async (updatedTask) => {
    try {
      await Task.findByIdAndUpdate(updatedTask._id, updatedTask);
      io.emit('update tasks', await Task.find());
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('delete task', async (taskId) => {
    try {
      await Task.findByIdAndDelete(taskId);
      io.emit('update tasks', await Task.find());
    } catch (error) {
      console.error(error);
    }
  });

  // Additional task board functionality can be added here
});

server.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});