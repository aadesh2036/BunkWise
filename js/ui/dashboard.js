/**
 * BunkWise - Clean & Clutter-Free Dashboard View
 * Focus: High clarity, zero cognitive overload, pure actionable decisions.
 */

const DashboardView = {
  render(container, state) {
    const { subjects, timetable, settings } = state;
    const target = settings.targetAttendance || 75;
    const activeDay = DateUtils.getActiveDay();
    const overall = BunkEngine.calculateOverallStats(subjects, target);
    const todaysClasses = DateUtils.getClassesForDay(timetable, activeDay);

    container.innerHTML = `
      <div class="flex flex-col gap-5 max-w-5xl mx-auto pb-12">
        
        <!-- Day Selector Strip -->
        <div class="bw-card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-0.5">
            <span class="text-xs font-bold text-slate-500 uppercase mr-1">Day:</span>
            ${DateUtils.DAYS.map(day => `
              <button 
                onclick="DashboardView.switchDay('${day}')" 
                class="px-2.5 py-1 text-xs font-bold uppercase rounded border transition-all ${
                  day === activeDay 
                    ? 'bg-[#18181B] text-white border-[#18181B] shadow-[1px_1px_0px_#18181B]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }"
              >
                ${day.slice(0, 3)}
              </button>
            `).join("")}
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center">
            <span class="text-xs text-slate-500 font-bold">
              ${todaysClasses.length} ${todaysClasses.length === 1 ? 'class' : 'classes'} on ${activeDay}
            </span>
            ${activeDay !== DateUtils.getRealTodayName() ? `
              <button onclick="DashboardView.resetToRealDay()" class="text-xs text-emerald-800 font-bold underline ml-1">
                (Today: ${DateUtils.getRealTodayName()})
              </button>
            ` : ""}
          </div>
        </div>

        <!-- Macro Attendance Pulse (Clean, uncluttered, focused) -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall University Standing</span>
              <div class="flex items-baseline gap-3 mt-1">
                <span class="font-headline text-4xl sm:text-5xl font-black ${overall.percentage >= target ? 'text-emerald-700' : 'text-red-600'}">
                  ${overall.percentage}%
                </span>
                <span class="text-xs text-slate-500 font-bold">
                  (Target: ${target}.00%)
                </span>
              </div>
            </div>

            <div class="self-start sm:self-center">
              <span class="bw-badge ${overall.percentage >= target ? 'bw-badge-safe' : 'bw-badge-danger'} py-1 px-3">
                ${overall.percentage >= target ? PixelIcon.get('check') : PixelIcon.get('alert')}
                <span>${overall.percentage >= target ? 'Above Requirement' : 'Below 75% Requirement'}</span>
              </span>
            </div>
          </div>

          <!-- Cutoff Progress Bar -->
          <div>
            <div class="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>0%</span>
              <span class="text-slate-700 font-bold">Cutoff (${target}%)</span>
              <span>100%</span>
            </div>
            <div class="w-full h-3 bg-slate-100 rounded border border-[#18181B] relative overflow-hidden">
              <div class="absolute top-0 bottom-0 left-[75%] w-[2px] bg-[#18181B] z-10" title="Target Cutoff"></div>
              <div class="h-full ${overall.percentage >= target ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-300" style="width: ${Math.min(100, overall.percentage)}%;"></div>
            </div>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span class="text-slate-500 block text-[10px] uppercase font-bold">Classes Attended</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">
                ${overall.totalAttended} / ${overall.totalConducted} classes
              </span>
            </div>

            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span class="text-slate-500 block text-[10px] uppercase font-bold">Today's Safe Bunk Allowance</span>
              <span class="font-bold text-sm mt-0.5 block ${this.countSafeSkipsToday(todaysClasses, subjects, target) > 0 ? 'text-emerald-700' : 'text-red-600'}">
                ${this.countSafeSkipsToday(todaysClasses, subjects, target)} classes
              </span>
            </div>

            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded">
              <span class="text-slate-500 block text-[10px] uppercase font-bold">Recovery Streak Needed</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">
                ${overall.recoveryNeeded > 0 ? `${overall.recoveryNeeded} consecutive attendances` : 'On track (0 needed)'}
              </span>
            </div>
          </div>
        </div>

        <!-- BunkCat Understated Pixel Advisor Note -->
        <div class="p-3 bg-white border-2 border-[#18181B] rounded-lg shadow-[2px_2px_0px_#18181B] flex items-center gap-3 text-xs">
          <div class="w-8 h-8 rounded bg-slate-100 border border-[#18181B] flex items-center justify-center flex-shrink-0 text-slate-800">
            ${PixelIcon.get('cat')}
          </div>
          <p class="text-slate-700 leading-snug">
            ${overall.percentage < target 
              ? `You are running a <strong>${(target - overall.percentage).toFixed(2)}% deficit</strong>. Deep Learning and Prompt Engineering are in danger territory. Attend today's sessions to prevent recovery debt.` 
              : `Your overall attendance is in safe standing. Keep tracking subject-specific allowances before skipping.`}
          </p>
        </div>

        <!-- Today's Classes List (Actionable Core Loop) -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between pb-1">
            <h3 class="font-headline text-lg font-bold text-[#18181B]">
              ${activeDay}'s Schedule
            </h3>
            <span class="text-xs text-slate-500 font-bold">
              Can I skip today?
            </span>
          </div>

          ${todaysClasses.length === 0 ? `
            <div class="bw-card p-8 text-center flex flex-col items-center justify-center gap-2 bg-white">
              <div class="text-slate-400 mb-1">${PixelIcon.get('calendar')}</div>
              <h4 class="font-headline font-bold text-base">No classes scheduled on ${activeDay}</h4>
              <p class="text-xs text-slate-500 max-w-sm">Enjoy your freedom. Sleep in or catch up on project work.</p>
            </div>
          ` : todaysClasses.map((item, idx) => {
            const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode) || {
              attended: 0, conducted: 0, name: item.subjectName || item.subjectCode
            };
            const decision = BunkEngine.evaluateClassDecision(sub, target);

            return `
              <div class="bw-card p-4 bg-white flex flex-col gap-3 hover:border-slate-800 transition-all">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-[#18181B] font-bold">
                        ${DateUtils.formatRange12h(item.startTime, item.endTime)}
                      </span>
                      <span class="text-xs text-slate-500 font-bold">Room: ${item.room || '--'}</span>
                      <span class="text-xs text-slate-500 font-bold uppercase">${item.type}</span>
                    </div>
                    <h4 class="font-headline text-base font-bold text-[#18181B] mt-1">
                      ${item.subjectCode} — ${item.subjectName || sub.name}
                    </h4>
                  </div>

                  <!-- Decision Badge -->
                  <div class="flex items-center gap-2 self-start sm:self-center">
                    <span class="bw-badge ${decision.badgeClass}">
                      ${decision.badge}
                    </span>
                  </div>
                </div>

                <!-- Mathematical Impact Strip -->
                <div class="p-2.5 bg-slate-50 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span class="text-slate-500">Current:</span>
                    <strong class="${decision.currentPct >= target ? 'text-emerald-700' : 'text-red-600'}">
                      ${decision.currentPct}%
                    </strong>
                    <span class="text-slate-400">(${sub.attended}/${sub.conducted})</span>
                    <span class="text-slate-400 mx-1">|</span>
                    <span class="text-slate-600">${decision.message}</span>
                  </div>

                  <div class="flex items-center gap-2 text-[11px] font-bold flex-shrink-0">
                    <span class="text-emerald-700">Attend: ${decision.attendPct}%</span>
                    <span class="text-slate-300">/</span>
                    <span class="text-red-600">Skip: ${decision.skipPct}%</span>
                  </div>
                </div>

                <!-- 1-Tap Attendance Logging Buttons -->
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-slate-400 font-bold">Mark session:</span>
                  <div class="flex items-center gap-2">
                    <button 
                      onclick="DashboardView.handleLogAttendance('${sub.id || sub.code}', 'attended', '${item.subjectCode}')"
                      class="bw-btn bw-btn-primary text-xs"
                      title="Mark as attended"
                    >
                      ${PixelIcon.get('check')}
                      <span>Attended</span>
                    </button>
                    <button 
                      onclick="DashboardView.handleLogAttendance('${sub.id || sub.code}', 'skipped', '${item.subjectCode}')"
                      class="bw-btn bw-btn-danger text-xs"
                      title="Mark as skipped"
                    >
                      ${PixelIcon.get('close')}
                      <span>Skipped</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Minimal What-If Math Stepper -->
        <div class="bw-card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="p-1 bg-slate-100 rounded border border-[#18181B]">${PixelIcon.get('planner')}</span>
            <div>
              <strong class="text-slate-800 block">Quick What-If Simulation:</strong>
              <span class="text-slate-500">What if I miss upcoming classes across college?</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <button onclick="DashboardView.adjustWhatIf(-1)" class="stepper-btn">-</button>
              <span class="font-bold text-sm w-6 text-center" id="whatif-skips-count">1</span>
              <button onclick="DashboardView.adjustWhatIf(1)" class="stepper-btn">+</button>
            </div>
            
            <div class="p-1.5 px-3 bg-slate-50 border border-slate-300 rounded font-bold" id="whatif-result-preview">
              ➔ Projected: <span class="text-red-600 font-headline" id="whatif-pct-val">${BunkEngine.calculatePercentage(overall.totalAttended, overall.totalConducted + 1)}%</span>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  countSafeSkipsToday(todaysClasses, subjects, target) {
    let count = 0;
    todaysClasses.forEach(item => {
      const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode);
      if (sub) {
        const decision = BunkEngine.evaluateClassDecision(sub, target);
        if (decision.safeToSkip) count++;
      }
    });
    return count;
  },

  switchDay(dayName) {
    DateUtils.setActiveDay(dayName);
    App.renderCurrentView();
  },

  resetToRealDay() {
    DateUtils.resetActiveDay();
    App.renderCurrentView();
  },

  whatIfVal: 1,

  adjustWhatIf(delta) {
    this.whatIfVal = Math.max(0, Math.min(10, this.whatIfVal + delta));
    const state = App.state;
    const overall = BunkEngine.calculateOverallStats(state.subjects, state.settings.targetAttendance);
    const target = state.settings.targetAttendance;

    const elCount = document.getElementById("whatif-skips-count");
    const elPct = document.getElementById("whatif-pct-val");

    if (elCount) elCount.innerText = this.whatIfVal;
    const newTotal = overall.totalConducted + this.whatIfVal;
    const projected = BunkEngine.calculatePercentage(overall.totalAttended, newTotal);
    if (elPct) {
      elPct.innerText = `${projected}%`;
      elPct.className = projected >= target ? 'text-emerald-700 font-headline' : 'text-red-600 font-headline';
    }
  },

  handleLogAttendance(subjectId, action, code) {
    const result = StorageManager.logAttendance(App.state.subjects, subjectId, action, {
      title: code,
      day: DateUtils.getActiveDay()
    });

    if (result) {
      const isAttended = action === "attended";
      const outcomePct = BunkEngine.calculatePercentage(result.updatedSubject.attended, result.updatedSubject.conducted);
      
      App.showToast(`
        <strong>${code}:</strong> Marked as ${isAttended ? 'Attended' : 'Skipped'} (${outcomePct}%).
        <button onclick="App.undoLastAction()" class="ml-2 underline font-bold text-xs">Undo</button>
      `);

      App.renderCurrentView();
    }
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.DashboardView = DashboardView;
}
