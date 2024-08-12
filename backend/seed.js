const axios = require('axios');
const { faker } = require('@faker-js/faker');

const numItems = process.argv[2] || 10;

async function seedDatabase() {
  const sensors = Array.from({ length: numItems }).map(() => ({
    name: faker.commerce.productName(),
    serialNumber: faker.string.uuid(),
    firmwareVersion: `v${faker.system.semver()}`,
    currentStatus: faker.helpers.arrayElement([
      'OFFLINE',
      'ONLINE',
    ]),
  }));

  for (const sensor of sensors) {
    try {
      const response = await axios.post(
        'http://localhost:3001/sensors',
        sensor,
      );
      console.log(`Sensor ${sensor.name} created successfully:`, response.data);
    } catch (error) {
      console.error(
        `Error creating sensor ${sensor.name}:`,
        error.response ? error.response.data : error.message,
      );
    }
  }
}

seedDatabase();
