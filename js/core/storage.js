/**
 * BunkWise - LocalStorage Persistence & Data Vault
 * 100% Client-Side Privacy. Zero server lock-in.
 */

const StorageManager = {
  KEYS: {
    SETTINGS: "bunkwise_settings",
    SUBJECTS: "bunkwise_subjects",
    TIMETABLE: "bunkwise_timetable",
    HISTORY: "bunkwise_attendance_history",
    QUOTA: "bunkwise_ocr_quota_count",
    LOGGED_SESSIONS: "bunkwise_logged_sessions"
  },

  /**
   * Initializes application state from localStorage or loads student demo dataset.
   */
  init() {
    let settings = this.get(this.KEYS.SETTINGS);
    let subjects = this.get(this.KEYS.SUBJECTS);
    let timetable = this.get(this.KEYS.TIMETABLE);
    let history = this.get(this.KEYS.HISTORY);

    // If completely new user / no data in localStorage, seed with student's real demo dataset
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return this.resetToDemo();
    }

    return {
      settings: settings || (window.DEMO_DATA ? window.DEMO_DATA.settings : { targetAttendance: 75 }),
      subjects: this.sanitizeSubjects(subjects),
      timetable: Array.isArray(timetable) ? timetable : (window.DEMO_DATA ? window.DEMO_DATA.timetable : []),
      history: Array.isArray(history) ? history : []
    };
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
    }
  },

  /**
   * Cleans and validates subject records.
   */
  sanitizeSubjects(subjects) {
    if (!Array.isArray(subjects)) return [];
    return subjects.map(s => {
      const attended = Math.max(0, parseInt(s.attended, 10) || 0);
      const conducted = Math.max(attended, parseInt(s.conducted, 10) || 0);
      return {
        ...s,
        id: s.id || "sub_" + (s.code || Math.random().toString(36).substring(2, 7)),
        code: s.code || "UNKNOWN",
        name: s.name || s.code || "Subject",
        faculty: s.faculty || "--",
        type: s.type || "theory",
        attended,
        conducted
      };
    });
  },

  /**
   * Returns current active date key (YYYY-MM-DD).
   */
  getTodayDateKey() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  /**
   * Resets all data to the student's actual demo dataset.
   */
  resetToDemo() {
    const demo = window.DEMO_DATA || { settings: { targetAttendance: 75 }, subjects: [], timetable: [], attendanceHistory: [] };
    this.set(this.KEYS.SETTINGS, demo.settings);
    this.set(this.KEYS.SUBJECTS, demo.subjects);
    this.set(this.KEYS.TIMETABLE, demo.timetable);
    this.set(this.KEYS.HISTORY, demo.attendanceHistory || []);
    this.set(this.KEYS.LOGGED_SESSIONS, {});

    return {
      settings: JSON.parse(JSON.stringify(demo.settings)),
      subjects: JSON.parse(JSON.stringify(demo.subjects)),
      timetable: JSON.parse(JSON.stringify(demo.timetable)),
      history: JSON.parse(JSON.stringify(demo.attendanceHistory || []))
    };
  },

  /**
   * Clears all user data completely (empty slate).
   */
  clearAll() {
    localStorage.removeItem(this.KEYS.SETTINGS);
    localStorage.removeItem(this.KEYS.SUBJECTS);
    localStorage.removeItem(this.KEYS.TIMETABLE);
    localStorage.removeItem(this.KEYS.HISTORY);
    localStorage.removeItem(this.KEYS.LOGGED_SESSIONS);
    return {
      settings: { targetAttendance: 75, semester: "Custom Semester", demoQuotaLimit: 100 },
      subjects: [],
      timetable: [],
      history: []
    };
  },

  saveSettings(settings) {
    this.set(this.KEYS.SETTINGS, settings);
  },

  saveSubjects(subjects) {
    this.set(this.KEYS.SUBJECTS, this.sanitizeSubjects(subjects));
  },

  saveTimetable(timetable) {
    this.set(this.KEYS.TIMETABLE, timetable);
  },

  saveHistory(history) {
    this.set(this.KEYS.HISTORY, history);
  },

  // --- Session-Level Queue Tracking (Prevents Duplicate Logging) ---

  getLoggedSessions() {
    return this.get(this.KEYS.LOGGED_SESSIONS) || {};
  },

  isClassLogged(classId, dateKey = null) {
    if (!classId) return false;
    const dk = dateKey || this.getTodayDateKey();
    const map = this.getLoggedSessions();
    return !!(map[dk] && map[dk][classId]);
  },

  getLoggedInfo(classId, dateKey = null) {
    if (!classId) return null;
    const dk = dateKey || this.getTodayDateKey();
    const map = this.getLoggedSessions();
    return map[dk] ? (map[dk][classId] || null) : null;
  },

  /**
   * Marks a session as logged for a specific date.
   */
  recordSessionLogged(classId, dateKey, action, logId) {
    if (!classId) return;
    const dk = dateKey || this.getTodayDateKey();
    const map = this.getLoggedSessions();
    if (!map[dk]) map[dk] = {};
    map[dk][classId] = {
      action,
      timestamp: new Date().toISOString(),
      logId
    };
    this.set(this.KEYS.LOGGED_SESSIONS, map);
  },

  /**
   * Unmarks a session from logged list for a specific date.
   */
  removeSessionLogged(classId, dateKey = null) {
    if (!classId) return;
    const dk = dateKey || this.getTodayDateKey();
    const map = this.getLoggedSessions();
    if (map[dk] && map[dk][classId]) {
      delete map[dk][classId];
      if (Object.keys(map[dk]).length === 0) {
        delete map[dk];
      }
      this.set(this.KEYS.LOGGED_SESSIONS, map);
    }
  },

  /**
   * 1-Tap Attendance logging with exact session binding.
   */
  logAttendance(subjects, subjectId, action, sessionInfo = {}) {
    const subIndex = subjects.findIndex(s => s.id === subjectId || s.code === subjectId);
    if (subIndex === -1) {
      console.warn(`Subject ${subjectId} not found in state.`);
      return null;
    }

    const classId = sessionInfo.classId || null;
    const dateKey = sessionInfo.dateKey || this.getTodayDateKey();

    // Guard: Prevent duplicate logging if this exact class is already logged today
    if (classId && this.isClassLogged(classId, dateKey)) {
      console.warn(`Class ${classId} already logged for ${dateKey}.`);
      return { duplicate: true, subject: subjects[subIndex] };
    }

    const sub = subjects[subIndex];
    const prevAttended = Number(sub.attended) || 0;
    const prevConducted = Number(sub.conducted) || 0;

    let newAttended = prevAttended;
    let newConducted = prevConducted + 1;

    if (action === "attended") {
      newAttended = prevAttended + 1;
    }

    // Update subject in state
    sub.attended = newAttended;
    sub.conducted = newConducted;
    subjects[subIndex] = sub;
    this.saveSubjects(subjects);

    // Append to history
    const logId = "hist_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    let history = this.get(this.KEYS.HISTORY) || [];
    const logEntry = {
      id: logId,
      timestamp: new Date().toISOString(),
      dateKey: dateKey,
      classId: classId,
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      action: action,
      prevAttended,
      prevConducted,
      newAttended,
      newConducted,
      sessionTitle: sessionInfo.title || "",
      day: sessionInfo.day || ""
    };
    history.unshift(logEntry);
    this.saveHistory(history);

    // Record session as completed for today
    if (classId) {
      this.recordSessionLogged(classId, dateKey, action, logId);
    }

    return { updatedSubject: sub, logEntry, classId };
  },

  /**
   * Reverts attendance specifically for a given class session.
   */
  undoAttendanceForClass(classId, dateKey, subjects) {
    const dk = dateKey || this.getTodayDateKey();
    let history = this.get(this.KEYS.HISTORY) || [];
    const entryIdx = history.findIndex(h => h.classId === classId && (h.dateKey === dk || !h.dateKey));
    if (entryIdx === -1) return null;

    const entry = history[entryIdx];
    history.splice(entryIdx, 1);
    this.saveHistory(history);

    // Revert subject attendance counts
    const subIndex = subjects.findIndex(s => s.id === entry.subjectId || s.code === entry.subjectCode);
    if (subIndex !== -1) {
      subjects[subIndex].attended = Math.max(0, entry.prevAttended);
      subjects[subIndex].conducted = Math.max(subjects[subIndex].attended, entry.prevConducted);
      this.saveSubjects(subjects);
    }

    // Remove from logged sessions so card reappears in the queue
    this.removeSessionLogged(classId, dk);

    return { revertedEntry: entry, updatedSubject: subjects[subIndex] };
  },

  /**
   * Reverts the most recent attendance log entry.
   */
  undoLastHistoryEntry(subjects) {
    let history = this.get(this.KEYS.HISTORY) || [];
    if (history.length === 0) return null;

    const lastEntry = history.shift();
    const subIndex = subjects.findIndex(s => s.id === lastEntry.subjectId || s.code === lastEntry.subjectCode);
    if (subIndex !== -1) {
      subjects[subIndex].attended = Math.max(0, lastEntry.prevAttended);
      subjects[subIndex].conducted = Math.max(subjects[subIndex].attended, lastEntry.prevConducted);
      this.saveSubjects(subjects);
    }
    this.saveHistory(history);

    // If it had a classId, remove from logged sessions map
    if (lastEntry.classId) {
      this.removeSessionLogged(lastEntry.classId, lastEntry.dateKey);
    }

    return { revertedEntry: lastEntry, updatedSubject: subjects[subIndex] };
  },

  getQuotaCount() {
    const raw = localStorage.getItem(this.KEYS.QUOTA);
    return raw ? parseInt(raw, 10) : 0;
  },

  incrementQuota() {
    const current = this.getQuotaCount();
    const next = current + 1;
    localStorage.setItem(this.KEYS.QUOTA, next.toString());
    return next;
  },

  /**
   * Exports full state as downloadable JSON file.
   */
  exportData() {
    const backup = {
      app: "BunkWise",
      version: "1.1.0",
      exportedAt: new Date().toISOString(),
      settings: this.get(this.KEYS.SETTINGS),
      subjects: this.get(this.KEYS.SUBJECTS),
      timetable: this.get(this.KEYS.TIMETABLE),
      history: this.get(this.KEYS.HISTORY)
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bunkwise-backup-${this.getTodayDateKey()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Imports backup JSON data with thorough format verification.
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== "object") {
        throw new Error("Invalid JSON structure.");
      }
      if (!Array.isArray(data.subjects) && !Array.isArray(data.timetable)) {
        throw new Error("Backup file must contain subjects or timetable array.");
      }

      const subjects = this.sanitizeSubjects(data.subjects || []);
      const timetable = Array.isArray(data.timetable) ? data.timetable : [];
      const settings = data.settings || { targetAttendance: 75, semester: "Imported Schedule" };
      const history = Array.isArray(data.history) ? data.history : [];

      this.set(this.KEYS.SETTINGS, settings);
      this.set(this.KEYS.SUBJECTS, subjects);
      this.set(this.KEYS.TIMETABLE, timetable);
      this.set(this.KEYS.HISTORY, history);
      this.set(this.KEYS.LOGGED_SESSIONS, {});

      return {
        success: true,
        data: { settings, subjects, timetable, history }
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Imports Timetable from CSV format:
   * Day, StartTime, EndTime, SubjectCode, SubjectName, Type, Faculty, Room
   */
  importTimetableFromCSV(csvText) {
    try {
      if (!csvText || typeof csvText !== "string") {
        throw new Error("Empty CSV content.");
      }

      const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        throw new Error("CSV must have a header row and at least one class entry.");
      }

      const headers = lines[0].toLowerCase().split(",").map(h => h.trim().replace(/['"]/g, ""));
      const dayIdx = headers.findIndex(h => h.includes("day"));
      const startIdx = headers.findIndex(h => h.includes("start"));
      const endIdx = headers.findIndex(h => h.includes("end"));
      const codeIdx = headers.findIndex(h => h.includes("code") || h === "subject");
      const nameIdx = headers.findIndex(h => h.includes("name") || h.includes("title"));
      const typeIdx = headers.findIndex(h => h.includes("type"));
      const facIdx = headers.findIndex(h => h.includes("faculty") || h.includes("prof"));
      const roomIdx = headers.findIndex(h => h.includes("room"));

      if (codeIdx === -1) {
        throw new Error("CSV requires at least a 'SubjectCode' column.");
      }

      const newTimetable = [];
      const discoveredSubjectsMap = new Map();

      // Read existing subjects to preserve counts
      const existingSubjects = this.get(this.KEYS.SUBJECTS) || [];
      existingSubjects.forEach(s => discoveredSubjectsMap.set(s.code.toUpperCase(), s));

      for (let i = 1; i < lines.length; i++) {
        // Simple comma split respecting quotes
        const row = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
        if (row.length < 2) continue;

        const dayRaw = (dayIdx !== -1 ? row[dayIdx] : "Monday") || "Monday";
        const day = dayRaw.charAt(0).toUpperCase() + dayRaw.slice(1).toLowerCase();
        const startTime = (startIdx !== -1 ? row[startIdx] : "10:00") || "10:00";
        const endTime = (endIdx !== -1 ? row[endIdx] : "11:00") || "11:00";
        const code = (row[codeIdx] || "SUB" + i).trim();
        const name = (nameIdx !== -1 && row[nameIdx]) ? row[nameIdx].trim() : code;
        const type = (typeIdx !== -1 && row[typeIdx]) ? row[typeIdx].trim().toLowerCase() : "theory";
        const faculty = (facIdx !== -1 && row[facIdx]) ? row[facIdx].trim() : "Faculty";
        const room = (roomIdx !== -1 && row[roomIdx]) ? row[roomIdx].trim() : "TBA";

        // Register subject if new
        if (!discoveredSubjectsMap.has(code.toUpperCase())) {
          discoveredSubjectsMap.set(code.toUpperCase(), {
            id: "sub_" + code.toUpperCase().replace(/[^A-Z0-9]/g, "_"),
            code: code,
            name: name,
            faculty: faculty,
            type: type,
            attended: 0,
            conducted: 0,
            color: "#0F766E"
          });
        }

        const sub = discoveredSubjectsMap.get(code.toUpperCase());

        newTimetable.push({
          id: `tt_csv_${i}_` + Date.now(),
          day: day,
          startTime: startTime,
          endTime: endTime,
          subjectId: sub.id,
          subjectCode: code,
          subjectName: name,
          type: type,
          faculty: faculty,
          room: room
        });
      }

      if (newTimetable.length === 0) {
        throw new Error("No valid timetable rows found in CSV.");
      }

      const mergedSubjects = Array.from(discoveredSubjectsMap.values());
      this.saveSubjects(mergedSubjects);
      this.saveTimetable(newTimetable);

      return {
        success: true,
        count: newTimetable.length,
        subjectsCount: mergedSubjects.length,
        subjects: mergedSubjects,
        timetable: newTimetable
      };

    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Generates a sample CSV template for timetable upload.
   */
  getSampleCSVTemplate() {
    return `Day,StartTime,EndTime,SubjectCode,SubjectName,Type,Faculty,Room\nMonday,09:00,10:00,CS301,Data Structures,theory,Dr. Alan Turing,Hall-A\nMonday,10:00,11:00,CS302,Operating Systems,theory,Prof. Linus,Hall-B\nTuesday,11:00,13:00,CS301L,Data Structures Lab,lab,Dr. Alan Turing,Lab-102\nWednesday,14:00,15:00,CS303,Computer Networks,theory,Prof. Cerf,Hall-C\nThursday,09:00,10:00,CS304,Database Systems,theory,Dr. Codd,Hall-A\nFriday,10:00,12:00,CS304L,Database Lab,lab,Dr. Codd,Lab-201`;
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.StorageManager = StorageManager;
}
