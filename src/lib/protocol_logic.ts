// lib/protocol_logic.ts

// THE DEFINITION OF "FREE TIME" FOR A FOUNDER
export const OPPORTUNITY_VECTOR = [
  "Sports", 
  "Library", 
  "Office Hours", 
  "Mentor", 
  "Club Activity", 
  "Tea Break", 
  "Lunch", 
  "Soft Skill Training", 
  "FREE"
];

export type TimeSlot = {
  H: string; // Bharath (4H)
  L: string; // Akhil (4L)
};

export type DaySchedule = Record<string, TimeSlot>;

export type WeeklyProtocol = Record<string, DaySchedule>;

// 4H = Bharath, 4L = Akhil
// Precise Timetable Extracted from PDF Artifacts [cite: 57, 6, 7, 8]
export const WEEKLY_PROTOCOL: WeeklyProtocol = {
  Monday: {
    "08:30": { H: "DAA", L: "DAA/DBMS Lab" },
    "09:25": { H: "IAI", L: "DAA/DBMS Lab" },
    "10:20": { H: "Tea Break", L: "Tea Break" }, // SYNC 🟢
    "10:45": { H: "DBMS", L: "DBMS" },
    "11:40": { H: "COA", L: "COA" },
    "12:35": { H: "Lunch", L: "Lunch" }, // SYNC 🟢
    "13:50": { H: "SEC", L: "SEC" },
    "14:40": { H: "P&S", L: "DAA" },
    "15:30": { H: "Sports", L: "Sports" } // SYNC 🟢 (Walking Meeting)
  },
  Tuesday: {
    "08:30": { H: "DBMS Lab", L: "RM" },
    "09:25": { H: "DBMS Lab", L: "IAI" },
    "10:20": { H: "Tea Break", L: "Tea Break" }, // SYNC 🟢
    "10:45": { H: "FREE", L: "DBMS" }, // ASYNC 🟡 (Bharath Builds)
    "11:40": { H: "FREE", L: "COA" }, // ASYNC 🟡
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "SEC", L: "SEC" },
    "14:40": { H: "IAI", L: "Office Hours" }, // ASYNC 🟡 (Akhil Builds)
    "15:30": { H: "Office Hours", L: "Library" } // SYNC 🟢 (Library Grind)
  },
  Wednesday: {
    "08:30": { H: "P&S", L: "DAA/DBMS Lab" },
    "09:25": { H: "Office Hours", L: "DAA/DBMS Lab" }, // ASYNC 🟡
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "DBMS" }, // ASYNC 🟡
    "11:40": { H: "FREE", L: "Library" }, // SYNC 🟢 (Both "Free")
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "CTS", L: "P&S" },
    "14:40": { H: "RM", L: "CTS" },
    "15:30": { H: "SEC", L: "SEC" }
  },
  Thursday: {
    "08:30": { H: "Mentor", L: "IAI" }, // ASYNC 🟡
    "09:25": { H: "P&S", L: "DAA" },
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "COA" }, // ASYNC 🟡
    "11:40": { H: "FREE", L: "Mentor" }, // SYNC 🟢
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "CTS", L: "P&S" },
    "14:40": { H: "Library", L: "SEC" }, // ASYNC 🟡
    "15:30": { H: "SEC", L: "Office Hours" } // ASYNC 🟡
  },
  Friday: {
    "08:30": { H: "DBMS", L: "DBMS" },
    "09:25": { H: "COA", L: "COA" },
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "P&S" }, // ASYNC 🟡
    "11:40": { H: "FREE", L: "CTS" }, // ASYNC 🟡
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "Mentor", L: "Soft Skill Training" }, // SYNC 🟢
    "14:40": { H: "DAA", L: "Soft Skill Training" }, // ASYNC 🟡
    "15:30": { H: "Club Activity", L: "Club Activity" } // SYNC 🟢 (HQ Meeting)
  },
  Saturday: {
    "08:30": { H: "RM", L: "RM" },
    "09:25": { H: "FREE", L: "FREE" }, // SYNC 🟢 (Hackathon Mode Start)
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "Soft Skill Training" }, // ASYNC 🟡
    "11:40": { H: "FREE", L: "Soft Skill Training" }, // ASYNC 🟡
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "Soft Skill Training", L: "FREE" }, // ASYNC 🟡
    "14:40": { H: "Soft Skill Training", L: "FREE" } // ASYNC 🟡
  }
};

export const isOpportunity = (activity: string) => OPPORTUNITY_VECTOR.includes(activity);

export type ProtocolState = "COMBAT" | "STEALTH" | "SYNC" | "ASYNC";

export const determineStatus = (scheduleBox: TimeSlot): ProtocolState => {
  const hFree = isOpportunity(scheduleBox.H);
  const lFree = isOpportunity(scheduleBox.L);

  if (hFree && lFree) return "SYNC"; // Both free
  
  // Stealth check? The PRD says "STEALTH (Library/Mentor/Sports): Ring turns Amber."
  // It gives examples that are in the OPPORTUNITY_VECTOR.
  // The PRD also says "ASYNC (One Free): Ring spins. Text: 'DELEGATION MODE'."
  
  // Let's rely on the definition:
  // COMBAT (Class): Ring turns Red. (Both busy? or just one busy?)
  // If we follow "One Person Free" = ASYNC.
  // Then "COMBAT" = Both Busy? or One Busy?
  
  // Let's interpret:
  // If H is busy & L is busy -> COMBAT (Academic Lock)
  // If H is free & L is free -> SYNC (Protocol: Build)
  // If H is free & L is busy -> ASYNC (User H is Free, L is Busy)
  // If H is busy & L is free -> ASYNC (User L is Free, H is Busy)
  
  // What about STEALTH? "Library/Mentor/Sports".
  // Maybe if the Activity is specifically one of these, it's STEALTH instead of just "Free/Opportunity".
  // But strictly, let's stick to the 4 states logic first. 
  // Free = Opportunity.
  // If (hFree && lFree) return "SYNC";
  // If (hFree || lFree) return "ASYNC";
  // return "COMBAT";
  
  // Refined Logic based on PRD:
  // "STEALTH (Library/Mentor/Sports): Ring turns Amber. Text: 'OPPORTUNITY DETECTED'."
  // This seems to imply specific activities trigger STEALTH.
  // BUT, logic block says: "It aggressively re-classifies 'soft' university periods as Work Slots."
  // So maybe these ARE the work slots.

  // Let's implement basic logic first:
  if (hFree && lFree) return "SYNC";
  if (hFree || lFree) return "ASYNC";
  return "COMBAT";
};

export const getCurrentSlot = (day: string, time: string) => {
    // This needs logic to find the current active slot.
    // For now, helper to return the data.
    return WEEKLY_PROTOCOL[day as keyof typeof WEEKLY_PROTOCOL];
}
