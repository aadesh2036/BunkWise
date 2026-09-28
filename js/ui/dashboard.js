/**
 * BunkWise - Clean Dashboard View with College Student Humor
 * High clarity, retro pixel icons, and sharp student reality checks.
 */

const DashboardView = {
  roastIndex: 0,
  roasts: [
    "Bestie wake up, you are literally cooked in Deep Learning (48.39%). 53 consecutive attendances needed without blinking. Do NOT touch that snooze button.",
    "Bro is operating on 0% sleep, 0% syllabus knowledge, and 100% fear of professor emails.",
    "Your attendance is currently lower than the chances of your college canteen serving good coffee. Front row seat required.",
    "Today's Safe Bunk Policy: Strict zero tolerance. If you miss class, the Dean won't even email—he'll appear in your dreams.",
    "Coursera is at 85.71% (Academic Weapon 🛡️). Deep Learning is in the ICU at 48.39% (Full Meltdown 💀). Balance your life!",
    "Calculated with 0% emotion, 100% math, and 0% hope that the biometric machine breaks down."
  ],

  render(container, state) {
    const { subjects, timetable, settings } = state;
    const target = settings.targetAttendance || 75;
    const activeDay = DateUtils.getActiveDay();
    const overall = BunkEngine.calculateOverallStats(subjects, target);
    const todaysClasses = DateUtils.getClassesForDay(timetable, activeDay);
    const currentRoast = this.roasts[this.roastIndex % this.roasts.length];

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

        <!-- BunkCat Humorous Mascot Banner (Clean, fun, retro) -->
        <div class="bw-card p-4 bg-white border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-start gap-3 flex-1">
            <div class="w-10 h-10 rounded bg-[#FEF08A] border-2 border-[#18181B] flex items-center justify-center flex-shrink-0 text-[#18181B] shadow-[1px_1px_0px_#18181B] mt-0.5">
              ${PixelIcon.get('cat')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <strong class="font-headline text-sm font-bold text-[#18181B]">BunkCat Academic Survival Guide</strong>
                <span class="bw-badge ${overall.percentage >= target ? 'bw-badge-safe' : 'bw-badge-danger'} text-[9px] py-0.2">
                  ${overall.percentage >= target ? 'Cruising' : 'Full Meltdown'}
                </span>
              </div>
              <p class="text-xs text-slate-700 leading-snug mt-1" id="bunkcat-speech-bubble">
                “${currentRoast}”
              </p>
            </div>
          </div>

          <!-- Quick Fun Interactive Controls -->
          <div class="flex items-center gap-2 self-end md:self-center flex-shrink-0">
            <button onclick="DashboardView.cycleRoast()" class="bw-btn bw-btn-accent text-xs" title="Get another brutal reality roast">
              ${PixelIcon.get('dice')}
              <span>Roast Me</span>
            </button>
            <button onclick="DashboardView.generateExcuse()" class="bw-btn text-xs hover:bg-slate-100" title="Generate absurd excuse for professor">
              ${PixelIcon.get('bed')}
              <span>Excuse Gen</span>
            </button>
          </div>
        </div>

        <!-- Macro Attendance Pulse (Clean, uncrowded, focused) -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Macro Attendance Standing</span>
              <div class="flex items-baseline gap-3 mt-1">
                <span class="font-headline text-4xl sm:text-5xl font-black ${overall.percentage >= target ? 'text-emerald-700' : 'text-red-600'}">
                  ${overall.percentage}%
                </span>
                <span class="text-xs text-slate-500 font-bold">
                  / Target ${target}.00%
                </span>
              </div>
            </div>

            <div class="self-start sm:self-center">
              <span class="bw-badge ${overall.percentage >= target ? 'bw-badge-safe' : 'bw-badge-danger'} py-1 px-3">
                ${overall.percentage >= target ? PixelIcon.get('coffee') : PixelIcon.get('fire')}
                <span>${overall.percentage >= target ? 'Safe Haven (Chill Mode)' : 'Cooked (Debarment Speedrun)'}</span>
              </span>
            </div>
          </div>

          <!-- Cutoff Progress Meter -->
          <div>
            <div class="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>0%</span>
              <span class="text-slate-800 font-bold">Debarment Cutoff (${target}%)</span>
              <span>100%</span>
            </div>
            <div class="w-full h-3.5 bg-slate-100 rounded border-2 border-[#18181B] relative overflow-hidden flex">
              <div class="absolute top-0 bottom-0 left-[75%] w-[2px] bg-[#18181B] z-10" title="Target Line"></div>
              <div class="h-full ${overall.percentage >= target ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-300" style="width: ${Math.min(100, overall.percentage)}%;"></div>
            </div>
            <div class="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>Total conducted: ${overall.totalConducted} classes</span>
              <span>Deficit: ${overall.percentage < target ? `${(target - overall.percentage).toFixed(2)}% below target` : 'None'}</span>
            </div>
          </div>

          <!-- Quick Metrics Row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div class="p-3 bg-slate-50 border border-slate-300 rounded">
              <span class="text-slate-500 block text-[10px] uppercase font-bold">Total Attended</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">
                ${overall.totalAttended} / ${overall.totalConducted} lectures
              </span>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-300 rounded">
              <span class="text-slate-500 block text-[10px] uppercase font-bold">Today's Safe Bunk Cushion</span>
              <span class="font-bold text-sm mt-0.5 block ${this.countSafeSkipsToday(todaysClasses, subjects, target) > 0 ? 'text-emerald-700' : 'text-red-600'}">
                ${this.countSafeSkipsToday(todaysClasses, subjects, target)} classes allowed
              </span>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-300 rounded">
              <span class="text-slate-500 block text-[10px] uppercase font-bold">Redemption Streak</span>
              <span class="font-bold text-slate-800 text-sm mt-0.5 block">
                ${overall.recoveryNeeded > 0 ? `${overall.recoveryNeeded} classes in a row` : 'Zero (Chilling)'}
              </span>
            </div>
          </div>
        </div>

        <!-- Today's Classes List (Actionable Core Loop) -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between pb-1">
            <h3 class="font-headline text-lg font-bold text-[#18181B]">
              ${activeDay}'s Tactical Decisions: To Bunk or Not to Bunk?
            </h3>
            <span class="text-xs text-slate-500 font-bold">
              ${todaysClasses.length} Scheduled
            </span>
          </div>

          ${todaysClasses.length === 0 ? `
            <div class="bw-card p-10 text-center flex flex-col items-center justify-center gap-2 bg-white">
              <div class="text-slate-400 mb-1">${PixelIcon.get('coffee')}</div>
              <h4 class="font-headline font-bold text-base">No classes scheduled on ${activeDay}!</h4>
              <p class="text-xs text-slate-500 max-w-sm">Enjoy your scientifically calculated freedom. Stay in bed or work on projects.</p>
            </div>
          ` : todaysClasses.map((item, idx) => {
            const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode) || {
              attended: 0, conducted: 0, name: item.subjectName || item.subjectCode
            };
            const decision = BunkEngine.evaluateClassDecision(sub, target);

            return `
              <div class="bw-card p-4 bg-white flex flex-col gap-3 border-2 hover:border-[#18181B] transition-all">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-[#18181B] font-bold">
                        ${DateUtils.formatRange12h(item.startTime, item.endTime)}
                      </span>
                      <span class="text-xs text-slate-500 font-bold">Room: ${item.room || '--'}</span>
                      <span class="text-xs text-slate-500 font-bold uppercase">Prof: ${item.faculty || '--'}</span>
                    </div>
                    <h4 class="font-headline text-base font-bold text-[#18181B] mt-1">
                      ${item.subjectCode} — ${item.subjectName || sub.name}
                    </h4>
                  </div>

                  <!-- Decision Badge -->
                  <div class="flex items-center gap-2 self-start sm:self-center">
                    <span class="bw-badge ${decision.badgeClass} py-1 px-2.5">
                      ${decision.safeToSkip ? PixelIcon.get('coffee') : (decision.status === 'BELOW_TARGET' ? PixelIcon.get('skull') : PixelIcon.get('alert'))}
                      <span>${decision.badge}</span>
                    </span>
                  </div>
                </div>

                <!-- Mathematical Impact & Reality Check Box -->
                <div class="p-3 bg-slate-50 rounded border border-slate-300 flex flex-col gap-1.5 text-xs">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span class="text-slate-500">Current:</span>
                      <strong class="${decision.currentPct >= target ? 'text-emerald-700' : 'text-red-600'}">
                        ${decision.currentPct}%
                      </strong>
                      <span class="text-slate-400">(${sub.attended}/${sub.conducted})</span>
                    </div>

                    <div class="flex items-center gap-2 font-bold">
                      <span class="text-emerald-700">Show Up ➔ ${decision.attendPct}% (${decision.diffAttend >= 0 ? '+' : ''}${decision.diffAttend}%)</span>
                      <span class="text-slate-300">|</span>
                      <span class="text-red-600">Bunk ➔ ${decision.skipPct}% (${decision.diffSkip}%)</span>
                    </div>
                  </div>

                  <p class="text-slate-700 italic border-t border-slate-200 pt-1">
                    “${decision.realityCheck}”
                  </p>
                </div>

                <!-- 1-Tap Attendance Logging Buttons -->
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-slate-400 font-bold">Today's Attendance:</span>
                  <div class="flex items-center gap-2">
                    <button 
                      onclick="DashboardView.handleLogAttendance('${sub.id || sub.code}', 'attended', '${item.subjectCode}')"
                      class="bw-btn bw-btn-primary text-xs"
                      title="Mark as attended"
                    >
                      ${PixelIcon.get('check')}
                      <span>I Showed Up 🫡</span>
                    </button>
                    <button 
                      onclick="DashboardView.handleLogAttendance('${sub.id || sub.code}', 'skipped', '${item.subjectCode}')"
                      class="bw-btn bw-btn-danger text-xs"
                      title="Mark as skipped"
                    >
                      ${PixelIcon.get('skull')}
                      <span>I Slept In 💀</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Clean What-If Math Stepper -->
        <div class="bw-card p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-2 border-[#18181B]">
          <div class="flex items-center gap-2">
            <span class="p-1 bg-[#FEF08A] rounded border border-[#18181B]">${PixelIcon.get('planner')}</span>
            <div>
              <strong class="text-slate-800 block">Emergency What-If Math:</strong>
              <span class="text-slate-500">What happens if I miss the next few sessions?</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <button onclick="DashboardView.adjustWhatIf(-1)" class="stepper-btn">-</button>
              <span class="font-bold text-sm w-6 text-center" id="whatif-skips-count">1</span>
              <button onclick="DashboardView.adjustWhatIf(1)" class="stepper-btn">+</button>
            </div>
            
            <div class="p-1.5 px-3 bg-slate-50 border border-[#18181B] rounded font-bold" id="whatif-result-preview">
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

  cycleRoast() {
    this.roastIndex++;
    const roast = this.roasts[this.roastIndex % this.roasts.length];
    const bubble = document.getElementById("bunkcat-speech-bubble");
    if (bubble) bubble.innerText = `“${roast}”`;
    App.showToast(`BunkCat roast delivered.`);
  },

  generateExcuse() {
    const excuses = [
      "“Respected Prof, my pet iguana chewed my Wi-Fi router cable during my morning existential crisis.”",
      "“Dear Faculty, my alarm clock went off in a different timezone.”",
      "“Respected Sir, I was physically in class in spirit, quantum-entangled with the lecture hall.”",
      "“Dear Madam, Windows 11 decided 8:55 AM was the ideal time for a 3-hour mandatory update.”",
      "“Sir, my auto-rickshaw driver took a detour through another dimension.”"
    ];
    const excuse = excuses[Math.floor(Math.random() * excuses.length)];
    App.showToast(`<strong>Excuse Generator:</strong> <em>${excuse}</em> (Please don't actually email this!)`, 4500);
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
      const msg = isAttended
        ? `<strong>${code}:</strong> Marked present (+1 to academic survival). New: ${outcomePct}%.`
        : `<strong>${code}:</strong> Marked skipped (Cooked). New: ${outcomePct}%.`;
      
      App.showToast(`
        ${msg}
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
