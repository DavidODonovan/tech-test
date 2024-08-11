import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { Sensor } from './entities/sensor.entity';
import { SensorsListener } from './sensors.listener';
import { SensorsGateway } from './sensors.gateway';

//TODO: add GRPC service to this module
@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  controllers: [SensorsController],
  providers: [SensorsService, SensorsGateway, SensorsListener],
})
export class SensorsModule {}
