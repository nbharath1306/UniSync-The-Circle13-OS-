'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Loader2,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: number;
  created_by: number;
  due_date: string | null;
  assigned_to_name?: string;
}

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onRefetch: () => void;
}

const PRIORITY_COLORS = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

const PRIORITY_BG = {
  low: 'bg-gray-500/20',
  medium: 'bg-blue-500/20',
  high: 'bg-orange-500/20',
  urgent: 'bg-red-500/20',
};

export default function TaskList({ tasks, loading, onRefetch }: TaskListProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });
  const [addingTask, setAddingTask] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setAddingTask(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          priority: newTask.priority,
        }),
      });

      if (res.ok) {
        setNewTask({ title: '', priority: 'medium' });
        setShowAddTask(false);
        onRefetch();
      }
    } catch (e) {
      console.error('Failed to add task:', e);
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatus = task.status === 'done' 
      ? 'todo' 
      : task.status === 'todo' 
        ? 'in_progress' 
        : 'done';

    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: nextStatus }),
      });
      onRefetch();
    } catch (e) {
      console.error('Failed to update task:', e);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });
      onRefetch();
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  };

  const todoTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Tasks</h2>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="p-2 text-purple-400 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <form onSubmit={handleAddTask} className="mb-4 p-3 bg-white/5 rounded-lg">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 mb-2"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
            >
              <option value="low" className="bg-slate-800">Low</option>
              <option value="medium" className="bg-slate-800">Medium</option>
              <option value="high" className="bg-slate-800">High</option>
              <option value="urgent" className="bg-slate-800">Urgent</option>
            </select>
            <button
              type="submit"
              disabled={addingTask || !newTask.title.trim()}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 disabled:opacity-50 flex items-center gap-1"
            >
              {addingTask && <Loader2 className="w-4 h-4 animate-spin" />}
              Add
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No tasks yet</p>
          <p className="text-sm text-gray-500">Click + to add your first task</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Tasks */}
          {todoTasks.length > 0 && (
            <div className="space-y-2">
              {todoTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${PRIORITY_BG[task.priority]} group`}
                >
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className="mt-0.5 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {task.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Done Tasks */}
          {doneTasks.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">Completed ({doneTasks.length})</p>
              <div className="space-y-2">
                {doneTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-2 opacity-60 group"
                  >
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="text-emerald-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <p className="text-white text-sm line-through truncate flex-1">
                      {task.title}
                    </p>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
