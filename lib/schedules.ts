export const TIME_SLOTS = [
  { start: "08:30", end: "09:25" },
  { start: "09:25", end: "10:20" },
  { start: "10:20", end: "10:45", type: "BREAK" }, // Tea Break
  { start: "10:45", end: "11:40" },
  { start: "11:40", end: "12:35" },
  { start: "12:35", end: "13:50", type: "LUNCH" }, // Lunch
  { start: "13:50", end: "14:40" },
  { start: "14:40", end: "15:30" },
  { start: "15:30", end: "16:20" }
];

export const SCHEDULE: Record<string, Record<string, { H: string, L: string, status?: string }>> = {
  Monday: {
    "08:30": { H: "DAA", L: "DAA/DBMS Lab" },
    "09:25": { H: "IAI", L: "DAA/DBMS Lab" },
    "10:20": { H: "Tea Break", L: "Tea Break", status: "SYNC" },
    "10:45": { H: "DBMS", L: "DBMS" },
    "11:40": { H: "COA", L: "COA" },
    "12:35": { H: "Lunch (War Room)", L: "Lunch (War Room)", status: "WAR_ROOM" },
    "13:50": { H: "SEC", L: "SEC" },
    "14:40": { H: "P&S", L: "DAA" },
    "15:30": { H: "Sports", L: "Sports", status: "WALK_MEETING" }
  },
  Tuesday: {
    "08:30": { H: "DBMS Lab", L: "RM" },
    "09:25": { H: "DBMS Lab", L: "IAI" },
    "10:20": { H: "Tea Break", L: "Tea Break", status: "SYNC" },
    "10:45": { H: "FREE", L: "DBMS" },
    "11:40": { H: "FREE", L: "COA" },
    "12:35": { H: "Lunch", L: "Lunch", status: "WAR_ROOM" },
    "13:50": { H: "SEC", L: "SEC" },
    "14:40": { H: "IAI", L: "Office Hours" },
    "15:30": { H: "Office Hours", L: "Library", status: "LIBRARY_GRIND" }
  },
  Wednesday: {
    "08:30": { H: "P&S", L: "DAA/DBMS Lab" },
    "09:25": { H: "Office Hours", L: "DAA/DBMS Lab", status: "ASYNC_WORK" },
    "10:20": { H: "Tea Break", L: "Tea Break", status: "SYNC" },
    "10:45": { H: "FREE", L: "DBMS" },
    "11:40": { H: "FREE", L: "Library" },
    "12:35": { H: "Lunch", L: "Lunch", status: "WAR_ROOM" },
    "13:50": { H: "CTS", L: "P&S" },
    "14:40": { H: "RM", L: "CTS" },
    "15:30": { H: "SEC", L: "SEC" }
  },
  Thursday: {
    "08:30": { H: "Mentor", L: "IAI" },
    "09:25": { H: "P&S", L: "DAA" },
    "10:20": { H: "Tea Break", L: "Tea Break", status: "SYNC" },
    "10:45": { H: "FREE", L: "COA" },
    "11:40": { H: "FREE", L: "Mentor" },
    "12:35": { H: "Lunch", L: "Lunch", status: "WAR_ROOM" },
    "13:50": { H: "CTS", L: "P&S" },
    "14:40": { H: "Library", L: "SEC" },
    "15:30": { H: "SEC", L: "Office Hours" }
  },
  Friday: {
    "08:30": { H: "DBMS", L: "DBMS" },
    "09:25": { H: "COA", L: "COA" },
    "10:20": { H: "Tea Break", L: "Tea Break", status: "SYNC" },
    "10:45": { H: "FREE", L: "P&S" },
    "11:40": { H: "FREE", L: "CTS" },
    "12:35": { H: "Lunch", L: "Lunch", status: "WAR_ROOM" },
    "13:50": { H: "Mentor", L: "Soft Skill Training" },
    "14:40": { H: "DAA", L: "Soft Skill Training" },
    "15:30": { H: "Club Activity", L: "Club Activity", status: "WEEKLY_REVIEW" }
  },
  Saturday: {
    "08:30": { H: "RM", L: "RM" },
    "09:25": { H: "FREE", L: "FREE", status: "HACKATHON_MODE" },
    "10:20": { H: "Tea Break", L: "Tea Break", status: "SYNC" },
    "10:45": { H: "FREE", L: "Soft Skill Training", status: "ASYNC_WORK" },
    "11:40": { H: "FREE", L: "Soft Skill Training", status: "ASYNC_WORK" },
    "12:35": { H: "Lunch", L: "Lunch", status: "WAR_ROOM" },
    "13:50": { H: "Soft Skill Training", L: "FREE", status: "ASYNC_WORK" },
    "14:40": { H: "Soft Skill Training", L: "FREE", status: "ASYNC_WORK" }
  }
};
