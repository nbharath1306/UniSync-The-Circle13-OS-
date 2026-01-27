'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Loader2 } from 'lucide-react';

interface StatusCardProps {
  userId?: string;
}

const STATUS_OPTIONS = [
  { value: 'free', label: '🟢 Free', color: 'bg-emerald-500' },
  { value: 'busy', label: '🔴 Busy', color: 'bg-red-500' },
  { value: 'available', label: '🟡 Available Soon', color: 'bg-amber-500' },
  { value: 'in_class', label: '📚 In Class', color: 'bg-gray-500' },
];

const LOCATION_PRESETS = [
  'Library',
  'Cafeteria',
  'Main Building',
  'Lab',
  'Dorm',
  'Off Campus',
];

export default function StatusCard({ userId }: StatusCardProps) {
  const [status, setStatus] = useState('offline');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchMyStatus = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/status?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setStatus(data.status || 'offline');
            setLocation(data.current_location || '');
            if (data.available_until) {
              const date = new Date(data.available_until);
              setAvailableUntil(date.toTimeString().slice(0, 5));
            }
            if (data.last_updated) {
              setLastUpdated(new Date(data.last_updated));
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch status:', e);
      }
    };

    fetchMyStatus();
  }, [userId]);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    setStatus(newStatus);

    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          location: location || customLocation || null,
          availableUntil: availableUntil 
            ? new Date(`${new Date().toDateString()} ${availableUntil}`).toISOString()
            : null,
        }),
      });

      if (res.ok) {
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation);
    setCustomLocation('');

    if (status !== 'offline') {
      setLoading(true);
      try {
        await fetch('/api/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            location: newLocation || null,
            availableUntil: availableUntil 
              ? new Date(`${new Date().toDateString()} ${availableUntil}`).toISOString()
              : null,
          }),
        });
        setLastUpdated(new Date());
      } catch (e) {
        console.error('Failed to update location:', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">My Status</h2>
        {loading && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
      </div>

      {/* Status Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => updateStatus(option.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              status === option.value
                ? `${option.color} text-white shadow-lg`
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <MapPin className="w-4 h-4" />
          Location
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {LOCATION_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleLocationChange(preset)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                location === preset
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
          value={customLocation}
          onChange={(e) => {
            setCustomLocation(e.target.value);
            setLocation('');
          }}
          onBlur={() => {
            if (customLocation) {
              handleLocationChange(customLocation);
            }
          }}
          placeholder="Or type custom location..."
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Available Until */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Clock className="w-4 h-4" />
          Available Until
        </label>
        <input
          type="time"
          value={availableUntil}
          onChange={(e) => setAvailableUntil(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
