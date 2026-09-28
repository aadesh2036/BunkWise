/**
 * BunkWise - Settings & Data Vault View
 */

const SettingsView = {
  render(container, state) {
    const { settings, subjects, timetable } = state;
    const currentTarget = settings.targetAttendance || 75;
    const quota = OCRService.checkQuota();

    container.innerHTML = `
      <div class="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="bw-card p-5 bg-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">⚙️</span>
            <div>
              <h2 class="font-headline text-2xl font-bold text-[#18181B]">Settings & Data Vault</h2>
              <span class="text-xs text-slate-500 font-bold">100% Client-Side Privacy. Stored in your browser.</span>
            </div>
          </div>
          <span class="bw-badge bg-emerald-100 text-emerald-800">
            LOCAL STORAGE VAULT
          </span>
        </div>

        <!-- 1. Attendance Target Threshold (PRD Section 6 & 27) -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 class="font-headline text-base font-bold text-[#18181B]">Attendance Requirement Threshold</h3>
              <p class="text-xs text-slate-600">The minimum attendance percentage required by your college regulations.</p>
            </div>
            <span class="font-headline text-2xl font-bold text-emerald-700">
              ${currentTarget}%
            </span>
          </div>

          <!-- Preset Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            {[60, 65, 70, 75, 80, 85, 90].map(val => `
              <button 
                onclick="SettingsView.updateTarget(${val})" 
                class="px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-[#18181B] transition-all ${
                  currentTarget === val 
                    ? 'bg-primary-container text-on-primary-container shadow-[2px_2px_0px_#18181B]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700'
                }"
              >
                ${val}% ${val === 75 ? '(Default)' : ''}
              </button>
            `).join("")}
          </div>

          <!-- Custom Target Slider -->
          <div class="flex items-center gap-4 pt-2">
            <input 
              type="range" 
              min="50" 
              max="95" 
              value="${currentTarget}" 
              oninput="SettingsView.updateTarget(parseInt(this.value, 10))" 
              class="w-full accent-emerald-600 cursor-pointer"
            >
            <span class="text-xs font-bold w-12 text-right">${currentTarget}%</span>
          </div>
        </div>

        <!-- 2. Hugging Face AI Configuration & Rate Limiter Safeguard -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 class="font-headline text-base font-bold text-[#18181B]">AI Vision Engine & Rate Limiter</h3>
              <p class="text-xs text-slate-600">Hugging Face timetable image OCR configuration and quota safeguard.</p>
            </div>
            <span class="bw-badge bg-amber-100 text-amber-900">
              ${quota.used} / ${quota.max} USED
            </span>
          </div>

          <div class="p-3 bg-slate-50 border border-[#18181B] rounded-lg text-xs flex flex-col gap-2">
            <div class="flex justify-between font-bold">
              <span>Demo Quota Guard (100 Requests):</span>
              <span class="${quota.exceeded ? 'text-red-600' : 'text-emerald-700'}">
                ${quota.remaining} remaining
              </span>
            </div>
            <div class="w-full h-2.5 bg-slate-200 rounded border border-[#18181B] overflow-hidden">
              <div class="h-full bg-emerald-500" style="width: ${(quota.used / quota.max) * 100}%;"></div>
            </div>
            <span class="text-[11px] text-slate-500">
              This safeguard ensures the demo will not deplete any developer Hugging Face account limits.
            </span>
          </div>

          <div class="flex flex-col gap-1.5 text-xs">
            <label class="font-bold text-slate-800">
              Personal Hugging Face Token (Optional):
            </label>
            <div class="flex gap-2">
              <input 
                type="password" 
                id="hf-token-input" 
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxx" 
                value="${settings.hfToken || ''}"
                class="flex-1 p-2 border-2 border-[#18181B] rounded font-mono text-xs"
              >
              <button onclick="SettingsView.saveHfToken()" class="bw-btn bw-btn-primary text-xs">
                Save Token
              </button>
            </div>
            <span class="text-[11px] text-slate-500">
              Your token stays strictly inside your browser's LocalStorage. It is never transmitted to any external server.
            </span>
          </div>
        </div>

        <!-- 3. Backup, Restore & Reset to Real Demo Dataset (PRD Section 29) -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="pb-2 border-b border-slate-200">
            <h3 class="font-headline text-base font-bold text-[#18181B]">Data Management & Backup</h3>
            <p class="text-xs text-slate-600">Export your schedule and attendance to JSON, or restore at any time.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onclick="StorageManager.exportData()" class="bw-btn text-xs py-3 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[18px]">download</span>
              <span>Export Backup (.JSON)</span>
            </button>

            <button onclick="document.getElementById('import-file-input').click()" class="bw-btn text-xs py-3 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[18px]">upload</span>
              <span>Import Backup (.JSON)</span>
            </button>
            <input type="file" id="import-file-input" accept=".json" class="hidden" onchange="SettingsView.handleImportFile(event)">
          </div>

          <div class="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button onclick="SettingsView.resetToStudentDemo()" class="bw-btn bw-btn-accent text-xs py-2.5 w-full sm:w-auto">
              🔄 Reset to Real Student Demo Data
            </button>

            <button onclick="SettingsView.clearAllData()" class="bw-btn text-xs text-red-600 hover:bg-red-50 border-red-600 py-2.5 w-full sm:w-auto">
              ⚠️ Wipe All Data (Empty Slate)
            </button>
          </div>
        </div>

        <!-- College Bylaw Disclaimer -->
        <div class="p-4 bg-slate-100 border-2 border-[#18181B] rounded-xl text-xs text-slate-600 flex items-start gap-3">
          <span class="material-symbols-outlined text-slate-700 text-xl">gavel</span>
          <div>
            <strong class="text-slate-800 block">Academic Integrity Notice:</strong>
            BunkWise is a mathematical decision engine designed to help students track and safeguard their academic standing. It strictly performs algebraic simulations and never submits false proxies or automates attendance.
          </div>
        </div>

      </div>
    `;
  },

  updateTarget(newVal) {
    App.state.settings.targetAttendance = newVal;
    StorageManager.saveSettings(App.state.settings);
    App.showToast(`🎯 Attendance requirement updated to <strong>${newVal}%</strong>`);
    App.renderCurrentView();
  },

  saveHfToken() {
    const input = document.getElementById("hf-token-input");
    if (!input) return;
    const token = input.value.trim();
    App.state.settings.hfToken = token;
    StorageManager.saveSettings(App.state.settings);
    App.showToast("🔑 Hugging Face token saved locally.");
  },

  resetToStudentDemo() {
    if (!confirm("Reset all subjects and timetable back to the real student dataset (64.96% overall)?")) return;
    App.state = StorageManager.resetToDemo();
    App.showToast("🎉 State restored to student's real college attendance & timetable.");
    App.renderCurrentView();
  },

  clearAllData() {
    if (!confirm("Are you sure you want to erase all data? This cannot be undone.")) return;
    App.state = StorageManager.clearAll();
    App.showToast("🧹 All local storage records wiped.");
    App.renderCurrentView();
  },

  handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;
      const res = StorageManager.importData(content);
      if (res.success) {
        App.state = res.data;
        App.showToast("✅ Backup successfully imported!");
        App.renderCurrentView();
      } else {
        alert("Import failed: " + res.error);
      }
    };
    reader.readAsText(file);
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.SettingsView = SettingsView;
}
