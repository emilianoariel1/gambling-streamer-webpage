import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const connectSocket = (userId: string, token?: string) => {
  const socket = getSocket();

  socket.auth = { userId, token };
  socket.connect();

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from socket server:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emitEvent = (event: string, ...args: any[]) => {
  const socket = getSocket();
  socket.emit(event, ...args);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onEvent = (event: string, callback: (...args: any[]) => void) => {
  const socket = getSocket();
  socket.on(event, callback);

  return () => {
    socket.off(event, callback);
  };
};
