import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SensorsService } from './sensors.service';
import { Sensor, SensorStatus } from './entities/sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { NotFoundException } from '@nestjs/common';

describe('SensorsService', () => {
  let service: SensorsService;
  let repo: Repository<Sensor>;
  let eventEmitter: EventEmitter2;

  const mockSensor: Sensor = {
    id: 1,
    name: 'Test Sensor',
    serialNumber: 'SN123',
    firmwareVersion: '1.0.0',
    currentStatus: SensorStatus.OFFLINE,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockSensor),
    save: jest.fn().mockResolvedValue(mockSensor),
    find: jest.fn().mockResolvedValue([mockSensor]),
    findOneBy: jest.fn().mockResolvedValue(mockSensor),
    remove: jest.fn().mockResolvedValue(mockSensor),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsService,
        {
          provide: getRepositoryToken(Sensor),
          useValue: mockRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<SensorsService>(SensorsService);
    repo = module.get<Repository<Sensor>>(getRepositoryToken(Sensor));
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new sensor', async () => {
      const createSensorDto: CreateSensorDto = {
        name: 'Test Sensor',
        serialNumber: 'SN123',
        firmwareVersion: '1.0.0',
        currentStatus: SensorStatus.OFFLINE,
      };

      expect(await service.create(createSensorDto)).toEqual(mockSensor);
      expect(repo.create).toHaveBeenCalledWith(createSensorDto);
      expect(repo.save).toHaveBeenCalledWith(mockSensor);
    });
  });

  describe('findAll', () => {
    it('should return an array of sensors', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockSensor]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single sensor', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockSensor);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if sensor is not found', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sensor', async () => {
      const updateSensorDto: UpdateSensorDto = {
        name: 'Updated Sensor',
        currentStatus: SensorStatus.ONLINE,
      };

      const updatedSensor = { ...mockSensor, ...updateSensorDto };
      jest.spyOn(repo, 'save').mockResolvedValue(updatedSensor);

      const result = await service.update(1, updateSensorDto);

      expect(result).toEqual(updatedSensor);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.save).toHaveBeenCalledWith(updatedSensor);
      expect(eventEmitter.emit).toHaveBeenCalledWith('sensor.statusUpdate', {
        id: updatedSensor.id,
        currentStatus: updatedSensor.currentStatus,
      });
    });

    it('should throw NotFoundException if sensor to update is not found', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Updated Sensor' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a sensor', async () => {
      const result = await service.remove(1);

      expect(result).toEqual(mockSensor);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.remove).toHaveBeenCalledWith(mockSensor);
    });

    it('should throw NotFoundException if sensor to remove is not found', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

});
