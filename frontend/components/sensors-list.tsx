'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import io from 'socket.io-client';
import { useSensorStore } from '../lib/store';

const fetchSensors = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sensors`);
  console.log("I was called: ", `${process.env.NEXT_PUBLIC_API_URL}/sensors`)
  if (!response.ok) {
    throw new Error('Failed to fetch sensors');
  }
  console.log({response})
  return  await response.json();
};

export const  SensorList=()=>{
  const { sensors, updateSensor } = useSensorStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ['sensors'],
    queryFn: fetchSensors,
    onSuccess: (data) => useSensorStore.setState({ sensors: data })
  });

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || '');
    socket.on('statusUpdate', (updatedSensor) => {
      updateSensor(updatedSensor);
    });
    return () => {
      socket.disconnect();
    };
  }, [updateSensor]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching sensors</div>;

  return (
    <div>
      {sensors.map((sensor) => (
        <div key={sensor.id}>
          {sensor.name} - Status: {sensor.currentStatus}
        </div>
      ))}
    </div>
  );
}

