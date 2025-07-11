import React, { useState, useCallback } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import SearchBox from './SearchBox'
import LocationMarker from './LocationMarker'
import TodoList from './TodoList'
import ColorLibrary from './ColorLibrary'
import { useGeolocation } from '../hooks/useGeolocation'
import { TodoItem, ColorLibraryItem } from '../types/todo'

interface MarkerData {
  id: string
  position: [number, number]
  name: string
  type: 'search' | 'current' | 'custom' | 'todo'
  todoId?: string
  completed?: boolean
  color?: string
}

const MapEvents: React.FC<{
  onMapClick: (lat: number, lng: number) => void
}> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const MapContainer: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]) // New York City default
  const [mapRef, setMapRef] = useState<L.Map | null>(null)
  
  // Todo state
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [todoListVisible, setTodoListVisible] = useState(false)
  const [pendingTodoId, setPendingTodoId] = useState<string | null>(null)
  
  // Color library state
  const [colorLibrary, setColorLibrary] = useState<ColorLibraryItem[]>([])
  const [colorLibraryVisible, setColorLibraryVisible] = useState(false)
  const [selectedTodoForColor, setSelectedTodoForColor] = useState<string | null>(null)
  
  const { latitude, longitude, getCurrentPosition, loading: geoLoading, error: geoError } = useGeolocation()

  const addMarker = useCallback((lat: number, lng: number, name: string, type: 'search' | 'current' | 'custom' | 'todo' = 'custom', todoId?: string, completed?: boolean, color?: string) => {
    const newMarker: MarkerData = {
      id: `${Date.now()}-${Math.random()}`,
      position: [lat, lng],
      name,
      type,
      todoId,
      completed,
      color,
    }
    
    // Remove existing markers of the same type (except custom and todo)
    if (type !== 'custom' && type !== 'todo') {
      setMarkers(prev => prev.filter(marker => marker.type !== type))
    }
    
    setMarkers(prev => [...prev, newMarker])
  }, [])

  const handleLocationFound = useCallback((lat: number, lng: number, name: string) => {
    addMarker(lat, lng, name, 'search')
    setMapCenter([lat, lng])
    if (mapRef) {
      mapRef.setView([lat, lng], 13)
    }
  }, [addMarker, mapRef])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (pendingTodoId) {
      // Adding location to a todo item
      setTodos(prev => prev.map(todo => 
        todo.id === pendingTodoId 
          ? { ...todo, position: [lat, lng], locationName: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
          : todo
      ))
      setPendingTodoId(null)
    } else {
      // Regular custom marker
      addMarker(lat, lng, `Custom location (${lat.toFixed(4)}, ${lng.toFixed(4)})`, 'custom')
    }
  }, [addMarker, pendingTodoId])

  const handleGetCurrentLocation = useCallback(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  // Add current location marker when geolocation is available
  React.useEffect(() => {
    if (latitude && longitude) {
      addMarker(latitude, longitude, 'Your current location', 'current')
      setMapCenter([latitude, longitude])
      if (mapRef) {
        mapRef.setView([latitude, longitude], 13)
      }
    }
  }, [latitude, longitude, addMarker, mapRef])

  // Update todo markers when todos change
  React.useEffect(() => {
    // Remove existing todo markers
    setMarkers(prev => prev.filter(marker => marker.type !== 'todo'))
    
    // Add markers for todos with positions
    todos.forEach(todo => {
      if (todo.position) {
        addMarker(
          todo.position[0], 
          todo.position[1], 
          todo.text, 
          'todo', 
          todo.id, 
          todo.completed,
          todo.color
        )
      }
    })
  }, [todos, addMarker])

  // Modified clearMarkers to only clear custom markers (not todo markers)
  const clearCustomMarkers = useCallback(() => {
    setMarkers(prev => prev.filter(marker => marker.type === 'todo'))
  }, [])

  // Todo management functions
  const handleAddTodo = useCallback((text: string) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}-${Math.random()}`,
      text,
      completed: false,
      createdAt: new Date(),
      color: '#3B82F6', // Default blue color
    }
    setTodos(prev => [...prev, newTodo])
  }, [])

  const handleToggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])

  const handleDeleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    // Remove associated marker
    setMarkers(prev => prev.filter(marker => marker.todoId !== id))
  }, [])

  const handleAddLocationToTodo = useCallback((id: string) => {
    setPendingTodoId(id)
  }, [])

  const handleRemoveLocationFromTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, position: undefined, locationName: undefined } : todo
    ))
    // Remove associated marker
    setMarkers(prev => prev.filter(marker => marker.todoId !== id))
  }, [])

  const handleSelectTodoLocation = useCallback((todo: TodoItem) => {
    if (todo.position && mapRef) {
      mapRef.setView(todo.position, 15)
    }
  }, [mapRef])

  const handleToggleTodoVisibility = useCallback(() => {
    setTodoListVisible(prev => !prev)
  }, [])

  // Color library functions
  const handleAddColorToLibrary = useCallback((name: string, color: string, category: string) => {
    const newColorItem: ColorLibraryItem = {
      id: `color-${Date.now()}-${Math.random()}`,
      name,
      color,
      category,
      createdAt: new Date(),
    }
    setColorLibrary(prev => [...prev, newColorItem])
  }, [])

  const handleDeleteColorFromLibrary = useCallback((id: string) => {
    setColorLibrary(prev => prev.filter(item => item.id !== id))
  }, [])

  const handleSelectColorFromLibrary = useCallback((color: string, category?: string) => {
    if (selectedTodoForColor) {
      setTodos(prev => prev.map(todo => 
        todo.id === selectedTodoForColor 
          ? { ...todo, color, colorCategory: category }
          : todo
      ))
      setSelectedTodoForColor(null)
      setColorLibraryVisible(false)
    }
  }, [selectedTodoForColor])

  const handleToggleColorLibrary = useCallback(() => {
    setColorLibraryVisible(prev => !prev)
  }, [])

  const handleSelectTodoForColor = useCallback((todoId: string) => {
    setSelectedTodoForColor(todoId)
    setColorLibraryVisible(true)
  }, [])

  const handleUpdateTodoColor = useCallback((todoId: string, color: string, category?: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { ...todo, color, colorCategory: category }
        : todo
    ))
  }, [])

  return (
    <div className="relative w-full h-full">
      <LeafletMapContainer
        center={mapCenter}
        zoom={13}
        className="w-full h-full"
        ref={setMapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={handleMapClick} />
        
        {markers.map(marker => (
          <LocationMarker
            key={marker.id}
            position={marker.position}
            name={marker.name}
            type={marker.type}
            completed={marker.completed}
            color={marker.color}
          />
        ))}
      </LeafletMapContainer>

      <SearchBox onLocationFound={handleLocationFound} />

      <TodoList
        todos={todos}
        onAddTodo={handleAddTodo}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
        onAddLocationToTodo={handleAddLocationToTodo}
        onRemoveLocationFromTodo={handleRemoveLocationFromTodo}
        onSelectTodoLocation={handleSelectTodoLocation}
        onSelectTodoForColor={handleSelectTodoForColor}
        onUpdateTodoColor={handleUpdateTodoColor}
        isVisible={todoListVisible}
        onToggleVisibility={handleToggleTodoVisibility}
        isAddingLocation={!!pendingTodoId}
      />

      <ColorLibrary
        isVisible={colorLibraryVisible}
        onToggleVisibility={handleToggleColorLibrary}
        colorLibrary={colorLibrary}
        onAddColor={handleAddColorToLibrary}
        onDeleteColor={handleDeleteColorFromLibrary}
        onSelectColor={handleSelectColorFromLibrary}
      />

      {/* Unified Control panel with all buttons same size */}
      <div className="absolute bottom-4 left-4 z-[1000] space-y-2">
        {/* Todo List Toggle Button */}
        <button
          onClick={handleToggleTodoVisibility}
          className="block w-12 h-12 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          title="Toggle Todo List"
        >
          <span className="text-lg">📝</span>
        </button>

        {/* Color Library Toggle Button */}
        <button
          onClick={handleToggleColorLibrary}
          className="block w-12 h-12 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          title="Toggle Color Library"
        >
          <span className="text-lg">🎨</span>
        </button>

        {/* Clear Custom Markers Button - only show if there are non-todo markers */}
        {markers.some(marker => marker.type !== 'todo') && (
          <button
            onClick={clearCustomMarkers}
            className="block w-12 h-12 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            title="Clear custom markers"
          >
            <span className="text-lg">🗑️</span>
          </button>
        )}

        {/* Get Current Location Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={geoLoading}
          className="block w-12 h-12 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Get current location"
        >
          {geoLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : (
            <span className="text-lg">📍</span>
          )}
        </button>
      </div>

      {/* Status messages */}
      {geoError && (
        <div className="absolute bottom-4 left-1/2 z-[1000] transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <strong className="font-bold">Location Error:</strong>
          <span className="block sm:inline"> {geoError}</span>
        </div>
      )}

      {selectedTodoForColor && (
        <div className="absolute top-4 left-1/2 z-[1000] transform -translate-x-1/2 bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <strong className="font-bold">Color Selection Mode:</strong>
          <span className="block sm:inline"> Choose a color from the library for your todo item.</span>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs text-sm">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ul className="space-y-1 text-gray-600">
          <li>• Search for locations using the search box</li>
          <li>• Click anywhere on the map to add custom markers</li>
          <li>• Use � to open your todo list</li>
          <li>• Use 🎨 to access the color library</li>
          <li>• Use �📍 to find your current location</li>
          <li>• Use 🗑️ to clear custom markers (keeps todo markers)</li>
        </ul>
      </div>
    </div>
  )
}

export default MapContainer