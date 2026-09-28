/**
 * BunkWise - Clean Attendance Matrix View with College Humor
 */

const AttendanceView = {
  render(container, state) {
    const { subjects, settings } = state;
    const target = settings.targetAttendance || 75;
    const overall = BunkEngine.calculateOverallStats(subjects, target);

    container.innerHTML = `
      <div class="flex flex-col gap-5 max-w-5xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="bw-card p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="font-headline text-2xl font-bold text-[#18181B]">Attendance Matrix</h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Subject-wise tallies, skip allowances, and redemption streaks.
            </p>
          </div>

          <button onclick="AttendanceView.openAddSubjectModal()" class="bw-btn bw-btn-primary text-xs">
            ${PixelIcon.get('plus')}
            <span>Add Subject</span>
          </button>
        </div>

        <!-- Overall Summary Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bw-card p-3.5 bg-white">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Overall Standing</span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="font-headline text-2xl font-black ${overall.percentage >= target ? 'text-emerald-700' : 'text-red-600'}">
                ${overall.percentage}%
              </span>
              <span class="text-[11px] text-slate-500">Target: ${target}%</span>
            </div>
            <span class="text-[10px] text-slate-400 block mt-0.5">
              ${overall.percentage >= target ? 'Comfortably above cutoff' : 'Living on prayers & proxy attempts'}
            </span>
          </div>

          <div class="bw-card p-3.5 bg-white">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Subjects in Danger</span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="font-headline text-2xl font-black text-red-600">
                ${overall.belowTargetCount}
              </span>
              <span class="text-[11px] text-slate-500">below ${target}% requirement</span>
            </div>
            <span class="text-[10px] text-red-600 font-bold block mt-0.5">
              ${overall.belowTargetCount > 0 ? 'Urgent attention required' : 'Clean sheet!'}
            </span>
          </div>

          <div class="bw-card p-3.5 bg-white">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">Lectures Endured</span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="font-headline text-2xl font-black text-slate-800">
                ${overall.totalAttended} / ${overall.totalConducted}
              </span>
              <span class="text-[11px] text-slate-500">attended</span>
            </div>
            <span class="text-[10px] text-slate-400 block mt-0.5">
              100% attendance is a myth
            </span>
          </div>
        </div>

        <!-- Subject Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${subjects.map((sub, idx) => this.renderSubjectCard(sub, target, idx)).join("")}
        </div>

      </div>
    `;
  },

  renderSubjectCard(sub, target, idx) {
    const attended = Number(sub.attended) || 0;
    const conducted = Number(sub.conducted) || 0;
    const pct = BunkEngine.calculatePercentage(attended, conducted);
    const skips = BunkEngine.calculateSkipAllowance(attended, conducted, target);
    const recovery = BunkEngine.classesNeededToRecover(attended, conducted, target);

    let statusTheme = {
      badge: "CRITICAL",
      badgeClass: "bw-badge-danger",
      pctColor: "text-red-600",
      humorNote: "Redemption arc needed ASAP"
    };

    if (conducted === 0) {
      statusTheme = {
        badge: "NOT STARTED",
        badgeClass: "bg-slate-100 text-slate-600 border-slate-300",
        pctColor: "text-slate-400",
        humorNote: "Technically unblemished"
      };
    } else if (pct >= 80) {
      statusTheme = {
        badge: "ACADEMIC WEAPON",
        badgeClass: "bw-badge-safe",
        pctColor: "text-emerald-700",
        humorNote: "Cushion intact, go touch grass"
      };
    } else if (pct >= target) {
      statusTheme = {
        badge: "SAFE HAVEN",
        badgeClass: "bw-badge-safe",
        pctColor: "text-emerald-600",
        humorNote: "Safe, but don't get cocky"
      };
    } else if (pct >= 70) {
      statusTheme = {
        badge: "RAZOR BLADE",
        badgeClass: "bw-badge-warn",
        pctColor: "text-amber-600",
        humorNote: "One bad cold away from debarment"
      };
    }

    return `
      <div class="bw-card p-4 bg-white flex flex-col justify-between gap-3 border-2 hover:border-[#18181B] transition-all">
        <!-- Subject Info -->
        <div>
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">
              ${sub.code}
            </span>
            <span class="bw-badge ${statusTheme.badgeClass}">
              ${statusTheme.badge}
            </span>
          </div>

          <h3 class="font-headline text-base font-bold text-[#18181B] mt-1 leading-snug">
            ${sub.name}
          </h3>
          <span class="text-[11px] text-slate-500 block mt-0.5">
            ${sub.faculty || 'Faculty TBA'} • <span class="uppercase font-bold">${sub.type || 'theory'}</span>
          </span>
        </div>

        <!-- Metric & Allowance -->
        <div class="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
          <div>
            <span class="font-headline text-2xl font-black ${statusTheme.pctColor}">
              ${conducted === 0 ? '0.0%' : `${pct}%`}
            </span>
            <span class="text-[10px] text-slate-500 block">
              ${attended} / ${conducted} conducted
            </span>
          </div>

          <div class="text-right text-xs">
            ${conducted === 0 ? `
              <span class="text-slate-400">No classes yet</span>
            ` : pct >= target ? `
              <span class="text-[10px] uppercase font-bold text-emerald-800 block">Skip Allowance</span>
              <strong class="text-emerald-700">${skips} safe ${skips === 1 ? 'class' : 'classes'}</strong>
            ` : `
              <span class="text-[10px] uppercase font-bold text-red-800 block">Redemption Goal</span>
              <strong class="text-red-600">+${recovery} consecutive</strong>
            `}
          </div>
        </div>

        <!-- Humor Reality Subtitle -->
        <p class="text-[11px] text-slate-500 italic">
          “${statusTheme.humorNote}”
        </p>

        <!-- Steppers -->
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <span class="text-slate-500 font-bold text-[11px] block mb-1">Attended:</span>
            <div class="flex items-center gap-1.5">
              <button onclick="AttendanceView.adjustAttended('${sub.id}', -1)" class="stepper-btn">-</button>
              <span class="font-bold text-xs w-6 text-center">${attended}</span>
              <button onclick="AttendanceView.adjustAttended('${sub.id}', 1)" class="stepper-btn">+</button>
            </div>
          </div>

          <div>
            <span class="text-slate-500 font-bold text-[11px] block mb-1">Conducted:</span>
            <div class="flex items-center gap-1.5">
              <button onclick="AttendanceView.adjustConducted('${sub.id}', -1)" class="stepper-btn">-</button>
              <span class="font-bold text-xs w-6 text-center">${conducted}</span>
              <button onclick="AttendanceView.adjustConducted('${sub.id}', 1)" class="stepper-btn">+</button>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-between pt-1 text-xs text-slate-400">
          <button onclick="AttendanceView.deleteSubject('${sub.id}')" class="text-slate-400 hover:text-red-600">
            ${PixelIcon.get('trash')} Delete
          </button>
          <span class="text-[10px]">Target: ${target}%</span>
        </div>

      </div>
    `;
  },

  adjustAttended(subId, delta) {
    const subjects = App.state.subjects;
    const sub = subjects.find(s => s.id === subId);
    if (!sub) return;

    const newAttended = Math.max(0, (Number(sub.attended) || 0) + delta);
    const newConducted = Math.max(newAttended, Number(sub.conducted) || 0);

    sub.attended = newAttended;
    sub.conducted = newConducted;

    StorageManager.saveSubjects(subjects);
    App.renderCurrentView();
  },

  adjustConducted(subId, delta) {
    const subjects = App.state.subjects;
    const sub = subjects.find(s => s.id === subId);
    if (!sub) return;

    const currentAttended = Number(sub.attended) || 0;
    const newConducted = Math.max(currentAttended, (Number(sub.conducted) || 0) + delta);

    sub.conducted = newConducted;

    StorageManager.saveSubjects(subjects);
    App.renderCurrentView();
  },

  deleteSubject(subId) {
    if (!confirm("Delete this subject?")) return;
    App.state.subjects = App.state.subjects.filter(s => s.id !== subId);
    StorageManager.saveSubjects(App.state.subjects);
    App.showToast("Subject removed.");
    App.renderCurrentView();
  },

  openAddSubjectModal() {
    Modal.open(`
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 class="font-headline text-lg font-bold">Add Subject</h3>
          <button onclick="Modal.close()" class="text-slate-500 hover:text-black">
            ${PixelIcon.get('close')}
          </button>
        </div>

        <form onsubmit="AttendanceView.saveNewSubject(event)" class="flex flex-col gap-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Subject Code:</label>
              <input type="text" id="sub-code" placeholder="e.g. CS301" required class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">Type:</label>
              <select id="sub-type" class="w-full p-2 border border-[#18181B] rounded font-bold">
                <option value="theory">Theory</option>
                <option value="lab">Lab</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
          </div>

          <div>
            <label class="font-bold block mb-1">Subject Name:</label>
            <input type="text" id="sub-name" placeholder="e.g. Operating Systems" required class="w-full p-2 border border-[#18181B] rounded font-bold">
          </div>

          <div>
            <label class="font-bold block mb-1">Faculty:</label>
            <input type="text" id="sub-faculty" placeholder="e.g. Dr. Vance" class="w-full p-2 border border-[#18181B] rounded font-bold">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Attended:</label>
              <input type="number" id="sub-att" value="0" min="0" required class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">Total Conducted:</label>
              <input type="number" id="sub-cond" value="0" min="0" required class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 mt-2">
            <button type="button" onclick="Modal.close()" class="bw-btn">Cancel</button>
            <button type="submit" class="bw-btn bw-btn-primary">Add Subject</button>
          </div>
        </form>
      </div>
    `);
  },

  saveNewSubject(e) {
    e.preventDefault();
    const code = document.getElementById("sub-code").value.trim();
    const name = document.getElementById("sub-name").value.trim();
    const type = document.getElementById("sub-type").value;
    const faculty = document.getElementById("sub-faculty").value.trim() || "--";
    const attended = parseInt(document.getElementById("sub-att").value, 10) || 0;
    const conducted = parseInt(document.getElementById("sub-cond").value, 10) || 0;

    const newSub = {
      id: "sub_" + Date.now(),
      code,
      name,
      type,
      faculty,
      attended,
      conducted: Math.max(attended, conducted)
    };

    App.state.subjects.push(newSub);
    StorageManager.saveSubjects(App.state.subjects);
    Modal.close();
    App.showToast(`Added ${code} to matrix.`);
    App.renderCurrentView();
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.AttendanceView = AttendanceView;
}
