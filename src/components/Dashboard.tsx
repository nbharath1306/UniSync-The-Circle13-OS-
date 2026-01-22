"use client";

import React, { useState, useEffect } from 'react';
import { SCHEDULE, TIME_SLOTS, getStatus } from '@/lib/schedules';

interface Issue {
  number: number;
  title: string;
  url: string; // html_url
  state: string;
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [issues, setIssues] = useState<Issue[]>([]);
  const [repoOwner, setRepoOwner] = useState(process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'nbharath1306');
  const [repoName, setRepoName] = useState(process.env.NEXT_PUBLIC_GITHUB_REPO || 'UniSync-The-Circle13-OS-');

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
  }, [repoOwner, repoName, currentTime]); // Re-fetch occasionally? Maybe just on mount or input change

  // Determine current slot
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[currentTime.getDay()];
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const timeString = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

  const currentSchedule = SCHEDULE[currentDay];
  
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
        activeSlotKey = slot.start;
        break;
    }
  }

  const slotData = (currentSchedule && activeSlotKey) ? currentSchedule[activeSlotKey] : null;
  const hSubject = slotData?.H || "OFFLINE";
  const lSubject = slotData?.L || "OFFLINE";

  const status = getStatus(hSubject, lSubject);
  const isPulse = status.text === 'GO BUILD';
  const isGreenH = ["Sports", "Library", "Office Hours", "Mentor", "Club Activity", "Tea Break", "Lunch", "Soft Skill Training", "FREE"].includes(hSubject) || hSubject === 'FREE';
  const isGreenL = ["Sports", "Library", "Office Hours", "Mentor", "Club Activity", "Tea Break", "Lunch", "Soft Skill Training", "FREE"].includes(lSubject) || lSubject === 'FREE';


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#22c55e] font-mono p-4 flex flex-col justify-between">
      
      {/* Top Bar: Giant Status Text */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
          <div className="text-6xl md:text-8xl font-black tracking-tighter text-center animate-pulse">
              {status.text}
          </div>
          <div className={`text-xl font-bold mt-2 px-4 py-1 border ${status.borderColor} ${status.color}`}>
              STATUS: {status.sub}
          </div>
          <div className="text-gray-500 mt-4 font-bold text-2xl">
              {timeString} | {currentDay}
          </div>
      </div>

      {/* Middle: Two Cards side-by-side */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 py-8 px-4 md:px-12">
        {/* User H Column */}
        <div className={`border-2 ${isGreenH ? 'border-green-500 bg-green-900/10' : 'border-red-900/50 bg-red-900/5'} p-8 rounded-xl flex flex-col items-center justify-center transition-all duration-300`}>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 w-full text-center text-gray-400">BHARATH (4H)</h2>
            <div className="text-center mt-4">
                <div className="text-sm text-gray-500 mb-2">CURRENT ACTIVITY</div>
                <div className={`text-4xl md:text-5xl font-bold ${isGreenH ? 'text-green-400' : 'text-red-500'} max-w-full break-words`}>
                    {hSubject}
                </div>
            </div>
        </div>

        {/* User L Column */}
        <div className={`border-2 ${isGreenL ? 'border-green-500 bg-green-900/10' : 'border-red-900/50 bg-red-900/5'} p-8 rounded-xl flex flex-col items-center justify-center transition-all duration-300`}>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 w-full text-center text-gray-400">AKHIL (4L)</h2>
            <div className="text-center mt-4">
                <div className="text-sm text-gray-500 mb-2">CURRENT ACTIVITY</div>
                <div className={`text-4xl md:text-5xl font-bold ${isGreenL ? 'text-green-400' : 'text-red-500'} max-w-full break-words`}>
                    {lSubject}
                </div>
            </div>
        </div>
      </main>

      {/* Bottom: Agenda */}
      <footer className="border-t border-gray-800 pt-4 px-4 pb-2">
        <h3 className="text-lg font-bold mb-2 flex items-center text-gray-400">
            <span className="mr-2">_ACTIVE_OBJECTIVES</span>
            <span className="text-xs font-normal opacity-50">({repoOwner}/{repoName})</span>
        </h3>
        <div className="bg-black border border-gray-800 p-4 font-mono text-sm h-48 overflow-y-auto rounded-lg">
            {issues.length > 0 ? (
                <ul className="space-y-3">
                    {issues.map((issue) => (
                        <li key={issue.number} className="flex justify-between items-start hover:bg-white/5 p-2 rounded cursor-pointer transition-colors border-b border-gray-900 last:border-0" onClick={() => window.open(issue.url, '_blank')}>
                            <span className="flex-1"><span className="text-gray-500 mr-2">#{issue.number}</span> {issue.title}</span>
                            <span className="text-xs border border-green-800 bg-green-900/20 px-2 py-0.5 rounded text-green-400 ml-4">OPEN</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-gray-600 italic flex items-center justify-center h-full">No active objectives found...</div>
            )}
        </div>
        
        {/* Hidden Config Inputs */}
        <div className="mt-4 w-full flex justify-center opacity-20 hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
                <input 
                    className="bg-black border border-gray-800 text-gray-500 px-2 py-1 text-xs w-32 focus:outline-none focus:border-green-500" 
                    value={repoOwner} 
                    onChange={(e) => setRepoOwner(e.target.value)} 
                    placeholder="Owner"
                />
                <input 
                    className="bg-black border border-gray-800 text-gray-500 px-2 py-1 text-xs w-48 focus:outline-none focus:border-green-500" 
                    value={repoName} 
                    onChange={(e) => setRepoName(e.target.value)} 
                    placeholder="Repo" 
                />
            </div>
         </div>
      </footer>
    </div>
  );
}
