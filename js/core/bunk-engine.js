/**
 * BunkWise - Deterministic Attendance Math Engine
 * Zero AI hallucination. Pure deterministic algebra.
 */

const BunkEngine = {
  calculatePercentage(attended, conducted) {
    if (!conducted || conducted <= 0) return 0;
    return Number(((attended / conducted) * 100).toFixed(2));
  },

  calculateSkipAllowance(attended, conducted, target = 75) {
    if (!conducted || conducted <= 0) return 0;
    const targetDecimal = target / 100;
    
    // If already below target, zero skips allowed
    if ((attended / conducted) < targetDecimal) {
      return 0;
    }

    const allowance = Math.floor((attended / targetDecimal) - conducted);
    return Math.max(0, allowance);
  },

  classesNeededToRecover(attended, conducted, target = 75) {
    if (!conducted || conducted <= 0) return 0;
    const targetDecimal = target / 100;

    if ((attended / conducted) >= targetDecimal) {
      return 0;
    }

    const numerator = (targetDecimal * conducted) - attended;
    const denominator = 1 - targetDecimal;
    if (denominator <= 0) return 0;

    const needed = Math.ceil(numerator / denominator);
    return Math.max(0, needed);
  },

  simulateOutcome(attended, conducted, willAttend) {
    const newAttended = willAttend ? attended + 1 : attended;
    const newConducted = conducted + 1;
    const percentage = this.calculatePercentage(newAttended, newConducted);
    return {
      attended: newAttended,
      conducted: newConducted,
      percentage: percentage
    };
  },

  evaluateClassDecision(subject, target = 75) {
    if (!subject) {
      return {
        status: "UNKNOWN",
        badge: "NO DATA",
        badgeClass: "bw-badge-warn",
        title: "No Data",
        message: "Subject data not found.",
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

    // Scenario A: Already below requirement
    if (currentPct < target) {
      return {
        status: "BELOW_TARGET",
        badge: "CRITICAL",
        badgeClass: "bw-badge-danger",
        title: "DO NOT SKIP",
        message: `Currently below ${target}%. Skipping drops you to ${ifSkip.percentage}%.`,
        recoveryText: `Need ${recoveryNeeded} consecutive attendances`,
        currentPct,
        attendPct: ifAttend.percentage,
        skipPct: ifSkip.percentage,
        diffAttend: Number((ifAttend.percentage - currentPct).toFixed(2)),
        diffSkip: Number((ifSkip.percentage - currentPct).toFixed(2)),
        skipAllowance,
        recoveryNeeded,
        safeToSkip: false
      };
    }

    // Scenario B: Currently >= target, but skipping drops below target
    if (ifSkip.percentage < target) {
      return {
        status: "BORDERLINE",
        badge: "BORDERLINE",
        badgeClass: "bw-badge-warn",
        title: "DON'T SKIP",
        message: `Skipping drops attendance to ${ifSkip.percentage}% (below ${target}%).`,
        recoveryText: "Must attend to stay safe",
        currentPct,
        attendPct: ifAttend.percentage,
        skipPct: ifSkip.percentage,
        diffAttend: Number((ifAttend.percentage - currentPct).toFixed(2)),
        diffSkip: Number((ifSkip.percentage - currentPct).toFixed(2)),
        skipAllowance,
        recoveryNeeded,
        safeToSkip: false
      };
    }

    // Scenario C: Safe to skip
    return {
      status: "SAFE_TO_SKIP",
      badge: "SAFE TO SKIP",
      badgeClass: "bw-badge-safe",
      title: "SAFE TO SKIP",
      message: `Skipping leaves you at ${ifSkip.percentage}% (remains ≥ ${target}%).`,
      recoveryText: `${skipAllowance} safe skip(s) available`,
      currentPct,
      attendPct: ifAttend.percentage,
      skipPct: ifSkip.percentage,
      diffAttend: Number((ifAttend.percentage - currentPct).toFixed(2)),
      diffSkip: Number((ifSkip.percentage - currentPct).toFixed(2)),
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
