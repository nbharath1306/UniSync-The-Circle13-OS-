"use client";

import { motion } from "framer-motion";
import { ProtocolState } from "@/lib/protocol_logic";
import clsx from "clsx";

interface StatusCoreProps {
  status: ProtocolState;
  founder: "Bharath" | "Akhil";
  activity: string;
}

export const StatusCore = ({ status, founder, activity }: StatusCoreProps) => {
  const getColor = (s: ProtocolState) => {
    switch (s) {
      case "COMBAT": return "border-[var(--neon-red)] shadow-[0_0_20px_var(--neon-red)] text-[var(--neon-red)]";
      case "STEALTH": return "border-[var(--neon-amber)] shadow-[0_0_20px_var(--neon-amber)] text-[var(--neon-amber)]";
      case "SYNC": return "border-[var(--neon-green)] shadow-[0_0_20px_var(--neon-green)] text-[var(--neon-green)]";
      case "ASYNC": return "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] text-blue-500";
    }
  };

  const getLabel = (s: ProtocolState) => {
    switch (s) {
      case "COMBAT": return "ACADEMIC LOCK";
      case "STEALTH": return "OPPORTUNITY DETECTED";
      case "SYNC": return "PROTOCOL: BUILD";
      case "ASYNC": return "DELEGATION MODE";
    }
  };

  const isSpinning = status === "ASYNC";
  const isPulsing = true;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          animate={isSpinning ? { rotate: 360 } : { scale: [1, 1.05, 1] }}
          transition={isSpinning ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={clsx(
            "w-48 h-48 rounded-full border-4 flex items-center justify-center bg-black/50 backdrop-blur-sm",
            getColor(status)
          )}
        >
          {/* Inner Core */}
          <div className="flex flex-col items-center text-center">
             <h2 className="text-xl font-bold font-mono tracking-widest uppercase mb-1">{founder}</h2>
             <p className="text-sm font-bold opacity-80">{activity}</p>
          </div>
        </motion.div>
        
        {/* Status Label */}
        <div className={clsx("mt-4 text-center font-bold tracking-widest text-sm", getColor(status))}>
            {getLabel(status)}
        </div>
      </div>
    </div>
  );
};
