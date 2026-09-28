/**
 * BunkWise - Attendance Matrix View
 * Manage subject-wise attendance with live steppers & recovery counters.
 */

const AttendanceView = {
  render(container, state) {
    const { subjects, settings } = state;
    const target = settings.targetAttendance || 75;
    const overall = BunkEngine.calculateOverallStats(subjects, target);

    container.innerHTML = `
      <div class="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
        
        <!-- Header & Add Subject Bar -->
        <div class="bw-card p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">📊</span>
              <h2 class="font-headline text-2xl font-bold text-[#18181B]">Attendance Matrix</h2>
            </div>
            <p class="text-xs text-slate-600 mt-1">
              Tune your subject tallies. Bunk allowances and recovery goals recompute instantly.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="AttendanceView.openAddSubjectModal()" class="bw-btn bw-btn-primary text-xs flex items-center gap-1.5 py-2.5 px-4">
              <span class="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Add New Subject</span>
            </button>
          </div>
        </div>

        <!-- Overall Summary Banner -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bw-card p-4 bg-white flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Overall Score</span>
              <span class="font-headline text-3xl font-black ${overall.percentage >= target ? 'text-emerald-600' : 'text-red-600'}">
                ${overall.percentage}%
              </span>
              <span class="text-[11px] text-slate-500 font-bold">Target: ${target}%</span>
            </div>
            <div class="text-right">
              <span class="bw-badge ${overall.percentage >= target ? 'bw-badge-safe' : 'bw-badge-danger'}">
                ${overall.percentage >= target ? 'HEALTHY' : 'CRITICAL DEFICIT'}
              </span>
            </div>
          </div>

          <div class="bw-card p-4 bg-white flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Danger List</span>
              <span class="font-headline text-3xl font-black text-red-600">
                ${overall.belowTargetCount}
              </span>
              <span class="text-[11px] text-slate-500 font-bold">Subjects below ${target}%</span>
            </div>
            <span class="material-symbols-outlined text-red-600 text-3xl">warning</span>
          </div>

          <div class="bw-card p-4 bg-white flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-500 block">Total Lectures</span>
              <span class="font-headline text-3xl font-black text-slate-800">
                ${overall.totalAttended} / ${overall.totalConducted}
              </span>
              <span class="text-[11px] text-slate-500 font-bold">Across all departments</span>
            </div>
            <span class="material-symbols-outlined text-emerald-600 text-3xl">school</span>
          </div>
        </div>

        <!-- Subject Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
      badge: "CRITICAL 🚨",
      badgeClass: "bw-badge-danger",
      cardBorder: "border-red-500",
      pctColor: "text-red-600"
    };

    if (conducted === 0) {
      statusTheme = {
        badge: "NOT STARTED 💤",
        badgeClass: "bg-slate-100 text-slate-700",
        cardBorder: "border-slate-300",
        pctColor: "text-slate-500"
      };
    } else if (pct >= 80) {
      statusTheme = {
        badge: "COMFORTABLE 🛡️",
        badgeClass: "bw-badge-safe",
        cardBorder: "border-emerald-500",
        pctColor: "text-emerald-700"
      };
    } else if (pct >= target) {
      statusTheme = {
        badge: "SAFE HAVEN 🟢",
        badgeClass: "bw-badge-safe",
        cardBorder: "border-emerald-400",
        pctColor: "text-emerald-600"
      };
    } else if (pct >= 70) {
      statusTheme = {
        badge: "DANGER ZONE ⚠️",
        badgeClass: "bw-badge-warn",
        cardBorder: "border-amber-400",
        pctColor: "text-amber-600"
      };
    }

    return `
      <div class="bw-card p-5 bg-white flex flex-col justify-between gap-4 border-2 hover:translate-x-0.5 transition-all">
        
        <!-- Top Info -->
        <div>
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-[#18181B] font-bold">
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
            ${sub.faculty || 'Faculty TBA'} • <strong class="uppercase">${sub.type || 'theory'}</strong>
          </span>
        </div>

        <!-- Metric Display & Progress -->
        <div class="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-[#18181B]">
          <div>
            <span class="font-headline text-3xl font-black ${statusTheme.pctColor}">
              ${conducted === 0 ? '0.0%' : `${pct}%`}
            </span>
            <span class="text-[11px] text-slate-500 font-bold block">
              (${attended} / ${conducted} conducted)
            </span>
          </div>

          <!-- Decision Advice Box -->
          <div class="text-right">
            ${conducted === 0 ? `
              <span class="text-xs text-slate-500 italic">No classes held</span>
            ` : pct >= target ? `
              <span class="text-[10px] uppercase font-bold text-emerald-800 block">Bunk Allowance</span>
              <span class="font-headline text-lg font-bold text-emerald-700">
                ${skips} safe ${skips === 1 ? 'class' : 'classes'}
              </span>
            ` : `
              <span class="text-[10px] uppercase font-bold text-red-800 block">Recovery Goal</span>
              <span class="font-headline text-lg font-bold text-red-600">
                +${recovery} in a row
              </span>
            `}
          </div>
        </div>

        <!-- Live Steppers (PRD Section 12) -->
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
          <!-- Attended Counter -->
          <div class="flex flex-col gap-1">
            <span class="font-bold text-slate-700">Attended:</span>
            <div class="flex items-center gap-1.5">
              <button onclick="AttendanceView.adjustAttended('${sub.id}', -1)" class="stepper-btn">-</button>
              <span class="font-bold text-sm w-7 text-center">${attended}</span>
              <button onclick="AttendanceView.adjustAttended('${sub.id}', 1)" class="stepper-btn">+</button>
            </div>
          </div>

          <!-- Conducted Counter -->
          <div class="flex flex-col gap-1">
            <span class="font-bold text-slate-700">Conducted:</span>
            <div class="flex items-center gap-1.5">
              <button onclick="AttendanceView.adjustConducted('${sub.id}', -1)" class="stepper-btn">-</button>
              <span class="font-bold text-sm w-7 text-center">${conducted}</span>
              <button onclick="AttendanceView.adjustConducted('${sub.id}', 1)" class="stepper-btn">+</button>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-between pt-2 text-xs text-slate-400">
          <button onclick="AttendanceView.deleteSubject('${sub.id}')" class="text-red-500 hover:text-red-700 hover:underline">
            Delete Subject
          </button>
          <span class="text-[10px] font-bold">TARGET: ${target}%</span>
        </div>

      </div>
    `;
  },

  adjustAttended(subId, delta) {
    const subjects = App.state.subjects;
    const sub = subjects.find(s => s.id === subId);
    if (!sub) return;

    const newAttended = Math.max(0, (Number(sub.attended) || 0) + delta);
    // Conducted should be at least attended
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
    if (!confirm("Are you sure you want to delete this subject?")) return;
    App.state.subjects = App.state.subjects.filter(s => s.id !== subId);
    StorageManager.saveSubjects(App.state.subjects);
    App.showToast("🗑️ Subject removed from matrix.");
    App.renderCurrentView();
  },

  openAddSubjectModal() {
    Modal.open(`
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b-2 border-[#18181B]">
          <h3 class="font-headline text-xl font-bold">Add Subject to Matrix</h3>
          <button onclick="Modal.close()" class="font-bold text-lg hover:text-red-600">✕</button>
        </div>

        <form onsubmit="AttendanceView.saveNewSubject(event)" class="flex flex-col gap-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Subject Code:</label>
              <input type="text" id="sub-code" placeholder="e.g. CS301" required class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">Type:</label>
              <select id="sub-type" class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
                <option value="theory">Theory</option>
                <option value="lab">Lab</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
          </div>

          <div>
            <label class="font-bold block mb-1">Subject Name:</label>
            <input type="text" id="sub-name" placeholder="e.g. Distributed Computing" required class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
          </div>

          <div>
            <label class="font-bold block mb-1">Faculty Name:</label>
            <input type="text" id="sub-faculty" placeholder="e.g. Dr. Alan Turing" class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Attended Classes:</label>
              <input type="number" id="sub-att" value="0" min="0" required class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">Total Conducted:</label>
              <input type="number" id="sub-cond" value="0" min="0" required class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
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
    App.showToast(`📚 Subject <strong>${code}</strong> added to matrix.`);
    App.renderCurrentView();
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.AttendanceView = AttendanceView;
}
