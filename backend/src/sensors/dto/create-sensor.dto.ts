import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

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

  @IsEnum(['OFFLINE', 'ONLINE'], { message: 'Valid role required' })
  role: 'OFFLINE' | 'ONLINE';
}
