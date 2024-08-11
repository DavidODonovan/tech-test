import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor, SensorStatus } from './entities/sensor.entity';

describe('SensorsController', () => {
  let controller: SensorsController;
  let service: SensorsService;

  const mockSensor: Sensor = {
    id: 1,
    name: 'Test Sensor',
    serialNumber: 'SN123',
    firmwareVersion: '1.0.0',
    currentStatus: SensorStatus.OFFLINE,
  };

  const mockSensorsService = {
    create: jest.fn().mockResolvedValue(mockSensor),
    findAll: jest.fn().mockResolvedValue([mockSensor]),
    findOne: jest.fn().mockResolvedValue(mockSensor),
    update: jest.fn().mockResolvedValue(mockSensor),
    remove: jest.fn().mockResolvedValue(mockSensor),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        {
          provide: SensorsService,
          useValue: mockSensorsService,
        },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
    service = module.get<SensorsService>(SensorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new sensor', async () => {
      const createSensorDto: CreateSensorDto = {
        name: 'Test Sensor',
        serialNumber: 'SN123',
        firmwareVersion: '1.0.0',
        currentStatus: SensorStatus.OFFLINE,
      };

      expect(await controller.create(createSensorDto)).toEqual(mockSensor);
      expect(service.create).toHaveBeenCalledWith(createSensorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of sensors', async () => {
      expect(await controller.findAll()).toEqual([mockSensor]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single sensor', async () => {
      expect(await controller.findOne('1')).toEqual(mockSensor);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a sensor', async () => {
      const updateSensorDto: UpdateSensorDto = {
        name: 'Updated Sensor',
      };

      expect(await controller.update('1', updateSensorDto)).toEqual(mockSensor);
      expect(service.update).toHaveBeenCalledWith(1, updateSensorDto);
    });
  });

  describe('remove', () => {
    it('should remove a sensor', async () => {
      expect(await controller.remove('1')).toEqual(mockSensor);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
