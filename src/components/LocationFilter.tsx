
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentLocation, calculateDistance, parseLocationCoordinates, LocationData, LocationError } from '../services/locationService';
import { Event } from '../pages/Index';

interface LocationFilterProps {
  events: Event[];
  onFilteredEvents: (events: Event[]) => void;
  maxDistance?: number;
}

export const LocationFilter = ({ events, onFilteredEvents, maxDistance = 10 }: LocationFilterProps) => {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  const requestLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setIsLocationEnabled(true);
      filterNearbyEvents(location);
    } catch (err) {
      const error = err as LocationError;
      setError(error.message);
      setIsLocationEnabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNearbyEvents = (location: LocationData) => {
    const nearbyEvents = events.filter(event => {
      const eventCoords = parseLocationCoordinates(event.location);
      if (!eventCoords) return true; // Include events where we can't determine location
      
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        eventCoords.lat,
        eventCoords.lng
      );
      
      return distance <= maxDistance;
    });
    
    // Sort by distance (closest first)
    nearbyEvents.sort((a, b) => {
      const aCoordsData = parseLocationCoordinates(a.location);
      const bCoordsData = parseLocationCoordinates(b.location);
      
      if (!aCoordsData || !bCoordsData) return 0;
      
      const aDistance = calculateDistance(
        location.latitude,
        location.longitude,
        aCoordsData.lat,
        aCoordsData.lng
      );
      
      const bDistance = calculateDistance(
        location.latitude,
        location.longitude,
        bCoordsData.lat,
        bCoordsData.lng
      );
      
      return aDistance - bDistance;
    });
    
    onFilteredEvents(nearbyEvents);
  };

  const clearLocationFilter = () => {
    setIsLocationEnabled(false);
    setUserLocation(null);
    setError(null);
    onFilteredEvents(events);
  };

  const getDistanceToEvent = (event: Event): string | null => {
    if (!userLocation) return null;
    
    const eventCoords = parseLocationCoordinates(event.location);
    if (!eventCoords) return null;
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      eventCoords.lat,
      eventCoords.lng
    );
    
    return distance < 1 
      ? `${Math.round(distance * 1000)}m away`
      : `${distance.toFixed(1)}km away`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {!isLocationEnabled ? (
          <Button
            onClick={requestLocation}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            {isLoading ? 'Getting Location...' : 'Find Nearby Events'}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={clearLocationFilter}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Show All Events
            </Button>
            <span className="text-sm text-green-600 font-medium">
              Showing events within {maxDistance}km
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {isLocationEnabled && userLocation && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm">
          <MapPin className="h-4 w-4 inline mr-1" />
          Location detected (±{Math.round(userLocation.accuracy)}m accuracy)
        </div>
      )}
    </div>
  );
};

// Export the distance calculation function for use in EventCard
export { parseLocationCoordinates, calculateDistance };
