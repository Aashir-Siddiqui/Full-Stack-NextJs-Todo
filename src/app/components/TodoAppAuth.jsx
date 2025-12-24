"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  Loader2,
  LogOut,
  User as UserIcon,
  Menu,
  X as CloseIcon,
  Sparkles,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import AuthPage from "./AuthPage";

export default function TodoAppAuth() {
  const {
    user,
    token,
    isAuthenticated,
    logout,
    loading: authLoading,
  } = useAuth();

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCategory, setEditCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [addingTodo, setAddingTodo] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch todos with authentication
  const fetchTodos = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error("Failed to fetch todos");
      }

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
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated, token]);

  // Create new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setAddingTodo(true);
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    } finally {
      setAddingTodo(false);
    }
  };

  // Update todo
  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      setTodos(todos.filter((todo) => todo._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  const toggleComplete = (id, completed) => {
    updateTodo(id, { completed: !completed });
  };

  const startEdit = (id, text, priority, category) => {
    setEditingId(id);
    setEditText(text);
    setEditPriority(priority);
    setEditCategory(category);
  };

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

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

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

  // Show auth page if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-purple-400 mx-auto mb-4"
            size={48}
          />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-400" size={28} />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Todo Master
              </h1>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              Welcome back,{" "}
              <span className="text-purple-400 font-medium">{user?.name}</span>!
            </p>
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-300">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-all text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 bg-gray-800/50 border border-gray-700 rounded-lg"
          >
            {showMobileMenu ? <CloseIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden mb-6 p-4 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <UserIcon size={40} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-300">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* Main Container - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Stats (Desktop) / Top Stats (Mobile) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
              {/* Active */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-xl">
                <p className="text-xs text-blue-400 mb-1">Active</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                  {activeCount}
                </p>
              </div>
              {/* Completed */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-xl">
                <p className="text-xs text-green-400 mb-1">Done</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">
                  {completedCount}
                </p>
              </div>
              {/* Total */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-xl">
                <p className="text-xs text-purple-400 mb-1">Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-400">
                  {todos.length}
                </p>
              </div>
            </div>

            {/* Quick Stats (Desktop Only) */}
            <div className="hidden lg:block bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                Progress
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Completion</span>
                    <span>
                      {todos.length
                        ? Math.round((completedCount / todos.length) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          todos.length
                            ? (completedCount / todos.length) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              {/* Add Todo Form */}
              <div className="p-4 sm:p-6 border-b border-gray-700/50">
                <form onSubmit={addTodo} className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Add a new task..."
                      className="flex-1 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                      disabled={addingTodo}
                    />
                    <button
                      type="submit"
                      disabled={addingTodo || !newTodo.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {addingTodo ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Add
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={addingTodo}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Work, Personal..."
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={addingTodo}
                      />
                    </div>
                  </div>
                </form>

                {error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs sm:text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="px-4 sm:px-6 py-3 border-b border-gray-700/50 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      filter === "all"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
                    }`}
                  >
                    All ({todos.length})
                  </button>
                  <button
                    onClick={() => setFilter("active")}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      filter === "active"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
                    }`}
                  >
                    Active ({activeCount})
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      filter === "completed"
                        ? "bg-green-500 text-white"
                        : "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
                    }`}
                  >
                    Completed ({completedCount})
                  </button>
                </div>
              </div>

              {/* Todo List */}
              <div className="p-4 sm:p-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2
                      className="animate-spin text-purple-400"
                      size={32}
                    />
                  </div>
                ) : filteredTodos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl sm:text-6xl mb-4">📝</div>
                    <p className="text-gray-400 text-base sm:text-lg">
                      {filter === "all"
                        ? "No tasks yet"
                        : filter === "active"
                        ? "No active tasks"
                        : "No completed tasks"}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">
                      {filter === "all" && "Add your first task to get started"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <div
                        key={todo._id}
                        className="group bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700/50 hover:border-gray-600 rounded-xl p-3 sm:p-4 transition-all"
                      >
                        {editingId === todo._id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <div className="flex flex-col sm:flex-row gap-2">
                              <select
                                value={editPriority}
                                onChange={(e) =>
                                  setEditPriority(e.target.value)
                                }
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                              </select>
                              <input
                                type="text"
                                value={editCategory}
                                onChange={(e) =>
                                  setEditCategory(e.target.value)
                                }
                                placeholder="Category"
                                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(todo._id)}
                                  className="flex-1 sm:flex-none p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="flex-1 sm:flex-none p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() =>
                                toggleComplete(todo._id, todo.completed)
                              }
                              className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all ${
                                todo.completed
                                  ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500"
                                  : "border-gray-600 hover:border-gray-500"
                              }`}
                            >
                              {todo.completed && (
                                <Check size={14} className="text-white" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm sm:text-base transition-all break-words ${
                                  todo.completed
                                    ? "text-gray-500 line-through"
                                    : "text-white"
                                }`}
                              >
                                {todo.text}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-md border ${
                                    priorityColors[todo.priority]
                                  }`}
                                >
                                  {priorityBadge[todo.priority]}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-md bg-gray-700/30 text-gray-400 border border-gray-600/30">
                                  {todo.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
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
                                <Edit2 size={14} className="text-blue-400" />
                              </button>
                              <button
                                onClick={() => deleteTodo(todo._id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                              >
                                <Trash2 size={14} className="text-red-400" />
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
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs sm:text-sm">
          Made with 💜 by Aashir Siddiqui
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
