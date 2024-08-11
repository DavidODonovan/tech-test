import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum SensorStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
}

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  serialNumber: string;

  @Column()
  firmwareVersion: string;

  @Column({
    type: 'enum',
    enum: SensorStatus,
    default: SensorStatus.OFFLINE,
  })
  currentStatus: SensorStatus;
}
