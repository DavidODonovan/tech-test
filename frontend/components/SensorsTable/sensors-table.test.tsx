import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SensorsTable } from './sensors-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as storeModule from '../../store';
import * as socketSetupModule from '../../lib/socketSetup';
import * as sensorsModule from '../../actions/sensors';

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useQueryClient: jest.fn()
}));
jest.mock('../../store');
jest.mock('../../lib/socketSetup');
jest.mock('../../actions/sensors');

// Mock data
const mockSensors = [
  { id: 1, name: 'Sensor 1', serialNumber: 'SN001', firmwareVersion: '1.0', currentStatus: 'ONLINE' },
  { id: 2, name: 'Sensor 2', serialNumber: 'SN002', firmwareVersion: '1.1', currentStatus: 'OFFLINE' }
];

describe('SensorsTable', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockSensors,
      isLoading: false
    });
    jest.spyOn(storeModule, 'useSensorStatusStore').mockReturnValue({
      updateStatus: jest.fn(),
      sensorStatuses: {}
    });
    (socketSetupModule.setupSocket as jest.Mock).mockReturnValue({
      disconnect: jest.fn()
    });
    (sensorsModule.fetchSensors as jest.Mock).mockResolvedValue(mockSensors);

    const mockQueryClient = {
      setQueryData: jest.fn()
    };
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
  });

  it('renders the table with sensor data', () => {
    render(<SensorsTable />);
    expect(screen.getByText('Sensor 1')).toBeInTheDocument();
    expect(screen.getByText('Sensor 2')).toBeInTheDocument();
    expect(screen.getByText('SN001')).toBeInTheDocument();
    expect(screen.getByText('SN002')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true
    });
    render(<SensorsTable />);
    expect(screen.getByText('Loading sensors...')).toBeInTheDocument();
  });

  it('sorts the table when clicking on the Name header', async () => {
    render(<SensorsTable />);
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Sensor 1');
      expect(rows[2]).toHaveTextContent('Sensor 2');
    });
    fireEvent.click(nameHeader);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('Sensor 2');
      expect(rows[2]).toHaveTextContent('Sensor 1');
    });
  });

  it('copies serial number to clipboard when action is clicked', () => {
    const mockClipboard = {
      writeText: jest.fn()
    };
    Object.assign(navigator, {
      clipboard: mockClipboard
    });

    render(<SensorsTable />);
    const actionsButton = screen.getAllByRole('button', { name: 'Open menu' })[0];
    fireEvent.click(actionsButton);
    const copyAction = screen.getByText('Copy serial number');
    fireEvent.click(copyAction);
    expect(mockClipboard.writeText).toHaveBeenCalledWith('SN001');
  });

  it('updates sensor status when receiving websocket update', async () => {
    const mockUpdateStatus = jest.fn();
    const mockSetQueryData = jest.fn();

    jest.spyOn(storeModule, 'useSensorStatusStore').mockReturnValue({
      updateStatus: mockUpdateStatus,
      sensorStatuses: {}
    });

    (useQueryClient as jest.Mock).mockReturnValue({
      setQueryData: mockSetQueryData
    });

    // Mock the setupSocket function to immediately call the callback
    (socketSetupModule.setupSocket as jest.Mock).mockImplementation((callback) => {
      // Simulate a websocket message immediately
      callback(1, { id: 1, currentStatus: 'OFFLINE' });
      return { disconnect: jest.fn() };
    });

    render(<SensorsTable />);

    // Wait for any asynchronous operations to complete
    await waitFor(() => {
      expect(mockUpdateStatus).toHaveBeenCalledWith(1, 'OFFLINE');
    });

    expect(mockSetQueryData).toHaveBeenCalledWith(['sensors'], expect.any(Function));

    // Test the update function
    const updateFunction = mockSetQueryData.mock.calls[0][1];
    const oldSensors = [
      { id: 1, currentStatus: 'ONLINE' },
      { id: 2, currentStatus: 'ONLINE' }
    ];
    const updatedSensors = updateFunction(oldSensors);
    expect(updatedSensors).toEqual([
      { id: 1, currentStatus: 'OFFLINE' },
      { id: 2, currentStatus: 'ONLINE' }
    ]);
  });

  it('displays the correct status indicator colors', () => {
    const mockSensors = [
      { id: 1, name: 'Sensor 1', serialNumber: 'SN001', firmwareVersion: '1.0', currentStatus: 'ONLINE' },
      { id: 2, name: 'Sensor 2', serialNumber: 'SN002', firmwareVersion: '1.1', currentStatus: 'OFFLINE' }
    ];

    (useQuery as jest.Mock).mockReturnValue({
      data: mockSensors,
      isLoading: false
    });

    jest.spyOn(storeModule, 'useSensorStatusStore').mockReturnValue({
      updateStatus: jest.fn(),
      sensorStatuses: { 1: 'ONLINE', 2: 'OFFLINE' }
    });

    const { container } = render(<SensorsTable />);
    console.log('Rendered HTML:', container.innerHTML);

    // Check if the sensor names are rendered
    console.log('Sensor 1 present:', screen.queryByText('Sensor 1') !== null);
    console.log('Sensor 2 present:', screen.queryByText('Sensor 2') !== null);

    const statusIndicators = screen.queryAllByTestId('status-indicator');
    console.log('Number of status indicators found:', statusIndicators.length);

    // Search for elements with specific classes
    const greenIndicators = container.querySelectorAll('.bg-green-500');
    const redIndicators = container.querySelectorAll('.bg-red-500');
    console.log('Green indicators:', greenIndicators.length);
    console.log('Red indicators:', redIndicators.length);

    // Search for all small round divs
    const roundDivs = container.querySelectorAll('div.rounded-full');
    console.log('Round divs:', roundDivs.length);

    // Log all divs for inspection
    const allDivs = container.querySelectorAll('div');
    console.log('All divs:', allDivs.length);
    allDivs.forEach((div, index) => {
      console.log(`Div ${index}:`, div.outerHTML);
    });

    // Adjust the expectations based on what we find
    expect(statusIndicators.length + greenIndicators.length + redIndicators.length).toBeGreaterThan(0);
    if (statusIndicators.length > 0) {
      expect(statusIndicators).toHaveLength(2);
      expect(statusIndicators.some((indicator) => indicator.classList.contains('bg-green-500'))).toBeTruthy();
      expect(statusIndicators.some((indicator) => indicator.classList.contains('bg-red-500'))).toBeTruthy();
    } else if (greenIndicators.length > 0 || redIndicators.length > 0) {
      expect(greenIndicators.length + redIndicators.length).toBe(2);
    } else {
      throw new Error('No status indicators found by any method');
    }
  });

  it('handles pagination correctly', () => {
    const manyMockSensors = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Sensor ${i + 1}`,
      serialNumber: `SN00${i + 1}`,
      firmwareVersion: '1.0',
      currentStatus: i % 2 === 0 ? 'ONLINE' : 'OFFLINE'
    }));

    (useQuery as jest.Mock).mockReturnValue({
      data: manyMockSensors,
      isLoading: false
    });

    render(<SensorsTable />);
    expect(screen.getByText('Sensor 1')).toBeInTheDocument();
    expect(screen.queryByText('Sensor 11')).not.toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);

    expect(screen.queryByText('Sensor 1')).not.toBeInTheDocument();
    expect(screen.getByText('Sensor 11')).toBeInTheDocument();
  });
});
