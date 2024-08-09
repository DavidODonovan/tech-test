'use client';

import { useEffect, useState } from 'react';
import { fetchDevices } from '@/actions/fetchDevices';

export default function Home() {
  
  const [data, setData ] = useState<string>("");

  useEffect(()=>{
    const updateState = async()=>{
      const testThing = await fetchDevices();
      console.log("thing", testThing)
      setData(testThing);
    };
    updateState();
  },[])

  return (
      <main className="h-full flex flex-col items-center justify-center px-16 ">
        hello 
      </main>
  );
}
