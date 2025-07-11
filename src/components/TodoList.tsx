import React, { useState } from 'react'
import { TodoItem } from '../types/todo'

interface TodoListProps {
  todos: TodoItem[]
  onAddTodo: (text: string) => void
  onToggleTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
  onAddLocationToTodo: (id: string) => void
  onRemoveLocationFromTodo: (id: string) => void
  onSelectTodoLocation: (todo: TodoItem) => void
  onSelectTodoForColor: (todoId: string) => void
  onUpdateTodoColor: (todoId: string, color: string, category?: string) => void
  isVisible: boolean
  onToggleVisibility: () => void
  isAddingLocation: boolean
}

export default function TodoList(props: TodoListProps) {
  const {
    todos,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
    onAddLocationToTodo,
    onRemoveLocationFromTodo,
    onSelectTodoLocation,
    onSelectTodoForColor,
    onUpdateTodoColor,
    isVisible,
    onToggleVisibility,
    isAddingLocation,
  } = props

  const [newTodoText, setNewTodoText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim())
      setNewTodoText('')
    }
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const activeTodos = todos.filter(todo => !todo.completed)

  return (
    <>
      {/* Todo List Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-[1000] transform transition-transform duration-300 ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Todo List</h2>
              <button
                onClick={onToggleVisibility}
                className="text-white hover:text-gray-200 text-xl"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>

          {/* Add Todo Form */}
          <div className="p-4 border-b">
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a new todo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Todo
              </button>
            </form>
            {isAddingLocation && (
              <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                Click on the map to add a location to your selected todo item.
              </div>
            )}
          </div>

          {/* Todo Items */}
          <div className="flex-1 overflow-y-auto">
            {/* Active Todos */}
            {activeTodos.length > 0 && (
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">Active Tasks ({activeTodos.length})</h3>
                <div className="space-y-2">
                  {activeTodos.map(todo => (
                    <TodoItemComponent
                      key={todo.id}
                      todo={todo}
                      onToggle={onToggleTodo}
                      onDelete={onDeleteTodo}
                      onAddLocation={onAddLocationToTodo}
                      onRemoveLocation={onRemoveLocationFromTodo}
                      onSelectLocation={onSelectTodoLocation}
                      onSelectTodoForColor={onSelectTodoForColor}
                      onUpdateTodoColor={onUpdateTodoColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
              <div className="p-4 border-t">
                <h3 className="font-medium text-gray-700 mb-3">Completed ({completedTodos.length})</h3>
                <div className="space-y-2">
                  {completedTodos.map(todo => (
                    <TodoItemComponent
                      key={todo.id}
                      todo={todo}
                      onToggle={onToggleTodo}
                      onDelete={onDeleteTodo}
                      onAddLocation={onAddLocationToTodo}
                      onRemoveLocation={onRemoveLocationFromTodo}
                      onSelectLocation={onSelectTodoLocation}
                      onSelectTodoForColor={onSelectTodoForColor}
                      onUpdateTodoColor={onUpdateTodoColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {todos.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <p>No todos yet. Add one above!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when visible */}
      {isVisible && (
        <div
          onClick={onToggleVisibility}
        />
      )}
    </>
  )
}

interface TodoItemComponentProps {
  todo: TodoItem
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAddLocation: (id: string) => void
  onRemoveLocation: (id: string) => void
  onSelectLocation: (todo: TodoItem) => void
  onSelectTodoForColor: (todoId: string) => void
  onUpdateTodoColor: (todoId: string, color: string, category?: string) => void
}

function TodoItemComponent(props: TodoItemComponentProps) {
  const {
    todo,
    onToggle,
    onDelete,
    onAddLocation,
    onRemoveLocation,
    onSelectLocation,
    onSelectTodoForColor,
    onUpdateTodoColor,
  } = props

  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleColorChange = (color: string) => {
    onUpdateTodoColor(todo.id, color)
    setShowColorPicker(false)
  }

  const quickColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#14B8A6', // Teal
  ]

  return (
    <div className={`p-3 border rounded-lg ${
      todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
    }`} style={{ borderLeftColor: todo.color, borderLeftWidth: '4px' }}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="mt-1 rounded focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {todo.text}
          </p>
          {todo.position && (
            <div className="mt-1">
              <button
                onClick={() => onSelectLocation(todo)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                title="View on map"
              >
                <span>📍</span>
                <span>{todo.locationName || `${todo.position[0].toFixed(4)}, ${todo.position[1].toFixed(4)}`}</span>
              </button>
            </div>
          )}
          {todo.colorCategory && (
            <div className="mt-1">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {todo.colorCategory}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {/* Color picker button */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500"
              style={{ backgroundColor: todo.color || '#3B82F6' }}
              title="Change color"
            />
            {showColorPicker && (
              <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg p-2 z-10">
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {quickColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded border border-gray-300 hover:border-gray-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => onSelectTodoForColor(todo.id)}
                  className="w-full text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                >
                  More Colors
                </button>
              </div>
            )}
          </div>

          {todo.position ? (
            <button
              onClick={() => onRemoveLocation(todo.id)}
              className="text-xs text-red-600 hover:text-red-800"
              title="Remove location"
            >
              🗑️
            </button>
          ) : (
            <button
              onClick={() => onAddLocation(todo.id)}
              className="text-xs text-blue-600 hover:text-blue-800"
              title="Add location"
            >
              📍
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="text-xs text-red-600 hover:text-red-800"
            title="Delete todo"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}