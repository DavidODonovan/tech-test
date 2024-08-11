import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './entities/sensor.entity';

@Injectable()
export class SensorsService {

  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
  ) {}

  create(createSensorDto: CreateSensorDto) {
    const newSensor = this.sensorRepository.create(createSensorDto);
    return this.sensorRepository.save(newSensor);
  }

  findAll() {
    return this.sensorRepository.find();
  }

  findOne(id: number) {
    return this.sensorRepository.findOneBy({ id })
  }

  async update(id: number, updateSensorDto: UpdateSensorDto) {
    const sensor = await this.findOne(id);
    return this.sensorRepository.save({...sensor, ...updateSensorDto})
  }

  async remove(id: number) {
    const sensor = await this.findOne(id);
    return this.sensorRepository.remove(sensor);
  }
}
