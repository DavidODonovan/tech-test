import React from 'react';
import { render, act } from '@testing-library/react';
import { setupSocket, StatusUpdate } from './socketSetup';
import { Socket } from 'socket.io-client';

// Mock the Socket.IO client
jest.mock('socket.io-client', () => {
  const mSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn()
  };
  return {
    io: jest.fn(() => mSocket)
  };
});

// A simple component that uses the setupSocket function
const TestComponent: React.FC = () => {
  React.useEffect(() => {
    const onStatusUpdate = (sensorId: number, status: StatusUpdate) => {
      console.log(`Sensor ${sensorId} status updated to ${status.currentStatus}`);
    };
    const socket = setupSocket(onStatusUpdate);
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Test Component</div>;
};

describe('setupSocket', () => {
  let mockSocket: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = require('socket.io-client').io();
    process.env.NEXT_PUBLIC_WS_URL = 'http://test-websocket-url.com';
  });

  it('should connect to the correct WebSocket URL', () => {
    render(<TestComponent />);
    expect(require('socket.io-client').io).toHaveBeenCalledWith('http://test-websocket-url.com');
  });

  it('should set up correct event listeners', () => {
    render(<TestComponent />);
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('statusUpdate', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  it('should handle status updates correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<TestComponent />);

    // Find the 'statusUpdate' event handler
    const statusUpdateHandler = mockSocket.on.mock.calls.find((call) => call[0] === 'statusUpdate')?.[1] as (update: StatusUpdate) => void;

    expect(statusUpdateHandler).toBeDefined();

    // Simulate a status update event
    act(() => {
      statusUpdateHandler({ id: 1, currentStatus: 'ONLINE' });
    });

    expect(consoleSpy).toHaveBeenCalledWith("Received status update:", {"currentStatus": "ONLINE", "id": 1});
    consoleSpy.mockRestore();
  });

  it('should disconnect the socket when component unmounts', () => {
    const { unmount } = render(<TestComponent />);
    unmount();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
