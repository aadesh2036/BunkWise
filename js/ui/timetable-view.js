/**
 * BunkWise - Timetable & OCR Schedule View
 */

const TimetableView = {
  currentDayFilter: "Tuesday", // default to day with rich classes

  render(container, state) {
    const { timetable, subjects } = state;
    const days = DateUtils.DAYS;
    const quota = OCRService.checkQuota();

    container.innerHTML = `
      <div class="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
        
        <!-- Header Actions Bar -->
        <div class="bw-card p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">📅</span>
              <h2 class="font-headline text-2xl font-bold text-[#18181B]">Weekly Schedule & Timetable</h2>
            </div>
            <p class="text-xs text-slate-600 mt-1">
              Import from timetable photo using AI or build your schedule manually.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="TimetableView.openOCRModal()" class="bw-btn bw-btn-accent text-xs flex items-center gap-1.5 py-2.5 px-4">
              <span class="material-symbols-outlined text-[18px]">document_scanner</span>
              <span>Import Timetable (AI OCR)</span>
            </button>
            <button onclick="TimetableView.openAddClassModal()" class="bw-btn bw-btn-primary text-xs flex items-center gap-1.5 py-2.5 px-4">
              <span class="material-symbols-outlined text-[18px]">add</span>
              <span>Add Class Manually</span>
            </button>
          </div>
        </div>

        <!-- Quota indicator & tips banner -->
        <div class="p-3 bg-amber-50 border-2 border-[#18181B] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-700 text-[18px]">info</span>
            <span>
              <strong>OCR Demo Status:</strong> ${quota.used} / ${quota.max} requests used. Fully client-side safe.
            </span>
          </div>
          <span class="text-[11px] text-slate-500 font-bold uppercase">
            Total scheduled sessions: ${timetable.length}
          </span>
        </div>

        <!-- Days Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button 
            onclick="TimetableView.setFilter('ALL')" 
            class="px-3 py-1.5 text-xs font-bold uppercase rounded-lg border-2 border-[#18181B] transition-all ${
              this.currentDayFilter === 'ALL' ? 'bg-[#18181B] text-white shadow-[2px_2px_0px_#18181B]' : 'bg-white hover:bg-slate-100 text-slate-700'
            }"
          >
            All Week (${timetable.length})
          </button>
          ${days.map(day => {
            const count = DateUtils.getClassesForDay(timetable, day).length;
            return `
              <button 
                onclick="TimetableView.setFilter('${day}')" 
                class="px-3 py-1.5 text-xs font-bold uppercase rounded-lg border-2 border-[#18181B] transition-all flex items-center gap-1.5 ${
                  this.currentDayFilter === day ? 'bg-primary-container text-on-primary-container shadow-[2px_2px_0px_#18181B]' : 'bg-white hover:bg-slate-100 text-slate-700'
                }"
              >
                <span>${day}</span>
                <span class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${count > 0 ? 'bg-[#18181B] text-white' : 'bg-slate-200 text-slate-600'}">
                  ${count}
                </span>
              </button>
            `;
          }).join("")}
        </div>

        <!-- Timetable Classes Grid -->
        <div class="flex flex-col gap-6">
          ${this.renderDaysSchedule(timetable, subjects)}
        </div>

      </div>
    `;
  },

  setFilter(day) {
    this.currentDayFilter = day;
    App.renderCurrentView();
  },

  renderDaysSchedule(timetable, subjects) {
    const daysToShow = this.currentDayFilter === "ALL" 
      ? DateUtils.DAYS 
      : [this.currentDayFilter];

    const rendered = daysToShow.map(day => {
      const classes = DateUtils.getClassesForDay(timetable, day);
      if (classes.length === 0 && this.currentDayFilter !== "ALL") {
        return `
          <div class="bw-card p-12 text-center flex flex-col items-center justify-center gap-3 bg-white">
            <span class="text-4xl">😴</span>
            <h3 class="font-headline text-lg font-bold">No Classes on ${day}</h3>
            <p class="text-xs text-slate-600">Zero lectures scheduled. Sleep in or catch up on coursework.</p>
            <button onclick="TimetableView.openAddClassModal('${day}')" class="bw-btn bw-btn-primary text-xs mt-2">
              + Add Class to ${day}
            </button>
          </div>
        `;
      }

      if (classes.length === 0) return "";

      return `
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between pb-1 border-b-2 border-[#18181B]">
            <div class="flex items-center gap-2">
              <h3 class="font-headline text-lg font-bold text-[#18181B]">${day}</h3>
              <span class="text-xs text-slate-500 font-bold">(${classes.length} classes)</span>
            </div>
            <button onclick="TimetableView.openAddClassModal('${day}')" class="text-xs font-bold text-emerald-700 hover:underline">
              + Add Class
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${classes.map(item => this.renderClassCard(item, subjects)).join("")}
          </div>
        </div>
      `;
    }).join("");

    return rendered || `
      <div class="bw-card p-12 text-center flex flex-col items-center justify-center gap-3 bg-white">
        <span class="text-4xl">📭</span>
        <h3 class="font-headline text-lg font-bold">Your Timetable is Empty</h3>
        <p class="text-xs text-slate-600 max-w-md">
          Upload a screenshot of your college timetable to extract it via AI, or click below to build it manually.
        </p>
        <div class="flex gap-3 mt-2">
          <button onclick="TimetableView.openOCRModal()" class="bw-btn bw-btn-accent text-xs">
            Import Timetable Screenshot
          </button>
          <button onclick="TimetableView.openAddClassModal()" class="bw-btn bw-btn-primary text-xs">
            Add First Class
          </button>
        </div>
      </div>
    `;
  },

  renderClassCard(item, subjects) {
    const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode);
    const typeColor = item.type === "lab" ? "bg-cyan-100 text-cyan-900" : (item.type === "tutorial" ? "bg-purple-100 text-purple-900" : "bg-amber-100 text-amber-900");

    return `
      <div class="bw-card p-4 flex flex-col justify-between gap-3 hover:translate-x-0.5">
        <div>
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-[#18181B] font-bold">
              ${DateUtils.formatRange12h(item.startTime, item.endTime)}
            </span>
            <span class="bw-badge ${typeColor}">
              ${item.type || 'theory'}
            </span>
          </div>

          <h4 class="font-headline text-base font-bold text-[#18181B] leading-tight">
            ${item.subjectCode}
          </h4>
          <p class="text-xs text-slate-700 font-bold mt-0.5">
            ${item.subjectName || (sub ? sub.name : '')}
          </p>
        </div>

        <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span class="block"><strong>Room:</strong> ${item.room || '--'}</span>
            <span class="block"><strong>Faculty:</strong> ${item.faculty || '--'}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="TimetableView.deleteClass('${item.id}')" class="text-xs text-red-600 hover:underline font-bold p-1" title="Delete Class">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  },

  deleteClass(classId) {
    if (!confirm("Are you sure you want to remove this class from your schedule?")) return;
    const timetable = App.state.timetable.filter(item => item.id !== classId);
    App.state.timetable = timetable;
    StorageManager.saveTimetable(timetable);
    App.showToast("🗑️ Class removed from timetable.");
    App.renderCurrentView();
  },

  // --- OCR Upload & Verification Workflow ---
  openOCRModal() {
    Modal.open(`
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b-2 border-[#18181B]">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📷</span>
            <h3 class="font-headline text-xl font-bold">Import Timetable with AI</h3>
          </div>
          <button onclick="Modal.close()" class="font-bold text-lg hover:text-red-600">✕</button>
        </div>

        <p class="text-xs text-slate-600">
          Upload an image (PNG, JPG, WEBP) of your college timetable schedule. Our Hugging Face vision pipeline will structure it into slots, faculty, and room numbers.
        </p>

        <!-- Dropzone -->
        <div 
          id="ocr-dropzone" 
          class="border-2 border-dashed border-[#18181B] rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
          onclick="document.getElementById('ocr-file-input').click()"
        >
          <span class="material-symbols-outlined text-4xl text-slate-600">upload_file</span>
          <div>
            <strong class="text-sm text-[#18181B] block">Click to upload or drag & drop</strong>
            <span class="text-[11px] text-slate-500">JPG, PNG, WEBP up to 10MB</span>
          </div>
          <input type="file" id="ocr-file-input" accept="image/*" class="hidden" onchange="TimetableView.handleImageSelect(event)">
        </div>

        <!-- Quick Demo autoloader for instant testing -->
        <div class="p-3 bg-emerald-50 border border-[#18181B] rounded-lg flex items-center justify-between text-xs">
          <div>
            <strong class="text-emerald-900 block">Judge / Instant Demo Mode</strong>
            <span class="text-slate-600">Test AI extraction using the real timetable structure without uploading a file.</span>
          </div>
          <button onclick="TimetableView.runDemoOCR()" class="bw-btn bw-btn-primary text-xs whitespace-nowrap">
            Run Test OCR ⚡
          </button>
        </div>

        <!-- Progress State (Hidden initially) -->
        <div id="ocr-progress-box" class="hidden flex flex-col gap-2 p-4 bg-slate-50 border border-[#18181B] rounded-lg">
          <div class="flex justify-between text-xs font-bold">
            <span id="ocr-step-text">Processing image...</span>
            <span id="ocr-progress-pct">0%</span>
          </div>
          <div class="w-full h-3 bg-slate-200 rounded border border-[#18181B] overflow-hidden">
            <div id="ocr-progress-bar" class="h-full bg-emerald-500 transition-all duration-300" style="width: 0%;"></div>
          </div>
        </div>

      </div>
    `);
  },

  async handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    this.processOCRFile(file);
  },

  async runDemoOCR() {
    const fakeFile = new File(["demo-image"], "college_timetable_screenshot.png", { type: "image/png" });
    this.processOCRFile(fakeFile);
  },

  async processOCRFile(file) {
    const progressBox = document.getElementById("ocr-progress-box");
    const stepText = document.getElementById("ocr-step-text");
    const pctText = document.getElementById("ocr-progress-pct");
    const bar = document.getElementById("ocr-progress-bar");
    const dropzone = document.getElementById("ocr-dropzone");

    if (progressBox) progressBox.classList.remove("hidden");
    if (dropzone) dropzone.classList.add("hidden");

    try {
      const extracted = await OCRService.extractTimetableFromImage(file, ({ message, progress }) => {
        if (stepText) stepText.innerText = message;
        if (pctText) pctText.innerText = `${progress}%`;
        if (bar) bar.style.width = `${progress}%`;
      });

      // Show Verification Screen (PRD Section 10)
      this.openVerificationModal(extracted);
    } catch (err) {
      alert("OCR Error: " + err.message);
      Modal.close();
    }
  },

  /**
   * Verification Modal before committing extracted timetable to state (PRD Section 10).
   */
  openVerificationModal(extractedClasses) {
    window.tempExtractedClasses = extractedClasses;

    Modal.open(`
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b-2 border-[#18181B]">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🔍</span>
            <div>
              <h3 class="font-headline text-xl font-bold">Review Extracted Timetable</h3>
              <span class="text-xs text-slate-500 font-bold">Verification step: Check details before saving</span>
            </div>
          </div>
          <button onclick="Modal.close()" class="font-bold text-lg hover:text-red-600">✕</button>
        </div>

        <p class="text-xs text-slate-600">
          AI detected <strong>${extractedClasses.length} classes</strong>. If any room or time needs tweaking, you can edit below.
        </p>

        <!-- Classes verification list -->
        <div class="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
          ${extractedClasses.map((item, idx) => `
            <div class="p-3 bg-white border border-[#18181B] rounded-lg flex items-center justify-between gap-3 text-xs">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-[#18181B]">${item.day}</span>
                  <span class="font-bold">${item.startTime} - ${item.endTime}</span>
                  <span class="text-slate-500 uppercase font-bold text-[10px]">${item.type}</span>
                </div>
                <div class="font-bold text-[#18181B] text-sm mt-1">${item.subjectCode} - ${item.subjectName}</div>
                <div class="text-[11px] text-slate-500">Room: ${item.room} | Faculty: ${item.faculty}</div>
              </div>
              <button onclick="TimetableView.removeVerificationItem(${idx})" class="text-red-600 font-bold text-xs hover:underline">
                Remove
              </button>
            </div>
          `).join("")}
        </div>

        <!-- Commit Actions -->
        <div class="flex items-center justify-between pt-3 border-t-2 border-[#18181B] gap-3">
          <button onclick="Modal.close()" class="bw-btn text-xs">
            Cancel
          </button>
          <button onclick="TimetableView.commitVerifiedTimetable()" class="bw-btn bw-btn-primary text-xs py-2.5 px-5">
            Looks Good! Import to Timetable →
          </button>
        </div>
      </div>
    `);
  },

  removeVerificationItem(idx) {
    if (window.tempExtractedClasses) {
      window.tempExtractedClasses.splice(idx, 1);
      this.openVerificationModal(window.tempExtractedClasses);
    }
  },

  commitVerifiedTimetable() {
    if (!window.tempExtractedClasses || window.tempExtractedClasses.length === 0) {
      Modal.close();
      return;
    }

    // Merge or replace timetable
    App.state.timetable = window.tempExtractedClasses;
    StorageManager.saveTimetable(window.tempExtractedClasses);
    Modal.close();
    App.showToast(`✅ Successfully imported ${window.tempExtractedClasses.length} classes into your timetable!`);
    App.renderCurrentView();
  },

  // --- Manual Add Class Modal ---
  openAddClassModal(defaultDay = "Tuesday") {
    const subjects = App.state.subjects;

    Modal.open(`
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b-2 border-[#18181B]">
          <h3 class="font-headline text-xl font-bold">Add Class to Schedule</h3>
          <button onclick="Modal.close()" class="font-bold text-lg hover:text-red-600">✕</button>
        </div>

        <form id="add-class-form" onsubmit="TimetableView.saveManualClass(event)" class="flex flex-col gap-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Day of Week:</label>
              <select id="form-day" class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
                ${DateUtils.DAYS.map(d => `<option value="${d}" ${d === defaultDay ? 'selected' : ''}>${d}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="font-bold block mb-1">Type:</label>
              <select id="form-type" class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
                <option value="theory">Theory</option>
                <option value="lab">Lab</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Start Time (24h):</label>
              <input type="time" id="form-start" value="13:00" required class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">End Time (24h):</label>
              <input type="time" id="form-end" value="14:00" required class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
            </div>
          </div>

          <div>
            <label class="font-bold block mb-1">Subject:</label>
            <select id="form-subject" class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
              ${subjects.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join("")}
              <option value="custom">+ New Subject Code</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Room / Hall:</label>
              <input type="text" id="form-room" placeholder="e.g. D208" class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">Faculty Name/Initials:</label>
              <input type="text" id="form-faculty" placeholder="e.g. Prof. Vance" class="w-full p-2 border-2 border-[#18181B] rounded font-bold">
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 mt-2">
            <button type="button" onclick="Modal.close()" class="bw-btn">Cancel</button>
            <button type="submit" class="bw-btn bw-btn-primary">Add to Schedule</button>
          </div>
        </form>
      </div>
    `);
  },

  saveManualClass(e) {
    e.preventDefault();
    const day = document.getElementById("form-day").value;
    const type = document.getElementById("form-type").value;
    const start = document.getElementById("form-start").value;
    const end = document.getElementById("form-end").value;
    const subId = document.getElementById("form-subject").value;
    const room = document.getElementById("form-room").value || "TBA";
    const faculty = document.getElementById("form-faculty").value || "Faculty";

    const subjects = App.state.subjects;
    const targetSub = subjects.find(s => s.id === subId);

    const newClass = {
      id: "class_" + Date.now(),
      day,
      startTime: start,
      endTime: end,
      type,
      subjectId: targetSub ? targetSub.id : "CUSTOM",
      subjectCode: targetSub ? targetSub.code : "GENERIC",
      subjectName: targetSub ? targetSub.name : "Elective",
      room,
      faculty
    };

    App.state.timetable.push(newClass);
    StorageManager.saveTimetable(App.state.timetable);
    Modal.close();
    App.showToast(`📅 Class <strong>${newClass.subjectCode}</strong> added to ${day}!`);
    App.renderCurrentView();
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.TimetableView = TimetableView;
}
