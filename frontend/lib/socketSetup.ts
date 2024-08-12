import io, { Socket } from 'socket.io-client';

export type SensorStatus = 'ONLINE' | 'OFFLINE';

interface StatusUpdate {
  id: number;
  currentStatus: SensorStatus;
}

export const setupSocket = (onStatusUpdate: (sensorId: number, status: StatusUpdate) => void): Socket => {
  const socket = io(`${process.env.NEXT_PUBLIC_WS_URL}`);

  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');

  });

  socket.on('statusUpdate', (data) => {
    console.log('Received status update:', data);
  });

  socket.on('statusUpdate', ({ id, currentStatus }: StatusUpdate) => {
    onStatusUpdate(id, currentStatus);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
  });

  return socket;
};
