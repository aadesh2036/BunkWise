/**
 * BunkWise - Date, Day & Time Helpers
 */

const DateUtils = {
  DAYS: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],

  /**
   * Returns current day name (e.g. "Tuesday").
   */
  getRealTodayName() {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, ...
    const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayMap[dayIndex];
  },

  /**
   * Returns active day name (can be overridden in session for demo purposes, defaults to real today or Tuesday).
   */
  getActiveDay() {
    const override = sessionStorage.getItem("bunkwise_day_override");
    return override || this.getRealTodayName();
  },

  setActiveDay(dayName) {
    if (this.DAYS.includes(dayName)) {
      sessionStorage.setItem("bunkwise_day_override", dayName);
    }
  },

  resetActiveDay() {
    sessionStorage.removeItem("bunkwise_day_override");
  },

  /**
   * Converts 24h "13:00" string to "1:00 PM"
   */
  formatTime12h(time24) {
    if (!time24) return "";
    const [hourStr, minStr] = time24.split(":");
    let hours = parseInt(hourStr, 10);
    const mins = minStr || "00";
    if (isNaN(hours)) return time24;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${mins} ${ampm}`;
  },

  /**
   * Formats a slot range like "13:00" - "14:00" to "1:00 PM – 2:00 PM"
   */
  formatRange12h(start, end) {
    if (!start) return "";
    if (!end) return this.formatTime12h(start);
    return `${this.formatTime12h(start)} – ${this.formatTime12h(end)}`;
  },

  /**
   * Returns classes for a specific day, sorted chronologically.
   */
  getClassesForDay(timetable, dayName) {
    if (!timetable || !Array.isArray(timetable)) return [];
    return timetable
      .filter(item => (item.day || "").toLowerCase() === (dayName || "").toLowerCase())
      .sort((a, b) => (a.startTime || "00:00").localeCompare(b.startTime || "00:00"));
  },

  /**
   * Returns human greeting based on time of day.
   */
  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.DateUtils = DateUtils;
}
