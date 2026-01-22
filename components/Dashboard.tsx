"use client";

import React, { useState, useEffect } from 'react';
import { SCHEDULE, TIME_SLOTS } from '@/lib/schedules';

interface Issue {
  number: number;
  title: string;
  url: string; // html_url
  state: string;
}

const getStatusColor = (status: string, hComp: string, lComp: string) => {
  if (status === 'SYNC' || status === 'WAR_ROOM') return 'text-green-500';
  if (status === 'WALK_MEETING') return 'text-yellow-500';
  if (status === 'ASYNC' || status === 'ASYNC_WORK' || status === 'LIBRARY_GRIND' || hComp === 'FREE' || lComp === 'FREE') return 'text-blue-500';
  if (status === 'HACKATHON_MODE') return 'text-purple-500';
  return 'text-red-500';
};

const getStatusLabel = (status: string, hComp: string, lComp: string) => {
  if (status) return status;
  if (hComp === 'FREE' || lComp === 'FREE') return 'ASYNC';
  return 'BUSY';
};

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [issues, setIssues] = useState<Issue[]>([]);
  const [repoOwner, setRepoOwner] = useState(process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'nbharath1306');
  const [repoName, setRepoName] = useState(process.env.NEXT_PUBLIC_GITHUB_REPO || 'UniSync-The-Circle13-OS--The-Circle13-OS--The-Circle13-OS--The-Circle13-OS-');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch GitHub issues
    const fetchIssues = async () => {
        try {
            const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`);
            if (res.ok) {
                const data = await res.json();
                // Filter only open issues, and take top 5
                const openIssues = data.filter((i: any) => i.state === 'open').slice(0, 5).map((i: any) => ({
                    number: i.number,
                    title: i.title,
                    url: i.html_url,
                    state: i.state
                }));
                setIssues(openIssues);
            }
        } catch (error) {
            console.error("Failed to fetch issues", error);
        }
    };
    fetchIssues();
  }, [repoOwner, repoName]);

  // Determine current slot
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[currentTime.getDay()];
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const timeString = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

  const currentSchedule = SCHEDULE[currentDay];
  
  let currentSlot = null;
  let nextSlot = null;
  let activeSlotKey = null;

  // Simple time comparison
  const getMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  for (const slot of TIME_SLOTS) {
    const startMin = getMinutes(slot.start);
    const endMin = getMinutes(slot.end);
    
    if (currentTotalMinutes >= startMin && currentTotalMinutes < endMin) {
        currentSlot = slot;
        activeSlotKey = slot.start;
        break;
    }
  }

  const slotData = (currentSchedule && activeSlotKey) ? currentSchedule[activeSlotKey] : null;
  const hStatus = slotData?.H || "OFFLINE";
  const lStatus = slotData?.L || "OFFLINE";
  const statusKey = slotData?.status || "";
  
  const statusLabel = getStatusLabel(statusKey, hStatus, lStatus);
  const statusColor = getStatusColor(statusKey, hStatus, lStatus);
  const isPulse = statusKey === 'WAR_ROOM';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#22c55e] font-mono p-4 flex flex-col">
      {/* Header */}
      <header className="border-b border-green-900 pb-4 mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-bold tracking-tighter">UniSync v1.0</h1>
            <p className="text-sm opacity-70">The Circle13 Operating System</p>
        </div>
        <div className="text-right">
            <div className="text-3xl font-bold">{timeString}</div>
            <div className={`text-xl font-bold ${statusColor} ${isPulse ? 'animate-pulse' : ''}`}>
               [{statusLabel}]
            </div>
            <div className="text-xs text-gray-500 mt-1">{currentDay}</div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* User H Column */}
        <div className="border border-green-900/50 p-6 bg-green-900/5 rounded-lg">
            <h2 className="text-xl font-bold mb-4 border-b border-green-900/30 pb-2">USER_H (N Bharath)</h2>
            <div className="text-center mt-8">
                <div className="text-sm text-gray-500 mb-2">CURRENT ACTIVITY</div>
                <div className="text-3xl font-bold text-white">{hStatus}</div>
            </div>
        </div>

        {/* Action Center - Simplified for now, maybe show upcoming or config */}
        <div className="border border-green-900/50 p-6 bg-green-900/5 rounded-lg flex flex-col justify-center items-center">
            <div className="text-center">
                <div className="text-6xl mb-4">
                    {statusLabel === 'SYNC' ? '⚡' : 
                     statusLabel === 'WAR_ROOM' ? '⚔️' : 
                     statusLabel === 'BUSY' ? '🚫' : '🌊'}
                </div>
                <div className="text-xl font-bold tracking-widest">{statusLabel} MODE</div>
            </div>
             
             {/* Repo Config Inputs (Optional per user request "allow user to configure repo name") */}
             <div className="mt-8 w-full">
                <label className="text-xs text-gray-500">GITHUB_CONFIG</label>
                <div className="flex gap-2 mt-1">
                    <input 
                        className="bg-black border border-green-800 text-green-500 px-2 py-1 text-xs w-1/2" 
                        value={repoOwner} 
                        onChange={(e) => setRepoOwner(e.target.value)} 
                        placeholder="Owner"
                    />
                    <input 
                        className="bg-black border border-green-800 text-green-500 px-2 py-1 text-xs w-1/2" 
                        value={repoName} 
                        onChange={(e) => setRepoName(e.target.value)} 
                        placeholder="Repo" 
                    />
                </div>
             </div>
        </div>

        {/* User L Column */}
        <div className="border border-green-900/50 p-6 bg-green-900/5 rounded-lg">
            <h2 className="text-xl font-bold mb-4 border-b border-green-900/30 pb-2">USER_L (Akhil Vipin Nair)</h2>
            <div className="text-center mt-8">
                <div className="text-sm text-gray-500 mb-2">CURRENT ACTIVITY</div>
                <div className="text-3xl font-bold text-white">{lStatus}</div>
            </div>
        </div>
      </main>

      {/* Footer / Agenda */}
      <footer className="border-t border-green-900 pt-4">
        <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">_ACTIVE_OBJECTIVES</span>
            <span className="text-xs font-normal opacity-50">(GitHub Issues: {repoOwner}/{repoName})</span>
        </h3>
        <div className="bg-black border border-green-900 p-4 font-mono text-sm h-48 overflow-y-auto rounded shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            {issues.length > 0 ? (
                <ul className="space-y-2">
                    {issues.map((issue) => (
                        <li key={issue.number} className="flex justify-between items-start hover:bg-green-900/20 p-1 cursor-pointer" onClick={() => window.open(issue.url, '_blank')}>
                            <span><span className="text-gray-500">#{issue.number}</span> {issue.title}</span>
                            <span className="text-xs border border-green-800 px-1 rounded text-green-400">OPEN</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-gray-500 italic">No active objectives found...</div>
            )}
        </div>
      </footer>
    </div>
  );
}
