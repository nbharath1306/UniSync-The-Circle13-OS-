"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MOCK_ISSUES = [
  { id: 1, text: "[PRIORITY-HIGH] :: Fix Auth Bug :: Assigned to Akhil", color: "text-[var(--neon-red)]" },
  { id: 2, text: "[PENDING] :: Update Landing Page :: Assigned to Bharath", color: "text-[var(--neon-amber)]" },
  { id: 3, text: "[COMPLETE] :: Database Migration :: System", color: "text-[var(--neon-green)]" },
  { id: 4, text: "[IN-PROGRESS] :: Neural Network Integration :: Akhil", color: "text-blue-400" },
  { id: 5, text: "Wait... picking up signal...", color: "text-gray-500" },
    { id: 6, text: "[ALERT] :: Deadline Approaching :: Project Y", color: "text-[var(--neon-red)]" }
];

export const MissionFeed = () => {
  const [logs, setLogs] = useState<typeof MOCK_ISSUES>([]);

  useEffect(() => {
    // Simulate typing effect / incoming feed
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < MOCK_ISSUES.length) {
        setLogs((current) => [MOCK_ISSUES[currentIndex], ...current].slice(0, 5));
        currentIndex++;
      } else {
          // Reset for demo loop
          currentIndex = 0;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md border border-[var(--neon-green)] bg-black/80 rounded-lg overflow-hidden font-mono text-xs">
        <div className="bg-[var(--neon-green)] text-black px-2 py-1 font-bold flex justify-between items-center">
            <span>GITHUB_NEURAL_LINK [v1.0]</span>
            <span className="animate-pulse">● LIVE</span>
        </div>
        <div className="p-4 h-48 overflow-y-auto flex flex-col-reverse gap-2">
            {logs.map((log) => (
                <motion.div 
                    key={log.id + Math.random()} // unique key for re-renders
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border-l-2 border-gray-700 pl-2 ${log.color}`}
                >
                    <span className="opacity-50 mr-2">
                        {new Date().toLocaleTimeString('en-US', {hour12: false, hour: "2-digit", minute: "2-digit"})}
                        {">"}
                    </span>
                    {log.text}
                </motion.div>
            ))}
        </div>
    </div>
  );
};
