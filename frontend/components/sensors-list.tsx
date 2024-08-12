'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSensors, Sensor as SensorType } from '@/actions/sensors';
import { useSensorStatusStore } from '@/store';
import { setupSocket } from '@/lib/socketSetup';

export const  SensorList=()=>{
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['sensors'], queryFn: ()=>fetchSensors() });
  const { data: sensors, isLoading } = query;  
  const sensorStatusStore  = useSensorStatusStore()
  const { updateStatus } = sensorStatusStore;

  useEffect(() => {
    console.log({sensorStatusStore});
    const socket = setupSocket((id, currentStatus) => {
      updateStatus(id, currentStatus);
      // Optimistically update React Query cache
      queryClient.setQueryData<SensorType[]>('sensors', (oldSensors = []) => oldSensors.map((sensor) => (sensor.id === id ? { ...sensor, currentStatus } : sensor)));
    });

    return () => {
      socket.disconnect();
    };
  }, [updateStatus, queryClient]);

  return (
    <div>
      {sensors && sensors.map((d: any) => {
        return (
          <div key={d.id}>
            Serial Number: {d.serialNumber}, Device name:{d.name}, Firmware version: {d.firmwareVersion} Status: {d.currentStatus}
          </div>
        )
      }
     )}
    </div>
  );
}

