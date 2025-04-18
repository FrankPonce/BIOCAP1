export type SiteData = {
    id: string;
    name: string;
    coordinates: [number, number];
    description: string;
    timestamp: string;
    parameters: {
      temperature: string;
      salinity: string;
      turbidity: string;
      pH: string;
      dissolvedOxygen: string;
    };
    timeSeriesData: {
      temperature: Array<{ time: string; value: number }>;
      salinity: Array<{ time: string; value: number }>;
      turbidity: Array<{ time: string; value: number }>;    
      pH: Array<{ time: string; value: number }>;
      dissolvedOxygen: Array<{ time: string; value: number }>;
    };
  }
  
  export const sites: SiteData[] = [
    {
      id: 'site1',
      name: 'Morningside Park',
      coordinates: [25.823004213636505, -80.17820662673486],
      description: 'Coastal monitoring station',
      timestamp: '2024-01-20 14:30:00',
      parameters: {
        temperature: '24.5°C',
        salinity: '35 PSU',
        turbidity: '2.8 NTU',
        pH: '8.2',
        dissolvedOxygen: '6.8 mg/L'
      },
      timeSeriesData: {
        temperature: [
          { time: '00:00', value: 24.2 },
          { time: '04:00', value: 23.8 },
          { time: '08:00', value: 24.5 },
          { time: '12:00', value: 25.2 },
          { time: '16:00', value: 24.8 },
          { time: '20:00', value: 24.3 },
          { time: '24:00', value: 24.0 }
        ],
        salinity: [
          { time: '00:00', value: 35.2 },
          { time: '04:00', value: 35.0 },
          { time: '08:00', value: 34.8 },
          { time: '12:00', value: 35.5 },
          { time: '16:00', value: 35.3 },
          { time: '20:00', value: 35.1 },
          { time: '24:00', value: 35.0 }
        ],
        turbidity: [
          { time: '00:00', value: 2.5 },
          { time: '04:00', value: 2.8 },
          { time: '08:00', value: 3.2 },
          { time: '12:00', value: 2.9 },
          { time: '16:00', value: 2.7 },
          { time: '20:00', value: 2.6 },
          { time: '24:00', value: 2.5 }
        ],
        pH: [
          { time: '00:00', value: 8.1 },
          { time: '04:00', value: 8.2 },
          { time: '08:00', value: 8.3 },
          { time: '12:00', value: 8.2 },
          { time: '16:00', value: 8.1 },
          { time: '20:00', value: 8.2 },
          { time: '24:00', value: 8.2 }
        ],
        dissolvedOxygen: [
          { time: '00:00', value: 6.5 },
          { time: '04:00', value: 6.7 },
          { time: '08:00', value: 7.0 },
          { time: '12:00', value: 6.8 },
          { time: '16:00', value: 6.6 },
          { time: '20:00', value: 6.5 },
          { time: '24:00', value: 6.4 }
        ]
      }
    },
    {
      id: 'site2',
      name: 'Miami Shores',
      coordinates: [25.8714, -80.17398],
      description: 'Deep water monitoring near shipping channel',
      timestamp: '2025-03-21 22:40:00',
      parameters: {
        temperature: '22.8°C',
        salinity: '38 PSU',
        turbidity: '4.2 NTU',
        pH: '7.9',
        dissolvedOxygen: '5.9 mg/L'
      },
      timeSeriesData: {
        temperature: [
          { time: '00:00', value: 22.5 },
          { time: '04:00', value: 22.2 },
          { time: '08:00', value: 22.8 },
          { time: '12:00', value: 23.5 },
          { time: '16:00', value: 23.2 },
          { time: '20:00', value: 22.9 },
          { time: '24:00', value: 22.6 }
        ],
        salinity: [
          { time: '00:00', value: 38.2 },
          { time: '04:00', value: 38.0 },
          { time: '08:00', value: 38.8 },
          { time: '12:00', value: 39.5 },
          { time: '16:00', value: 39.3 },
          { time: '20:00', value: 39.1 },
          { time: '24:00', value: 39.0 }
        ],
        turbidity: [
          { time: '00:00', value: 4.5 },
          { time: '04:00', value: 4.8 },
          { time: '08:00', value: 5.2 },
          { time: '12:00', value: 4.9 },
          { time: '16:00', value: 4.7 },
          { time: '20:00', value: 4.6 },
          { time: '24:00', value: 4.5 }
        ],
        pH: [
          { time: '00:00', value: 7.8 },
          { time: '04:00', value: 7.9 },
          { time: '08:00', value: 8.0 },
          { time: '12:00', value: 7.9 },
          { time: '16:00', value: 7.8 },
          { time: '20:00', value: 7.9 },
          { time: '24:00', value: 7.9 }
        ],
        dissolvedOxygen: [
          { time: '00:00', value: 5.5 },
          { time: '04:00', value: 5.7 },
          { time: '08:00', value: 6.0 },
          { time: '12:00', value: 5.8 },
          { time: '16:00', value: 5.6 },
          { time: '20:00', value: 5.5 },
          { time: '24:00', value: 5.4 }
        ]
      }
    },
    {
      id: 'site3',
      name: 'Key Biscayne',
      coordinates: [25.6891, -80.1621],
      description: 'Shallow water reef monitoring station',
      timestamp: '2024-01-20 14:40:00',
      parameters: {
        temperature: '26.2°C',
        salinity: '32 PSU',
        turbidity: '1.8 NTU',
        pH: '8.4',
        dissolvedOxygen: '7.5 mg/L'
      },
      timeSeriesData: {
        temperature: [
          { time: '00:00', value: 26.0 },
          { time: '04:00', value: 25.8 },
          { time: '08:00', value: 26.2 },
          { time: '12:00', value: 26.8 },
          { time: '16:00', value: 26.5 },
          { time: '20:00', value: 26.1 },
          { time: '24:00', value: 25.9 }
        ],
        salinity: [
          { time: '00:00', value: 32.2 },
          { time: '04:00', value: 32.0 },
          { time: '08:00', value: 32.8 },
          { time: '12:00', value: 33.5 },
          { time: '16:00', value: 33.3 },
          { time: '20:00', value: 33.1 },
          { time: '24:00', value: 33.0 }
        ],
        turbidity: [
          { time: '00:00', value: 1.5 },
          { time: '04:00', value: 1.8 },
          { time: '08:00', value: 2.2 },
          { time: '12:00', value: 1.9 },
          { time: '16:00', value: 1.7 },
          { time: '20:00', value: 1.6 },
          { time: '24:00', value: 1.5 }
        ],
        pH: [
          { time: '00:00', value: 8.3 },
          { time: '04:00', value: 8.4 },
          { time: '08:00', value: 8.5 },
          { time: '12:00', value: 8.4 },
          { time: '16:00', value: 8.3 },
          { time: '20:00', value: 8.4 },
          { time: '24:00', value: 8.4 }
        ],
        dissolvedOxygen: [
          { time: '00:00', value: 7.5 },
          { time: '04:00', value: 7.7 },
          { time: '08:00', value: 8.0 },
          { time: '12:00', value: 7.8 },
          { time: '16:00', value: 7.6 },
          { time: '20:00', value: 7.5 },
          { time: '24:00', value: 7.4 }
        ]
      }
    }
  ];