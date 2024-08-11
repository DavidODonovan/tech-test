import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SensorsGateway } from './sensors.gateway';

@Injectable()
export class SensorsListener {
  constructor(private sensorsGateway: SensorsGateway) {}

  @OnEvent('sensor.statusUpdate')
  handleStatusUpdate(payload: { id: number; currentStatus: string }) {
    this.sensorsGateway.emitStatusUpdate(payload.id, payload.currentStatus);
  }
}
