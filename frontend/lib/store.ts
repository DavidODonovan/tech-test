import { create } from 'zustand';

interface Sensor {
  id: number;
  name: string;
  currentStatus: string;
}

interface SensorStore {
  sensors: Sensor[];
  updateSensor: (updatedSensor: Sensor) => void;
}

export const useSensorStore = create<SensorStore>((set) => ({
  sensors: [],
  updateSensor: (updatedSensor) =>
    set((state) => ({
      sensors: state.sensors.map((sensor) =>
        sensor.id === updatedSensor.id ? { ...sensor, ...updatedSensor } : sensor
      ),
    })),
}));