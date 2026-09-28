/**
 * BunkWise - Weekly Bunk Planner & Multi-Skip Sandbox
 * Evaluate weekly flexibility and simulate multi-session bunks.
 */

const PlannerView = {
  simulatedSkips: new Set(), // Set of class IDs to simulate skipping

  render(container, state) {
    const { subjects, timetable, settings } = state;
    const target = settings.targetAttendance || 75;

    // Calculate weekly flexibility
    const weeklyAnalysis = this.analyzeWeeklyFlexibility(timetable, subjects, target);

    container.innerHTML = `
      <div class="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="bw-card p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">⚡</span>
              <h2 class="font-headline text-2xl font-bold text-[#18181B]">Weekly Bunk Planner & Sandbox</h2>
            </div>
            <p class="text-xs text-slate-600 mt-1">
              Select any upcoming classes to simulate skipping and see the real-time cascade on your attendance.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="PlannerView.resetSim()" class="bw-btn text-xs">
              Clear Simulation (${this.simulatedSkips.size})
            </button>
          </div>
        </div>

        <!-- Weekly Flexibility Summary Banner (PRD Section 23) -->
        <div class="bw-card p-5 ${weeklyAnalysis.totalSafeSkips > 0 ? 'bg-emerald-50' : 'bg-red-50'} border-2 border-[#18181B]">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-xs uppercase font-bold tracking-wider ${weeklyAnalysis.totalSafeSkips > 0 ? 'text-emerald-800' : 'text-red-800'}">
                Weekly Flexibility Analysis
              </span>
              <h3 class="font-headline text-2xl font-black text-[#18181B] mt-1">
                You have <span class="${weeklyAnalysis.totalSafeSkips > 0 ? 'text-emerald-700' : 'text-red-600'}">${weeklyAnalysis.totalSafeSkips} safe class ${weeklyAnalysis.totalSafeSkips === 1 ? 'skip' : 'skips'}</span> available this week.
              </h3>
              <p class="text-xs text-slate-700 mt-1">
                ⚠️ Remember: Attendance flexibility is strictly <strong>subject-specific</strong>, not university-wide.
              </p>
            </div>

            <!-- Subject Badges Row -->
            <div class="flex flex-wrap gap-2">
              ${subjects.filter(s => (s.conducted || 0) > 0).map(s => {
                const skips = BunkEngine.calculateSkipAllowance(s.attended, s.conducted, target);
                return `
                  <div class="p-2 bg-white rounded border border-[#18181B] text-xs flex flex-col">
                    <span class="font-bold text-[#18181B]">${s.code}</span>
                    <span class="${skips > 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}">
                      ${skips > 0 ? `${skips} skip(s)` : '0 skips (Danger)'}
                    </span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <!-- Simulation HUD (If any classes checked) -->
        ${this.simulatedSkips.size > 0 ? this.renderSimulationHUD(timetable, subjects, target) : ""}

        <!-- Weekly Schedule Simulator Grid -->
        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <h3 class="font-headline text-xl font-bold text-[#18181B]">
              This Week's Scheduled Sessions: Check to Simulate Bunking
            </h3>
            <span class="text-xs text-slate-500 font-bold">
              ${this.simulatedSkips.size} session(s) selected
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            ${DateUtils.DAYS.map(day => this.renderDayColumn(day, timetable, subjects, target)).join("")}
          </div>
        </div>

      </div>
    `;
  },

  analyzeWeeklyFlexibility(timetable, subjects, target) {
    let totalSafeSkips = 0;
    const subjectSkips = {};

    subjects.forEach(sub => {
      const allowance = BunkEngine.calculateSkipAllowance(sub.attended, sub.conducted, target);
      subjectSkips[sub.id] = allowance;
      totalSafeSkips += allowance;
    });

    return { totalSafeSkips, subjectSkips };
  },

  renderDayColumn(day, timetable, subjects, target) {
    const classes = DateUtils.getClassesForDay(timetable, day);
    if (classes.length === 0) return "";

    return `
      <div class="bw-card p-4 bg-white flex flex-col gap-3">
        <div class="flex items-center justify-between pb-2 border-b-2 border-[#18181B]">
          <h4 class="font-headline text-base font-bold text-[#18181B]">${day}</h4>
          <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-[#18181B] font-bold">
            ${classes.length} Classes
          </span>
        </div>

        <div class="flex flex-col gap-2.5">
          ${classes.map(item => {
            const isSimulated = this.simulatedSkips.has(item.id);
            const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode) || {
              attended: 0, conducted: 0, name: item.subjectName
            };
            const decision = BunkEngine.evaluateClassDecision(sub, target);

            return `
              <div class="p-3 rounded-lg border-2 border-[#18181B] transition-all ${
                isSimulated 
                  ? 'bg-red-50 border-red-600 shadow-[2px_2px_0px_#DC2626]' 
                  : 'bg-slate-50 hover:bg-white'
              }">
                <div class="flex items-center justify-between gap-1 mb-1">
                  <span class="text-[11px] font-bold bg-white px-1.5 py-0.2 rounded border border-[#18181B]">
                    ${item.startTime} - ${item.endTime}
                  </span>
                  <span class="bw-badge ${decision.badgeClass} text-[10px]">
                    ${decision.badge}
                  </span>
                </div>

                <div class="font-bold text-[#18181B] text-sm mt-1">
                  ${item.subjectCode}
                </div>
                <div class="text-[11px] text-slate-500">
                  ${item.room} • Current: <strong>${decision.currentPct}%</strong>
                </div>

                <!-- Simulation Checkbox -->
                <div class="mt-2 pt-2 border-t border-[#18181B]/15 flex items-center justify-between">
                  <label class="flex items-center gap-2 cursor-pointer select-none text-xs font-bold ${isSimulated ? 'text-red-700' : 'text-slate-700'}">
                    <input 
                      type="checkbox" 
                      ${isSimulated ? 'checked' : ''} 
                      onchange="PlannerView.toggleSimClass('${item.id}')"
                      class="w-4 h-4 rounded border-2 border-[#18181B] accent-red-600"
                    >
                    <span>Simulate Bunk</span>
                  </label>
                  <span class="text-[10px] text-slate-400 uppercase font-bold">
                    ${item.type}
                  </span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  renderSimulationHUD(timetable, subjects, target) {
    // Clone subjects to simulate bunk impacts
    const simSubjects = JSON.parse(JSON.stringify(subjects));

    // For each checked class in timetable, add 1 to conducted
    this.simulatedSkips.forEach(classId => {
      const cls = timetable.find(t => t.id === classId);
      if (cls) {
        const sub = simSubjects.find(s => s.id === cls.subjectId || s.code === cls.subjectCode);
        if (sub) {
          sub.conducted = (Number(sub.conducted) || 0) + 1;
        }
      }
    });

    const baseline = BunkEngine.calculateOverallStats(subjects, target);
    const simulated = BunkEngine.calculateOverallStats(simSubjects, target);

    return `
      <div class="bw-card p-5 bg-[#FFFBEA] border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] flex flex-col gap-4">
        <div class="flex items-center justify-between pb-2 border-b border-[#18181B]">
          <div class="flex items-center gap-2">
            <span class="text-xl">🔮</span>
            <h3 class="font-headline text-lg font-bold">Simulation Results: Skipping ${this.simulatedSkips.size} Selected Sessions</h3>
          </div>
          <button onclick="PlannerView.resetSim()" class="text-xs font-bold text-red-700 hover:underline">
            Reset Sandbox
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <!-- Overall impact -->
          <div class="p-3 bg-white border border-[#18181B] rounded-lg">
            <span class="text-slate-500 font-bold block mb-1">Overall Attendance</span>
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-bold text-slate-400 line-through">${baseline.percentage}%</span>
              <span class="font-headline text-2xl font-black ${simulated.percentage >= target ? 'text-emerald-700' : 'text-red-600'}">
                ➔ ${simulated.percentage}%
              </span>
            </div>
            <span class="text-[10px] text-slate-500 font-bold">
              Change: ${Number((simulated.percentage - baseline.percentage).toFixed(2))}%
            </span>
          </div>

          <!-- Recovery impact -->
          <div class="p-3 bg-white border border-[#18181B] rounded-lg">
            <span class="text-slate-500 font-bold block mb-1">Consecutive Recovery Needed</span>
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-bold text-slate-400 line-through">${baseline.recoveryNeeded}</span>
              <span class="font-headline text-2xl font-black text-red-600">
                ➔ ${simulated.recoveryNeeded} Classes
              </span>
            </div>
            <span class="text-[10px] text-slate-500 font-bold">
              Penalty: +${simulated.recoveryNeeded - baseline.recoveryNeeded} extra lectures
            </span>
          </div>

          <!-- Danger subjects count -->
          <div class="p-3 bg-white border border-[#18181B] rounded-lg">
            <span class="text-slate-500 font-bold block mb-1">Subjects Below Cutoff</span>
            <div class="flex items-baseline gap-2">
              <span class="font-headline text-2xl font-black text-red-600">
                ${simulated.belowTargetCount}
              </span>
              <span class="text-slate-500">out of ${simulated.totalSubjects} subjects</span>
            </div>
            <span class="text-[10px] text-slate-500 font-bold">
              ${simulated.belowTargetCount > baseline.belowTargetCount ? `🚨 +${simulated.belowTargetCount - baseline.belowTargetCount} subjects fell into danger!` : 'No new subjects breached cutoff.'}
            </span>
          </div>
        </div>
      </div>
    `;
  },

  toggleSimClass(classId) {
    if (this.simulatedSkips.has(classId)) {
      this.simulatedSkips.delete(classId);
    } else {
      this.simulatedSkips.add(classId);
    }
    App.renderCurrentView();
  },

  resetSim() {
    this.simulatedSkips.clear();
    App.renderCurrentView();
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.PlannerView = PlannerView;
}
