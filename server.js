const express = require('express');
const socket = require('socket.io');

const app = express();
const tasks = [{ id: 1, name: 'Shopping' }, { id: 2, name: 'Go out with a dog' }];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).res.send({message: "Not found..."});
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', id);
  });
});


