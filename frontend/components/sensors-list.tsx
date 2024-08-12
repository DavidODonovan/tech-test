'use client';
import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSensors, Sensor as SensorType } from '@/actions/sensors';
import { useSensorStatusStore } from '@/store';
import { setupSocket, SensorStatus } from '@/lib/socketSetup';

export const SensorList = () => {
  const queryClient = useQueryClient();
  const { data: sensors, isLoading } = useQuery({
    queryKey: ['sensors'],
    queryFn: ()=>fetchSensors()
  });

  const { updateStatus, sensorStatuses } = useSensorStatusStore();

  const updateSensorStatus = useCallback((sensor: SensorType, id: number, newStatus: SensorStatus): SensorType => (sensor.id === id ? { ...sensor, currentStatus: newStatus } : sensor), []);

  useEffect(() => {
    const socket = setupSocket((id, currentStatus) => {
      updateStatus(id, currentStatus);

      // Optimistically update React Query cache
      queryClient.setQueryData<SensorType[]>(['sensors'], (oldSensors = []) => oldSensors.map((sensor) => updateSensorStatus(sensor, id, currentStatus)));
    });

    return () => {
      socket.disconnect();
    };
  }, [updateStatus, queryClient, updateSensorStatus]);

  if (isLoading) return <div>Loading sensors...</div>;

  return (
    <div>
      {sensors?.map((sensor: SensorType) => (
        <div key={sensor.id}>
          Serial Number: {sensor.serialNumber}, Device name: {sensor.name}, Firmware version: {sensor.firmwareVersion}, Status: {sensorStatuses[sensor.id] || sensor.currentStatus}
        </div>
      ))}
    </div>
  );
};
