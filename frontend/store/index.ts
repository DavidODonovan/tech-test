import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SensorStatus } from '@/lib/socketSetup';

interface SensorStatusStore {
  sensorStatuses: Record<number, SensorStatus>;
  updateStatus: (sensorId: number, status: SensorStatus) => void;
}

export const useSensorStatusStore = create<SensorStatusStore>()(
  devtools(
    persist(
      (set) => ({
        sensorStatuses: {},
        updateStatus: (sensorId, status) => {
          console.log('Status update: ', sensorId, status);
          set((state) => ({
            sensorStatuses: { ...state.sensorStatuses, [sensorId]: status }
          }));
        }
      }),
      {
        name: 'sensor-status-storage'
      }
    )
  )
);
