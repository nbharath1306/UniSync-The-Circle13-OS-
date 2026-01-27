// In-memory database for serverless environments (Vercel compatible)
// Note: Data resets on each cold start in production

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

// Demo password hash for "demo123" - generated with bcrypt
// $2a$10$ prefix indicates bcrypt with cost factor 10
const DEMO_PASSWORD_HASH = '$2a$10$K8Jh5BO1tMdDQMFRnE3Q8.hYwQ5Xr9mXl8EjZqFyOsDV1Zr7YXWMO';

// Initial database with demo users
const createInitialDB = (): Database => {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 1,
        email: 'bharath@circle13.com',
        password_hash: DEMO_PASSWORD_HASH,
        full_name: 'Bharath',
        section: '4H',
        role: 'founder',
        avatar_url: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        email: 'akhil@circle13.com',
        password_hash: DEMO_PASSWORD_HASH,
        full_name: 'Akhil',
        section: '4L',
        role: 'founder',
        avatar_url: null,
        created_at: now,
        updated_at: now,
      },
    ],
    user_status: [
      {
        user_id: 1,
        status: 'free',
        current_location: 'Library',
        available_until: null,
        last_updated: now,
      },
      {
        user_id: 2,
        status: 'in_class',
        current_location: 'Room 301',
        available_until: null,
        last_updated: now,
      },
    ],
    tasks: [
      {
        id: 1,
        title: 'Complete MVP landing page',
        description: 'Finish the hero section and feature highlights',
        assigned_to: 1,
        created_by: 2,
        status: 'in_progress',
        priority: 'high',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        title: 'Setup authentication',
        description: 'Implement NextAuth with credentials',
        assigned_to: 2,
        created_by: 1,
        status: 'done',
        priority: 'urgent',
        due_date: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        title: 'Design sync notification system',
        description: null,
        assigned_to: 1,
        created_by: 1,
        status: 'todo',
        priority: 'medium',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: now,
        updated_at: now,
      },
    ],
    sync_requests: [],
    _meta: {
      next_user_id: 3,
      next_task_id: 4,
      next_sync_id: 1,
    },
  };
};

// In-memory database instance
let memoryDB: Database | null = null;

// Get or initialize database
function getDB(): Database {
  if (!memoryDB) {
    memoryDB = createInitialDB();
  }
  return memoryDB;
}

// Read database
export function readDB(): Database {
  return getDB();
}

// Write database (updates in-memory)
export function writeDB(db: Database): void {
  memoryDB = db;
}

// User operations
export function getUserByEmail(email: string): User | undefined {
  const db = readDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
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

export function getAllStatuses(): (UserStatus & { user_name: string; section: string })[] {
  const db = readDB();
  return db.user_status.map(status => {
    const user = db.users.find(u => u.id === status.user_id);
    return {
      ...status,
      user_name: user?.full_name || 'Unknown',
      section: user?.section || '',
    };
  });
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
