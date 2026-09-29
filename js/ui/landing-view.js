/**
 * BunkWise - Beautiful Landing Page View
 * High-impact, neo-brutalist student aesthetic with reactive pixelated hero component,
 * interactive mini-simulator, feature highlights, and clear onboarding dialogues.
 * ZERO GRADIENTS — 100% solid, crisp retro colors.
 */

const LandingView = {
  // Live interactive simulator state for landing page visitors
  simState: {
    attended: 15,
    conducted: 31,
    target: 75
  },

  pixelCanvasAnimId: null,

  render(container) {
    // Clean up any existing canvas animation loop
    this.cleanupPixelCanvas();

    const { attended, conducted, target } = this.simState;
    const currentPct = BunkEngine.calculatePercentage(attended, conducted);
    const allowance = BunkEngine.calculateSkipAllowance(attended, conducted, target);
    const recovery = BunkEngine.classesNeededToRecover(attended, conducted, target);

    container.innerHTML = `
      <div class="flex flex-col gap-10 sm:gap-14 max-w-5xl mx-auto pb-20 px-2 sm:px-0">
        
        <!-- HERO SECTION -->
        <section class="flex flex-col items-center text-center pt-2 sm:pt-6 gap-4 sm:gap-6">
          
          <!-- Trust Pill -->
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#18181B] rounded-full shadow-[2px_2px_0px_#18181B] text-[11px] font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Client-Side Privacy • Zero Database Required</span>
          </div>

          <!-- Headline 1 -->
          <h1 class="font-headline text-3xl sm:text-5xl md:text-6xl font-black text-[#18181B] tracking-tight leading-[1.08]">
            Know your attendance.
          </h1>

          <!-- REACTIVE PIXELATED HERO COMPONENT (shadcn/retro-inspired, zero gradient) -->
          <div id="pixel-hero-container" class="relative w-full max-w-3xl my-1 p-5 sm:p-7 bg-[#F4F4F0] border-2 border-[#18181B] rounded-xl shadow-[5px_5px_0px_#18181B] overflow-hidden select-none cursor-crosshair">
            
            <!-- Interactive Pixel Canvas Grid (Reactive to cursor & touch) -->
            <canvas id="hero-pixel-canvas" class="absolute inset-0 w-full h-full"></canvas>

            <!-- Foreground Hero Content -->
            <div class="relative z-10 pointer-events-none flex flex-col items-center gap-2.5">
              

              <!-- Solid Retro Ink Hero Banner (No Gradients) -->
              <div class="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#18181B] border-2 border-[#18181B] rounded-lg shadow-[4px_4px_0px_#0F766E] transition-transform">
                <span class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#10B981] inline-block animate-pulse"></span>
                <span class="font-mono text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#A7F3D0]">
                  KNOW YOUR FREEDOM
                </span>
                <span class="font-mono text-2xl sm:text-4xl text-white font-bold animate-pulse">_</span>
              </div>

              <div class="flex items-center gap-2 text-[11px] sm:text-xs text-slate-700 font-bold bg-white/90 px-3 py-1 rounded border border-slate-300 mt-1 shadow-sm">
                <span class="text-emerald-800">75% Exam Math</span>
                <span class="text-slate-400">•</span>
                <span class="text-slate-800">Deterministic Engine</span>
                <span class="text-slate-400">•</span>
                <span class="text-amber-800">Safe Bunk Cushion</span>
              </div>

            </div>
          </div>

          <p class="text-xs sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            The brutally honest attendance decision engine built for college students. Never guess your 75% cutoff or face exam debarment again.
          </p>

          <!-- Call to Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto pt-1">
            <button 
              onclick="App.navigateTo('dashboard')" 
              class="bw-btn bw-btn-primary text-sm sm:text-base py-3 px-6 w-full sm:w-auto shadow-[3px_3px_0px_#18181B] hover:shadow-[4px_4px_0px_#18181B]"
            >
              ${PixelIcon.get('cat')}
              <span>Launch App (Try Demo)</span>
            </button>
            
            <button 
              onclick="App.openTimetableModal()" 
              class="bw-btn text-sm sm:text-base py-3 px-6 w-full sm:w-auto bg-white hover:bg-slate-50 shadow-[3px_3px_0px_#18181B]"
            >
              ${PixelIcon.get('upload')}
              <span>Upload My Timetable</span>
            </button>
          </div>

          <!-- Subtle Stats Badge Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full pt-4 text-left">
            <div class="p-3 bg-white border-2 border-[#18181B] rounded-lg shadow-[2px_2px_0px_#18181B]">
              <span class="text-[10px] font-bold uppercase text-slate-400 block">Math Accuracy</span>
              <strong class="font-headline text-lg sm:text-xl font-black text-slate-900">100% Integer</strong>
              <span class="text-[10px] text-slate-500 block">0% AI Hallucination</span>
            </div>
            <div class="p-3 bg-white border-2 border-[#18181B] rounded-lg shadow-[2px_2px_0px_#18181B]">
              <span class="text-[10px] font-bold uppercase text-slate-400 block">Queue Logic</span>
              <strong class="font-headline text-lg sm:text-xl font-black text-slate-900">Active Queue</strong>
              <span class="text-[10px] text-slate-500 block">Cards clear when marked</span>
            </div>
            <div class="p-3 bg-white border-2 border-[#18181B] rounded-lg shadow-[2px_2px_0px_#18181B]">
              <span class="text-[10px] font-bold uppercase text-slate-400 block">Storage Lock-in</span>
              <strong class="font-headline text-lg sm:text-xl font-black text-emerald-700">Zero Server</strong>
              <span class="text-[10px] text-slate-500 block">100% in your browser</span>
            </div>
            <div class="p-3 bg-white border-2 border-[#18181B] rounded-lg shadow-[2px_2px_0px_#18181B]">
              <span class="text-[10px] font-bold uppercase text-slate-400 block">Timetable Setup</span>
              <strong class="font-headline text-lg sm:text-xl font-black text-slate-900">OCR / CSV / Demo</strong>
              <span class="text-[10px] text-slate-500 block">Import in seconds</span>
            </div>
          </div>
        </section>

        <!-- INTERACTIVE LIVE SIMULATOR SHOWCASE -->
        <section class="bw-card p-5 sm:p-7 bg-white border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#18181B]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Interactive Teaser</span>
              <h2 class="font-headline text-xl sm:text-2xl font-bold text-[#18181B]">
                Experience BunkWise Decision Math
              </h2>
            </div>
            <span class="bw-badge bw-badge-danger self-start sm:self-center py-1 px-2.5">
              ${PixelIcon.get('fire')} Critical Deficit Scenario
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            
            <!-- Subject Card -->
            <div class="p-4 bg-slate-50 border-2 border-[#18181B] rounded-lg flex flex-col justify-between gap-3">
              <div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-bold px-2 py-0.5 bg-white border border-[#18181B] rounded">DS3201</span>
                  <span class="text-xs font-bold text-slate-500">1:00 PM – 2:00 PM • Room D208</span>
                </div>
                <h3 class="font-headline text-lg font-bold text-slate-900 mt-2">
                  Deep Learning (Theory)
                </h3>
                <span class="text-xs text-slate-500 block">Faculty: Mrs. Dhammjyoti Dhawase</span>
              </div>

              <!-- Interactive Outcome Preview -->
              <div class="p-3 bg-white border border-slate-300 rounded flex flex-col gap-1 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 font-bold">Current Standing:</span>
                  <strong class="font-headline text-lg font-black text-red-600" id="landing-sim-pct">${currentPct}%</strong>
                </div>
                <div class="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Attended: <strong id="landing-sim-att">${attended}</strong> / <strong id="landing-sim-cond">${conducted}</strong> conducted</span>
                  <span>Target: <strong>${target}%</strong></span>
                </div>
              </div>

              <!-- Interactive Buttons -->
              <div class="flex items-center gap-2 pt-1">
                <button 
                  onclick="LandingView.stepSim(true)" 
                  class="bw-btn bw-btn-primary text-xs flex-1 py-2.5"
                  title="Simulate showing up"
                >
                  ${PixelIcon.get('check')}
                  <span>I Showed Up (+1)</span>
                </button>
                <button 
                  onclick="LandingView.stepSim(false)" 
                  class="bw-btn bw-btn-danger text-xs flex-1 py-2.5"
                  title="Simulate skipping"
                >
                  ${PixelIcon.get('skull')}
                  <span>I Slept In (Bunk)</span>
                </button>
              </div>
            </div>

            <!-- BunkCat Mathematical Reaction -->
            <div class="flex flex-col justify-between p-4 bg-[#FEF08A]/40 border-2 border-[#18181B] rounded-lg gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded bg-[#FEF08A] border border-[#18181B] flex items-center justify-center">${PixelIcon.get('cat')}</span>
                  <strong class="font-headline text-sm font-bold text-slate-900">Deterministic Diagnosis</strong>
                </div>
                
                <p class="text-xs text-slate-800 italic mt-3 leading-relaxed" id="landing-sim-humor">
                  ${currentPct < target 
                    ? `“You are currently in the academic emergency ward (${currentPct}%). You need <strong>${recovery} unbroken attendances</strong> without batting an eyelid to pull this back above 75%.”` 
                    : `“You made it to the safe zone (${currentPct}%)! You now have <strong>${allowance} safe bunk token(s)</strong> available.”`}
                </p>
              </div>

              <div class="p-3 bg-white/80 border border-slate-300 rounded text-xs flex items-center justify-between">
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400 block">Redemption Goal</span>
                  <strong class="text-red-700 font-bold" id="landing-sim-recovery">${recovery > 0 ? `+${recovery} consecutive classes` : 'Zero (Safe)'}</strong>
                </div>
                <button onclick="LandingView.resetSim()" class="text-xs font-bold text-slate-500 hover:text-black underline">
                  Reset Teaser
                </button>
              </div>
            </div>

          </div>
        </section>

        <!-- THE FOUR CORE PILLARS (FEATURES GRID) -->
        <section class="flex flex-col gap-6">
          <div class="text-center">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Why BunkWise Exists</span>
            <h2 class="font-headline text-2xl sm:text-3xl font-black text-[#18181B] mt-1">
              Built by Students, for Students
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Pillar 1 -->
            <div class="bw-card p-5 bg-white flex flex-col justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded bg-emerald-100 border-2 border-[#18181B] flex items-center justify-center flex-shrink-0 text-emerald-800 shadow-[2px_2px_0px_#18181B]">
                  ${PixelIcon.get('chart')}
                </div>
                <div>
                  <h3 class="font-headline text-base font-bold text-slate-900">Deterministic Math Engine</h3>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    No guesswork or vague percentages. BunkWise computes the exact mathematical skip allowance and unbroken recovery streaks required to stay above examination cutoffs.
                  </p>
                </div>
              </div>
            </div>

            <!-- Pillar 2 -->
            <div class="bw-card p-5 bg-white flex flex-col justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded bg-yellow-100 border-2 border-[#18181B] flex items-center justify-center flex-shrink-0 text-amber-800 shadow-[2px_2px_0px_#18181B]">
                  ${PixelIcon.get('check')}
                </div>
                <div>
                  <h3 class="font-headline text-base font-bold text-slate-900">1-Tap Decision Queue</h3>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    Scheduled classes for today appear in a clean decision queue. Once you mark "Showed Up" or "Slept In", the card clears from the queue with multi-click lock and instant undo.
                  </p>
                </div>
              </div>
            </div>

            <!-- Pillar 3 -->
            <div class="bw-card p-5 bg-white flex flex-col justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded bg-blue-100 border-2 border-[#18181B] flex items-center justify-center flex-shrink-0 text-blue-800 shadow-[2px_2px_0px_#18181B]">
                  ${PixelIcon.get('planner')}
                </div>
                <div>
                  <h3 class="font-headline text-base font-bold text-slate-900">Weekly What-If Sandbox</h3>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    Simulate future absences across your entire weekly calendar before you take them. See exactly how missing Friday's lab impacts your exam eligibility.
                  </p>
                </div>
              </div>
            </div>

            <!-- Pillar 4 -->
            <div class="bw-card p-5 bg-white flex flex-col justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded bg-purple-100 border-2 border-[#18181B] flex items-center justify-center flex-shrink-0 text-purple-800 shadow-[2px_2px_0px_#18181B]">
                  ${PixelIcon.get('upload')}
                </div>
                <div>
                  <h3 class="font-headline text-base font-bold text-slate-900">No Database • 100% Private</h3>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    Zero accounts, zero trackers, zero cloud lock-in. Everything is stored locally in your browser. Export or restore your full semester data via JSON or CSV anytime.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- SETUP OPTIONS SECTION: Demo vs Upload -->
        <section class="bw-card p-6 sm:p-8 bg-slate-900 text-white border-2 border-[#18181B] shadow-[5px_5px_0px_#18181B] flex flex-col gap-6">
          <div class="text-center max-w-xl mx-auto">
            <span class="text-emerald-400 font-bold text-xs uppercase tracking-wider">Fast-Track Onboarding</span>
            <h2 class="font-headline text-2xl sm:text-3xl font-black text-white mt-1">
              Choose How You Want to Start
            </h2>
            <p class="text-xs text-slate-300 mt-1">
              Test drive our preloaded student dataset or upload your own timetable in one click.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Option 1: Demo -->
            <div class="p-5 bg-slate-800 border border-slate-700 rounded-lg flex flex-col justify-between gap-4">
              <div>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Recommended for Testing
                </span>
                <h3 class="font-headline text-lg font-bold text-white mt-2">
                  1. Preloaded Student Demo
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Real Semester 6 AI & Data Science engineering dataset. 12 subjects, 64.96% attendance, 16 weekly sessions. Ready out of the box.
                </p>
              </div>

              <button 
                onclick="App.navigateTo('dashboard')" 
                class="bw-btn bw-btn-primary text-xs py-2.5 w-full"
              >
                ${PixelIcon.get('cat')} Open Dashboard with Demo
              </button>
            </div>

            <!-- Option 2: Upload -->
            <div class="p-5 bg-slate-800 border border-slate-700 rounded-lg flex flex-col justify-between gap-4">
              <div>
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Your College Timetable
                </span>
                <h3 class="font-headline text-lg font-bold text-white mt-2">
                  2. Upload Your Own Timetable
                </h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                  Upload a photo of your printed timetable, import an Excel CSV file, or paste your schedule directly into our dialogue box.
                </p>
              </div>

              <button 
                onclick="App.openTimetableModal()" 
                class="bw-btn bw-btn-accent text-xs py-2.5 w-full"
              >
                ${PixelIcon.get('upload')} Open Timetable Dialogue
              </button>
            </div>

          </div>
        </section>

        <!-- BOTTOM CALL TO ACTION -->
        <section class="text-center flex flex-col items-center gap-4 py-6">
          <h2 class="font-headline text-2xl sm:text-3xl font-black text-[#18181B]">
            Stop Stressing. Start Calculating.
          </h2>
          <p class="text-xs text-slate-600 max-w-md">
            Join the students who calculate before they bunk. 100% free, private, and offline-capable.
          </p>
          <div class="flex items-center gap-3">
            <button onclick="App.navigateTo('dashboard')" class="bw-btn bw-btn-primary text-xs py-3 px-6 shadow-[2px_2px_0px_#18181B]">
              ${PixelIcon.get('cat')} Launch BunkWise
            </button>
            <button onclick="App.openTimetableModal()" class="bw-btn text-xs py-3 px-5 shadow-[2px_2px_0px_#18181B]">
              ${PixelIcon.get('upload')} Setup Timetable
            </button>
          </div>
        </section>

      </div>
    `;

    // Initialize the reactive pixel canvas after DOM insertion
    setTimeout(() => {
      this.initPixelCanvas();
    }, 50);
  },

  /**
   * Reactive Pixelated Canvas Component (inspired by shadcn / Aceternity Pixel Canvas)
   * Pure deterministic canvas math. Creates an interactive grid of square pixels that
   * reactively light up with emerald, mint, gold, and dark ink particles when moving cursor/finger.
   */
  initPixelCanvas() {
    const canvas = document.getElementById("hero-pixel-canvas");
    const container = document.getElementById("pixel-hero-container");
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelSize = 14;
    const gap = 2;
    const step = pixelSize + gap;
    const colors = ["#10B981", "#059669", "#0F766E", "#A7F3D0", "#FEF08A", "#18181B"];

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let pixels = [];
    let mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / step);
      rows = Math.ceil(height / step);

      pixels = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          pixels.push({
            x: c * step,
            y: r * step,
            color: colors[Math.floor(Math.random() * colors.length)],
            intensity: 0,
            baseAlpha: 0.04 + Math.random() * 0.05
          });
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse & Touch Interaction Listeners
    const updateCoord = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;

      // Energize pixels within radius of pointer
      const radius = 65;
      const radiusSq = radius * radius;

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        const dx = p.x + pixelSize / 2 - mouse.x;
        const dy = p.y + pixelSize / 2 - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq) {
          const force = (1 - distSq / radiusSq);
          p.intensity = Math.min(1.0, p.intensity + force * 0.6);
        }
      }
    };

    container.onmousemove = (e) => {
      updateCoord(e.clientX, e.clientY);
    };

    container.onmouseleave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    container.onclick = (e) => {
      updateCoord(e.clientX, e.clientY);
      // Create ripple wave of pixels on click
      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          p.intensity = Math.max(p.intensity, (1 - dist / 140));
        }
      }
    };

    // Mobile touch handling
    container.ontouchstart = (e) => {
      if (e.touches && e.touches[0]) {
        updateCoord(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    container.ontouchmove = (e) => {
      if (e.touches && e.touches[0]) {
        updateCoord(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    container.ontouchend = () => {
      mouse.active = false;
    };

    // Animation Loop
    let tick = 0;
    const animate = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient random flicker so it breathes even when idle
      if (tick % 6 === 0 && pixels.length > 0) {
        const randomIndex = Math.floor(Math.random() * pixels.length);
        if (pixels[randomIndex].intensity < 0.1) {
          pixels[randomIndex].intensity = 0.35;
        }
      }

      // Render pixels
      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];

        if (p.intensity > 0.01) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1.0, p.intensity * 0.9);
          ctx.fillRect(p.x, p.y, pixelSize, pixelSize);

          // Decay intensity smoothly
          p.intensity *= 0.92;
        } else {
          // Subtle idle pixel grid outline
          ctx.fillStyle = "#18181B";
          ctx.globalAlpha = p.baseAlpha;
          ctx.fillRect(p.x, p.y, pixelSize, pixelSize);
        }
      }

      ctx.globalAlpha = 1.0;
      this.pixelCanvasAnimId = requestAnimationFrame(animate);
    };

    this.pixelCanvasAnimId = requestAnimationFrame(animate);
  },

  cleanupPixelCanvas() {
    if (this.pixelCanvasAnimId) {
      cancelAnimationFrame(this.pixelCanvasAnimId);
      this.pixelCanvasAnimId = null;
    }
  },

  stepSim(willAttend) {
    if (willAttend) {
      this.simState.attended += 1;
      this.simState.conducted += 1;
    } else {
      this.simState.conducted += 1;
    }

    const currentPct = BunkEngine.calculatePercentage(this.simState.attended, this.simState.conducted);
    const allowance = BunkEngine.calculateSkipAllowance(this.simState.attended, this.simState.conducted, this.simState.target);
    const recovery = BunkEngine.classesNeededToRecover(this.simState.attended, this.simState.conducted, this.simState.target);

    const pctEl = document.getElementById("landing-sim-pct");
    const attEl = document.getElementById("landing-sim-att");
    const condEl = document.getElementById("landing-sim-cond");
    const humorEl = document.getElementById("landing-sim-humor");
    const recEl = document.getElementById("landing-sim-recovery");

    if (pctEl) {
      pctEl.innerText = `${currentPct}%`;
      pctEl.className = `font-headline text-lg font-black ${currentPct >= this.simState.target ? 'text-emerald-700' : 'text-red-600'}`;
    }
    if (attEl) attEl.innerText = this.simState.attended;
    if (condEl) condEl.innerText = this.simState.conducted;
    if (recEl) recEl.innerText = recovery > 0 ? `+${recovery} consecutive classes` : 'Zero (Safe)';

    if (humorEl) {
      humorEl.innerHTML = currentPct < this.simState.target
        ? `“You are currently below target (${currentPct}%). You need <strong>${recovery} unbroken attendances</strong> without blinking to reach ${this.simState.target}%.”`
        : `“Safe zone achieved (${currentPct}%)! You now have <strong>${allowance} safe bunk token(s)</strong> available.”`;
    }
  },

  resetSim() {
    this.simState = { attended: 15, conducted: 31, target: 75 };
    const container = document.getElementById("app-main-content");
    if (container && App.currentTab === "landing") {
      this.render(container);
    }
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.LandingView = LandingView;
}
