import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SensorStatusStore {
  sensorStatuses: Record<number, 'ONLINE' | 'OFFLINE'>;
  updateStatus: (sensorId: number, status: 'ONLINE' | 'OFFLINE') => void;
}

export const useSensorStatusStore = create<SensorStatusStore>((set) => ({
  sensorStatuses: {},
  updateStatus: (sensorId, status) =>
  {
    console.log("hello status update, ", status);
    return set((state) => ({sensorStatuses: { ...state.sensorStatuses, [sensorId]: status }}))
  }
}));

