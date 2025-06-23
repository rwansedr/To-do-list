'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'

interface Todo {
  id: string
  text: string
  completed: boolean
  user_id: string
}

export default function TodoList({ session }: { session: Session }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const userId = session.user.id

  // Fetch todos on load
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) console.error('Error fetching todos:', error)
      else setTodos(data as Todo[])
    }

    fetchTodos()
  }, [userId])

  // Add todo to Supabase
  const addTodo = async () => {
    if (!newTodo.trim()) return

    const { data, error } = await supabase
      .from('todos')
      .insert([{ text: newTodo, completed: false, user_id: userId }])
      .select()
      .single()

    if (error) {
      console.error('Error adding todo:', error)
    } else {
      setTodos([data as Todo, ...todos])
      setNewTodo('')
    }
  }

  // Toggle complete
  const toggleTodo = async (todo: Todo) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling todo:', error)
    } else {
      setTodos(todos.map(t => (t.id === todo.id ? (data as Todo) : t)))
    }
  }

  // Delete todo
  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) console.error('Error deleting todo:', error)
    else setTodos(todos.filter(t => t.id !== id))
  }

  // Start editing
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  // Save edit
  const saveEdit = async (id: string) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ text: editingText })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) console.error('Error saving edit:', error)
    else {
      setTodos(todos.map(t => (t.id === id ? (data as Todo) : t)))
      setEditingId(null)
      setEditingText('')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 shadow-md rounded-xl bg-white">
      <h1 className="text-2xl font-bold mb-4">📝 To-Do List</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Add a new task..."
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex justify-between items-center mb-2">
            <div className="flex items-center flex-1 gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="w-5 h-5 cursor-pointer"
              />
              {editingId === todo.id ? (
                <input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  className="p-1 border rounded w-full"
                />
              ) : (
                <span
                  className={`${todo.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {todo.text}
                </span>
              )}
            </div>
            <div className="ml-2 flex gap-2">
              {editingId === todo.id ? (
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="text-green-500"
                >
                  💾
                </button>
              ) : (
                <button
                  onClick={() => startEditing(todo)}
                  className="text-yellow-500"
                >
                  ✏️
                </button>
              )}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>

      {todos.some(t => t.completed) && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            ✅ Completed Tasks (History)
          </h2>
          <ul className="text-sm text-gray-600">
            {todos
              .filter(todo => todo.completed)
              .map(todo => (
                <li key={todo.id} className="line-through">
                  {todo.text}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}
