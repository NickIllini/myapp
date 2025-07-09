import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LocationMarkerProps {
  position: [number, number]
  name: string
  type?: 'search' | 'current' | 'custom'
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, name, type = 'custom' }) => {
  const getIcon = () => {
    const iconSize: [number, number] = [25, 41]
    const iconAnchor: [number, number] = [12, 41]
    const popupAnchor: [number, number] = [1, -34]

    switch (type) {
      case 'current':
        return L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })
      case 'search':
        return L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
      default:
        return L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize,
          iconAnchor,
          popupAnchor,
          shadowSize: [41, 41],
        })
    }
  }

  return (
    <Marker position={position} icon={getIcon()}>
      <Popup>
        <div className="text-sm">
          <strong>{name}</strong>
          <br />
          <span className="text-gray-600">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        </div>
      </Popup>
    </Marker>
  )
}

export default LocationMarker