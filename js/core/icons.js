/**
 * BunkWise - Pixel Art Icons (Crisp, 8-Bit Retro Pixel SVGs)
 * No emojis. Pure pixel-art geometry rendered with sharp edges.
 */

const PixelIcon = {
  // Collection of pixelated SVG paths rendered on crisp 16x16 or 24x24 grids
  icons: {
    cat: `<svg class="px-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h3v2H2V2zm9 0h3v2h-3V2zM1 4h2v2H1V4zm12 0h2v2h-2V4zM2 6h12v6H2V6zm2 2h2v2H4V8zm6 0h2v2h-2V8zm-3 2h2v1H7v-1zm-4 2h10v2H3v-2z"/></svg>`,
    
    dashboard: `<svg class="px-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2h6v5H1V2zm8 0h6v3H9V2zm0 5h6v7H9V7zM1 9h6v5H1V9z"/></svg>`,
    
    calendar: `<svg class="px-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h2v2H3V1zm8 0h2v2h-2V1zM1 3h14v12H1V3zm2 4h3v2H3V7zm5 0h3v2H8V7zm-5 4h3v2H3v-2zm5 0h3v2H8v-2z"/></svg>`,
    
    chart: `<svg class="px-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 1h2v14H1V1zm4 8h2v6H5V9zm4-4h2v10H9V5zm4-3h2v13h-2V2z"/></svg>`,
    
    planner: `<svg class="px-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h10v14H3V1zm2 2v2h6V3H5zm0 4h2v2H5V7zm4 0h2v2H9V7zm-4 4h2v2H5v-2zm4 0h2v2H9v-2z"/></svg>`,
    
    settings: `<svg class="px-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7 1h2v2H7V1zm-3 2h2v2H4V3zm8 0h2v2h-2V3zM1 7h2v2H1V7zm12 0h2v2h-2V7zm-9 4h2v2H4v-2zm8 0h2v2h-2v-2zm-5 2h2v2H7v-2zM6 6h4v4H6V6z"/></svg>`,
    
    check: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13 3l2 2-8 8-4-4 2-2 2 2 6-6z"/></svg>`,
    
    close: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3 3h2v2H3V3zm2 2h2v2H5V5zm2 2h2v2H7V7zm2-2h2v2H9V5zm2-2h2v2h-2V3zm-2 6h2v2H9V9zm-2 2h2v2H7v-2zm-2 0H3v-2h2v2zm6 2h2v2h-2v-2z"/></svg>`,
    
    alert: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7 2h2v2H7V2zm-2 3h6v2H5V5zm-2 3h10v2H3V8zm-2 3h14v2H1v-2zm6-4h2v3H7V7zm0 4h2v2H7v-2z"/></svg>`,
    
    camera: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 2h6v2H5V2zM2 4h12v10H2V4zm6 2a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z"/></svg>`,
    
    plus: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7 3h2v10H7V3zm-4 4h10v2H3V7z"/></svg>`,
    
    minus: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3 7h10v2H3V7z"/></svg>`,
    
    trash: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 2h6v2H5V2zM2 4h12v2H2V4zm2 3h2v7H4V7zm4 0h2v7H8V7zm4 0h-2v7h2V7z"/></svg>`,
    
    download: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7 1h2v7h3l-4 4-4-4h3V1zM2 13h12v2H2v-2z"/></svg>`,
    
    upload: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7 11h2V4h3L8 0 4 4h3v7zM2 13h12v2H2v-2z"/></svg>`,
    
    refresh: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h4v2H3v3H1V3h1V2zm11 0h2v5h-2V4h-3V2h3zm1 12h-4v-2h3v-3h2v4h-1v1zM3 14H1v-5h2v3h3v2H3z"/></svg>`,
    
    clock: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M7 1h2v2H7V1zm-4 2h2v2H3V3zm8 0h2v2h-2V3zM1 7h2v2H1V7zm12 0h2v2h-2V7zM3 11h2v2H3v-2zm8 0h2v2h-2v-2zM7 13h2v2H7v-2zM7 4h2v4h3v2H7V4z"/></svg>`,

    zap: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L2 9h5v6l6-8H8V1z"/></svg>`,

    shield: `<svg class="px-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1h12v7c0 4-3 7-6 8-3-1-6-4-6-8V1zm2 2v5c0 3 2 5 4 6 2-1 4-3 4-6V3H4z"/></svg>`
  },

  get(name, extraClass = "") {
    const svg = this.icons[name] || this.icons.info;
    if (!extraClass) return svg;
    return svg.replace('class="px-icon"', `class="px-icon ${extraClass}"`);
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.PixelIcon = PixelIcon;
}
