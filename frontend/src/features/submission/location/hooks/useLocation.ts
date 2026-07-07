import { useState, useCallback } from 'react';
import { useSubmissionDraft } from '../../hooks/useSubmissionDraft';
import { GPSState } from '../types/location';

export function useLocation() {
  const { draft, updateDraft } = useSubmissionDraft();
  const [gpsState, setGpsState] = useState<GPSState>(draft.location?.source === 'gps' ? 'success' : 'idle');
  const [gpsError, setGpsError] = useState<string | null>(null);

  // 1. Capture browser Geolocation
  const captureGPSLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsState('error');
      return;
    }

    setGpsState('fetching');
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const capturedAt = new Date().toISOString();
        const { latitude, longitude, accuracy } = position.coords;

        updateDraft((prev) => ({
          ...prev,
          location: {
            latitude,
            longitude,
            accuracy,
            source: 'gps',
            capturedAt,
          },
        }));
        setGpsState('success');
      },
      (error) => {
        let msg = "Failed to capture location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "Location permission denied. Please enable location access in settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            msg = "Location request timed out.";
            break;
        }
        setGpsError(msg);
        setGpsState('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [updateDraft]);

  // 2. Save manual address location entry
  const updateManualLocation = useCallback((locality: string, ward?: string, landmark?: string) => {
    const capturedAt = new Date().toISOString();
    
    updateDraft((prev) => ({
      ...prev,
      location: {
        locality: locality.trim(),
        ward: ward?.trim() || undefined,
        landmark: landmark?.trim() || undefined,
        source: 'manual',
        capturedAt,
      },
    }));
    setGpsState('idle');
    setGpsError(null);
  }, [updateDraft]);

  // 3. Clear stored location
  const clearLocation = useCallback(() => {
    updateDraft((prev) => ({
      ...prev,
      location: undefined,
    }));
    setGpsState('idle');
    setGpsError(null);
  }, [updateDraft]);

  return {
    location: draft.location,
    gpsState,
    gpsError,
    captureGPSLocation,
    updateManualLocation,
    clearLocation,
  };
}
