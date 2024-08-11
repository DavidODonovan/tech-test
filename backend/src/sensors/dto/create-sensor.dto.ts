import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { SensorStatus } from '../entities/sensor.entity';

export class CreateSensorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsString()
  @IsNotEmpty()
  firmwareVersion: string;

  @IsEnum(SensorStatus, { message: 'Valid currentStatus required' })
  currentStatus: SensorStatus;
}
