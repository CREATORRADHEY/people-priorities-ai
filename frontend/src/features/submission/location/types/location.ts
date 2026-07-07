export interface LocationData {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  locality?: string;
  ward?: string;
  landmark?: string;
  source: 'gps' | 'manual';
  capturedAt: string;
}

export type GPSState = 'idle' | 'fetching' | 'success' | 'error';
