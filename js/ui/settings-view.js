/**
 * BunkWise - Clean Settings & Data Vault View
 */

const SettingsView = {
  render(container, state) {
    const { settings } = state;
    const currentTarget = settings.targetAttendance || 75;
    const quota = OCRService.checkQuota();

    container.innerHTML = `
      <div class="flex flex-col gap-5 max-w-4xl mx-auto pb-12">
        
        <!-- Header -->
        <div class="bw-card p-5 bg-white flex items-center justify-between">
          <div>
            <h2 class="font-headline text-2xl font-bold text-[#18181B]">Settings & Vault</h2>
            <span class="text-xs text-slate-500 font-bold">100% Client-Side Privacy. Stored in your browser LocalStorage.</span>
          </div>
          <span class="bw-badge bg-slate-100 text-slate-700">
            LOCAL DATA
          </span>
        </div>

        <!-- 1. Attendance Target Threshold -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 class="font-headline text-base font-bold text-[#18181B]">Attendance Requirement Cutoff</h3>
              <p class="text-xs text-slate-500">Minimum attendance percentage required to sit for semester examinations.</p>
            </div>
            <span id="settings-target-header-val" class="font-headline text-2xl font-bold text-slate-800">
              ${currentTarget}%
            </span>
          </div>

          <!-- Preset Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            ${[60, 65, 70, 75, 80, 85, 90].map(val => `
              <button 
                onclick="SettingsView.updateTarget(${val})" 
                class="px-3 py-1.5 text-xs font-bold rounded border transition-all ${
                  currentTarget === val 
                    ? 'bg-[#18181B] text-white border-[#18181B] shadow-[1px_1px_0px_#18181B]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }"
              >
                ${val}% ${val === 75 ? '(Default)' : ''}
              </button>
            `).join("")}
          </div>

          <!-- Custom Slider -->
          <div class="flex items-center gap-3 pt-1">
            <input 
              type="range" 
              min="50" 
              max="95" 
              value="${currentTarget}" 
              id="settings-target-slider"
              oninput="SettingsView.previewTarget(parseInt(this.value, 10))" 
              onchange="SettingsView.updateTarget(parseInt(this.value, 10))" 
              class="w-full accent-slate-800 cursor-pointer"
            >
            <span id="target-slider-display" class="text-xs font-bold text-slate-700 w-10 text-right">${currentTarget}%</span>
          </div>
        </div>

        <!-- 2. OCR Timetable API & Rate Limit Guard -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 class="font-headline text-base font-bold text-[#18181B]">Timetable OCR & Rate Limiter</h3>
              <p class="text-xs text-slate-500">OCR image extraction demo safeguard.</p>
            </div>
            <span class="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              ${quota.used} / ${quota.max} USED
            </span>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex flex-col gap-2">
            <div class="flex justify-between font-bold text-slate-700">
              <span>Demo Quota:</span>
              <span class="${quota.exceeded ? 'text-red-600' : 'text-emerald-700'}">
                ${quota.remaining} remaining
              </span>
            </div>
            <div class="w-full h-2 bg-slate-200 rounded overflow-hidden">
              <div class="h-full bg-slate-700" style="width: ${(quota.used / quota.max) * 100}%;"></div>
            </div>
            <span class="text-[11px] text-slate-500">
              Safe limit ensures the demo does not exhaust API limits on Vercel deployment.
            </span>
          </div>

          <div class="flex flex-col gap-1.5 text-xs">
            <label class="font-bold text-slate-700">
              Optional Hugging Face Token:
            </label>
            <div class="flex gap-2">
              <input 
                type="password" 
                id="hf-token-input" 
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxx" 
                value="${settings.hfToken || ''}"
                class="flex-1 p-2 border border-slate-300 rounded font-mono text-xs"
              >
              <button onclick="SettingsView.saveHfToken()" class="bw-btn bw-btn-primary text-xs">
                Save
              </button>
            </div>
            <span class="text-[11px] text-slate-400">
              Stored locally in this browser only.
            </span>
          </div>
        </div>

        <!-- 3. Backup, Restore & Reset -->
        <div class="bw-card p-5 bg-white flex flex-col gap-4">
          <div class="pb-2 border-b border-slate-100">
            <h3 class="font-headline text-base font-bold text-[#18181B]">Data Vault</h3>
            <p class="text-xs text-slate-500">Export or restore your schedule and attendance records.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onclick="StorageManager.exportData()" class="bw-btn text-xs py-2.5 flex items-center justify-center gap-1.5">
              ${PixelIcon.get('download')}
              <span>Export Backup (.JSON)</span>
            </button>

            <button onclick="document.getElementById('import-file-input').click()" class="bw-btn text-xs py-2.5 flex items-center justify-center gap-1.5">
              ${PixelIcon.get('upload')}
              <span>Import Backup (.JSON)</span>
            </button>
            <input type="file" id="import-file-input" accept=".json" class="hidden" onchange="SettingsView.handleImportFile(event)">
          </div>

          <div class="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button onclick="SettingsView.resetToStudentDemo()" class="bw-btn bw-btn-accent text-xs py-2 w-full sm:w-auto">
              ${PixelIcon.get('refresh')}
              <span>Reset to Real Demo Dataset</span>
            </button>

            <button onclick="SettingsView.clearAllData()" class="text-xs text-red-600 hover:underline py-1">
              Clear All Data (Empty Slate)
            </button>
          </div>
        </div>

      </div>
    `;
  },

  previewTarget(val) {
    const display = document.getElementById("target-slider-display");
    if (display) display.innerText = `${val}%`;
    const headerDisplay = document.querySelector("#settings-target-header-val");
    if (headerDisplay) headerDisplay.innerText = `${val}%`;
  },

  updateTarget(newVal) {
    const val = Math.max(50, Math.min(99, newVal));
    App.state.settings.targetAttendance = val;
    StorageManager.saveSettings(App.state.settings);
    App.showToast(`Attendance target updated to ${val}%.`);
    App.renderCurrentView();
  },

  saveHfToken() {
    const input = document.getElementById("hf-token-input");
    if (!input) return;
    const token = input.value.trim();
    App.state.settings.hfToken = token;
    StorageManager.saveSettings(App.state.settings);
    App.showToast("Hugging Face token saved locally.");
  },

  resetToStudentDemo() {
    if (!confirm("Reset back to the demo dataset (64.96% overall)?")) return;
    App.state = StorageManager.resetToDemo();
    App.showToast("Demo data reloaded.");
    App.renderCurrentView();
  },

  clearAllData() {
    if (!confirm("Are you sure you want to clear all data? This will wipe your subjects and timetable.")) return;
    App.state = StorageManager.clearAll();
    App.showToast("Local data cleared.");
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
        App.showToast("Backup imported successfully.");
        App.renderCurrentView();
      } else {
        App.showToast("Import failed: " + res.error);
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input so same file can be reselected
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.SettingsView = SettingsView;
}
