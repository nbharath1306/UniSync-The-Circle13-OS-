'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRealtimeStatus, useRealtimeTasks } from '@/hooks/useRealtime';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  Circle, 
  LogOut, 
  Bell, 
  Plus,
  Users,
  Calendar,
  Zap
} from 'lucide-react';
import StatusCard from '@/components/StatusCard';
import TaskList from '@/components/TaskList';
import QuickSync from '@/components/QuickSync';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [coFounderId, setCoFounderId] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { status: coFounderStatus } = useRealtimeStatus(coFounderId);
  const { tasks, loading: tasksLoading, refetch: refetchTasks } = useRealtimeTasks();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch('/api/team');
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
          if (data.length > 0 && !coFounderId) {
            setCoFounderId(data[0].id.toString());
          }
        }
      } catch (e) {
        console.error('Failed to fetch team:', e);
      }
    };

    if (session?.user) {
      fetchTeamMembers();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      free: 'bg-emerald-500',
      busy: 'bg-red-500',
      available: 'bg-amber-500',
      in_class: 'bg-gray-500',
      offline: 'bg-gray-400'
    };
    return colors[status] || 'bg-gray-400';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      free: '🟢 Free',
      busy: '🔴 Busy',
      available: '🟡 Available Soon',
      in_class: '📚 In Class',
      offline: '⚫ Offline'
    };
    return labels[status] || 'Unknown';
  };

  const selectedCofounder = teamMembers.find(m => m.id.toString() === coFounderId);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Circle13 Sync</h1>
              <p className="text-xs text-gray-400">Welcome, {session?.user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status & Quick Actions */}
          <div className="space-y-6">
            {/* My Status Card */}
            <StatusCard userId={session?.user?.id} />

            {/* Quick Sync */}
            <QuickSync 
              teamMembers={teamMembers} 
              selectedMemberId={coFounderId}
              onSelectMember={setCoFounderId}
            />
          </div>

          {/* Middle Column - Co-founder Status */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Co-founder Status
              </h2>

              {teamMembers.length > 1 && (
                <select
                  value={coFounderId}
                  onChange={(e) => setCoFounderId(e.target.value)}
                  className="w-full mb-4 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                >
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id} className="bg-slate-800">
                      {member.full_name}
                    </option>
                  ))}
                </select>
              )}

              {coFounderStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(coFounderStatus.status)}`} />
                      {coFounderStatus.status === 'free' && (
                        <div className={`absolute inset-0 ${getStatusColor(coFounderStatus.status)} rounded-full pulse-ring`} />
                      )}
                    </div>
                    <span className="text-white font-medium">
                      {getStatusLabel(coFounderStatus.status)}
                    </span>
                  </div>

                  {coFounderStatus.current_location && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{coFounderStatus.current_location}</span>
                    </div>
                  )}

                  {coFounderStatus.available_until && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>
                        Available until{' '}
                        {new Date(coFounderStatus.available_until).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Last updated:{' '}
                    {new Date(coFounderStatus.last_updated).toLocaleString()}
                  </div>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No team members yet</p>
                  <p className="text-sm text-gray-500">Invite your co-founder to get started</p>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  Loading status...
                </div>
              )}
            </div>

            {/* Today's Schedule Preview */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Today&apos;s Schedule
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-1 h-10 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-white text-sm font-medium">Team Standup</p>
                    <p className="text-gray-400 text-xs">10:00 AM - Library</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-1 h-10 bg-purple-500 rounded-full" />
                  <div>
                    <p className="text-white text-sm font-medium">Work Session</p>
                    <p className="text-gray-400 text-xs">2:00 PM - Cafeteria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tasks */}
          <div className="space-y-6">
            <TaskList 
              tasks={tasks} 
              loading={tasksLoading} 
              onRefetch={refetchTasks}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
