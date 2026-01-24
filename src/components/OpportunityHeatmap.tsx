"use client";

import { WEEKLY_PROTOCOL, determineStatus, DaySchedule } from "@/lib/protocol_logic";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useState } from "react";

const TIME_SLOTS = [
  "08:30", "09:25", "10:20", "10:45", "11:40", "12:35", "13:50", "14:40", "15:30"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const OpportunityHeatmap = () => {
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

    return (
        <div className="w-full p-4 border border-[var(--neon-green)] bg-black/40 backdrop-blur-md rounded-lg mx-auto max-w-4xl">
            <h3 className="text-[var(--neon-green)] font-mono text-lg mb-4 uppercase tracking-widest border-b border-[var(--neon-green)] pb-2">
                Opportunity Matrix
            </h3>
            
            <div className="flex flex-col gap-1">
                {/* Header Row */}
                <div className="flex gap-1 ml-16 mb-2">
                    {TIME_SLOTS.map((time) => (
                        <div key={time} className="flex-1 text-[10px] text-center text-[var(--neon-green)] opacity-70 rotate-45 origin-bottom-left transform translate-x-2">
                           {time}
                        </div>
                    ))}
                </div>

                {DAYS.map((day) => {
                    const schedule = WEEKLY_PROTOCOL[day as keyof typeof WEEKLY_PROTOCOL] as DaySchedule;
                    
                    return (
                        <div key={day} className="flex gap-2 items-center">
                            <div className="w-16 text-[10px] uppercase text-[var(--neon-green)] font-bold text-right pt-1">{day.substring(0, 3)}</div>
                            <div className="flex-1 flex gap-1">
                                {TIME_SLOTS.map((time) => {
                                    const slot = schedule?.[time];
                                    if (!slot) return <div key={time} className="flex-1 h-8 bg-gray-900/50 rounded-sm" />;

                                    const status = determineStatus(slot);
                                    let bgClass = "bg-gray-800"; // COMBAT
                                    let opacity = "opacity-30";
                                    
                                    if (status === "SYNC") {
                                        bgClass = "bg-[var(--neon-green)]";
                                        opacity = "opacity-100 shadow-[0_0_10px_var(--neon-green)]";
                                    } else if (status === "ASYNC") {
                                        bgClass = "bg-[var(--neon-green)]";
                                        opacity = "opacity-40";
                                    } else if (status === "STEALTH") {
                                         bgClass = "bg-[var(--neon-amber)]";
                                         opacity = "opacity-80";
                                    }

                                    return (
                                        <motion.div
                                            key={time}
                                            whileHover={{ scale: 1.2, zIndex: 10 }}
                                            className={clsx(
                                                "flex-1 h-8 rounded-sm cursor-crosshair transition-all border border-black",
                                                bgClass,
                                                opacity
                                            )}
                                            onMouseEnter={() => setHoveredInfo(`${day} ${time} | B: ${slot.H} | A: ${slot.L} -> ${status}`)}
                                            onMouseLeave={() => setHoveredInfo(null)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="h-8 mt-4 text-center font-mono text-xs text-[var(--neon-green)] typing-effect">
                {hoveredInfo || "HOVER STRATEGY BLOCK TO DECRYPT"}
            </div>
        </div>
    );
};
