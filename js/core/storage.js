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
    QUOTA: "bunkwise_ocr_quota_count"
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
      settings: settings || window.DEMO_DATA.settings,
      subjects: subjects,
      timetable: timetable || window.DEMO_DATA.timetable,
      history: history || []
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
   * Resets all data to the student's actual demo dataset.
   */
  resetToDemo() {
    const demo = window.DEMO_DATA;
    this.set(this.KEYS.SETTINGS, demo.settings);
    this.set(this.KEYS.SUBJECTS, demo.subjects);
    this.set(this.KEYS.TIMETABLE, demo.timetable);
    this.set(this.KEYS.HISTORY, demo.attendanceHistory);

    return {
      settings: JSON.parse(JSON.stringify(demo.settings)),
      subjects: JSON.parse(JSON.stringify(demo.subjects)),
      timetable: JSON.parse(JSON.stringify(demo.timetable)),
      history: JSON.parse(JSON.stringify(demo.attendanceHistory))
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
    return {
      settings: { targetAttendance: 75, semester: "Default Semester", demoQuotaLimit: 100 },
      subjects: [],
      timetable: [],
      history: []
    };
  },

  /**
   * Updates settings (e.g. target cutoff, HF token).
   */
  saveSettings(settings) {
    this.set(this.KEYS.SETTINGS, settings);
  },

  /**
   * Saves subjects list.
   */
  saveSubjects(subjects) {
    this.set(this.KEYS.SUBJECTS, subjects);
  },

  /**
   * Saves timetable slots.
   */
  saveTimetable(timetable) {
    this.set(this.KEYS.TIMETABLE, timetable);
  },

  /**
   * Saves attendance history logs.
   */
  saveHistory(history) {
    this.set(this.KEYS.HISTORY, history);
  },

  /**
   * 1-Tap Attendance logging with undo history.
   */
  logAttendance(subjects, subjectId, action, sessionInfo = {}) {
    const subIndex = subjects.findIndex(s => s.id === subjectId || s.code === subjectId);
    if (subIndex === -1) return null;

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
    let history = this.get(this.KEYS.HISTORY) || [];
    const logEntry = {
      id: "hist_" + Date.now(),
      timestamp: new Date().toISOString(),
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

    return { updatedSubject: sub, logEntry };
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
      subjects[subIndex].attended = lastEntry.prevAttended;
      subjects[subIndex].conducted = lastEntry.prevConducted;
      this.saveSubjects(subjects);
    }
    this.saveHistory(history);

    return { revertedEntry: lastEntry, updatedSubject: subjects[subIndex] };
  },

  /**
   * Tracks demo OCR rate-limiting (max 100 requests safeguard).
   */
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
      version: "1.0.0",
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
    a.download = `bunkwise-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Imports backup JSON data.
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.subjects || !data.timetable) {
        throw new Error("Invalid BunkWise backup file format.");
      }

      this.set(this.KEYS.SETTINGS, data.settings || window.DEMO_DATA.settings);
      this.set(this.KEYS.SUBJECTS, data.subjects);
      this.set(this.KEYS.TIMETABLE, data.timetable);
      this.set(this.KEYS.HISTORY, data.history || []);

      return {
        success: true,
        data: {
          settings: data.settings || window.DEMO_DATA.settings,
          subjects: data.subjects,
          timetable: data.timetable,
          history: data.history || []
        }
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.StorageManager = StorageManager;
}
