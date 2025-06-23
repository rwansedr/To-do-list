'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Todo {
  id: string
  text: string
  completed: boolean
  user_id: string
  created_at: string
}

interface Props {
  session: {
    user: {
      id: string
    }
  }
}

export default function TodoList({ session }: Props) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchTodos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching todos:', error.message)
    } else if (data) {
      setTodos(data as Todo[])
    }
    setLoading(false)
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    setLoading(true)

    const { data, error } = await supabase
      .from('todos')
      .insert({ text: newTodo.trim(), completed: false, user_id: session.user.id })
      .select()
      .single()

    if (error) {
      console.error('Error adding todo:', error.message)
    } else if (data) {
      setTodos(prev => [data as Todo, ...prev])
      setNewTodo('')
    }
    setLoading(false)
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id)

    if (error) {
      console.error('Error toggling todo:', error.message)
    } else {
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, completed: !completed } : todo))
      )
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error.message)
    } else {
      setTodos(prev => prev.filter(todo => todo.id !== id))
    }
  }

  const handleLogout = async () => {
  const confirmed = window.confirm('Are you sure you want to logout?')
  if (!confirmed) return

  await supabase.auth.signOut()
  location.reload()
}

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 shadow-md rounded-xl bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📝 To-Do List</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none"
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          disabled={loading}
        />
        <button
          onClick={addTodo}
          disabled={loading || !newTodo.trim()}
          className={`px-6 rounded-r-md text-white ${
            loading || !newTodo.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Add
        </button>
      </div>

      {loading && todos.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-500">No tasks yet. Add one!</p>
      ) : (
        <ul className="space-y-3">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-3 border border-gray-200 rounded"
            >
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.text}
                </span>
              </label>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800 font-bold text-xl leading-none"
                aria-label="Delete task"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
