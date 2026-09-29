/**
 * BunkWise - Deterministic Attendance Math Engine with Real College Humor
 * Zero AI hallucination. Pure deterministic algebra + sharp student humor.
 */

const BunkEngine = {
  calculatePercentage(attended, conducted) {
    const a = Number(attended) || 0;
    const c = Number(conducted) || 0;
    if (c <= 0 || a <= 0) return 0;
    const pct = (a / c) * 100;
    return Number(Math.min(100, Math.max(0, pct)).toFixed(2));
  },

  calculateSkipAllowance(attended, conducted, target = 75) {
    const a = Number(attended) || 0;
    const c = Number(conducted) || 0;
    const t = Number(target) || 75;
    if (c <= 0 || a <= 0 || t <= 0) return 0;
    
    // Check if currently meeting target
    if ((a / c) * 100 < t) {
      return 0;
    }

    // Exact integer-scaled calculation to prevent floating point precision bugs
    // Condition: a / (c + allowance) >= t / 100  =>  (a * 100) / t - c >= allowance
    const allowance = Math.floor(((a * 100) / t) - c + 1e-9);
    return Math.max(0, allowance);
  },

  classesNeededToRecover(attended, conducted, target = 75) {
    const a = Number(attended) || 0;
    const c = Number(conducted) || 0;
    const t = Number(target) || 75;
    if (c <= 0 || t <= 0) return 0;

    // Check if already meeting target
    if ((a / c) * 100 >= t) {
      return 0;
    }

    if (t >= 100) {
      // Mathematically, 100% can never be recovered if any class was missed
      return Math.max(0, c - a);
    }

    // Condition: (a + x) / (c + x) >= t / 100
    // => 100a + 100x >= t*c + t*x
    // => x(100 - t) >= t*c - 100a
    // => x = ceil((t*c - 100a) / (100 - t))
    const numerator = (t * c) - (100 * a);
    const denominator = 100 - t;
    if (denominator <= 0) return Math.max(0, c - a);

    const needed = Math.ceil((numerator - 1e-9) / denominator);
    return Math.max(0, needed);
  },

  simulateOutcome(attended, conducted, willAttend) {
    const a = Number(attended) || 0;
    const c = Number(conducted) || 0;
    const newAttended = willAttend ? a + 1 : a;
    const newConducted = c + 1;
    const percentage = this.calculatePercentage(newAttended, newConducted);
    return {
      attended: newAttended,
      conducted: newConducted,
      percentage: percentage
    };
  },

  /**
   * Generates humorous, subject-aware reality checks for students.
   */
  getSubjectHumor(code, currentPct, target, isSafe) {
    const c = (code || "").toUpperCase();

    if (currentPct === 0) {
      return "Zero lectures held yet. Show up once and you are legally a 100% attendance god.";
    }

    if (c.includes("3201")) {
      return currentPct < target 
        ? "Absolute academic treason. Sit in the front row, nod at tensors, and cry quietly."
        : "Safe for now, but Deep Learning will humble you fast. Guard your cushion.";
    }

    if (c.includes("3202")) {
      return currentPct < target
        ? "Prompting ChatGPT won't write you out of this attendance hole. Go to class."
        : "Cushion intact. You may prompt from bed today if you wish.";
    }

    if (c.includes("3203A") && c.includes("LAB")) {
      return currentPct <= target
        ? "Walking the razor blade. One single bunk and you kiss your exam hall ticket goodbye."
        : "Lab attendance is alive. Don't blow it on a 15-minute nap.";
    }

    if (c.includes("3203A")) {
      return currentPct < target
        ? "Computational Data is computing your demise. Needs unbroken streak."
        : "Calculated cushion available. Stay frosty.";
    }

    if (c.includes("DSC04") || c.includes("DSC05")) {
      return isSafe
        ? "You have a legal bunk token. Go get boba, you academic weapon."
        : "Coursera track needs love. Don't let an online cert sink your semester.";
    }

    if (c.includes("3205")) {
      return "Design Thinking: Think about designing an alarm clock that actually wakes you up.";
    }

    if (isSafe) {
      return "Safe to skip. Go sleep in or grab a chai, you have calculated room to breathe.";
    }

    return "Skipping drops you straight into the Dean's automated stern email list. Do not do it.";
  },

  evaluateClassDecision(subject, target = 75) {
    if (!subject) {
      return {
        status: "UNKNOWN",
        badge: "NO DATA",
        badgeClass: "bw-badge-warn",
        title: "No Data",
        message: "Subject data not found.",
        realityCheck: "Who knows? Roll the dice.",
        safeToSkip: false
      };
    }

    const attended = Number(subject.attended) || 0;
    const conducted = Number(subject.conducted) || 0;

    if (conducted === 0) {
      return {
        status: "NOT_STARTED",
        badge: "NOT STARTED",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
        title: "Course Not Started",
        message: "No lectures conducted yet.",
        realityCheck: this.getSubjectHumor(subject.code, 0, target, false),
        currentPct: 0,
        attendPct: 100,
        skipPct: 0,
        skipAllowance: 0,
        recoveryNeeded: 0,
        safeToSkip: false
      };
    }

    const currentPct = this.calculatePercentage(attended, conducted);
    const ifAttend = this.simulateOutcome(attended, conducted, true);
    const ifSkip = this.simulateOutcome(attended, conducted, false);
    const skipAllowance = this.calculateSkipAllowance(attended, conducted, target);
    const recoveryNeeded = this.classesNeededToRecover(attended, conducted, target);

    const formatDiff = (val) => {
      const num = Number(val);
      if (Math.abs(num) < 0.001) return 0;
      return Number(num.toFixed(2));
    };

    // Scenario A: Already below requirement
    if (currentPct < target) {
      return {
        status: "BELOW_TARGET",
        badge: "DO NOT BUNK",
        badgeClass: "bw-badge-danger",
        title: "CRITICAL DEFICIT",
        message: `Currently ${currentPct}% (< ${target}%). Skipping drops you to ${ifSkip.percentage}%.`,
        realityCheck: this.getSubjectHumor(subject.code, currentPct, target, false),
        recoveryText: `Need ${recoveryNeeded} consecutive attendances`,
        currentPct,
        attendPct: ifAttend.percentage,
        skipPct: ifSkip.percentage,
        diffAttend: formatDiff(ifAttend.percentage - currentPct),
        diffSkip: formatDiff(ifSkip.percentage - currentPct),
        skipAllowance,
        recoveryNeeded,
        safeToSkip: false
      };
    }

    // Scenario B: Currently >= target, but skipping drops below target
    if (ifSkip.percentage < target) {
      return {
        status: "BORDERLINE",
        badge: "RAZOR BLADE",
        badgeClass: "bw-badge-warn",
        title: "DON'T BUNK",
        message: `Skipping drops attendance to ${ifSkip.percentage}% (breaches ${target}% cutoff).`,
        realityCheck: this.getSubjectHumor(subject.code, currentPct, target, false),
        recoveryText: "Must attend to stay safe",
        currentPct,
        attendPct: ifAttend.percentage,
        skipPct: ifSkip.percentage,
        diffAttend: formatDiff(ifAttend.percentage - currentPct),
        diffSkip: formatDiff(ifSkip.percentage - currentPct),
        skipAllowance,
        recoveryNeeded,
        safeToSkip: false
      };
    }

    // Scenario C: Safe to skip
    return {
      status: "SAFE_TO_SKIP",
      badge: "SAFE TO BUNK",
      badgeClass: "bw-badge-safe",
      title: "CUSHION AVAILABLE",
      message: `Skipping leaves you at ${ifSkip.percentage}% (comfortably ≥ ${target}%).`,
      realityCheck: this.getSubjectHumor(subject.code, currentPct, target, true),
      recoveryText: `${skipAllowance} safe skip(s) available`,
      currentPct,
      attendPct: ifAttend.percentage,
      skipPct: ifSkip.percentage,
      diffAttend: formatDiff(ifAttend.percentage - currentPct),
      diffSkip: formatDiff(ifSkip.percentage - currentPct),
      skipAllowance,
      recoveryNeeded,
      safeToSkip: true
    };
  },

  calculateOverallStats(subjects, target = 75) {
    if (!subjects || subjects.length === 0) {
      return {
        totalAttended: 0,
        totalConducted: 0,
        percentage: 0,
        skipAllowance: 0,
        recoveryNeeded: 0,
        belowTargetCount: 0,
        safeCount: 0,
        totalSubjects: 0
      };
    }

    let totalAttended = 0;
    let totalConducted = 0;
    let belowTargetCount = 0;
    let safeCount = 0;

    subjects.forEach(sub => {
      const a = Number(sub.attended) || 0;
      const c = Number(sub.conducted) || 0;
      totalAttended += a;
      totalConducted += c;

      if (c > 0) {
        const pct = (a / c) * 100;
        if (pct < target) {
          belowTargetCount++;
        } else {
          safeCount++;
        }
      }
    });

    const percentage = this.calculatePercentage(totalAttended, totalConducted);
    const skipAllowance = this.calculateSkipAllowance(totalAttended, totalConducted, target);
    const recoveryNeeded = this.classesNeededToRecover(totalAttended, totalConducted, target);

    return {
      totalAttended,
      totalConducted,
      percentage,
      skipAllowance,
      recoveryNeeded,
      belowTargetCount,
      safeCount,
      totalSubjects: subjects.length
    };
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.BunkEngine = BunkEngine;
}
