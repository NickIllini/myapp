import React, { useState } from 'react'
import { ColorLibraryItem } from '../types/todo'

interface ColorLibraryProps {
  isVisible: boolean
  onToggleVisibility: () => void
  colorLibrary: ColorLibraryItem[]
  onAddColor: (name: string, color: string, category: string) => void
  onDeleteColor: (id: string) => void
  onSelectColor: (color: string, category?: string) => void
}

export default function ColorLibrary(props: ColorLibraryProps) {
  const {
    isVisible,
    onToggleVisibility,
    colorLibrary,
    onAddColor,
    onDeleteColor,
    onSelectColor,
  } = props

  const [newColorName, setNewColorName] = useState('')
  const [newColor, setNewColor] = useState('#3B82F6')
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newColorName.trim() && newColor && newCategory.trim()) {
      onAddColor(newColorName.trim(), newColor, newCategory.trim())
      setNewColorName('')
      setNewColor('#3B82F6')
      setNewCategory('')
    }
  }

  const categories = ['all', ...Array.from(new Set(colorLibrary.map(item => item.category)))]
  const filteredColors = selectedCategory === 'all' 
    ? colorLibrary 
    : colorLibrary.filter(item => item.category === selectedCategory)

  const predefinedColors = [
    { name: 'Blue', color: '#3B82F6', category: 'Default' },
    { name: 'Red', color: '#EF4444', category: 'Default' },
    { name: 'Green', color: '#10B981', category: 'Default' },
    { name: 'Yellow', color: '#F59E0B', category: 'Default' },
    { name: 'Purple', color: '#8B5CF6', category: 'Default' },
    { name: 'Pink', color: '#EC4899', category: 'Default' },
    { name: 'Orange', color: '#F97316', category: 'Default' },
    { name: 'Teal', color: '#14B8A6', category: 'Default' },
  ]

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-[1000] transform transition-transform duration-300 ${
      isVisible ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-purple-500 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Color Library</h2>
            <button
              onClick={onToggleVisibility}
              className="text-white hover:text-gray-200 text-xl"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Add Color Form */}
        <div className="p-4 border-b">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Color name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black placeholder:text-gray-500"
            />
            <div className="flex space-x-2">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Add to Library
            </button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Color Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Predefined Colors */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Quick Colors</h3>
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map(colorItem => (
                <button
                  key={`predefined-${colorItem.name}`}
                  onClick={() => onSelectColor(colorItem.color, colorItem.category)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-colors"
                  style={{ backgroundColor: colorItem.color }}
                  title={colorItem.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          {filteredColors.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-3">
                {selectedCategory === 'all' ? 'Saved Colors' : selectedCategory}
              </h3>
              <div className="space-y-2">
                {filteredColors.map(colorItem => (
                  <div
                    key={colorItem.id}
                    className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-gray-50"
                  >
                    <button
                      onClick={() => onSelectColor(colorItem.color, colorItem.category)}
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                      style={{ backgroundColor: colorItem.color }}
                      title={`Use ${colorItem.name}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {colorItem.name}
                      </p>
                      <p className="text-xs text-gray-500">{colorItem.category}</p>
                    </div>
                    <button
                      onClick={() => onDeleteColor(colorItem.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      title="Delete color"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredColors.length === 0 && selectedCategory !== 'all' && (
            <div className="text-center text-gray-500 mt-8">
              <p>No colors in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}