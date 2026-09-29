/**
 * BunkWise - Clean Timetable & OCR Schedule View
 */

const TimetableView = {
  currentDayFilter: "Tuesday",

  render(container, state) {
    const { timetable, subjects } = state;
    const days = DateUtils.DAYS;
    const quota = OCRService.checkQuota();

    container.innerHTML = `
      <div class="flex flex-col gap-5 max-w-5xl mx-auto pb-12">
        
        <!-- Header Actions Bar -->
        <div class="bw-card p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 class="font-headline text-2xl font-bold text-[#18181B]">Weekly Schedule</h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Import via Photo OCR, CSV file, custom entry, or preloaded demo.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="App.openTimetableModal()" class="bw-btn text-xs bg-yellow-50 hover:bg-yellow-100">
              ${PixelIcon.get('upload')}
              <span>Upload / Switch Timetable</span>
            </button>
            <button onclick="TimetableView.openOCRModal()" class="bw-btn bw-btn-accent text-xs">
              ${PixelIcon.get('camera')}
              <span>Photo OCR</span>
            </button>
            <button onclick="TimetableView.openAddClassModal()" class="bw-btn bw-btn-primary text-xs">
              ${PixelIcon.get('plus')}
              <span>Add Class</span>
            </button>
          </div>
        </div>

        <!-- Quota indicator & subtle notice -->
        <div class="p-3 bg-white border border-slate-300 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
          <span>
            <strong>OCR Usage:</strong> ${quota.used} / ${quota.max} requests used (Demo rate limit safeguard).
          </span>
          <span class="font-bold text-slate-800">
            ${timetable.length} sessions scheduled across week
          </span>
        </div>

        <!-- Days Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button 
            onclick="TimetableView.setFilter('ALL')" 
            class="px-3 py-1.5 text-xs font-bold uppercase rounded border transition-all ${
              this.currentDayFilter === 'ALL' ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }"
          >
            All (${timetable.length})
          </button>
          ${days.map(day => {
            const count = DateUtils.getClassesForDay(timetable, day).length;
            return `
              <button 
                onclick="TimetableView.setFilter('${day}')" 
                class="px-3 py-1.5 text-xs font-bold uppercase rounded border transition-all flex items-center gap-1.5 ${
                  this.currentDayFilter === day ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }"
              >
                <span>${day.slice(0, 3)}</span>
                <span class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${count > 0 ? (this.currentDayFilter === day ? 'bg-white text-black' : 'bg-slate-200 text-slate-700') : 'bg-transparent text-slate-400'}">
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
          <div class="bw-card p-10 text-center flex flex-col items-center justify-center gap-2 bg-white">
            <div class="text-slate-400 mb-1">${PixelIcon.get('calendar')}</div>
            <h3 class="font-headline text-base font-bold">No Classes on ${day}</h3>
            <p class="text-xs text-slate-500">Zero lectures scheduled.</p>
            <button onclick="TimetableView.openAddClassModal('${day}')" class="bw-btn text-xs mt-2">
              ${PixelIcon.get('plus')} Add Class to ${day}
            </button>
          </div>
        `;
      }

      if (classes.length === 0) return "";

      return `
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between pb-1 border-b border-[#18181B]">
            <div class="flex items-center gap-2">
              <h3 class="font-headline text-base font-bold text-[#18181B]">${day}</h3>
              <span class="text-xs text-slate-500 font-bold">(${classes.length} classes)</span>
            </div>
            <button onclick="TimetableView.openAddClassModal('${day}')" class="text-xs font-bold text-slate-700 hover:underline">
              + Add Class
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${classes.map(item => this.renderClassCard(item, subjects)).join("")}
          </div>
        </div>
      `;
    }).join("");

    return rendered;
  },

  renderClassCard(item, subjects) {
    const sub = subjects.find(s => s.id === item.subjectId || s.code === item.subjectCode);

    return `
      <div class="bw-card p-4 bg-white flex flex-col justify-between gap-3">
        <div>
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">
              ${DateUtils.formatRange12h(item.startTime, item.endTime)}
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
              ${item.type || 'theory'}
            </span>
          </div>

          <h4 class="font-headline text-base font-bold text-[#18181B] leading-tight">
            ${item.subjectCode}
          </h4>
          <p class="text-xs text-slate-600 mt-0.5 font-bold">
            ${item.subjectName || (sub ? sub.name : '')}
          </p>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span>Room: ${item.room || '--'}</span>
            <span class="mx-1">•</span>
            <span>Faculty: ${item.faculty || '--'}</span>
          </div>

          <button onclick="TimetableView.deleteClass('${item.id}')" class="text-slate-400 hover:text-red-600 p-1" title="Delete Class">
            ${PixelIcon.get('trash')}
          </button>
        </div>
      </div>
    `;
  },

  deleteClass(classId) {
    if (!confirm("Remove this class from your timetable?")) return;
    const timetable = App.state.timetable.filter(item => item.id !== classId);
    App.state.timetable = timetable;
    StorageManager.saveTimetable(timetable);
    App.showToast("Class removed from timetable.");
    App.renderCurrentView();
  },

  // --- OCR Upload & Verification Workflow ---
  openOCRModal() {
    Modal.open(`
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div class="flex items-center gap-2">
            ${PixelIcon.get('camera')}
            <h3 class="font-headline text-lg font-bold">Import Timetable (Image OCR)</h3>
          </div>
          <button onclick="Modal.close()" class="text-slate-500 hover:text-black">
            ${PixelIcon.get('close')}
          </button>
        </div>

        <p class="text-xs text-slate-600">
          Select or drop a photo of your timetable schedule. The OCR will extract days, subject codes, faculty, and room numbers.
        </p>

        <!-- Dropzone -->
        <div 
          id="ocr-dropzone" 
          class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
          onclick="document.getElementById('ocr-file-input').click()"
        >
          <div class="text-slate-600 mb-1">${PixelIcon.get('upload')}</div>
          <strong class="text-sm text-slate-800">Click to choose image or drag & drop</strong>
          <span class="text-[11px] text-slate-500">JPG, PNG, WEBP</span>
          <input type="file" id="ocr-file-input" accept="image/*" class="hidden" onchange="TimetableView.handleImageSelect(event)">
        </div>

        <!-- Quick Demo autoloader -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
          <div>
            <strong class="text-slate-800 block">Instant Demo Test</strong>
            <span class="text-slate-500">Extract demo college timetable without uploading file.</span>
          </div>
          <button onclick="TimetableView.runDemoOCR()" class="bw-btn bw-btn-primary text-xs whitespace-nowrap">
            Test OCR
          </button>
        </div>

        <!-- Progress State -->
        <div id="ocr-progress-box" class="hidden flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded">
          <div class="flex justify-between text-xs font-bold">
            <span id="ocr-step-text">Reading image...</span>
            <span id="ocr-progress-pct">0%</span>
          </div>
          <div class="w-full h-2 bg-slate-200 rounded overflow-hidden">
            <div id="ocr-progress-bar" class="h-full bg-emerald-600 transition-all duration-300" style="width: 0%;"></div>
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
    const fakeFile = new File(["demo-image"], "college_timetable.png", { type: "image/png" });
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

      this.openVerificationModal(extracted);
    } catch (err) {
      alert("OCR Error: " + err.message);
      Modal.close();
    }
  },

  openVerificationModal(extractedClasses) {
    window.tempExtractedClasses = extractedClasses;

    Modal.open(`
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 class="font-headline text-lg font-bold">Verify Extracted Classes</h3>
            <span class="text-xs text-slate-500 font-bold">Review detected schedule before saving</span>
          </div>
          <button onclick="Modal.close()" class="text-slate-500 hover:text-black">
            ${PixelIcon.get('close')}
          </button>
        </div>

        <p class="text-xs text-slate-600">
          Detected <strong>${extractedClasses.length} classes</strong>. Check slots and remove any misreads:
        </p>

        <div class="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
          ${extractedClasses.map((item, idx) => `
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between gap-2 text-xs">
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-300">${item.day}</span>
                  <span class="font-bold">${item.startTime} - ${item.endTime}</span>
                  <span class="text-slate-500 uppercase text-[10px]">${item.type}</span>
                </div>
                <div class="font-bold text-slate-900 mt-1">${item.subjectCode} - ${item.subjectName}</div>
                <div class="text-[11px] text-slate-500">Room: ${item.room} | Faculty: ${item.faculty}</div>
              </div>
              <button onclick="TimetableView.removeVerificationItem(${idx})" class="text-red-600 font-bold text-xs hover:underline">
                Remove
              </button>
            </div>
          `).join("")}
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-200 gap-3">
          <button onclick="Modal.close()" class="bw-btn text-xs">
            Cancel
          </button>
          <button onclick="TimetableView.commitVerifiedTimetable()" class="bw-btn bw-btn-primary text-xs">
            Looks Good! Import (${extractedClasses.length})
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

    // Auto-create any missing subjects in App.state.subjects
    const subjects = App.state.subjects || [];
    window.tempExtractedClasses.forEach(item => {
      const code = (item.subjectCode || "SUB").toUpperCase();
      let sub = subjects.find(s => s.code.toUpperCase() === code || s.id === item.subjectId);
      if (!sub) {
        sub = {
          id: "sub_" + code.replace(/[^A-Z0-9]/g, "_") + "_" + Date.now(),
          code: item.subjectCode,
          name: item.subjectName || item.subjectCode,
          faculty: item.faculty || "--",
          type: item.type || "theory",
          attended: 0,
          conducted: 0,
          color: "#0F766E"
        };
        subjects.push(sub);
      }
      item.subjectId = sub.id;
    });

    App.state.subjects = subjects;
    StorageManager.saveSubjects(subjects);

    App.state.timetable = window.tempExtractedClasses;
    StorageManager.saveTimetable(window.tempExtractedClasses);
    Modal.close();
    App.showToast(`Imported ${window.tempExtractedClasses.length} classes into your timetable.`);
    App.renderCurrentView();
  },

  openAddClassModal(defaultDay = "Tuesday") {
    const subjects = App.state.subjects || [];

    Modal.open(`
      <div class="p-4 sm:p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 class="font-headline text-lg font-bold">Add Class to Schedule</h3>
          <button onclick="Modal.close()" class="text-slate-500 hover:text-black">
            ${PixelIcon.get('close')}
          </button>
        </div>

        <form id="add-class-form" onsubmit="TimetableView.saveManualClass(event)" class="flex flex-col gap-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Day of Week:</label>
              <select id="form-day" class="w-full p-2 border border-[#18181B] rounded font-bold">
                ${DateUtils.DAYS.map(d => `<option value="${d}" ${d === defaultDay ? 'selected' : ''}>${d}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="font-bold block mb-1">Session Type:</label>
              <select id="form-type" class="w-full p-2 border border-[#18181B] rounded font-bold">
                <option value="theory">Theory Lecture</option>
                <option value="lab">Practical / Lab</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Start Time (24h):</label>
              <input type="time" id="form-start" value="13:00" required class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">End Time (24h):</label>
              <input type="time" id="form-end" value="14:00" required class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
          </div>

          <div>
            <label class="font-bold block mb-1">Select Subject:</label>
            <select id="form-subject" onchange="TimetableView.handleSubjectSelectChange(this.value)" class="w-full p-2 border border-[#18181B] rounded font-bold">
              ${subjects.map(s => `<option value="${s.id}">${s.code} — ${s.name}</option>`).join("")}
              <option value="__NEW__">+ Create New Subject...</option>
            </select>
          </div>

          <div id="new-subject-fields" class="${subjects.length > 0 ? 'hidden' : ''} p-3 bg-slate-50 border border-slate-300 rounded flex flex-col gap-2">
            <span class="font-bold text-slate-700">New Subject Details:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input type="text" id="form-new-code" placeholder="Subject Code (e.g. CS301)" class="w-full p-2 border border-[#18181B] rounded font-bold uppercase">
              <input type="text" id="form-new-name" placeholder="Subject Name (e.g. Compiler Design)" class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="font-bold block mb-1">Room / Hall:</label>
              <input type="text" id="form-room" placeholder="e.g. D208" class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
            <div>
              <label class="font-bold block mb-1">Faculty:</label>
              <input type="text" id="form-faculty" placeholder="e.g. Dr. Vance" class="w-full p-2 border border-[#18181B] rounded font-bold">
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200 mt-2">
            <button type="button" onclick="Modal.close()" class="bw-btn">Cancel</button>
            <button type="submit" class="bw-btn bw-btn-primary">Save Class</button>
          </div>
        </form>
      </div>
    `);

    if (subjects.length === 0) {
      const select = document.getElementById("form-subject");
      if (select) select.value = "__NEW__";
    }
  },

  handleSubjectSelectChange(val) {
    const fields = document.getElementById("new-subject-fields");
    if (!fields) return;
    if (val === "__NEW__") {
      fields.classList.remove("hidden");
    } else {
      fields.classList.add("hidden");
    }
  },

  saveManualClass(e) {
    e.preventDefault();
    const day = document.getElementById("form-day").value;
    const type = document.getElementById("form-type").value;
    const start = document.getElementById("form-start").value;
    const end = document.getElementById("form-end").value;
    const subSelect = document.getElementById("form-subject").value;
    const room = document.getElementById("form-room").value.trim() || "TBA";
    const faculty = document.getElementById("form-faculty").value.trim() || "Faculty";

    if (start >= end) {
      App.showToast("Start time must be earlier than End time.");
      return;
    }

    let targetSub = null;
    const subjects = App.state.subjects;

    if (subSelect === "__NEW__") {
      const newCode = (document.getElementById("form-new-code").value.trim() || "SUB" + Date.now().toString().slice(-4)).toUpperCase();
      const newName = document.getElementById("form-new-name").value.trim() || newCode;

      targetSub = {
        id: "sub_" + newCode.replace(/[^A-Z0-9]/g, "_") + "_" + Date.now(),
        code: newCode,
        name: newName,
        faculty: faculty,
        type: type,
        attended: 0,
        conducted: 0,
        color: "#0F766E"
      };
      subjects.push(targetSub);
      StorageManager.saveSubjects(subjects);
    } else {
      targetSub = subjects.find(s => s.id === subSelect);
    }

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
    App.showToast(`Added ${newClass.subjectCode} to ${day}.`);
    App.renderCurrentView();
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.TimetableView = TimetableView;
}
