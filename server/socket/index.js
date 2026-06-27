const jwt = require('jsonwebtoken');

const connectedUsers = new Map();

const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    socket.join(`user:${userId}`);

    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);

    console.log(`User connected: ${userId} (socket: ${socket.id})`);

    socket.on('device:connect', (data) => {
      io.to(`user:${userId}`).emit('device:connect', data);
    });

    socket.on('device:update', (data) => {
      io.to(`user:${userId}`).emit('device:update', data);
    });

    socket.on('device:disconnect', (data) => {
      io.to(`user:${userId}`).emit('device:disconnect', data);
    });

    socket.on('photo:uploaded', (data) => {
      io.to(`user:${userId}`).emit('photo:uploaded', data);
    });

    socket.on('sms:received', (data) => {
      io.to(`user:${userId}`).emit('sms:received', data);
    });

    socket.on('location:updated', (data) => {
      io.to(`user:${userId}`).emit('location:updated', data);
    });

    socket.on('contact:synced', (data) => {
      io.to(`user:${userId}`).emit('contact:synced', data);
    });

    socket.on('clipboard:changed', (data) => {
      io.to(`user:${userId}`).emit('clipboard:changed', data);
    });

    socket.on('disconnect', () => {
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
      console.log(`User disconnected: ${userId} (socket: ${socket.id})`);
    });
  });
};

module.exports = { initializeSocket, connectedUsers };
