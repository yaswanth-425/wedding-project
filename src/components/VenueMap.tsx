import { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '@/config/constants';

interface VenueMapProps {
  latitude?: number;
  longitude?: number;
  venueName?: string;
  address?: string;
}

export function VenueMap({
  latitude = WEDDING_CONFIG.venue.latitude,
  longitude = WEDDING_CONFIG.venue.longitude,
  venueName = WEDDING_CONFIG.venue.name,
  address = WEDDING_CONFIG.venue.address,
}: VenueMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Use OpenStreetMap for free alternative
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;


  const openInMaps = () => {
    // Open in Google Maps
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  const openDirections = () => {
    // Open in Google Maps for directions
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(directionsUrl, '_blank');
  };

  const shareLocation = () => {
    const shareText = `${venueName}\n${address}\n\nCoordinates: ${latitude}, ${longitude}`;
    const exactLocationUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    
    if (navigator.share) {
      navigator.share({
        title: venueName,
        text: shareText,
        url: exactLocationUrl,
      }).catch(() => {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText);
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
      // Also open the exact location link
      window.open(exactLocationUrl, '_blank');
    }
  };

  return (
    <div className="paper rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="script text-[14px] text-primary">{venueName}</h3>
        <div className="flex gap-2">
          <button
            onClick={openInMaps}
            className="label text-xs bg-gold text-white px-3 py-1 rounded-full hover:bg-gold/90 transition-colors"
          >
            View Map
          </button>
          <button
            onClick={openDirections}
            className="label text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full hover:bg-primary/90 transition-colors"
          >
            Directions
          </button>
        </div>
      </div>

      <p className="serif text-muted-foreground">{address}</p>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden bg-muted/20">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="label text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}

        {mapError ? (
          <div className="aspect-video flex items-center justify-center bg-muted/20">
            <div className="text-center p-4">
              <svg className="w-12 h-12 text-muted-foreground mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="serif text-muted-foreground mb-2">Map Preview</p>
              <p className="label text-xs text-muted-foreground">{latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
            </div>
          </div>
        ) : (
          <iframe
            src={osmUrl}
            className="w-full aspect-video border-0"
            title={`Map of ${venueName}`}
            onLoad={() => setMapLoaded(true)}
            onError={() => setMapError(true)}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        )}
      </div>

      {/* Location Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <p className="label text-muted-foreground">Coordinates</p>
          <p className="serif font-mono text-xs">{latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
        </div>
        <div className="space-y-2">
          <p className="label text-muted-foreground">Area</p>
          <p className="serif text-xs">{WEDDING_CONFIG.venue.area}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={openDirections}
          className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-full label text-sm hover:bg-primary/90 transition-colors"
        >
          Get Directions
        </button>
        <button
          onClick={shareLocation}
          className="flex-1 border border-border bg-background/60 py-2 px-4 rounded-full label text-sm hover:bg-accent transition-colors"
        >
          Share Location
        </button>
      </div>

      {/* Transportation Info */}
      <div className="border-t border-border pt-4">
        <p className="label text-muted-foreground mb-2">Getting There</p>
        <div className="space-y-1 text-sm">
          <p className="serif text-muted-foreground">🚇 Nearest BusStand: {WEDDING_CONFIG.transportation.metro}</p>
          <p className="serif text-muted-foreground">🚖 Taxi/Ride: {WEDDING_CONFIG.transportation.taxi}</p>
          <p className="serif text-muted-foreground">🚗 Parking: {WEDDING_CONFIG.transportation.parking}</p>
        </div>
      </div>
    </div>
  );
}
