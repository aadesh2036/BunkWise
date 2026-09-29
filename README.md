# BunkWise — Know your attendance. Know your freedom.

> **Codédex Hackathon Project**  
> *A minimalist attendance decision engine built around a student's real-life timetable.*

---

## Pitch

College attendance portals tell students numbers like `15/31 — 48.39%`.  
What students actually need answered is:

> **“Can I skip today's 1:00 PM lecture without falling below the 75% cutoff?”**

**BunkWise** turns a student's timetable and attendance records into an immediate daily decision engine. It tells students exactly how missing upcoming classes affects their attendance percentage, calculates how many classes can be safely skipped, and provides the exact streak of consecutive classes required to recover to the 75% cutoff.

AI is kept strictly where it provides genuine value: **reading timetable photos through OCR**. Everything else is fast, explainable, deterministic mathematics.

---

## Clean & Focused Features

1. **Active Decision Queue (Today's Classes)**
   - Scheduled classes for the day appear in a dynamic tactical queue.
   - 1-Tap Attendance logging (*"I Showed Up 🫡"* or *"I Slept In 💀"*).
   - **Queue Removal:** Once marked, the card is immediately cleared from the active queue.
   - **Multi-Click Lockout:** Anti-debounce logic prevents double-clicks from inflating attendance.
   - **Undo Drawer:** Revert any logged class back to the active queue with a single tap.

2. **Beautiful Student Landing Page**
   - Striking neo-brutalist aesthetic with live interactive decision teaser widget.
   - Explains the 4 core pillars: Deterministic Math, 1-Tap Queue, Weekly Sandbox, Zero Database Privacy.
   - Quick onboarding pathways: Launch Demo, Upload Timetable, or Blank Canvas.

3. **Timetable Dialogue Box (Upload or Use Demo)**
   - Zero-database setup modal accessible from any screen:
     - **⚡ 1-Tap Student Demo:** Instant load of the real AI & Data Science Sem 6 timetable.
     - **📁 File Upload:** Supports `.json` backups and `.csv` schedules.
     - **📝 Paste CSV:** Quick-paste schedule rows from Excel or Google Sheets.
     - **📷 Timetable Photo OCR:** Vision OCR with pre-commit verification review.
     - **✨ Blank Schedule:** Build custom classes from scratch.
   - Downloadable sample CSV template included.

4. **Mobile-First Responsive Design**
   - Seamless usability across mobile phones, tablets, and desktops.
   - Smooth horizontal swipe for day navigation, touch-friendly buttons, and responsive modal dialogues.

5. **Deterministic Mathematical Engine & Weekly Planner**
   - 100% explainable integer algebra (0% AI hallucination).
   - Computes exact skip allowances and unbroken redemption streaks required for exam cutoff.
   - Weekly sandbox to simulate multiple future absences before making the decision.

6. **100% Client-Side Privacy & Data Vault**
   - Zero login, zero database, zero external tracking.
   - All attendance records and timetables are stored in browser `localStorage`.
   - 1-click **Export Backup (.JSON)** and **Import Backup**.
   - 1-click **Reset to Real Student Demo Data**.

---

## The Core Mathematical Engine

Unlike apps that use generative AI to guess attendance advice, BunkWise is **strictly deterministic JavaScript algebra**:

### 1. Can Skip Allowance ($x$)
How many future classes can be skipped while maintaining attendance $\ge T$ (default 75%):
$$\frac{A}{C + x} \ge T \implies x \le \frac{A}{T} - C$$
$$\text{canSkip} = \max\left(0, \left\lfloor \frac{A}{T} - C \right\rfloor\right)$$

### 2. Consecutive Recovery Classes ($x$)
If attendance is currently below $T$, how many consecutive classes must be attended to reach $\ge T$:
$$\frac{A + x}{C + x} \ge T \implies x \ge \frac{T \cdot C - A}{1 - T}$$
$$\text{classesNeeded} = \max\left(0, \left\lceil \frac{T \cdot C - A}{1 - T} \right\rceil\right)$$

---

## Authentic Demo Dataset Included

Pre-loaded with real university attendance and timetable records:
- **DSC04 (Coursera Track 4):** 7 / 9 = 77.78% (Safe)
- **DSC05 (Coursera Track 5):** 6 / 7 = 85.71% (Safe)
- **DS3201 (Deep Learning Theory):** 15 / 31 = 48.39% (Critical — 53 consecutive classes to recover!)
- **DS3201 (Deep Learning Lab):** 9 / 11 = 81.82%
- **DS3202 (Prompt Engineering Theory):** 14 / 22 = 63.64%
- **DS3202 (Prompt Engineering Lab):** 3 / 7 = 42.86%
- **DS3203A (Computational Data Theory):** 18 / 27 = 66.67%
- **DS3203A (Computational Data Lab):** 9 / 12 = 75.00%
- **DS3205 (Design Thinking):** 8 / 11 = 72.73%
- **Overall Attendance:** **89 / 137 = 64.96%**

---

## Deploying to Vercel

BunkWise runs as a lightweight, static web app with zero build steps or npm installations:

1. Push this directory to GitHub.
2. Import the repository into **Vercel**.
3. (Optional) In Vercel Project Settings ➔ **Environment Variables**, add:
   ```env
   HUGGINGFACE_TOKEN=your_hf_token_here
   RATE_LIMIT_MAX=100
   ```
4. Deploy!

> **Demo Rate Limit Safeguard:** The serverless OCR endpoint (`/api/ocr.js`) and client settings include a demo limit of **100 requests** so that public visitors cannot exhaust your Hugging Face API quota.

---

## Local Usage

Simply double-click `index.html` or open it in any web browser.  
No node, npm, or build tools required.
