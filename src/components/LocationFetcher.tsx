import React, { useState } from 'react';

interface LocationFetcherProps {
  onAddressFetched?: (address: string) => void;
}

const LocationFetcher: React.FC<LocationFetcherProps> = ({ onAddressFetched }) => {
  const [location, setLocation] = useState<string>('Not fetched');
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by your browser.';
      setLocation(errorMsg);
      onAddressFetched?.(errorMsg);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) throw new Error('Failed to fetch address');

          const data = await response.json();
          const address = data.display_name || 'Address not found';

          setLocation(address);
          onAddressFetched?.(address);
        } catch (error) {
          console.error('Geocoding error:', error);
          const errorMsg = 'Unable to fetch address.';
          setLocation(errorMsg);
          onAddressFetched?.(errorMsg);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        const errorMsg = 'Unable to retrieve your location.';
        setLocation(errorMsg);
        onAddressFetched?.(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="space-y-4">
      <button
        onClick={fetchLocation}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Fetching Location...' : 'Get Current Location'}
      </button>
      <p className="text-sm text-gray-800">{location}</p>
    </div>
  );
};

export default LocationFetcher; 