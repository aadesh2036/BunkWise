/**
 * BunkWise - Timetable Setup Dialogue Box (Upload Own Timetable or Use Demo)
 * Because there is no database, this gives students an intuitive, zero-friction setup modal:
 *  1. 1-Tap Load Student Demo (AI & Data Science Sem 6)
 *  2. Upload Timetable File (.JSON or .CSV)
 *  3. Paste Spreadsheet / CSV text directly
 *  4. Upload Photo of Timetable (OCR Engine)
 *  5. Start with Blank Schedule
 */

const TimetableModal = {
  currentTab: "demo",

  open() {
    this.currentTab = "demo";
    this.render();
  },

  render() {
    Modal.open(`
      <div class="p-4 sm:p-6 flex flex-col gap-4 text-xs">
        
        <!-- Header -->
        <div class="flex items-start justify-between pb-3 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-1 rounded bg-[#FEF08A] border border-[#18181B] text-slate-900">${PixelIcon.get('calendar')}</span>
              <h3 class="font-headline text-lg sm:text-xl font-bold text-[#18181B]">Timetable Setup</h3>
            </div>
            <p class="text-xs text-slate-500 mt-1 leading-snug">
              No database needed. All data lives safely in your browser. Choose how to set up your schedule:
            </p>
          </div>
          <button onclick="Modal.close()" class="text-slate-500 hover:text-black p-1">
            ${PixelIcon.get('close')}
          </button>
        </div>

        <!-- Mode Selection Tabs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-300">
          <button 
            type="button"
            onclick="TimetableModal.switchTab('demo')" 
            class="py-1.5 px-2 font-bold rounded text-center transition-all ${
              this.currentTab === 'demo' ? 'bg-[#18181B] text-white shadow-[1px_1px_0px_#18181B]' : 'text-slate-600 hover:text-black'
            }"
          >
            ⚡ Demo
          </button>
          <button 
            type="button"
            onclick="TimetableModal.switchTab('file')" 
            class="py-1.5 px-2 font-bold rounded text-center transition-all ${
              this.currentTab === 'file' ? 'bg-[#18181B] text-white shadow-[1px_1px_0px_#18181B]' : 'text-slate-600 hover:text-black'
            }"
          >
            📁 Upload File
          </button>
          <button 
            type="button"
            onclick="TimetableModal.switchTab('paste')" 
            class="py-1.5 px-2 font-bold rounded text-center transition-all ${
              this.currentTab === 'paste' ? 'bg-[#18181B] text-white shadow-[1px_1px_0px_#18181B]' : 'text-slate-600 hover:text-black'
            }"
          >
            📝 Paste CSV
          </button>
          <button 
            type="button"
            onclick="TimetableModal.switchTab('ocr')" 
            class="py-1.5 px-2 font-bold rounded text-center transition-all ${
              this.currentTab === 'ocr' ? 'bg-[#18181B] text-white shadow-[1px_1px_0px_#18181B]' : 'text-slate-600 hover:text-black'
            }"
          >
            📷 Photo OCR
          </button>
        </div>

        <!-- Tab Content Body -->
        <div id="timetable-modal-body" class="min-h-[220px] flex flex-col justify-between">
          ${this.getTabHTML()}
        </div>

      </div>
    `);
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  getTabHTML() {
    switch (this.currentTab) {
      case "demo":
        return `
          <div class="flex flex-col gap-3 py-1">
            <div class="p-3.5 bg-[#F0FDF4] border-2 border-emerald-600 rounded-lg flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <strong class="font-headline text-sm font-bold text-emerald-950">AI & Data Science (Sem 6) Real Demo</strong>
                <span class="bw-badge bw-badge-safe text-[10px]">Ready to Run</span>
              </div>
              <p class="text-xs text-emerald-800 leading-snug">
                Preloaded with 12 actual engineering subjects, realistic attendance tallies (64.96% overall), and a full weekly schedule. Perfect to test BunkWise features right away.
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-emerald-900 font-bold">
                <div class="bg-white/70 p-1.5 rounded border border-emerald-200">• Deep Learning</div>
                <div class="bg-white/70 p-1.5 rounded border border-emerald-200">• Prompt Engg</div>
                <div class="bg-white/70 p-1.5 rounded border border-emerald-200">• Computational Data</div>
                <div class="bg-white/70 p-1.5 rounded border border-emerald-200">• Coursera Track 4 & 5</div>
                <div class="bg-white/70 p-1.5 rounded border border-emerald-200">• Design Thinking</div>
                <div class="bg-white/70 p-1.5 rounded border border-emerald-200">• PLCM & Labs</div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-200">
              <button onclick="TimetableModal.loadBlank()" class="text-slate-500 hover:text-red-600 font-bold underline text-xs">
                Or start with completely empty schedule
              </button>
              <button onclick="TimetableModal.loadDemo()" class="bw-btn bw-btn-primary text-xs w-full sm:w-auto py-2.5 px-4 shadow-[2px_2px_0px_#18181B]">
                ${PixelIcon.get('refresh')}
                <span>Load Demo Timetable</span>
              </button>
            </div>
          </div>
        `;

      case "file":
        return `
          <div class="flex flex-col gap-3 py-1">
            <p class="text-xs text-slate-600">
              Upload a <strong>.JSON</strong> backup file or a <strong>.CSV</strong> timetable file exported from Excel, Sheets, or another calendar:
            </p>

            <div 
              class="border-2 border-dashed border-slate-400 hover:border-black rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all"
              onclick="document.getElementById('modal-timetable-file-input').click()"
            >
              <div class="text-slate-700">${PixelIcon.get('upload')}</div>
              <strong class="text-xs text-slate-800">Click to choose .JSON or .CSV file</strong>
              <span class="text-[11px] text-slate-500">Supports full BunkWise backups and custom CSV schedules</span>
              <input 
                type="file" 
                id="modal-timetable-file-input" 
                accept=".json,.csv" 
                class="hidden" 
                onchange="TimetableModal.handleFileUpload(event)"
              >
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <button onclick="TimetableModal.downloadSampleCSV()" class="bw-btn text-xs py-1 px-2.5">
                ${PixelIcon.get('download')}
                <span>Download Sample CSV Template</span>
              </button>
              <span class="text-[11px] text-slate-400">Comma-separated</span>
            </div>
          </div>
        `;

      case "paste":
        return `
          <div class="flex flex-col gap-2 py-1">
            <div class="flex items-center justify-between">
              <label class="font-bold text-slate-700">Paste CSV or Tab-Separated Timetable:</label>
              <button onclick="TimetableModal.pasteSample()" class="text-xs text-emerald-800 font-bold underline">
                Fill Sample Data
              </button>
            </div>
            
            <textarea 
              id="modal-csv-textarea" 
              rows="6" 
              class="w-full p-2.5 border border-[#18181B] rounded font-mono text-[11px] bg-slate-50 focus:bg-white"
              placeholder="Day,StartTime,EndTime,SubjectCode,SubjectName,Type,Faculty,Room&#10;Monday,09:00,10:00,CS301,Data Structures,theory,Dr. Alan Turing,Hall-A&#10;Monday,10:00,11:00,CS302,Operating Systems,theory,Prof. Linus,Hall-B"
            ></textarea>

            <div class="flex items-center justify-between pt-2 border-t border-slate-200">
              <button onclick="TimetableModal.downloadSampleCSV()" class="text-xs text-slate-600 underline font-bold">
                Download CSV Template
              </button>
              <button onclick="TimetableModal.processPastedCSV()" class="bw-btn bw-btn-primary text-xs py-2 px-3">
                ${PixelIcon.get('check')}
                <span>Import Schedule</span>
              </button>
            </div>
          </div>
        `;

      case "ocr":
        return `
          <div class="flex flex-col gap-3 py-1">
            <p class="text-xs text-slate-600">
              Take or select a photo of your printed college timetable. Our OCR engine parses days, slots, and subject codes.
            </p>

            <div 
              class="border-2 border-dashed border-slate-400 hover:border-black rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all"
              onclick="document.getElementById('modal-ocr-input').click()"
            >
              <div class="text-slate-700">${PixelIcon.get('camera')}</div>
              <strong class="text-xs text-slate-800">Select Timetable Photo (JPG, PNG)</strong>
              <span class="text-[11px] text-slate-500">Fast client-side vision & layout parser</span>
              <input 
                type="file" 
                id="modal-ocr-input" 
                accept="image/*" 
                class="hidden" 
                onchange="TimetableModal.handleOCRUpload(event)"
              >
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <button onclick="TimetableModal.runDemoOCR()" class="bw-btn bw-btn-accent text-xs">
                ${PixelIcon.get('dice')} Run Instant Test Photo
              </button>
              <span class="text-[11px] text-slate-400">Verification modal before saving</span>
            </div>
          </div>
        `;
    }
  },

  loadDemo() {
    App.state = StorageManager.resetToDemo();
    Modal.close();
    App.showToast("Student Demo Timetable loaded (64.96% overall).");
    App.renderCurrentView();
  },

  loadBlank() {
    if (!confirm("Start with an empty schedule? All current data will be cleared.")) return;
    App.state = StorageManager.clearAll();
    Modal.close();
    App.showToast("Started blank timetable. Add your subjects in the Attendance tab.");
    App.renderCurrentView();
  },

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;

      if (file.name.endsWith(".csv") || content.includes(",") && !content.trim().startsWith("{")) {
        // CSV Timetable import
        const res = StorageManager.importTimetableFromCSV(content);
        if (res.success) {
          App.state.timetable = res.timetable;
          App.state.subjects = res.subjects;
          Modal.close();
          App.showToast(`Imported ${res.count} classes across ${res.subjectsCount} subjects from CSV.`);
          App.renderCurrentView();
        } else {
          App.showToast("CSV Import error: " + res.error);
        }
      } else {
        // JSON Backup import
        const res = StorageManager.importData(content);
        if (res.success) {
          App.state = res.data;
          Modal.close();
          App.showToast("JSON backup imported successfully.");
          App.renderCurrentView();
        } else {
          App.showToast("JSON Import error: " + res.error);
        }
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  },

  processPastedCSV() {
    const textarea = document.getElementById("modal-csv-textarea");
    if (!textarea) return;
    const content = textarea.value.trim();
    if (!content) {
      App.showToast("Please paste CSV data first.");
      return;
    }

    const res = StorageManager.importTimetableFromCSV(content);
    if (res.success) {
      App.state.timetable = res.timetable;
      App.state.subjects = res.subjects;
      Modal.close();
      App.showToast(`Imported ${res.count} classes across ${res.subjectsCount} subjects!`);
      App.renderCurrentView();
    } else {
      App.showToast("CSV Error: " + res.error);
    }
  },

  pasteSample() {
    const textarea = document.getElementById("modal-csv-textarea");
    if (textarea) {
      textarea.value = StorageManager.getSampleCSVTemplate();
    }
  },

  downloadSampleCSV() {
    const template = StorageManager.getSampleCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bunkwise_timetable_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    App.showToast("Downloaded sample timetable CSV template.");
  },

  handleOCRUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    Modal.close();
    TimetableView.processOCRFile(file);
  },

  runDemoOCR() {
    Modal.close();
    TimetableView.runDemoOCR();
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.TimetableModal = TimetableModal;
}
