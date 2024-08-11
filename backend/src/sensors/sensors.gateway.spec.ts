import { Test, TestingModule } from '@nestjs/testing';
import { SensorsGateway } from './sensors.gateway';
import { Server } from 'socket.io';

describe('SensorsGateway', () => {
  let gateway: SensorsGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorsGateway],
    }).compile();

    gateway = module.get<SensorsGateway>(SensorsGateway);
    server = {
      emit: jest.fn(),
    } as any;
    gateway['server'] = server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('emitStatusUpdate', () => {
    it('should emit a statusUpdate event', () => {
      const sensorId = 1;
      const status = 'ONLINE';
      gateway.emitStatusUpdate(sensorId, status);
      expect(server.emit).toHaveBeenCalledWith('statusUpdate', {
        id: sensorId,
        currentStatus: status,
      });
    });
  });
});
