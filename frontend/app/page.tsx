'use client';

import { useEffect, useState } from 'react';
import { fetchDevices } from '@/actions/fetchDevices';
import {SensorList} from '@/components/sensors-list';

export default function Home() {
  
  const [data, setData ] = useState<string>("");

  useEffect(()=>{
    const updateState = async()=>{
      const testThing = await fetchDevices();
      setData(testThing);
    };
    updateState();
  },[])

  return (
    <main className="h-full flex flex-col items-center justify-center px-16 ">
      <h1>Hello</h1>
      <SensorList />
    </main>
  );
}
