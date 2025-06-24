
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let message = 'Unknown error occurred';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'The request to get user location timed out.';
            break;
        }
        reject({
          code: error.code,
          message
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  });
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Simple geocoding function (in a real app, you'd use a proper geocoding service)
export const parseLocationCoordinates = (location: string): { lat: number; lng: number } | null => {
  // This is a very basic implementation - in production you'd use Google Maps API or similar
  // For now, we'll just handle some common location formats
  const coordPattern = /(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/;
  const match = location.match(coordPattern);
  
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2])
    };
  }
  
  // For demo purposes, assign approximate coordinates to some common locations
  const locationMap: { [key: string]: { lat: number; lng: number } } = {
    'downtown': { lat: 40.7128, lng: -74.0060 },
    'park': { lat: 40.7831, lng: -73.9712 },
    'community center': { lat: 40.7589, lng: -73.9851 },
    'library': { lat: 40.7532, lng: -73.9822 },
    'school': { lat: 40.7614, lng: -73.9776 }
  };
  
  const lowercaseLocation = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationMap)) {
    if (lowercaseLocation.includes(key)) {
      return coords;
    }
  }
  
  return null;
};
