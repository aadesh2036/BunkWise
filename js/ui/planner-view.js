/**
 * BunkWise - Clean Weekly Planner & Simulation Sandbox
 */

const PlannerView = {
  simulatedSkips: new Set(),

  render(container, state) {
    const { subjects, timetable, settings } = state;
    const target = settings.targetAttendance || 75;

    // Purge any stale IDs if timetable classes were deleted or modified
    const validIds = new Set((timetable || []).map(t => t.id));
    this.simulatedSkips.forEach(id => {
      if (!validIds.has(id)) this.simulatedSkips.delete(id);
    });

    const weeklyAnalysis = this.analyzeWeeklyFlexibility(timetable || [], subjects || [], target);

    container.innerHTML = `
      <div class="flex flex-col gap-5 max-w-5xl mx-auto pb-16 px-1 sm:px-0">
        
        <!-- Header -->
        <div class="bw-card p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="font-headline text-2xl font-bold text-[#18181B]">Weekly Bunk Planner</h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Check upcoming sessions to simulate skipping and see the projected impact before you make the call.
            </p>
          </div>

          <div class="flex items-center gap-2">
            ${this.simulatedSkips.size > 0 ? `
              <button onclick="PlannerView.resetSim()" class="bw-btn text-xs">
                Clear Simulation (${this.simulatedSkips.size})
              </button>
            ` : ""}
            <button onclick="App.openTimetableModal()" class="bw-btn text-xs bg-yellow-50 hover:bg-yellow-100">
              ${PixelIcon.get('upload')} Timetable
            </button>
          </div>
        </div>

        <!-- Weekly Flexibility Summary Banner -->
        <div class="bw-card p-4 bg-white border border-[#18181B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Weekly Flexibility Analysis</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="font-headline text-2xl font-bold ${weeklyAnalysis.totalSafeSkips > 0 ? 'text-emerald-700' : 'text-slate-800'}">
                ${weeklyAnalysis.totalSafeSkips} safe ${weeklyAnalysis.totalSafeSkips === 1 ? 'class skip' : 'class skips'}
              </span>
              <span class="text-xs text-slate-500">available across this week</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Flexibility is strictly subject-specific. Skipping one subject does not transfer cushion to another.
            </p>
          </div>

          <!-- Subject Pill Breakdown -->
          <div class="flex flex-wrap gap-1.5 self-start sm:self-center">
            ${subjects.filter(s => (s.conducted || 0) > 0).map(s => {
              const skips = BunkEngine.calculateSkipAllowance(s.attended, s.conducted, target);
              return `
                <div class="px-2 py-1 bg-slate-50 rounded border border-slate-200 text-[11px] font-bold">
                  <span class="text-slate-700">${s.code}:</span>
                  <span class="${skips > 0 ? 'text-emerald-700' : 'text-red-600'}">${skips}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Simulation HUD (Active when classes are checked) -->
        ${this.simulatedSkips.size > 0 ? this.renderSimulationHUD(timetable, subjects, target) : ""}

        <!-- Weekly Days Grid -->
        <div class="flex flex-col gap-4">
          <h3 class="font-headline text-base font-bold text-slate-800">
            Weekly Schedule: Select sessions to simulate skipping
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${DateUtils.DAYS.map(day => this.renderDayColumn(day, timetable, subjects, target)).join("")}
          </div>
        </div>

      </div>
    `;
  },

  analyzeWeeklyFlexibility(timetable, subjects, target) {
    let totalSafeSkips = 0;
    subjects.forEach(sub => {
      const allowance = BunkEngine.calculateSkipAllowance(sub.attended, sub.conducted, target);
      totalSafeSkips += allowance;
    });
    return { totalSafeSkips };
  },

  renderDayColumn(day, timetable, subjects, target) {
    const classes = DateUtils.getClassesForDay(timetable, day);
    if (classes.length === 0) return "";

    return `
      <div class="bw-card p-4 bg-white flex flex-col gap-3">
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <h4 class="font-headline text-sm font-bold text-slate-900">${day}</h4>
          <span class="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-600">
            ${classes.length} classes
          </span>
        </div>

        <div class="flex flex-col gap-2">
          ${classes.map(item => {
            const isSimulated = this.simulatedSkips.has(item.id);
            const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode) || {
              attended: 0, conducted: 0, name: item.subjectName
            };
            const decision = BunkEngine.evaluateClassDecision(sub, target);

            return `
              <div class="p-2.5 rounded border transition-all ${
                isSimulated 
                  ? 'bg-red-50 border-red-500 shadow-[1px_1px_0px_#EF4444]' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-400'
              }">
                <div class="flex items-center justify-between gap-1 mb-1">
                  <span class="text-[10px] font-bold text-slate-700 bg-white px-1 rounded border border-slate-200">
                    ${item.startTime} - ${item.endTime}
                  </span>
                  <span class="bw-badge ${decision.badgeClass} text-[9px] py-0.2 px-1">
                    ${decision.badge}
                  </span>
                </div>

                <div class="font-bold text-slate-900 text-xs">
                  ${item.subjectCode}
                </div>
                <div class="text-[11px] text-slate-500">
                  Current: <strong>${decision.currentPct}%</strong>
                </div>

                <!-- Toggle Checkbox -->
                <div class="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                  <label class="flex items-center gap-1.5 cursor-pointer text-xs font-bold ${isSimulated ? 'text-red-700' : 'text-slate-600'}">
                    <input 
                      type="checkbox" 
                      ${isSimulated ? 'checked' : ''} 
                      onchange="PlannerView.toggleSimClass('${item.id}')"
                      class="w-3.5 h-3.5 rounded border border-[#18181B] accent-red-600"
                    >
                    <span>Simulate Skip</span>
                  </label>
                  <span class="text-[10px] text-slate-400 uppercase">
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
    const simSubjects = JSON.parse(JSON.stringify(subjects));

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
      <div class="bw-card p-4 bg-slate-50 border-2 border-[#18181B] flex flex-col gap-3">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200">
          <strong class="text-xs text-slate-800">
            Projected Impact of Skipping ${this.simulatedSkips.size} Selected Sessions:
          </strong>
          <button onclick="PlannerView.resetSim()" class="text-xs font-bold text-slate-500 hover:text-red-600">
            Reset
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-2.5 bg-white border border-slate-200 rounded">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Overall Attendance</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-xs text-slate-400 line-through">${baseline.percentage}%</span>
              <span class="font-headline text-xl font-black ${simulated.percentage >= target ? 'text-emerald-700' : 'text-red-600'}">
                ➔ ${simulated.percentage}%
              </span>
            </div>
            <span class="text-[10px] text-slate-500">
              Diff: ${Number((simulated.percentage - baseline.percentage).toFixed(2))}%
            </span>
          </div>

          <div class="p-2.5 bg-white border border-slate-200 rounded">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Recovery Needed</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-xs text-slate-400 line-through">${baseline.recoveryNeeded}</span>
              <span class="font-headline text-xl font-black text-red-600">
                ➔ ${simulated.recoveryNeeded} classes
              </span>
            </div>
            <span class="text-[10px] text-slate-500">
              Penalty: +${simulated.recoveryNeeded - baseline.recoveryNeeded} extra classes
            </span>
          </div>

          <div class="p-2.5 bg-white border border-slate-200 rounded">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Subjects in Deficit</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="font-headline text-xl font-black text-slate-800">
                ${simulated.belowTargetCount}
              </span>
              <span class="text-[11px] text-slate-500">out of ${simulated.totalSubjects} subjects</span>
            </div>
            <span class="text-[10px] text-slate-500">
              ${simulated.belowTargetCount > baseline.belowTargetCount ? `+${simulated.belowTargetCount - baseline.belowTargetCount} subject(s) crossed below cutoff` : 'No new deficit subjects'}
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
