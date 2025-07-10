export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  position?: [number, number] // Optional map coordinates
  locationName?: string // Optional location description
}

export type TodoFormData = Omit<TodoItem, 'id' | 'createdAt'>