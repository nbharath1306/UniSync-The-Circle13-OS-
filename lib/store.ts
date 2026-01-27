import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  section?: string;
}

interface UserStatus {
  status: 'free' | 'busy' | 'in_class' | 'available' | 'offline';
  current_location: string | null;
  available_until: string | null;
  last_updated: string;
}

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

interface SyncRequest {
  id: number;
  from_user_id: number;
  to_user_id: number;
  status: 'pending' | 'accepted' | 'declined';
  meeting_time: string;
  location: string;
  duration: number;
  purpose: string;
}

interface AppState {
  user: User | null;
  cofounderStatus: UserStatus | null;
  myStatus: UserStatus | null;
  tasks: Task[];
  pendingSyncs: SyncRequest[];
  
  setUser: (user: User | null) => void;
  setCofounderStatus: (status: UserStatus) => void;
  setMyStatus: (status: UserStatus) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  removeTask: (id: number) => void;
  setPendingSyncs: (syncs: SyncRequest[]) => void;
  addPendingSync: (sync: SyncRequest) => void;
  removePendingSync: (id: number) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  cofounderStatus: null,
  myStatus: null,
  tasks: [],
  pendingSyncs: [],
  
  setUser: (user) => set({ user }),
  setCofounderStatus: (status) => set({ cofounderStatus: status }),
  setMyStatus: (status) => set({ myStatus: status }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  setPendingSyncs: (syncs) => set({ pendingSyncs: syncs }),
  addPendingSync: (sync) => set((state) => ({ 
    pendingSyncs: [sync, ...state.pendingSyncs] 
  })),
  removePendingSync: (id) => set((state) => ({
    pendingSyncs: state.pendingSyncs.filter(s => s.id !== id)
  })),
}));
