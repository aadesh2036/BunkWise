/**
 * BunkWise - Deterministic Bunk & Attendance Math Engine
 * Zero AI guessing. Pure, provable academic algebra.
 */

const BunkEngine = {
  /**
   * Calculates attendance percentage formatted to 2 decimal places.
   */
  calculatePercentage(attended, conducted) {
    if (!conducted || conducted <= 0) return 0;
    return Number(((attended / conducted) * 100).toFixed(2));
  },

  /**
   * Calculates how many upcoming classes can be missed while maintaining >= target%.
   * Formula:
   *   A / (C + x) >= T
   *   x <= (A / T) - C
   *   maxSkips = Math.floor(A / T - C)
   */
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

  /**
   * Calculates how many consecutive classes must be attended to recover to >= target%.
   * Formula:
   *   (A + x) / (C + x) >= T
   *   A + x >= T*C + T*x
   *   x*(1 - T) >= T*C - A
   *   x >= (T*C - A) / (1 - T)
   *   needed = Math.ceil((T*C - A) / (1 - T))
   */
  classesNeededToRecover(attended, conducted, target = 75) {
    if (!conducted || conducted <= 0) return 0;
    const targetDecimal = target / 100;

    // Already above or equal to target
    if ((attended / conducted) >= targetDecimal) {
      return 0;
    }

    const numerator = (targetDecimal * conducted) - attended;
    const denominator = 1 - targetDecimal;
    if (denominator <= 0) return 0; // Safeguard for 100% target

    const needed = Math.ceil(numerator / denominator);
    return Math.max(0, needed);
  },

  /**
   * Simulates the exact percentage after attending or skipping.
   */
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

  /**
   * Evaluates today's decision for a specific subject class session.
   * Returns deterministic status, colors, messages, and percentage diffs.
   */
  evaluateClassDecision(subject, target = 75) {
    if (!subject) {
      return {
        status: "UNKNOWN",
        badge: "UNKNOWN",
        badgeClass: "bg-surface-container text-on-surface",
        title: "No Data",
        message: "Subject information is missing.",
        safeToSkip: false
      };
    }

    const attended = Number(subject.attended) || 0;
    const conducted = Number(subject.conducted) || 0;

    // Zero classes held yet
    if (conducted === 0) {
      return {
        status: "NOT_STARTED",
        badge: "NEW 💤",
        badgeClass: "bg-surface-container text-on-surface",
        title: "Course Not Started",
        message: "No lectures held yet. Attending first lecture will set you at 100%.",
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
        badge: "CRITICAL 🔴",
        badgeClass: "bg-error text-on-error",
        borderClass: "border-error",
        bgLight: "bg-[#FEECEE]",
        title: "DO NOT BUNK",
        humorText: "Pack your bags or sit in the front row. Academic treason imminent.",
        message: `Already below target. Skipping drops you to ${ifSkip.percentage}%.`,
        recoveryText: `Attend ${recoveryNeeded} unbroken classes to hit ${target}%`,
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

    // Scenario B: Currently >= target, but skipping drops BELOW target
    if (ifSkip.percentage < target) {
      return {
        status: "BORDERLINE",
        badge: "RAZOR BLADE ⚠️",
        badgeClass: "bg-[#FFD43B] text-on-surface",
        borderClass: "border-[#FFD43B]",
        bgLight: "bg-[#FFFBEA]",
        title: "WALKING THE WIRE",
        humorText: "One skip drops you straight to academic probation.",
        message: `Skipping drops you to ${ifSkip.percentage}% (< ${target}%). Don't risk it!`,
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

    // Scenario C: Safe to skip! Remaining >= target
    return {
      status: "SAFE_TO_SKIP",
      badge: "SAFE HAVEN 🟢",
      badgeClass: "bg-primary-container text-on-primary-container",
      borderClass: "border-primary",
      bgLight: "bg-[#E8F8F2]",
      title: "SAFE TO BUNK",
      humorText: "Go sleep in or grab a chai. You have a cushion.",
      message: `If you skip, you'll still have ${ifSkip.percentage}%, which is >= ${target}%.`,
      recoveryText: `${skipAllowance} safe bunk(s) available`,
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

  /**
   * Aggregates overall university metrics across all subjects.
   */
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
  },

  /**
   * Generates dynamic BunkCat mascot mood, speech and advice.
   */
  getMascotVibe(overallPct, target = 75, belowCount = 0) {
    if (overallPct >= 85) {
      return {
        mood: "chill",
        emoji: "😼",
        name: "Academic Weapon",
        badgeClass: "bg-primary-container text-on-primary-container",
        bgClass: "bg-[#E8F8F2]",
        speech: "“Look at you living like royalty. You've got attendance to burn, but don't get cocky or you'll be back in the trenches.”",
        stressLevel: "12%",
        status: "SAFE_ZONE"
      };
    }
    if (overallPct >= target) {
      return {
        mood: "chill",
        emoji: "😺",
        name: "Cruising Altitude",
        badgeClass: "bg-primary-container text-on-primary-container",
        bgClass: "bg-[#E8F8F2]",
        speech: `“Sitting at ${overallPct}%. You're safe above the ${target}% mark, but guard your cushions. No reckless bunks today.”`,
        stressLevel: "35%",
        status: "CONTROLLED"
      };
    }
    if (overallPct >= target - 5) {
      return {
        mood: "sweat",
        emoji: "😰",
        name: "Sweating Bullets",
        badgeClass: "bg-[#FFD43B] text-on-surface",
        bgClass: "bg-[#FFFBEA]",
        speech: `“Sitting at ${overallPct}%! You are literally one bad flu away from the Dean's automated warning letter. Put down the video games and show up.”`,
        stressLevel: "74%",
        status: "THREAT_HIGH"
      };
    }
    return {
      mood: "panic",
      emoji: "🙀",
      name: "Full Meltdown",
      badgeClass: "bg-error text-on-error",
      bgClass: "bg-[#FEECEE]",
      speech: `“Bestie wake up, you are at ${overallPct}%. Deep Learning alone needs a full redemption arc. Sit in the front row, nod vigorously, and pray.”`,
      stressLevel: "98%",
      status: "DISASTER_IMMINENT"
    };
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.BunkEngine = BunkEngine;
}
