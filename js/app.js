/**
 * BunkWise - Main Application Orchestrator & State Coordinator
 */

const App = {
  currentTab: "dashboard",
  state: null,

  init() {
    this.state = StorageManager.init();
    this.setupNavigation();
    this.renderCurrentView();
  },

  setupNavigation() {
    document.querySelectorAll("[data-nav-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = btn.getAttribute("data-nav-tab");
        this.navigateTo(tab);
      });
    });

    document.querySelectorAll("[data-mobile-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = btn.getAttribute("data-mobile-tab");
        this.navigateTo(tab);
      });
    });
  },

  navigateTo(tabName) {
    this.currentTab = tabName;
    this.updateNavUI();
    this.renderCurrentView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  updateNavUI() {
    document.querySelectorAll("[data-nav-tab]").forEach(btn => {
      const tab = btn.getAttribute("data-nav-tab");
      if (tab === this.currentTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    document.querySelectorAll("[data-mobile-tab]").forEach(btn => {
      const tab = btn.getAttribute("data-mobile-tab");
      if (tab === this.currentTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    this.updateHeaderBadge();
  },

  updateHeaderBadge() {
    const badgeEl = document.getElementById("header-pulse-badge");
    if (!badgeEl || !this.state) return;

    const target = this.state.settings.targetAttendance || 75;
    const overall = BunkEngine.calculateOverallStats(this.state.subjects, target);

    let vibeText = "Below Cutoff";
    let bgClass = "bg-[#FEF2F2]";
    let textClass = "text-red-700";

    if (overall.percentage >= target) {
      vibeText = "Above Cutoff";
      bgClass = "bg-[#F0FDF4]";
      textClass = "text-emerald-800";
    }

    badgeEl.className = `hidden sm:flex items-center gap-2 px-2.5 py-1 ${bgClass} border border-slate-300 rounded shadow-[1px_1px_0px_#18181B]`;
    badgeEl.innerHTML = `
      <span class="w-2 h-2 rounded-full ${overall.percentage >= target ? 'bg-emerald-600' : 'bg-red-600'}"></span>
      <span class="text-xs font-bold ${textClass} tracking-tight">Attendance: ${overall.percentage}% (${vibeText})</span>
    `;
  },

  renderCurrentView() {
    const container = document.getElementById("app-main-content");
    if (!container) return;

    this.updateHeaderBadge();

    switch (this.currentTab) {
      case "dashboard":
        DashboardView.render(container, this.state);
        break;
      case "timetable":
        TimetableView.render(container, this.state);
        break;
      case "attendance":
        AttendanceView.render(container, this.state);
        break;
      case "planner":
        PlannerView.render(container, this.state);
        break;
      case "settings":
        SettingsView.render(container, this.state);
        break;
      default:
        DashboardView.render(container, this.state);
    }
  },

  undoLastAction() {
    const result = StorageManager.undoLastHistoryEntry(this.state.subjects);
    if (result) {
      this.showToast(`Reverted attendance log for ${result.revertedEntry.subjectCode}.`);
      this.renderCurrentView();
    } else {
      this.showToast("No recent actions to undo.");
    }
  },

  showToast(message, duration = 3000) {
    let toast = document.getElementById("global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "global-toast";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="flex items-center justify-between gap-3 w-full">
        <div class="flex-1">${message}</div>
        <button onclick="document.getElementById('global-toast').classList.remove('show')" class="text-xs font-bold hover:text-red-500">✕</button>
      </div>
    `;
    toast.classList.add("show");

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }
};

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// Export to window
if (typeof window !== "undefined") {
  window.App = App;
}
