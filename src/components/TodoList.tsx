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
      {/* Toggle button */}
      <button
        onClick={onToggleVisibility}
        className="fixed top-4 left-4 z-[1001] bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Toggle Todo List"
      >
        📝
      </button>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="fixed inset-0 bg-black bg-opacity-25 z-[999]"
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
}

function TodoItemComponent(props: TodoItemComponentProps) {
  const {
    todo,
    onToggle,
    onDelete,
    onAddLocation,
    onRemoveLocation,
    onSelectLocation,
  } = props

  return (
    <div className={`p-3 border rounded-lg ${
      todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
    }`}>
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
        </div>
        <div className="flex items-center space-x-1">
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