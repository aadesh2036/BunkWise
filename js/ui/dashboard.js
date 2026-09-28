/**
 * BunkWise - Dashboard View
 * Clutter-free, high-clarity daily decision engine.
 */

const DashboardView = {
  render(container, state) {
    const { subjects, timetable, settings } = state;
    const target = settings.targetAttendance || 75;
    const activeDay = DateUtils.getActiveDay();
    const overall = BunkEngine.calculateOverallStats(subjects, target);
    const mascot = BunkEngine.getMascotVibe(overall.percentage, target, overall.belowTargetCount);
    const todaysClasses = DateUtils.getClassesForDay(timetable, activeDay);

    container.innerHTML = `
      <div class="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
        
        <!-- Day Selector & Quick Vibe Banner -->
        <div class="bw-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-headline text-lg font-bold">Today is:</span>
            <div class="flex items-center gap-1 overflow-x-auto py-1">
              ${DateUtils.DAYS.map(day => `
                <button 
                  onclick="DashboardView.switchDay('${day}')" 
                  class="px-2.5 py-1 text-xs font-bold uppercase rounded border-2 border-[#18181B] transition-all ${
                    day === activeDay 
                      ? 'bg-primary-container text-on-primary-container shadow-[2px_2px_0px_#18181B]' 
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }"
                >
                  ${day.slice(0, 3)}
                </button>
              `).join("")}
            </div>
            ${activeDay !== DateUtils.getRealTodayName() ? `
              <button onclick="DashboardView.resetToRealDay()" class="text-xs text-emerald-700 font-bold underline ml-2">
                (Reset to ${DateUtils.getRealTodayName()})
              </button>
            ` : ""}
          </div>

          <div class="flex items-center gap-3">
            <span class="bw-badge ${overall.percentage >= target ? 'bw-badge-safe' : 'bw-badge-danger'}">
              <span class="w-2 h-2 rounded-full ${overall.percentage >= target ? 'bg-emerald-600' : 'bg-red-600 animate-ping'}"></span>
              Status: ${overall.percentage >= target ? 'Safe Haven 🛡️' : 'Debarment Threat 🚨'}
            </span>
            <span class="text-xs text-slate-500 font-bold">${todaysClasses.length} Classes Today</span>
          </div>
        </div>

        <!-- Hero Metrics Row: Clean & Clutter-Free -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          <!-- BunkCat Mascot Box (4 cols) -->
          <div class="lg:col-span-4 ${mascot.bgClass} p-5 rounded-xl border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] flex flex-col justify-between" id="dashboard-mascot-box">
            <div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-3xl">${mascot.emoji}</span>
                  <div>
                    <h3 class="font-headline font-bold text-base leading-tight">BunkCat</h3>
                    <span class="text-[10px] text-slate-600 font-bold uppercase">Academic Advisor</span>
                  </div>
                </div>
                <span class="bw-badge ${mascot.badgeClass}">
                  ${mascot.name}
                </span>
              </div>

              <!-- Comic Speech Bubble -->
              <div class="relative bg-white p-3.5 rounded-lg border-2 border-[#18181B] shadow-[2px_2px_0px_#18181B] my-3">
                <div class="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t-2 border-l-2 border-[#18181B] rotate-45"></div>
                <p class="text-xs leading-relaxed text-slate-800">
                  ${mascot.speech}
                </p>
              </div>
            </div>

            <!-- Mascot Mood Controls -->
            <div class="flex items-center justify-between pt-2 border-t border-[#18181B]/15 text-xs">
              <span class="text-[10px] uppercase font-bold text-slate-500">Vibe:</span>
              <div class="flex gap-1.5">
                <button onclick="DashboardView.forceMascotMood('chill')" class="px-2 py-0.5 text-[11px] rounded border border-[#18181B] ${mascot.mood === 'chill' ? 'bg-emerald-500 text-white font-bold' : 'bg-white hover:bg-slate-100'}">Chill 😼</button>
                <button onclick="DashboardView.forceMascotMood('sweat')" class="px-2 py-0.5 text-[11px] rounded border border-[#18181B] ${mascot.mood === 'sweat' ? 'bg-amber-400 text-black font-bold' : 'bg-white hover:bg-slate-100'}">Sweat 😰</button>
                <button onclick="DashboardView.forceMascotMood('panic')" class="px-2 py-0.5 text-[11px] rounded border border-[#18181B] ${mascot.mood === 'panic' ? 'bg-red-500 text-white font-bold' : 'bg-white hover:bg-slate-100'}">Panic 🙀</button>
              </div>
            </div>
          </div>

          <!-- Main Macro Attendance Card (5 cols) -->
          <div class="lg:col-span-5 bw-card p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase font-bold tracking-wider text-slate-500">Macro Attendance Pulse</span>
                <span class="bw-badge ${overall.percentage >= target ? 'bw-badge-safe' : 'bw-badge-danger'}">
                  Target: ${target}%
                </span>
              </div>

              <div class="mt-2 flex items-baseline gap-3">
                <span class="font-headline text-5xl font-black ${overall.percentage >= target ? 'text-emerald-600' : 'text-red-600'}">
                  ${overall.percentage}%
                </span>
                <span class="text-slate-500 font-bold text-sm">
                  (${overall.totalAttended} / ${overall.totalConducted} classes)
                </span>
              </div>

              <p class="text-xs text-slate-600 mt-1">
                ${overall.percentage >= target 
                  ? `You are ${Number((overall.percentage - target).toFixed(2))}% above your required minimum threshold.` 
                  : `You are running a ${Number((target - overall.percentage).toFixed(2))}% deficit below university requirements.`
                }
              </p>
            </div>

            <!-- Arcade Progress Bar -->
            <div class="mt-4 pt-3 border-t border-slate-200">
              <div class="flex justify-between text-[11px] font-bold mb-1">
                <span class="${overall.percentage >= target ? 'text-emerald-600' : 'text-red-600'}">Current: ${overall.percentage}%</span>
                <span class="text-slate-500">Threshold: ${target}%</span>
              </div>
              <div class="w-full h-4 bg-slate-100 rounded-sm border-2 border-[#18181B] relative overflow-hidden">
                <div class="absolute top-0 bottom-0 left-[75%] w-[2px] bg-[#18181B] z-10" title="Target Line"></div>
                <div class="h-full ${overall.percentage >= target ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-500" style="width: ${Math.min(100, overall.percentage)}%;"></div>
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-500 font-bold mt-1.5">
                <span>${overall.belowTargetCount} SUBJECTS BELOW TARGET</span>
                <span>${overall.safeCount} SUBJECTS SAFE</span>
              </div>
            </div>
          </div>

          <!-- Quick Ledger Balances (3 cols) -->
          <div class="lg:col-span-3 bw-card p-5 flex flex-col justify-between">
            <div>
              <span class="text-xs uppercase font-bold tracking-wider text-slate-500">Safe Skip Ledger</span>
              
              <div class="mt-3 p-3 bg-red-50 border-2 border-[#18181B] rounded-lg">
                <span class="text-[10px] uppercase font-bold text-red-700 block">Today's Safe Bunks</span>
                <span class="font-headline text-3xl font-black text-red-600 block my-0.5">
                  ${this.countSafeSkipsToday(todaysClasses, subjects, target)}
                </span>
                <span class="text-[11px] text-slate-600 block">Calculated class-by-class</span>
              </div>
            </div>

            <div class="mt-3 p-3 bg-slate-50 border-2 border-[#18181B] rounded-lg">
              <span class="text-[10px] uppercase font-bold text-slate-700 block">Streak To Recovery</span>
              <div class="flex items-baseline gap-1 my-0.5">
                <span class="font-headline text-2xl font-bold text-emerald-700">
                  ${overall.recoveryNeeded}
                </span>
                <span class="text-xs text-slate-600">consecutive classes</span>
              </div>
              <span class="text-[10px] text-slate-500 block">To reach ${target}% overall</span>
            </div>
          </div>

        </div>

        <!-- Main Content Grid: Today's Schedule & Simulator -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Today's Schedule (7 cols) -->
          <div class="lg:col-span-7 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Tactical Daily Execution</span>
                <h2 class="font-headline text-xl font-bold text-[#18181B]">
                  ${activeDay}'s Classes: Can I Skip?
                </h2>
              </div>
              <span class="bw-badge bg-amber-300 text-[#18181B]">
                ${todaysClasses.length} SESSIONS
              </span>
            </div>

            ${todaysClasses.length === 0 ? `
              <!-- Empty day state -->
              <div class="bw-card p-8 text-center flex flex-col items-center justify-center gap-3 bg-white">
                <span class="text-4xl">🎉</span>
                <h3 class="font-headline text-lg font-bold">No classes scheduled on ${activeDay}!</h3>
                <p class="text-xs text-slate-600 max-w-sm">
                  Enjoy your scientifically calculated freedom. Sleep in, grab some coffee, or work on side projects.
                </p>
                <button onclick="App.navigateTo('timetable')" class="bw-btn bw-btn-accent text-xs mt-2">
                  View Full Week Timetable →
                </button>
              </div>
            ` : todaysClasses.map((item, idx) => {
              const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode) || {
                attended: 0, conducted: 0, name: item.subjectName || item.subjectCode
              };
              const decision = BunkEngine.evaluateClassDecision(sub, target);

              return `
                <div class="bw-card overflow-hidden flex flex-col transition-all hover:translate-x-0.5" id="class-card-${item.id || idx}">
                  <!-- Left accent color bar -->
                  <div class="p-4 flex flex-col gap-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-[#18181B] font-bold">
                            ${DateUtils.formatRange12h(item.startTime, item.endTime)}
                          </span>
                          <span class="text-xs font-bold text-slate-600">ROOM: ${item.room || '--'}</span>
                          <span class="text-xs font-bold text-slate-500 uppercase">PROF: ${item.faculty || '--'}</span>
                        </div>
                        <h3 class="font-headline text-base font-bold text-[#18181B] mt-1">
                          ${item.subjectCode} - ${item.subjectName || sub.name}
                        </h3>
                      </div>
                      
                      <!-- Current percentage indicator -->
                      <div class="flex items-baseline gap-1.5 self-start sm:self-center bg-slate-50 px-2.5 py-1 rounded border border-[#18181B]">
                        <span class="text-[11px] text-slate-500 font-bold">Current:</span>
                        <span class="font-headline font-bold text-sm ${decision.currentPct >= target ? 'text-emerald-700' : 'text-red-600'}">
                          ${decision.currentPct}%
                        </span>
                        <span class="text-[10px] text-slate-400">(${sub.attended}/${sub.conducted})</span>
                      </div>
                    </div>

                    <!-- Consequence & Math Projection Box -->
                    <div class="${decision.bgLight} p-3 rounded-lg border border-[#18181B] flex flex-col gap-1.5">
                      <div class="flex items-center justify-between flex-wrap gap-1">
                        <span class="bw-badge ${decision.badgeClass}">
                          ${decision.title}: ${decision.badge}
                        </span>
                        <span class="text-[11px] font-bold text-slate-600">Deterministic Impact:</span>
                      </div>
                      <p class="text-xs text-slate-800 leading-snug">
                        ${decision.message}
                      </p>
                      <div class="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-[#18181B]/15">
                        <span class="text-emerald-700 font-bold">
                          If Attend ➔ ${decision.attendPct}% (${decision.diffAttend >= 0 ? '+' : ''}${decision.diffAttend}%)
                        </span>
                        <span class="text-slate-400">|</span>
                        <span class="text-red-600 font-bold">
                          If Skip ➔ ${decision.skipPct}% (${decision.diffSkip}%)
                        </span>
                      </div>
                    </div>

                    <!-- 1-Tap Attendance Actions -->
                    <div class="flex items-center justify-between gap-2 pt-1">
                      <span class="text-[11px] text-slate-500 font-bold">Log Attendance:</span>
                      <div class="flex items-center gap-2">
                        <button 
                          onclick="DashboardView.handleLogAttendance('${sub.id || sub.code}', 'attended', '${item.id || idx}', '${item.subjectCode}')"
                          class="bw-btn bw-btn-primary text-xs"
                          title="Record that you attended this class"
                        >
                          I Showed Up 🫡
                        </button>
                        <button 
                          onclick="DashboardView.handleLogAttendance('${sub.id || sub.code}', 'skipped', '${item.id || idx}', '${item.subjectCode}')"
                          class="bw-btn bw-btn-danger text-xs"
                          title="Record that you missed this class"
                        >
                          I Slept In 💀
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Right Column: What-If Simulator & Roommate Notes (5 cols) -->
          <div class="lg:col-span-5 flex flex-col gap-5">
            
            <!-- What-If Math Sandbox -->
            <div class="bw-card p-5 flex flex-col gap-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-200">
                <div class="flex items-center gap-2">
                  <span class="text-xl">🧮</span>
                  <h3 class="font-headline font-bold text-base text-[#18181B]">Emergency What-If Math</h3>
                </div>
                <span class="bw-badge bg-emerald-100 text-emerald-800">INSTANT</span>
              </div>

              <p class="text-xs text-slate-600">
                Simulate your fate: What happens if I miss the next consecutive lectures across college?
              </p>

              <!-- Stepper input -->
              <div class="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-[#18181B]">
                <span class="text-xs font-bold text-slate-800">Lectures to Skip:</span>
                <div class="flex items-center gap-2">
                  <button onclick="DashboardView.adjustWhatIf(-1)" class="stepper-btn">-</button>
                  <span class="font-headline text-lg font-bold w-8 text-center" id="whatif-skips-count">1</span>
                  <button onclick="DashboardView.adjustWhatIf(1)" class="stepper-btn">+</button>
                </div>
              </div>

              <!-- Simulation output -->
              <div class="p-3 bg-red-50 border-2 border-[#18181B] rounded-lg flex items-center justify-between" id="whatif-result-box">
                <div>
                  <span class="text-[10px] uppercase font-bold text-red-800 block">Projected Total</span>
                  <span class="font-headline text-xl font-bold text-red-600 leading-tight" id="whatif-projected-pct">
                    ${BunkEngine.calculatePercentage(overall.totalAttended, overall.totalConducted + 1)}%
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] uppercase font-bold text-slate-600 block">Classes to Recover</span>
                  <span class="font-headline text-xl font-bold text-slate-800 leading-tight" id="whatif-recovery-count">
                    +${BunkEngine.classesNeededToRecover(overall.totalAttended, overall.totalConducted + 1, target)} Classes
                  </span>
                </div>
              </div>

              <p class="text-xs text-red-700 italic text-center" id="whatif-verdict">
                “Every skip sets you back 3 extra lectures of sheer dread.”
              </p>
            </div>

            <!-- Roommate's Unfiltered Advice -->
            <div class="bw-card p-5 flex flex-col gap-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-200">
                <div class="flex items-center gap-2">
                  <span class="text-xl">📋</span>
                  <h3 class="font-headline font-bold text-base text-[#18181B]">Roommate's Cheat Sheet</h3>
                </div>
                <span class="text-[10px] font-bold text-slate-500 uppercase">UNFILTERED</span>
              </div>

              <div class="flex flex-col gap-2.5">
                <div class="p-2.5 bg-emerald-50 rounded-lg border border-[#18181B] text-xs">
                  <div class="flex justify-between font-bold text-emerald-900 mb-0.5">
                    <span>DSC05: Coursera Cloud</span>
                    <span>85.71% (SAFE)</span>
                  </div>
                  <p class="text-slate-700">“Safe to skip 1 session and grab boba. You have a comfortable cushion.”</p>
                </div>

                <div class="p-2.5 bg-red-50 rounded-lg border border-[#18181B] text-xs">
                  <div class="flex justify-between font-bold text-red-900 mb-0.5">
                    <span>DS3201: Deep Learning</span>
                    <span>48.39% (CRITICAL)</span>
                  </div>
                  <p class="text-slate-700">“Missing this is academic suicide. Sit in the front row and nod at every matrix slide.”</p>
                </div>

                <div class="p-2.5 bg-amber-50 rounded-lg border border-[#18181B] text-xs">
                  <div class="flex justify-between font-bold text-amber-900 mb-0.5">
                    <span>DS3203A: Computational Data</span>
                    <span>66.67% (RECOVERY)</span>
                  </div>
                  <p class="text-slate-700">“You need 9 consecutive classes to hit 75%. No naps allowed.”</p>
                </div>
              </div>
            </div>

            <!-- Quick Utility Buttons -->
            <div class="grid grid-cols-2 gap-3">
              <button onclick="App.navigateTo('planner')" class="bw-btn bw-btn-accent text-xs flex items-center justify-center gap-1.5 py-3">
                <span>⚡ Bunk Planner</span>
              </button>
              <button onclick="DashboardView.fakeExcuseGenerator()" class="bw-btn text-xs flex items-center justify-center gap-1.5 py-3">
                <span>🤒 Sick Note Gen</span>
              </button>
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

  forceMascotMood(mood) {
    const mascotCard = document.getElementById("dashboard-mascot-box");
    if (!mascotCard) return;

    const data = {
      chill: {
        bg: "bg-[#E8F8F2]",
        emoji: "😼",
        name: "Academic Weapon",
        speech: "“Look at you pretending you have this under control. Don't let your guard down, but okay, you can relax for 45 minutes.”"
      },
      sweat: {
        bg: "bg-[#FFFBEA]",
        emoji: "😰",
        name: "Sweating Bullets",
        speech: "“You are one bad cold away from getting an official signed debarment letter from Prof. Vance. Drink water and sit up straight.”"
      },
      panic: {
        bg: "bg-[#FEECEE]",
        emoji: "🙀",
        name: "Full Meltdown",
        speech: "“Bestie wake up, you are literally cooked in Deep Learning. You need 18 back-to-back lectures without blinking to hit 75%. Do NOT touch that bed.”"
      }
    }[mood];

    if (data) {
      App.showToast(`BunkCat mood changed to: <strong>${data.name}</strong>`);
    }
  },

  whatIfVal: 1,

  adjustWhatIf(delta) {
    this.whatIfVal = Math.max(0, Math.min(15, this.whatIfVal + delta));
    const state = App.state;
    const overall = BunkEngine.calculateOverallStats(state.subjects, state.settings.targetAttendance);
    const target = state.settings.targetAttendance;

    const elCount = document.getElementById("whatif-skips-count");
    const elPct = document.getElementById("whatif-projected-pct");
    const elRecovery = document.getElementById("whatif-recovery-count");
    const elVerdict = document.getElementById("whatif-verdict");

    if (!elCount) return;

    elCount.innerText = this.whatIfVal;
    const newTotal = overall.totalConducted + this.whatIfVal;
    const projected = BunkEngine.calculatePercentage(overall.totalAttended, newTotal);
    const needed = BunkEngine.classesNeededToRecover(overall.totalAttended, newTotal, target);

    elPct.innerText = `${projected}%`;
    elRecovery.innerText = `+${needed} Classes`;

    if (this.whatIfVal === 0) {
      elVerdict.innerText = "“Zero skips. Keep grinding towards graduation.”";
      elVerdict.className = "text-xs text-emerald-700 italic text-center";
    } else if (this.whatIfVal < 3) {
      elVerdict.innerText = `“${this.whatIfVal} skip(s) costs you ${needed} consecutive classes without sleeping.”`;
      elVerdict.className = "text-xs text-amber-700 italic text-center";
    } else {
      elVerdict.innerText = `“${this.whatIfVal} skips? Speedrunning academic probation. The dean is drafting the email.”`;
      elVerdict.className = "text-xs text-red-600 italic text-center";
    }
  },

  handleLogAttendance(subjectId, action, classCardId, code) {
    const result = StorageManager.logAttendance(App.state.subjects, subjectId, action, {
      title: code,
      day: DateUtils.getActiveDay()
    });

    if (result) {
      const isAttended = action === "attended";
      const icon = isAttended ? "🫡" : "💀";
      const text = isAttended ? "Logged Present" : "Logged Skipped";
      
      App.showToast(`
        ${icon} <strong>${text} (${code}):</strong> New Attendance: ${BunkEngine.calculatePercentage(result.updatedSubject.attended, result.updatedSubject.conducted)}% 
        <button onclick="App.undoLastAction()" class="ml-2 underline font-bold text-xs">Undo</button>
      `);

      App.renderCurrentView();
    }
  },

  fakeExcuseGenerator() {
    const excuses = [
      "“Respected Prof, my pet iguana chewed my Wi-Fi router cable.”",
      "“Dear Faculty, I had a sudden philosophical inquiry into the nature of existence at 8:00 AM.”",
      "“Respected Sir, my alarm clock went off in a different timezone.”",
      "“Dear Madam, my laptop conducted an unprompted Windows update for 4 straight hours.”",
      "“Sir, I was physically in class in spirit, quantum entangled with the lecture hall.”"
    ];
    const excuse = excuses[Math.floor(Math.random() * excuses.length)];
    App.showToast(`🤒 <strong>Excuse Generator:</strong> <em>${excuse}</em> (Don't actually send this!)`);
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.DashboardView = DashboardView;
}
