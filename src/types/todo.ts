export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  position?: [number, number] // Optional map coordinates
  locationName?: string // Optional location description
  color?: string // Custom color for the todo item
  colorCategory?: string // Category for the color (for library organization)
}

export type TodoFormData = Omit<TodoItem, 'id' | 'createdAt'>

export interface ColorLibraryItem {
  id: string
  name: string
  color: string
  category: string
  createdAt: Date
}