'use server';

export type Sensor = {
  id: number;
  name: string;
  serialNumber: string;
  firmwareVersion: string;
  currentStatus: 'ONLINE' | 'OFFLINE';
};

export const fetchSensors = async (): Promise<Sensor[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sensors`);
  if (!response.ok) {
    throw new Error('Failed to fetch sensors');
  };
  return response.json();
};