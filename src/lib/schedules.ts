// The "Founder Filter" keywords
const FREE_TYPES = ["Sports", "Library", "Office Hours", "Mentor", "Club Activity", "Tea Break", "Lunch", "Soft Skill Training", "FREE"];

export const TIME_SLOTS = [
  { start: "08:30", end: "09:25" },
  { start: "09:25", end: "10:20" },
  { start: "10:20", end: "10:45", type: "BREAK" },
  { start: "10:45", end: "11:40" },
  { start: "11:40", end: "12:35" },
  { start: "12:35", end: "13:50", type: "LUNCH" },
  { start: "13:50", end: "14:40" },
  { start: "14:40", end: "15:30" },
  { start: "15:30", end: "16:20" }
];

export const SCHEDULE: Record<string, Record<string, { H: string, L: string }>> = {
  Monday: {
    "08:30": { H: "DAA", L: "Lab" },
    "09:25": { H: "IAI", L: "Lab" },
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "DBMS", L: "DBMS" },
    "11:40": { H: "COA", L: "COA" },
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "SEC", L: "SEC" },
    "14:40": { H: "P&S", L: "DAA" },
    "15:30": { H: "Sports", L: "Sports" } // DOUBLE FREE 🟢
  },
  Tuesday: {
    "08:30": { H: "Lab", L: "RM" },
    "09:25": { H: "Lab", L: "IAI" },
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "DBMS" },
    "11:40": { H: "FREE", L: "COA" },
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "SEC", L: "SEC" },
    "14:40": { H: "IAI", L: "Office Hours" }, // ONE FREE 🟡
    "15:30": { H: "Office Hours", L: "Library" } // DOUBLE FREE 🟢
  },
  Wednesday: {
    "08:30": { H: "P&S", L: "Lab" },
    "09:25": { H: "Office Hours", L: "Lab" }, // ONE FREE 🟡
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "DBMS" },
    "11:40": { H: "FREE", L: "Library" }, // DOUBLE FREE 🟢
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "CTS", L: "P&S" },
    "14:40": { H: "RM", L: "CTS" },
    "15:30": { H: "SEC", L: "SEC" }
  },
  Thursday: {
    "08:30": { H: "Mentor", L: "IAI" }, // ONE FREE 🟡
    "09:25": { H: "P&S", L: "DAA" },
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "COA" }, // DOUBLE FREE (Assuming H is free if not listed)
    "11:40": { H: "FREE", L: "Mentor" }, // DOUBLE FREE 🟢
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "CTS", L: "P&S" },
    "14:40": { H: "Library", L: "SEC" }, // ONE FREE 🟡
    "15:30": { H: "SEC", L: "Office Hours" } // ONE FREE 🟡
  },
  Friday: {
    "08:30": { H: "DBMS", L: "DBMS" },
    "09:25": { H: "COA", L: "COA" },
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "P&S" },
    "11:40": { H: "FREE", L: "CTS" },
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "Mentor", L: "Soft Skill Training" }, // DOUBLE FREE 🟢
    "14:40": { H: "DAA", L: "Soft Skill Training" }, // ONE FREE 🟡
    "15:30": { H: "Club Activity", L: "Club Activity" } // DOUBLE FREE 🟢
  },
  Saturday: {
    "08:30": { H: "RM", L: "RM" },
    "09:25": { H: "FREE", L: "FREE" }, // DOUBLE FREE 🟢
    "10:20": { H: "Tea Break", L: "Tea Break" },
    "10:45": { H: "FREE", L: "Soft Skill Training" }, // DOUBLE FREE 🟢
    "11:40": { H: "FREE", L: "Soft Skill Training" }, // DOUBLE FREE 🟢
    "12:35": { H: "Lunch", L: "Lunch" },
    "13:50": { H: "Soft Skill Training", L: "FREE" }, // DOUBLE FREE 🟢
    "14:40": { H: "Soft Skill Training", L: "FREE" } // DOUBLE FREE 🟢
  }
};

export function getStatus(hSubject: string, lSubject: string) {
   const isHFree = FREE_TYPES.includes(hSubject) || hSubject === "FREE";
   const isLFree = FREE_TYPES.includes(lSubject) || lSubject === "FREE";

   if (isHFree && isLFree) return { color: "text-green-500", borderColor: "border-green-500", text: "GO BUILD", sub: "Both Free" };
   if (isHFree || isLFree) return { color: "text-yellow-500", borderColor: "border-yellow-500", text: "SOLO GRIND", sub: "One Free" };
   return { color: "text-red-500", borderColor: "border-red-500", text: "LOCKED IN", sub: "Class" };
}
