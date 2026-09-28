/**
 * BunkWise - Main Application Orchestrator & State Coordinator
 */

const App = {
  currentTab: "dashboard",
  state: null,

  init() {
    // 1. Initialize persistent state from LocalStorage or seed with student demo data
    this.state = StorageManager.init();

    // 2. Setup navigation listeners
    this.setupNavigation();

    // 3. Render current tab view
    this.renderCurrentView();

    console.log("⚡ BunkWise v1.0 initialized successfully. State:", this.state);
  },

  setupNavigation() {
    // Desktop Nav tabs
    document.querySelectorAll("[data-nav-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = btn.getAttribute("data-nav-tab");
        this.navigateTo(tab);
      });
    });

    // Mobile bottom tabs
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
    // Update desktop tabs
    document.querySelectorAll("[data-nav-tab]").forEach(btn => {
      const tab = btn.getAttribute("data-nav-tab");
      if (tab === this.currentTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update mobile bottom tabs
    document.querySelectorAll("[data-mobile-tab]").forEach(btn => {
      const tab = btn.getAttribute("data-mobile-tab");
      if (tab === this.currentTab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update header live pulse badge
    this.updateHeaderBadge();
  },

  updateHeaderBadge() {
    const badgeEl = document.getElementById("header-pulse-badge");
    if (!badgeEl || !this.state) return;

    const target = this.state.settings.targetAttendance || 75;
    const overall = BunkEngine.calculateOverallStats(this.state.subjects, target);

    let vibeText = "Panic Mode 🙀";
    let bgClass = "bg-[#FEECEE]";
    let textClass = "text-error";

    if (overall.percentage >= 80) {
      vibeText = "Cruising 😼";
      bgClass = "bg-[#E8F8F2]";
      textClass = "text-emerald-700";
    } else if (overall.percentage >= target) {
      vibeText = "Safe Zone 🛡️";
      bgClass = "bg-[#E8F8F2]";
      textClass = "text-emerald-700";
    } else if (overall.percentage >= target - 5) {
      vibeText = "Sweating 😰";
      bgClass = "bg-[#FFFBEA]";
      textClass = "text-amber-700";
    }

    badgeEl.className = `hidden sm:flex items-center gap-1.5 px-2.5 py-1 ${bgClass} border-2 border-[#18181B] rounded shadow-[2px_2px_0px_#18181B]`;
    badgeEl.innerHTML = `
      <span class="w-2 h-2 rounded-full ${overall.percentage >= target ? 'bg-emerald-600' : 'bg-red-600 animate-pulse'}"></span>
      <span class="font-label-code text-xs font-bold ${textClass} tracking-tight">Attendance: ${overall.percentage}% (${vibeText})</span>
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
      const sub = result.updatedSubject;
      this.showToast(`↩️ Reverted last attendance log for <strong>${result.revertedEntry.subjectCode}</strong>.`);
      this.renderCurrentView();
    } else {
      this.showToast("No recent actions to undo.");
    }
  },

  showToast(message, duration = 3500) {
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

// Bootstrap on window load
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

// Export to window
if (typeof window !== "undefined") {
  window.App = App;
}
