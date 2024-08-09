'use server';

export const fetchDevices = async():Promise<string>=>{
  console.log("I was called")
  const response = await fetch('http://localhost:3001');
  return await response.json();
}