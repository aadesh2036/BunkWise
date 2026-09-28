/**
 * BunkWise - Modal & Toast Manager
 */

const Modal = {
  getOverlay() {
    let overlay = document.getElementById("global-modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "global-modal-overlay";
      overlay.className = "modal-overlay";
      overlay.onclick = (e) => {
        if (e.target === overlay) Modal.close();
      };
      document.body.appendChild(overlay);
    }
    return overlay;
  },

  open(htmlContent) {
    const overlay = this.getOverlay();
    overlay.innerHTML = `<div class="modal-box">${htmlContent}</div>`;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  },

  close() {
    const overlay = this.getOverlay();
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
};

// Global escape key listener to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    Modal.close();
  }
});

// Export to window
if (typeof window !== "undefined") {
  window.Modal = Modal;
}
