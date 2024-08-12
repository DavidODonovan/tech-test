'use client';

import { useEffect, useState } from 'react';
import {SensorsTable} from '@/components/SensorsTable/sensors-table';

export default function Home() {
  
  return (
    <main className="h-full flex flex-col items-center justify-center px-16 ">
      <h1>Hello Sensors</h1>
      <SensorsTable />
    </main>
  );
}
