import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Types
export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  section: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStatus {
  user_id: number;
  status: 'free' | 'busy' | 'in_class' | 'available' | 'offline';
  current_location: string | null;
  available_until: string | null;
  last_updated: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assigned_to: number;
  created_by: number;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncRequest {
  id: number;
  from_user_id: number;
  to_user_id: number;
  status: 'pending' | 'accepted' | 'declined';
  meeting_time: string;
  location: string;
  duration: number;
  purpose: string;
  created_at: string;
  responded_at: string | null;
  expires_at: string;
}

export interface Database {
  users: User[];
  user_status: UserStatus[];
  tasks: Task[];
  sync_requests: SyncRequest[];
  _meta: {
    next_user_id: number;
    next_task_id: number;
    next_sync_id: number;
  };
}

const DEFAULT_DB: Database = {
  users: [],
  user_status: [],
  tasks: [],
  sync_requests: [],
  _meta: {
    next_user_id: 1,
    next_task_id: 1,
    next_sync_id: 1,
  },
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read database
export function readDB(): Database {
  ensureDataDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading database:', error);
  }
  return { ...DEFAULT_DB };
}

// Write database
export function writeDB(db: Database): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// User operations
export function getUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find(u => u.email === email);
}

export function getUserById(id: number): User | undefined {
  const db = readDB();
  return db.users.find(u => u.id === id);
}

export function createUser(email: string, passwordHash: string, fullName: string, section: string): User {
  const db = readDB();
  const now = new Date().toISOString();
  
  const user: User = {
    id: db._meta.next_user_id++,
    email,
    password_hash: passwordHash,
    full_name: fullName,
    section,
    role: 'founder',
    avatar_url: null,
    created_at: now,
    updated_at: now,
  };
  
  db.users.push(user);
  
  // Create initial status
  db.user_status.push({
    user_id: user.id,
    status: 'offline',
    current_location: null,
    available_until: null,
    last_updated: now,
  });
  
  writeDB(db);
  return user;
}

export function getTeamMembers(excludeUserId: number): Omit<User, 'password_hash'>[] {
  const db = readDB();
  return db.users
    .filter(u => u.id !== excludeUserId)
    .map(({ password_hash, ...user }) => user);
}

// Status operations
export function getUserStatus(userId: number): UserStatus | undefined {
  const db = readDB();
  return db.user_status.find(s => s.user_id === userId);
}

export function updateUserStatus(
  userId: number, 
  status: string, 
  location: string | null, 
  availableUntil: string | null
): UserStatus {
  const db = readDB();
  const now = new Date().toISOString();
  
  let userStatus = db.user_status.find(s => s.user_id === userId);
  
  if (!userStatus) {
    userStatus = {
      user_id: userId,
      status: status as UserStatus['status'],
      current_location: location,
      available_until: availableUntil,
      last_updated: now,
    };
    db.user_status.push(userStatus);
  } else {
    userStatus.status = status as UserStatus['status'];
    userStatus.current_location = location;
    userStatus.available_until = availableUntil;
    userStatus.last_updated = now;
  }
  
  writeDB(db);
  return userStatus;
}

// Task operations
export function getTasks(userId: number): (Task & { assigned_to_name?: string })[] {
  const db = readDB();
  return db.tasks
    .filter(t => t.assigned_to === userId || t.created_by === userId)
    .map(task => {
      const assignee = db.users.find(u => u.id === task.assigned_to);
      return {
        ...task,
        assigned_to_name: assignee?.full_name,
      };
    })
    .sort((a, b) => {
      const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
      const aPriority = priorityOrder[a.priority] || 5;
      const bPriority = priorityOrder[b.priority] || 5;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function createTask(
  title: string,
  description: string | null,
  assignedTo: number,
  createdBy: number,
  priority: string,
  dueDate: string | null
): Task {
  const db = readDB();
  const now = new Date().toISOString();
  
  const task: Task = {
    id: db._meta.next_task_id++,
    title,
    description,
    assigned_to: assignedTo,
    created_by: createdBy,
    status: 'todo',
    priority: priority as Task['priority'],
    due_date: dueDate,
    created_at: now,
    updated_at: now,
  };
  
  db.tasks.push(task);
  writeDB(db);
  return task;
}

export function updateTask(id: number, updates: Partial<Task>): Task | null {
  const db = readDB();
  const task = db.tasks.find(t => t.id === id);
  
  if (!task) return null;
  
  Object.assign(task, updates, { updated_at: new Date().toISOString() });
  writeDB(db);
  return task;
}

export function deleteTask(id: number): boolean {
  const db = readDB();
  const index = db.tasks.findIndex(t => t.id === id);
  
  if (index === -1) return false;
  
  db.tasks.splice(index, 1);
  writeDB(db);
  return true;
}

// Sync request operations
export function getPendingSyncs(userId: number): (SyncRequest & { from_user_name?: string })[] {
  const db = readDB();
  return db.sync_requests
    .filter(s => s.to_user_id === userId && s.status === 'pending')
    .map(sync => {
      const fromUser = db.users.find(u => u.id === sync.from_user_id);
      return {
        ...sync,
        from_user_name: fromUser?.full_name,
      };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createSyncRequest(
  fromUserId: number,
  toUserId: number,
  meetingTime: string,
  location: string,
  duration: number,
  purpose: string
): SyncRequest {
  const db = readDB();
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  
  const sync: SyncRequest = {
    id: db._meta.next_sync_id++,
    from_user_id: fromUserId,
    to_user_id: toUserId,
    status: 'pending',
    meeting_time: meetingTime,
    location,
    duration,
    purpose,
    created_at: now,
    responded_at: null,
    expires_at: expires,
  };
  
  db.sync_requests.push(sync);
  writeDB(db);
  return sync;
}

export function updateSyncRequest(id: number, userId: number, status: string): SyncRequest | null {
  const db = readDB();
  const sync = db.sync_requests.find(s => s.id === id && s.to_user_id === userId);
  
  if (!sync) return null;
  
  sync.status = status as SyncRequest['status'];
  sync.responded_at = new Date().toISOString();
  writeDB(db);
  return sync;
}
