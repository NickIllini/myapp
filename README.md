# Interactive Map App

A modern, feature-rich map application built with React, TypeScript, and Leaflet.

## Features

- **Interactive Map**: Built with Leaflet and OpenStreetMap tiles
- **Location Search**: Search for any location worldwide using the search box
- **Current Location**: Get your current GPS location with one click
- **Custom Markers**: Click anywhere on the map to add custom markers
- **Multiple Marker Types**: 
  - 🔴 Red markers for search results
  - 🟢 Green markers for current location
  - 🔵 Blue markers for custom locations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS

## How to Use

1. **Search for locations**: Use the search box in the top-left to find any location
2. **Add custom markers**: Click anywhere on the map to place a marker
3. **Find your location**: Click the 📍 button to get your current GPS location
4. **Clear markers**: Click the 🗑️ button to remove all markers
5. **View details**: Click on any marker to see location details

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **React Leaflet** - React integration for Leaflet
- **OpenStreetMap** - Map tiles
- **Nominatim API** - Geocoding service

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Usage

This app uses free and open-source services:
- **OpenStreetMap** for map tiles
- **Nominatim** for geocoding (search functionality)
- **Browser Geolocation API** for current location

No API keys required!

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Location features require HTTPS (except localhost)
