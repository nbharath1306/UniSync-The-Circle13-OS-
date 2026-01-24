"use client";

import { useState, useEffect } from "react";
import { WeeklyProtocol, WEEKLY_PROTOCOL, determineStatus, TimeSlot, ProtocolState } from "@/lib/protocol_logic";
import { StatusCore } from "./StatusCore";
import { OpportunityHeatmap } from "./OpportunityHeatmap";
import { MissionFeed } from "./MissionFeed";
import { motion } from "framer-motion";

export const ProtocolDashboard = () => {
  const [currentSlot, setCurrentSlot] = useState<TimeSlot>({ H: "Scanning...", L: "Scanning..." });
  const [status, setStatus] = useState<ProtocolState>("COMBAT");
  const [timeLeft, setTimeLeft] = useState("");
  
  // Real-time Update Logic
  useEffect(() => {
    const updateProtocol = () => {
      const now = new Date();
      const day = now.toLocaleDateString("en-US", { weekday: "long" });
      
      // Simple time mapping for demo - normally you'd implement strict time parsing
      // For now, let's find the closest previous slot or current slot
      const schedule = WEEKLY_PROTOCOL[day as keyof typeof WEEKLY_PROTOCOL];
      
      if (!schedule) {
          // Sunday or error
          setCurrentSlot({ H: "Rest", L: "Rest" });
          setStatus("SYNC"); // Weekend?
          return;
      }

      // Find current time slot
      // Format now as HH:MM
      const currentLocTime = now.getHours() * 60 + now.getMinutes();
      
      let foundTime = null;
      let slotData = { H: "FREE", L: "FREE" }; // Default to free if outside hours? Or blocked?

      // Sort keys to find ranges
      const sortedTimes = Object.keys(schedule).sort();
      
      for (let i = 0; i < sortedTimes.length; i++) {
          const t = sortedTimes[i];
          const [h, m] = t.split(":").map(Number);
          const tMins = h * 60 + m;
          
          if (currentLocTime >= tMins) {
              foundTime = t;
              slotData = schedule[t];
          } else {
              break; // Future slot
          }
      }

      // If scheduled hours are over (after 15:30 slot + duration), maybe free?
      // Assuming 50 min classes?
      if (foundTime) {
          setCurrentSlot(slotData);
          setStatus(determineStatus(slotData));
      } else {
          // Before start
           setCurrentSlot({ H: "Sleep/Prep", L: "Sleep/Prep" });
           setStatus("SYNC");
      }
      
      // Countdown Logic (to next Sync)
      // Find next 'SYNC' slot in the week
      // This is complex, for v1 just countdown to next hour or placeholder
      const nowTime = new Date();
      const target = new Date();
      target.setHours(nowTime.getHours() + 1);
      target.setMinutes(0);
      target.setSeconds(0);
      
      const diff = target.getTime() - nowTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`NEXT SYNC IN: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const interval = setInterval(updateProtocol, 1000);
    updateProtocol(); // Initial call
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6 md:gap-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-[var(--neon-green)] pb-4">
        <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-[var(--neon-green)] glitch" data-text="CIRCLE13 // PROTOCOL">
                CIRCLE13 // PROTOCOL
            </h1>
            <p className="text-xs md:text-sm text-gray-400 font-mono">FOUNDER OPERATING SYSTEM v1.0</p>
        </div>
        <div className="font-mono text-xl md:text-2xl font-bold animate-pulse text-[var(--neon-green)] mt-2 md:mt-0">
            {timeLeft}
        </div>
      </header>

      {/* Main Status Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          <StatusCore status={status} founder="Bharath" activity={currentSlot.H} />
          <StatusCore status={status} founder="Akhil" activity={currentSlot.L} />
      </div>

      {/* Data Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
              <OpportunityHeatmap />
          </div>
          <div className="lg:col-span-1">
              <MissionFeed />
          </div>
      </div>
      
      {/* Mobile Footer / Controls */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[var(--neon-green)] p-2 grid grid-cols-3 gap-2 z-50">
          <button className="bg-[var(--neon-green)] text-black font-bold py-3 uppercase text-xs">STATUS</button>
          <button className="border border-[var(--neon-green)] text-[var(--neon-green)] font-bold py-3 uppercase text-xs">MAP</button>
          <button className="border border-[var(--neon-green)] text-[var(--neon-green)] font-bold py-3 uppercase text-xs">COMMS</button>
      </div>
      
      <div className="h-16 md:h-0"></div> {/* Spacer for fixed footer */}
    </div>
  );
};
