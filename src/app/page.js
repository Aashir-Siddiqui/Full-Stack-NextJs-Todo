"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  Loader2,
  Filter,
  Tag,
  Flag,
} from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCategory, setEditCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const result = await response.json();
      setTodos(result.data || []);
    } catch (err) {
      setError("Failed to load todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newTodo,
          priority,
          category,
        }),
      });

      if (!response.ok) throw new Error("Failed to create todo");
      const result = await response.json();
      setTodos([result.data, ...todos]);
      setNewTodo("");
      setPriority("medium");
      setCategory("general");
      setError("");
    } catch (err) {
      setError("Failed to add todo");
      console.error(err);
    }
  };

  // Update todo
  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update todo");
      const result = await response.json();
      setTodos(todos.map((todo) => (todo._id === id ? result.data : todo)));
      setError("");
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");
      setTodos(todos.filter((todo) => todo._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  // Toggle completed status
  const toggleComplete = (id, completed) => {
    updateTodo(id, { completed: !completed });
  };

  // Start editing
  const startEdit = (id, text, priority, category) => {
    setEditingId(id);
    setEditText(text);
    setEditPriority(priority);
    setEditCategory(category);
  };

  // Save edit
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    updateTodo(id, {
      text: editText,
      priority: editPriority,
      category: editCategory,
    });
    setEditingId(null);
    setEditText("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Priority colors
  const priorityColors = {
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const priorityBadge = {
    low: "Low",
    medium: "Med",
    high: "High",
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Todo Master Pro
          </h1>
          <p className="text-gray-400 text-sm">
            MongoDB Full-Stack Todo Application
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-6 py-4 border-b border-gray-700/50">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Active:</span>
                <span className="font-bold text-blue-400">{activeCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Completed:</span>
                <span className="font-bold text-green-400">
                  {completedCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Total:</span>
                <span className="font-bold text-purple-400">
                  {todos.length}
                </span>
              </div>
            </div>
          </div>

          {/* Add Todo Form */}
          <div className="p-6 border-b border-gray-700/50">
            <form onSubmit={addTodo} className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>

              <div className="flex gap-3">
                {/* Priority Selector */}
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Category Input */}
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Work, Personal"
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-6 py-3 border-b border-gray-700/50 flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              All ({todos.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === "active"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Todo List */}
          <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-purple-400" size={32} />
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400 text-lg">
                  {filter === "all"
                    ? "No tasks yet"
                    : filter === "active"
                    ? "No active tasks"
                    : "No completed tasks"}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {filter === "all" && "Add your first task to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo._id}
                    className="group bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 transition-all"
                  >
                    {editingId === todo._id ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                        <div className="flex gap-3">
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                          <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            placeholder="Category"
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => saveEdit(todo._id)}
                            className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <div className="flex items-center gap-4">
                        {/* Checkbox */}
                        <button
                          onClick={() =>
                            toggleComplete(todo._id, todo.completed)
                          }
                          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            todo.completed
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          {todo.completed && (
                            <Check size={16} className="text-white" />
                          )}
                        </button>

                        {/* Todo Content */}
                        <div className="flex-1">
                          <span
                            className={`block transition-all ${
                              todo.completed
                                ? "text-gray-500 line-through"
                                : "text-white"
                            }`}
                          >
                            {todo.text}
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-md border ${
                                priorityColors[todo.priority]
                              }`}
                            >
                              {priorityBadge[todo.priority]}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-md bg-gray-700/30 text-gray-400 border border-gray-600/30">
                              {todo.category}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              startEdit(
                                todo._id,
                                todo.text,
                                todo.priority,
                                todo.category
                              )
                            }
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Powered by MongoDB & Next.js 💜
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );
}
