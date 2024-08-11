import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './entities/sensor.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
    private eventEmitter: EventEmitter2
  ) {}

  create(createSensorDto: CreateSensorDto) {
    const newSensor = this.sensorRepository.create(createSensorDto);
    return this.sensorRepository.save(newSensor);
  }

  findAll() {
    return this.sensorRepository.find();
  }

  async findOne(id: number) {
    const sensor = await this.sensorRepository.findOneBy({ id });
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }
    return sensor;
  }

  async update(id: number, updateSensorDto: UpdateSensorDto) {
    const prevSensor = await this.findOne(id);
    const updatedSensor = await this.sensorRepository.save({ ...prevSensor, ...updateSensorDto }); 
    // Emit status update if currentStatus has changed
    if (
      updateSensorDto.currentStatus &&
      updateSensorDto.currentStatus !== prevSensor.currentStatus
    ) {
      this.eventEmitter.emit('sensor.statusUpdate', {
        id: updatedSensor.id,
        currentStatus: updatedSensor.currentStatus,
      });
    }
    return updatedSensor;
  }

  async remove(id: number) {
    const sensor = await this.findOne(id);
    return this.sensorRepository.remove(sensor);
  }
}
