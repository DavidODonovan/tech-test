'use client';

import { useEffect, useState } from 'react';
import {SensorList} from '@/components/sensors-list';

export default function Home() {
  
  return (
    <main className="h-full flex flex-col items-center justify-center px-16 ">
      <h1>Hello</h1>
      <SensorList />
    </main>
  );
}
