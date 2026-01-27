'use client';

import { useState } from 'react';
import { Zap, Send, Loader2, MapPin, Clock } from 'lucide-react';

interface TeamMember {
  id: number;
  email: string;
  full_name: string;
  section?: string;
}

interface QuickSyncProps {
  teamMembers: TeamMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
}

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
];

const LOCATION_PRESETS = [
  'Library',
  'Cafeteria',
  'Main Building',
  'Lab',
];

export default function QuickSync({ teamMembers, selectedMemberId, onSelectMember }: QuickSyncProps) {
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    location: '',
    duration: 30,
    purpose: '',
    meetingTime: '',
  });

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setSending(true);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: parseInt(selectedMemberId),
          location: form.location,
          duration: form.duration,
          purpose: form.purpose || 'Quick sync',
          meetingTime: form.meetingTime 
            ? new Date(form.meetingTime).toISOString()
            : new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins from now
        }),
      });

      if (res.ok) {
        setSent(true);
        setShowForm(false);
        setForm({ location: '', duration: 30, purpose: '', meetingTime: '' });
        setTimeout(() => setSent(false), 3000);
      }
    } catch (e) {
      console.error('Failed to send sync request:', e);
    } finally {
      setSending(false);
    }
  };

  const selectedMember = teamMembers.find(m => m.id.toString() === selectedMemberId);

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Quick Sync
      </h2>

      {sent ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-emerald-400 font-medium">Request Sent!</p>
          <p className="text-gray-400 text-sm">
            Waiting for {selectedMember?.full_name || 'co-founder'} to respond
          </p>
        </div>
      ) : showForm ? (
        <form onSubmit={handleSendRequest} className="space-y-4">
          {/* To */}
          {teamMembers.length > 0 && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">To</label>
              <select
                value={selectedMemberId}
                onChange={(e) => onSelectMember(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id} className="bg-slate-800">
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <MapPin className="w-4 h-4" />
              Where?
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {LOCATION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setForm({ ...form, location: preset })}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    form.location === preset
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Or type location..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Clock className="w-4 h-4" />
              Duration
            </label>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, duration: option.value })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                    form.duration === option.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">What for? (optional)</label>
            <input
              type="text"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="Quick chat, review design, etc."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !form.location}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">
            Request a quick meetup with your co-founder
          </p>
          <button
            onClick={() => setShowForm(true)}
            disabled={teamMembers.length === 0}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Request Sync
          </button>
          {teamMembers.length === 0 && (
            <p className="text-xs text-gray-500 text-center">
              Invite team members to enable sync requests
            </p>
          )}
        </div>
      )}
    </div>
  );
}
