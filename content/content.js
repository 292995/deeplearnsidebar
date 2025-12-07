
/**
 * DeepLearn Sidebar - Content Script
 * Handles UI injection, Video interaction, Data collection, AI Generation, and Visualization.
 * Supports: YouTube
 */

console.log("DeepLearn Sidebar Loading...");

// --- Configuration ---
let API_KEY = localStorage.getItem('dl_api_key') || ""; 

// --- Templates ---
const BRIDGE_TEMPLATE = `## Why this connection matters
- 

## Key differences
- 

## New questions
- `;

// --- CSS Styles (Inlined for Robustness) ---
const SIDEBAR_CSS = `
/* DeepLearn Sidebar Styles */

#deeplearn-root {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background-color: #09090b; /* Zinc 950 */
  border-left: 1px solid #27272a; /* Zinc 800 */
  z-index: 2147483647; /* Max z-index */
  font-family: 'Inter', sans-serif;
  color: #e4e4e7; /* Zinc 200 */
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
  font-size: 14px;
  line-height: 1.5;
}

#deeplearn-root.collapsed {
  transform: translateX(100%);
}

#deeplearn-root * {
  box-sizing: border-box;
}

/* Utility Classes Helpers */
.dl-flex { display: flex; }
.dl-flex-col { flex-direction: column; }
.dl-items-center { align-items: center; }
.dl-justify-between { justify-content: space-between; }
.dl-hidden { display: none !important; }

/* Header */
.dl-header {
  padding: 16px;
  background-color: #09090b;
  border-bottom: 1px solid #27272a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dl-title {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
}

.dl-badge {
  background-color: #27272a;
  color: #a1a1aa;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  margin-left: 8px;
}

/* Distraction Guard */
.dl-guard {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #27272a;
  background: #18181b;
  color: #71717a;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.dl-guard.warning {
  background: rgba(127, 29, 29, 0.2);
  color: #fecaca;
  border-color: #7f1d1d;
}

/* Controls Area */
.dl-controls {
  padding: 16px;
  background-color: rgba(24, 24, 27, 0.5);
  border-bottom: 1px solid #27272a;
}

.dl-top-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #71717a;
}

.dl-textarea {
  width: 100%;
  background-color: #09090b;
  border: 1px solid #27272a;
  border-radius: 6px;
  padding: 12px;
  color: #e4e4e7;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  margin-bottom: 12px;
}

.dl-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.dl-input {
  width: 100%;
  background-color: #09090b;
  border: 1px solid #27272a;
  border-radius: 6px;
  padding: 8px 12px;
  color: #e4e4e7;
  font-size: 13px;
  margin-bottom: 12px;
}

.dl-btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr; /* 4 columns for Trace button */
  gap: 6px;
}

.dl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 4px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  white-space: nowrap;
}

.dl-btn-xs {
  font-size: 10px;
  padding: 2px 6px;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  color: #a1a1aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dl-btn-xs:hover { color: white; background: #3f3f46; }

.dl-btn-primary {
  background-color: #27272a;
  color: white;
  border-color: #3f3f46;
}
.dl-btn-primary:hover { background-color: #3f3f46; }
.dl-btn-primary:active { transform: scale(0.98); }

.dl-btn-ai {
  background-color: rgba(30, 58, 138, 0.3);
  color: #bfdbfe;
  border-color: rgba(30, 58, 138, 0.5);
}
.dl-btn-ai:hover { background-color: rgba(30, 58, 138, 0.5); }
.dl-btn-ai:disabled { opacity: 0.5; cursor: not-allowed; }

.dl-btn-trace {
  background-color: rgba(16, 185, 129, 0.1);
  color: #6ee7b7;
  border-color: rgba(16, 185, 129, 0.2);
}
.dl-btn-trace:hover { background-color: rgba(16, 185, 129, 0.2); }
.dl-btn-trace:disabled { opacity: 0.5; cursor: not-allowed; }

.dl-btn-icon {
  background: transparent;
  color: #a1a1aa;
  padding: 4px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.dl-btn-icon:hover { color: white; background: #27272a; }

/* Note List */
.dl-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.dl-note-card {
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  position: relative;
  transition: border-color 0.2s;
}

.dl-note-card:hover { border-color: #3f3f46; }

.dl-note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.dl-timestamp {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #60a5fa;
  background: rgba(23, 37, 84, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
}

.dl-note-content {
  font-size: 14px;
  line-height: 1.5;
  color: #d4d4d8;
  white-space: pre-wrap;
  margin-bottom: 8px;
}

.dl-transcript-snippet {
  font-size: 12px;
  color: #71717a;
  font-style: italic;
  padding-left: 8px;
  border-left: 2px solid #3f3f46;
  margin-bottom: 8px;
}

.dl-ai-box {
  background: rgba(0, 0, 0, 0.3);
  border-left: 2px solid #a855f7;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 0 4px 4px 0;
}
.dl-ai-box.trace {
  border-left-color: #10b981;
}

.dl-ai-title {
  font-size: 11px;
  color: #c084fc;
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dl-ai-box.trace .dl-ai-title {
  color: #34d399;
}

.dl-ai-text {
  font-size: 12px;
  color: #a1a1aa;
  font-family: 'JetBrains Mono', monospace;
  white-space: pre-wrap;
}

.dl-screenshot {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 8px;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.dl-screenshot:hover { opacity: 1; }

.dl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dl-tag {
  font-size: 10px;
  background: #27272a;
  color: #a1a1aa;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Toggle Button on Page */
#dl-toggle-btn {
  position: fixed;
  top: 100px;
  right: 0;
  background: #09090b;
  color: white;
  border: 1px solid #27272a;
  border-right: none;
  padding: 8px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  z-index: 9998;
  transition: transform 0.3s;
}

.dl-context-active {
  color: #4ade80 !important;
  background: rgba(20, 83, 45, 0.3) !important;
  border: 1px solid rgba(20, 83, 45, 0.5) !important;
}

/* Export Menu */
.dl-export-menu {
  position: absolute;
  right: 16px;
  top: 56px; /* Adjusted for header height */
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 6px;
  padding: 4px 0;
  z-index: 2147483647;
  width: 180px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.dl-export-item {
  padding: 8px 12px;
  font-size: 13px;
  color: #d4d4d8;
  cursor: pointer;
}
.dl-export-item:hover { background: #27272a; color: white; }

/* Graph Modal */
.dl-graph-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(9,9,11,0.95);
  z-index: 2147483648;
  flex-direction: column;
}

/* Active Links */
.dl-active-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
  padding: 4px;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 4px;
}

/* Series Card */
.dl-series-card {
  background: #18181b;
  border-bottom: 1px solid #27272a;
  padding: 12px;
}

/* Dynamic UI Components */
.dl-type-selector { display: flex; gap: 2px; background: #18181b; padding: 2px; border-radius: 4px; border: 1px solid #27272a; overflow-x: auto; }
.dl-type-btn { background: transparent; border: none; color: #71717a; padding: 4px; border-radius: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; min-width: 24px; }
.dl-type-btn:hover { color: #d4d4d8; }
.dl-type-btn.active { background: #3f3f46; color: white; }

.dl-type-btn[data-type="question"].active { color: #fbbf24; } 
.dl-type-btn[data-type="insight"].active { color: #c084fc; } 
.dl-type-btn[data-type="bridge"].active { color: #60a5fa; } 
.dl-type-btn[data-type="definition"].active { color: #10b981; }
.dl-type-btn[data-type="moc"].active { color: #f43f5e; }

.dl-card-question { border-left: 2px solid #fbbf24 !important; background: rgba(251, 191, 36, 0.05); }
.dl-card-insight { border-left: 2px solid #c084fc !important; background: rgba(192, 132, 252, 0.05); }
.dl-card-bridge { border-left: 2px solid #60a5fa !important; background: rgba(96, 165, 250, 0.05); }
.dl-card-definition { border-left: 2px solid #10b981 !important; background: rgba(16, 185, 129, 0.05); }
.dl-card-moc { border-left: 2px solid #f43f5e !important; background: rgba(244, 63, 94, 0.05); }

.dl-prompt-chip:hover { background: #3f3f46 !important; color: white !important; }
.dl-suggestions { position: absolute; bottom: 100%; left: 0; width: 100%; background: #18181b; border: 1px solid #3f3f46; border-radius: 6px; max-height: 150px; overflow-y: auto; z-index: 50; box-shadow: 0 -4px 10px rgba(0,0,0,0.5); }
.dl-suggestion-item { padding: 8px; border-bottom: 1px solid #27272a; cursor: pointer; font-size: 12px; display: flex; align-items: center; }
.dl-suggestion-item:hover { background: #27272a; }
.dl-link-chip { font-size: 10px; background: rgba(30, 58, 138, 0.3); color: #93c5fd; border: 1px solid rgba(30, 58, 138, 0.5); padding: 2px 6px; border-radius: 99px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
.dl-link-chip-remove { opacity: 0.6; }
.dl-link-chip-remove:hover { opacity: 1; color: white; }
.dl-note-title { font-weight: 600; font-size: 13px; color: #fff; margin-bottom: 4px; display: block;}
.dl-edit-input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid #3f3f46; color: white; padding: 4px; border-radius: 4px; margin-bottom: 4px; font-family: inherit; font-size: inherit; }
`;

// --- SVG Icons ---
const ICONS = {
  lock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  unlock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
  camera: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  brain: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
  activity: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  edit: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  save: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
  cancel: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  typeFile: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  typeHelp: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  typeIdea: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="18" x2="15" y2="18"></line><line x1="10" y1="22" x2="14" y2="22"></line><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 16.5 8 4.5 4.5 0 0 0 12 3.5 4.5 4.5 0 0 0 7.5 8c0 1.16.67 2.16 1.58 2.8.62.43.94.97 1 1.7"></path></svg>`,
  typeLink: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  typeDef: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  typeMoc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  arrowRight: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  linkSmall: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  graph: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  sparkles: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"></path></svg>`,
  list: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  quote: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>`,
  cursor: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 13l6 6"></path><path d="M22 17.5A2.5 2.5 0 0 1 19.5 20H2"></path><path d="M16 8L2 8"></path><path d="M10 2L2 2"></path></svg>`,
  fileText: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
};

// --- State ---
let notes = [];
let transcriptSegments = [];
let isContextLocked = true;
let lastInteractionTime = Date.now();
let isSidebarVisible = true;
let currentVideoId = null;
let currentPlaylistId = null;
let currentNoteType = 'standard';
let currentDraftLinks = [];
let graphSimulationReq = null;
let checkInterval = null;

// --- Initialization ---
function init() {
  // Ensure DOM is ready
  if (!document.body) {
    setTimeout(init, 100);
    return;
  }

  // CLEANUP: Remove existing instance if it exists (critical for hot reloading in extension)
  const existing = document.getElementById('deeplearn-root');
  if (existing) {
      console.log("Removing existing sidebar instance...");
      existing.remove();
      const btn = document.getElementById('dl-toggle-btn');
      if (btn) btn.remove();
  }

  injectSidebar();
  setupListeners();
  checkVideoChange();
  
  // Force playlist check on init
  checkPlaylist();

  // Setup periodic checks
  if(checkInterval) clearInterval(checkInterval);
  checkInterval = setInterval(() => {
      checkVideoChange();
      checkPlaylist();
  }, 2000);
  
  // Add robust YouTube navigation listener
  window.addEventListener('yt-navigate-finish', () => {
      setTimeout(() => {
          checkVideoChange();
          checkPlaylist();
      }, 1000);
  });

  loadNotes();
  startDistractionGuard();
  console.log("DeepLearn Sidebar Injected");
}

// --- DOM Injection ---
function injectSidebar() {
  // 1. Inject Fonts
  if (!document.getElementById('dl-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'dl-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap';
    document.head.appendChild(fontLink);
  }

  const root = document.createElement('div');
  root.id = 'deeplearn-root';
  
  const prompts = [
    { label: "Why?", text: "This is important because " },
    { label: "Analogy", text: "It is like " },
    { label: "Contrast", text: "Unlike previous concepts, " }
  ];

  root.innerHTML = `
    <div class="dl-header">
      <div class="dl-flex dl-items-center">
        <span class="dl-title">DeepLearn</span>
        <span class="dl-badge" id="dl-count">0</span>
      </div>
      <div class="dl-flex dl-items-center" style="gap:4px;">
        <div id="dl-guard" class="dl-guard">
          <span>Focus</span>
        </div>
        <button class="dl-btn-icon" id="dl-graph-btn" title="Knowledge Graph">${ICONS.graph}</button>
        <button class="dl-btn-icon" id="dl-export-btn" title="Export Notes">${ICONS.download}</button>
        <button class="dl-btn-icon" id="dl-clear-header-btn" title="Clear All Notes" style="color:#ef4444;">${ICONS.trash}</button>
        <button class="dl-btn-icon" id="dl-close-btn" title="Close Sidebar">${ICONS.x}</button>
      </div>
    </div>

    <!-- Lecture Series Card -->
    <div id="dl-series-card" class="dl-series-card dl-hidden">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; align-items:center;">
            <span style="font-size:12px; color:#e4e4e7; display:flex; align-items:center; gap:6px;">${ICONS.list} <b>Series Mode</b></span>
            <span id="dl-series-count" style="font-size:10px; color:#71717a;"></span>
        </div>
        <div style="height:4px; background:#27272a; border-radius:2px; width:100%;">
            <div id="dl-series-progress" style="height:100%; background:#3b82f6; border-radius:2px; width:0%;"></div>
        </div>
    </div>

    <div id="dl-export-menu" class="dl-export-menu dl-hidden">
      <div class="dl-export-item" data-format="SINGLE_FILE">Single Markdown</div>
      <div class="dl-export-item" data-format="PER_VIDEO">One File Per Video</div>
      <div class="dl-export-item" data-format="JSON">JSON Data</div>
      <div class="dl-export-item" data-format="ANKI">Anki Flashcards (CSV)</div>
      <div class="dl-export-divider" style="border-top:1px solid #27272a; margin:4px 0;"></div>
      <div class="dl-export-item" id="dl-copy-trans-btn">${ICONS.fileText} Copy Full Transcript</div>
      <div class="dl-export-divider" style="border-top:1px solid #27272a; margin:4px 0;"></div>
      <div class="dl-export-item" id="dl-set-key-btn">${ICONS.settings} Set API Key</div>
      <div class="dl-export-item" id="dl-clear-btn" style="color:#ef4444;">${ICONS.trash} Clear All Notes</div>
    </div>

    <div class="dl-controls">
      <div class="dl-top-row">
        <div class="dl-type-selector">
           <button class="dl-type-btn active" data-type="standard" title="Log">${ICONS.typeFile}</button>
           <button class="dl-type-btn" data-type="question" title="Question">${ICONS.typeHelp}</button>
           <button class="dl-type-btn" data-type="insight" title="Insight">${ICONS.typeIdea}</button>
           <button class="dl-type-btn" data-type="bridge" title="Connect">${ICONS.typeLink}</button>
           <button class="dl-type-btn" data-type="definition" title="Definition">${ICONS.typeDef}</button>
           <button class="dl-type-btn" data-type="moc" title="Map of Content">${ICONS.typeMoc}</button>
        </div>
        <button id="dl-lock-btn" class="dl-btn-icon dl-context-active" style="font-size:10px; display:flex; align-items:center; gap:4px; width:auto; padding:2px 6px;">
          ${ICONS.lock} <span>Keep Text</span>
        </button>
      </div>
      
      <input id="dl-title-input" class="dl-input" style="font-weight:600; border:none; background:transparent; padding-left:0; margin-bottom:4px;" placeholder="Title (optional, auto-fills)..." />

      <!-- Helpers Row -->
      <div style="display:flex; gap:8px; margin-bottom:8px;">
        <button id="dl-quote-btn" class="dl-btn-xs" title="Insert current transcript line">${ICONS.quote} Quote Transcript</button>
        <button id="dl-sel-btn" class="dl-btn-xs" title="Insert selected text from page">${ICONS.cursor} Paste Selection</button>
      </div>

      <div style="position:relative;">
          <textarea id="dl-note-input" class="dl-textarea" placeholder="Capture concept or paste code to trace... (Type [[ to link)"></textarea>
          <div id="dl-suggestions" class="dl-suggestions dl-hidden"></div>
      </div>
      
      <div id="dl-active-links" class="dl-active-links dl-hidden"></div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div class="dl-prompts" style="display:flex; gap:6px; overflow-x:auto; padding-bottom:2px; max-width:70%;">
            ${prompts.map(p => `
            <button class="dl-prompt-chip" data-text="${p.text}" style="white-space:nowrap; padding:2px 6px; border-radius:4px; background:#27272a; color:#a1a1aa; border:1px solid #3f3f46; font-size:10px; cursor:pointer;">
                ${p.label}
            </button>
            `).join('')}
        </div>
        <button id="dl-auto-extract-btn" class="dl-btn-icon" title="Auto-Extract Concepts" style="color:#c084fc;">
            ${ICONS.sparkles}
        </button>
      </div>

      <input id="dl-tag-input" class="dl-input" placeholder="Tags (comma separated)..." />
      
      <div class="dl-btn-row">
        <button id="dl-snap-btn" class="dl-btn dl-btn-primary" title="Capture Screenshot & Note (Alt+S)">
          ${ICONS.camera} Snap
        </button>
         <button id="dl-log-sel-btn" class="dl-btn" style="background:#18181b; border-color:#3f3f46; color:#d4d4d8;" title="Save Text Note (Alt+L)">
          ${ICONS.fileText} Log
        </button>
        <button id="dl-ai-btn" class="dl-btn dl-btn-ai">
          ${ICONS.brain} Intuition
        </button>
        <button id="dl-trace-btn" class="dl-btn dl-btn-trace" title="Generate Mechanical Walkthrough (Alt+T)">
          ${ICONS.activity} Trace
        </button>
      </div>
    </div>

    <div id="dl-notes-list" class="dl-list"></div>
    
    <!-- Graph Modal -->
    <div id="dl-graph-modal" class="dl-graph-modal dl-hidden">
        <div style="padding:16px; border-bottom:1px solid #27272a; display:flex; justify-content:space-between; align-items:center;">
            <span class="dl-title">Knowledge Graph</span>
            <button class="dl-btn-icon" id="dl-close-graph">${ICONS.x}</button>
        </div>
        <div style="flex:1; position:relative; overflow:hidden;" id="dl-graph-container">
            <canvas id="dl-graph-canvas" style="display:block;"></canvas>
            <div style="position:absolute; bottom:16px; left:16px; font-size:12px; color:#71717a;">
                <div style="display:flex; gap:8px; align-items:center;">
                    <span style="width:8px; height:8px; background:#e4e4e7; border-radius:50%;"></span> Log
                    <span style="width:8px; height:8px; background:#fbbf24; border-radius:50%;"></span> Question
                    <span style="width:8px; height:8px; background:#c084fc; border-radius:50%;"></span> Insight
                    <span style="width:8px; height:8px; background:#60a5fa; border-radius:50%;"></span> Bridge
                </div>
            </div>
        </div>
    </div>
  `;

  document.body.appendChild(root);
  
  const toggleBtn = document.createElement('div');
  toggleBtn.id = 'dl-toggle-btn';
  toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`;
  toggleBtn.style.display = 'none';
  toggleBtn.title = "Open DeepLearn Sidebar";
  toggleBtn.addEventListener('click', () => toggleSidebar(true));
  document.body.appendChild(toggleBtn);

  // Inject styles directly to ensure visibility
  const style = document.createElement('style');
  style.textContent = SIDEBAR_CSS;
  document.head.appendChild(style);
}

function setupListeners() {
  document.getElementById('dl-close-btn').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('dl-clear-header-btn').addEventListener('click', handleClearAll);
  document.getElementById('dl-snap-btn').addEventListener('click', () => handleCapture(null, true));
  document.getElementById('dl-log-sel-btn').addEventListener('click', () => handleCapture(null, false));
  document.getElementById('dl-ai-btn').addEventListener('click', () => handleCapture('intuition', true));
  document.getElementById('dl-trace-btn').addEventListener('click', () => handleCapture('trace', true));
  document.getElementById('dl-graph-btn').addEventListener('click', () => toggleGraph(true));
  document.getElementById('dl-close-graph').addEventListener('click', () => toggleGraph(false));
  document.getElementById('dl-auto-extract-btn').addEventListener('click', handleAutoExtraction);
  
  // --- New Helpers Listeners ---
  document.getElementById('dl-quote-btn').addEventListener('click', () => {
      const video = findVideoElement();
      if(video) {
          const snippet = getTranscriptSnippet(video.currentTime, 10);
          if(snippet) {
              const input = document.getElementById('dl-note-input');
              const quote = `> "${snippet}"\n`;
              input.value = (input.value ? input.value + "\n" : "") + quote;
              input.focus();
          } else {
              alert("No transcript found nearby.");
          }
      } else {
          alert("No video playing.");
      }
  });

  document.getElementById('dl-sel-btn').addEventListener('click', () => {
      const selection = window.getSelection().toString();
      if(selection) {
          const input = document.getElementById('dl-note-input');
          input.value = (input.value ? input.value + " " : "") + selection;
          input.focus();
      } else {
          alert("Select text on the page first.");
      }
  });

  const noteInput = document.getElementById('dl-note-input');
  noteInput.addEventListener('input', (e) => {
      lastInteractionTime = Date.now();
      const val = e.target.value;
      const match = val.match(/\[\[([^\]]*)$/);
      const suggestionsEl = document.getElementById('dl-suggestions');
      
      if (match) {
          const query = match[1].toLowerCase();
          const matches = notes.filter(n => 
            n.content.toLowerCase().includes(query) || 
            (n.title && n.title.toLowerCase().includes(query)) ||
            n.tags.some(t => t.toLowerCase().includes(query))
          );
          
          if (matches.length > 0) {
              suggestionsEl.innerHTML = matches.map(n => `
                <div class="dl-suggestion-item" data-id="${n.id}" data-time="${formatTime(n.timestamp)}">
                    <span style="color:#60a5fa; font-family:monospace; margin-right:8px;">${formatTime(n.timestamp)}</span>
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${n.title || n.content.substring(0,20)}</span>
                </div>
              `).join('');
              
              suggestionsEl.querySelectorAll('.dl-suggestion-item').forEach(item => {
                  item.addEventListener('click', () => {
                      const id = item.getAttribute('data-id');
                      const timeStr = item.getAttribute('data-time');
                      const newVal = noteInput.value.replace(/\[\[([^\]]*)$/, `[[${timeStr}]] `);
                      noteInput.value = newVal;
                      noteInput.focus();
                      if (!currentDraftLinks.includes(id)) {
                          currentDraftLinks.push(id);
                          renderDraftLinks();
                      }
                      suggestionsEl.classList.add('dl-hidden');
                  });
              });
              suggestionsEl.classList.remove('dl-hidden');
          } else {
             suggestionsEl.innerHTML = `<div style="padding:8px; font-size:11px; color:#71717a;">No notes found</div>`;
             suggestionsEl.classList.remove('dl-hidden');
          }
      } else {
          suggestionsEl.classList.add('dl-hidden');
      }
  });

  document.querySelectorAll('.dl-type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.dl-type-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentNoteType = e.currentTarget.getAttribute('data-type');
      
      const input = document.getElementById('dl-note-input');
      if (currentNoteType === 'question') input.placeholder = "What is confusing? What if...";
      else if (currentNoteType === 'insight') input.placeholder = "Core idea / Aha moment...";
      else if (currentNoteType === 'bridge') {
          input.placeholder = "Connects to concept...";
          // Auto-inject template if empty
          if (!input.value.trim()) input.value = BRIDGE_TEMPLATE;
      }
      else if (currentNoteType === 'definition') input.placeholder = "Define a term precisely...";
      else if (currentNoteType === 'moc') input.placeholder = "List related concepts (Map of Content)...";
      else input.placeholder = "Capture concept or paste code to trace... (Type [[ to link)";
      input.focus();
    });
  });
  
  document.querySelectorAll('.dl-prompt-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
       const text = e.currentTarget.getAttribute('data-text');
       const input = document.getElementById('dl-note-input');
       input.value += (input.value.length > 0 && !input.value.endsWith(' ') ? ' ' : '') + text;
       input.focus();
    });
  });

  document.getElementById('dl-lock-btn').addEventListener('click', () => {
    isContextLocked = !isContextLocked;
    const btn = document.getElementById('dl-lock-btn');
    if (isContextLocked) {
      btn.classList.add('dl-context-active');
      btn.innerHTML = `${ICONS.lock} <span>Keep Text</span>`;
    } else {
      btn.classList.remove('dl-context-active');
      btn.innerHTML = `${ICONS.unlock} <span>Auto-Clear</span>`;
    }
  });

  const exportBtn = document.getElementById('dl-export-btn');
  const exportMenu = document.getElementById('dl-export-menu');
  exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle('dl-hidden');
  });
  
  document.getElementById('dl-set-key-btn').addEventListener('click', () => {
    const key = prompt("Enter your Gemini API Key:", API_KEY);
    if (key) {
      API_KEY = key;
      localStorage.setItem('dl_api_key', key);
      // Sync to chrome storage as well
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ 'dl_api_key': key });
      }
      alert("API Key Saved!");
    }
  });
  
  document.getElementById('dl-copy-trans-btn').addEventListener('click', handleCopyTranscript);
  document.getElementById('dl-clear-btn').addEventListener('click', handleClearAll);

  document.querySelectorAll('.dl-export-item').forEach(item => {
    if (item.id === 'dl-set-key-btn' || item.id === 'dl-clear-btn' || item.id === 'dl-copy-trans-btn') return;
    item.addEventListener('click', () => {
      const format = item.getAttribute('data-format');
      handleExportAction(format);
      exportMenu.classList.add('dl-hidden');
    });
  });
  document.addEventListener('click', (e) => {
    if (!exportBtn.contains(e.target) && !exportMenu.contains(e.target)) {
      exportMenu.classList.add('dl-hidden');
    }
  });
  
  const root = document.getElementById('deeplearn-root');
  root.addEventListener('click', () => { lastInteractionTime = Date.now(); });
  root.addEventListener('input', () => { lastInteractionTime = Date.now(); });

  window.addEventListener('keydown', (e) => {
    // Snap: Alt + S (or Ctrl+Shift+M legacy)
    if ((e.altKey && e.code === 'KeyS') || ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyM')) {
      e.preventDefault();
      handleCapture(null, true);
    }
    // Log: Alt + L
    if (e.altKey && e.code === 'KeyL') {
        e.preventDefault();
        handleCapture(null, false);
    }
    // Trace: Alt + T
    if (e.altKey && e.code === 'KeyT') {
        e.preventDefault();
        handleCapture('trace', true);
    }
    // Log: Ctrl + Enter (When focusing input)
    if ((e.metaKey || e.ctrlKey) && e.code === 'Enter') {
      const textarea = document.getElementById('dl-note-input');
      const tagInput = document.getElementById('dl-tag-input');
      const titleInput = document.getElementById('dl-title-input');
      if (document.activeElement === textarea || document.activeElement === tagInput || document.activeElement === titleInput) {
        handleCapture(null, false); // Ctrl+Enter = Log (Text only)
      }
    }
  });
}

function renderDraftLinks() {
    const container = document.getElementById('dl-active-links');
    if (currentDraftLinks.length === 0) {
        container.classList.add('dl-hidden');
        return;
    }
    container.innerHTML = `<span style="font-size:10px; color:#71717a; display:flex; align-items:center; gap:4px;">${ICONS.typeLink} Linking:</span>` + 
    currentDraftLinks.map(id => {
        const n = notes.find(note => note.id === id);
        if(!n) return '';
        return `<div class="dl-link-chip"><span>${formatTime(n.timestamp)}</span><span class="dl-link-chip-remove" data-id="${id}">✕</span></div>`;
    }).join('');
    container.classList.remove('dl-hidden');
    container.querySelectorAll('.dl-link-chip-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            currentDraftLinks = currentDraftLinks.filter(l => l !== id);
            renderDraftLinks();
        });
    });
}

function toggleSidebar(show) {
  const root = document.getElementById('deeplearn-root');
  const btn = document.getElementById('dl-toggle-btn');
  if (!root || !btn) return;

  isSidebarVisible = show;
  if (show) {
    root.classList.remove('collapsed');
    btn.style.display = 'none';
  } else {
    root.classList.add('collapsed');
    btn.style.display = 'block';
  }
}

// --- Core Logic: Capture, AI, Auto-Extract, Clear ---

function handleCopyTranscript() {
    if (!transcriptSegments.length) {
        return alert("No transcript segments found. Ensure captions are enabled on the video.");
    }
    const text = transcriptSegments.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
        alert("Full transcript copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy transcript.");
    });
    document.getElementById('dl-export-menu').classList.add('dl-hidden');
}

function handleClearAll() {
    if (confirm("Are you sure you want to delete ALL notes? This cannot be undone.")) {
        notes = [];
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ 'deeplearn_notes': [] });
        } else {
            localStorage.setItem('deeplearn_notes', JSON.stringify([]));
        }
        renderNotesList();
        // Also close graph if open as it is now empty
        const graphModal = document.getElementById('dl-graph-modal');
        if (graphModal && !graphModal.classList.contains('dl-hidden')) {
             startGraphSimulation(); // Will trigger the empty message
        }
    }
    document.getElementById('dl-export-menu').classList.add('dl-hidden');
}

function findVideoElement() {
  const videos = Array.from(document.querySelectorAll('video'));
  if (videos.length === 0) return null;
  const playing = videos.find(v => !v.paused && v.currentTime > 0 && !v.ended);
  return playing || videos[0];
}

// REPLACEMENT: Direct fetch call instead of GoogleGenAI SDK
async function callGeminiAPI(promptText, systemInstruction = "", responseSchema = null) {
    if (!API_KEY) {
        alert("Please set your Gemini API Key in the Export menu.");
        throw new Error("No API Key");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const payload = {
        contents: [{
            parts: [{ text: promptText }]
        }]
    };

    if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    
    if (responseSchema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        };
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "API Request Failed");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function handleGeminiRequest(prompt, customSystemPrompt = null) {
  try {
    const defaultSystem = "You are a computer science tutor focusing on mechanical intuition. Analyze the student note and context. Explain the low-level mechanism or state change implied. Keep it brief (2 sentences).";
    const systemInst = customSystemPrompt || defaultSystem;
    const text = await callGeminiAPI(prompt, systemInst);
    return text;
  } catch (e) {
    console.error("Gemini Request Failed", e);
    return "Could not generate analysis.";
  }
}

async function handleAutoExtraction() {
    const btn = document.getElementById('dl-auto-extract-btn');
    const originalHtml = btn.innerHTML;
    
    if (transcriptSegments.length === 0) return alert("No transcript available for extraction.");
    
    btn.innerHTML = `<span style="font-size:10px;">...</span>`;
    btn.disabled = true;

    const fullText = transcriptSegments.map(s => s.text).join(' ');
    const context = fullText.slice(0, 30000); 

    try {
        // Define schema manually since we don't have the SDK Types
        const schema = {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING" },
                    content: { type: "STRING" },
                    type: { type: "STRING", enum: ["insight", "standard", "definition", "moc"] }
                }
            }
        };

        const jsonText = await callGeminiAPI(
            `Extract key concepts, definitions, and theorems from the following transcript. 
            Create a structured list of "insight", "definition", or "standard" notes. 
            Transcript: ${context}`,
            "",
            schema
        );
        
        const extracted = JSON.parse(jsonText);
        const videoId = getVideoId();
        const videoTitle = getPageTitle();
        
        extracted.forEach(item => {
            const note = {
                id: crypto.randomUUID(),
                videoId: videoId,
                videoTitle: videoTitle,
                timestamp: 0, // Global concept
                title: item.title,
                content: item.content,
                tags: ['auto-concept'],
                type: item.type,
                links: [],
                transcriptSnippet: null,
                aiAnalysis: null,
                createdAt: Date.now()
            };
            saveNote(note);
        });
        
        alert(`Extracted ${extracted.length} concepts!`);

    } catch(e) {
        console.error(e);
        alert("Failed to extract concepts. Check API Key.");
    } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }
}

async function handleCapture(aiMode = null, captureImage = true) {
  lastInteractionTime = Date.now();
  const video = findVideoElement();
  if (!video) return alert("No video found on this page.");

  const currentTime = video.currentTime;
  const title = getPageTitle();
  const noteInput = document.getElementById('dl-note-input');
  const tagInput = document.getElementById('dl-tag-input');
  const titleInput = document.getElementById('dl-title-input');
  
  const screenshotUrl = captureImage ? captureFrame(video) : null;
  const snippet = getTranscriptSnippet(currentTime, 15);

  // Smart Title Logic
  let smartTitle = titleInput.value.trim();
  if (!smartTitle && snippet) {
      smartTitle = snippet.split('.')[0].split(' ').slice(0, 8).join(' ') + '...';
  }
  if (!smartTitle) {
      smartTitle = `Note at ${formatTime(currentTime)}`;
  }

  const note = {
    id: crypto.randomUUID(),
    videoId: getVideoId(),
    videoTitle: title,
    timestamp: currentTime,
    title: smartTitle,
    content: noteInput.value,
    tags: tagInput.value.split(',').map(t => t.trim()).filter(Boolean),
    type: currentNoteType, 
    links: [...currentDraftLinks], 
    screenshotUrl: screenshotUrl,
    transcriptSnippet: snippet,
    aiAnalysis: null,
    aiMode: aiMode,
    createdAt: Date.now()
  };

  if (aiMode) {
    let btnId = 'dl-ai-btn';
    if (aiMode === 'trace') btnId = 'dl-trace-btn';
    
    const btn = document.getElementById(btnId);
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `Thinking...`;
    btn.disabled = true;
    
    let systemContext = "Explain the mechanical intuition.";
    let userPrompt = `User Note (${note.type}): "${note.content}". \n\nTranscript Context: "${snippet}". \n\n`;

    if (aiMode === 'trace') {
        systemContext = "You are a runtime environment visualizer. Your goal is to demystify code execution. Given a code snippet or logic description, generate a step-by-step state visualization (Stack/Heap/Registers/Variables). Format: Use strict 'Step N:' format with '|' separators for state.";
        userPrompt += "Generate a mechanical step-by-step execution trace (walkthrough) for this code/concept.";
    } else {
        // Intuition Mode
        if (note.type === 'question') systemContext = "Answer this user's confusion clearly.";
        if (note.type === 'insight') systemContext = "Validate and expand on this user's insight.";
        if (note.type === 'bridge') systemContext = "Explain the connection between these concepts.";
        if (note.type === 'definition') systemContext = "Verify this definition and provide a concrete example.";
        userPrompt += systemContext;
    }

    try {
      const aiText = await handleGeminiRequest(userPrompt, systemContext);
      note.aiAnalysis = aiText || "Could not generate analysis.";
    } catch (e) {
      console.error(e);
      note.aiAnalysis = "AI Connection failed.";
    }
    
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }

  saveNote(note);

  // UX Reset based on locking preference
  if (!isContextLocked) {
      noteInput.value = "";
      titleInput.value = "";
      tagInput.value = "";
      currentNoteType = 'standard';
      document.querySelectorAll('.dl-type-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.dl-type-btn[data-type="standard"]').classList.add('active');
      noteInput.placeholder = "Capture concept or paste code to trace... (Type [[ to link)";
      currentDraftLinks = [];
      renderDraftLinks();
  } else {
      // If locked, maybe just clear links/tags but keep text? Or keep nothing?
      // Currently implementation: keep text to allow refining/adding multiple notes for same thought.
      tagInput.value = ""; 
      currentDraftLinks = []; 
      renderDraftLinks();
  }
}

function captureFrame(video) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth / 2; // Resize for performance/storage
        canvas.height = video.videoHeight / 2;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.7);
    } catch (e) {
        console.error("Screenshot failed", e);
        return null;
    }
}

// --- Helper Functions ---

function checkVideoChange() {
  // Simple URL check to reset or reload data if video changes
  const newId = getVideoId();
  if (newId && newId !== currentVideoId) {
      currentVideoId = newId;
      transcriptSegments = []; // Clear old transcript
      // Attempt to fetch transcript (mock/real implementation needed)
      // In real extension, this would parse YouTube transcript panel or network requests
  }
}

// SERIES / PLAYLIST DETECTION LOGIC
function checkPlaylist() {
    const params = new URLSearchParams(window.location.search);
    const listId = params.get('list');
    const indexStr = params.get('index');
    
    const card = document.getElementById('dl-series-card');
    if (!card) return;

    if (listId) {
        currentPlaylistId = listId;
        card.classList.remove('dl-hidden');
        
        let index = parseInt(indexStr || '1');
        let total = 0;

        // Try to scrape YouTube UI for "X / Y"
        // Selector for the playlist panel index text
        const indexMsg = document.querySelector('.index-message.ytd-playlist-panel-renderer');
        if (indexMsg) {
            const text = indexMsg.textContent.trim(); // e.g. "5 / 24"
            const parts = text.split('/').map(s => parseInt(s.trim()));
            if (parts.length === 2) {
                index = parts[0];
                total = parts[1];
            }
        }

        // Fallback if total is unknown
        if (!total) total = index + 5; // fake it if we can't find it

        const progressPct = (index / total) * 100;
        
        document.getElementById('dl-series-count').textContent = `${index}/${total} Learned`;
        document.getElementById('dl-series-progress').style.width = `${progressPct}%`;
    } else {
        currentPlaylistId = null;
        card.classList.add('dl-hidden');
    }
}

function getVideoId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('v') || window.location.pathname;
}

function getPageTitle() {
  // Try YouTube specific title selector first
  const ytTitle = document.querySelector('h1.ytd-video-primary-info-renderer');
  if (ytTitle) return ytTitle.textContent.trim();
  return document.title.replace(' - YouTube', '');
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function getTranscriptSnippet(time, windowSeconds) {
    // In a real implementation, this searches 'transcriptSegments'
    // For demo purposes, returns generic text if empty
    if (!transcriptSegments.length) return "Transcript not available (enable captions)";
    
    const match = transcriptSegments.find(s => s.start <= time && (s.start + s.duration) >= time);
    return match ? match.text : "";
}

// --- Storage & Rendering ---

function loadNotes() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['deeplearn_notes'], (result) => {
            notes = result.deeplearn_notes || [];
            renderNotesList();
        });
    } else {
        const raw = localStorage.getItem('deeplearn_notes');
        if (raw) notes = JSON.parse(raw);
        renderNotesList();
    }
}

function saveNote(note) {
    // Add to memory
    notes.unshift(note); // Add to top
    renderNotesList();
    
    // Persist
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ 'deeplearn_notes': notes });
    } else {
        localStorage.setItem('deeplearn_notes', JSON.stringify(notes));
    }
}

function renderNotesList() {
    const list = document.getElementById('dl-notes-list');
    list.innerHTML = '';
    document.getElementById('dl-count').textContent = notes.length;
    
    notes.forEach(note => {
        const el = document.createElement('div');
        el.className = `dl-note-card dl-card-${note.type}`;
        el.id = `note-${note.id}`;

        let typeIcon = '';
        if (note.type === 'question') typeIcon = ICONS.typeHelp;
        else if (note.type === 'insight') typeIcon = ICONS.typeIdea;
        else if (note.type === 'bridge') typeIcon = ICONS.typeLink;
        else if (note.type === 'definition') typeIcon = ICONS.typeDef;
        else if (note.type === 'moc') typeIcon = ICONS.typeMoc;
        else typeIcon = ICONS.typeFile;

        let linksHtml = '';
        if (note.links && note.links.length > 0) {
            linksHtml = `<div class="dl-flex" style="gap:4px; flex-wrap:wrap; margin-top:8px; padding-top:4px; border-top:1px solid rgba(255,255,255,0.1);">
                <span style="opacity:0.5; font-size:10px; display:flex; align-items:center;">${ICONS.linkSmall} Mentions:</span>
                ${note.links.map(linkId => {
                    const target = notes.find(n => n.id === linkId);
                    if(!target) return '';
                    return `<span class="dl-tag" style="color:#60a5fa; cursor:pointer;" onclick="document.getElementById('note-${linkId}').scrollIntoView({behavior:'smooth'})">${formatTime(target.timestamp)}</span>`;
                }).join('')}
            </div>`;
        }
        
        // Generate Backlinks
        const backlinks = notes.filter(n => n.links && n.links.includes(note.id));
        let backlinksHtml = '';
        if (backlinks.length > 0) {
             backlinksHtml = `<div class="dl-flex" style="gap:4px; flex-wrap:wrap; margin-top:4px;">
                <span style="opacity:0.5; font-size:10px; display:flex; align-items:center;">${ICONS.arrowRight} Mentioned by:</span>
                ${backlinks.map(bn => {
                    return `<span class="dl-tag" style="color:#c084fc; cursor:pointer;" onclick="document.getElementById('note-${bn.id}').scrollIntoView({behavior:'smooth'})">${formatTime(bn.timestamp)}</span>`;
                }).join('')}
            </div>`;
        }

        el.innerHTML = `
            <div class="dl-note-header">
                <div class="dl-flex dl-items-center" style="gap:6px;">
                    <span style="opacity:0.7;">${typeIcon}</span>
                    <span class="dl-timestamp">${formatTime(note.timestamp)}</span>
                </div>
                <div class="dl-flex" style="gap:4px;">
                    <button class="dl-btn-icon" style="padding:2px;">${ICONS.trash}</button>
                </div>
            </div>
            ${note.title ? `<div class="dl-note-title">${note.title}</div>` : ''}
            <div class="dl-note-content">${note.content}</div>
            
            ${note.transcriptSnippet ? `<div class="dl-transcript-snippet">"${note.transcriptSnippet}"</div>` : ''}
            
            ${note.aiAnalysis ? `
                <div class="dl-ai-box ${note.aiMode === 'trace' ? 'trace' : ''}">
                    <div class="dl-ai-title">
                        ${note.aiMode === 'trace' ? ICONS.activity : ICONS.brain} 
                        ${note.aiMode === 'trace' ? 'MECHANICAL TRACE' : 'INTUITION'}
                    </div>
                    <div class="dl-ai-text">${note.aiAnalysis}</div>
                </div>
            ` : ''}

            ${note.screenshotUrl ? `<img src="${note.screenshotUrl}" class="dl-screenshot" />` : ''}
            
            <div class="dl-tags">
                ${note.tags.map(t => `<span class="dl-tag">#${t}</span>`).join('')}
            </div>
            
            ${linksHtml}
            ${backlinksHtml}
        `;
        
        // Setup delete listener
        const delBtn = el.querySelector('.dl-btn-icon');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm('Delete note?')) {
                notes = notes.filter(n => n.id !== note.id);
                saveNote(notes[0]); // Just trigger save, logic needs array though. 
                // Fix saveNote to accept array or handle global variable
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ 'deeplearn_notes': notes });
                } else {
                    localStorage.setItem('deeplearn_notes', JSON.stringify(notes));
                }
                renderNotesList();
            }
        });

        // Jump listener
        el.querySelector('.dl-timestamp').addEventListener('click', () => {
            const video = findVideoElement();
            if (video) video.currentTime = note.timestamp;
        });

        list.appendChild(el);
    });
}

function toggleGraph(show) {
    const modal = document.getElementById('dl-graph-modal');
    if (show) {
        modal.classList.remove('dl-hidden');
        startGraphSimulation();
    } else {
        modal.classList.add('dl-hidden');
        if (graphSimulationReq) cancelAnimationFrame(graphSimulationReq);
    }
}

function startGraphSimulation() {
    const canvas = document.getElementById('dl-graph-canvas');
    const container = document.getElementById('dl-graph-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const ctx = canvas.getContext('2d');
    
    // Simple Force Directed Layout Logic (Mock)
    // Nodes = notes
    const nodesData = notes.map(n => ({
        id: n.id,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0, vy: 0,
        type: n.type
    }));

    // Links based on note.links
    const linksData = [];
    notes.forEach(n => {
        if(n.links) {
            n.links.forEach(targetId => {
                // check if target exists
                if(nodesData.find(nd => nd.id === targetId)) {
                    linksData.push({ source: n.id, target: targetId });
                }
            });
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Links
        ctx.strokeStyle = "#3f3f46";
        ctx.lineWidth = 1;
        linksData.forEach(link => {
            const source = nodesData.find(n => n.id === link.source);
            const target = nodesData.find(n => n.id === link.target);
            if(source && target) {
                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);
                ctx.stroke();
            }
        });

        // Draw Nodes
        nodesData.forEach(node => {
            ctx.fillStyle = node.type === 'question' ? '#fbbf24' : 
                            node.type === 'insight' ? '#c084fc' : 
                            node.type === 'bridge' ? '#60a5fa' : 
                            node.type === 'definition' ? '#10b981' : 
                            node.type === 'moc' ? '#f43f5e' : '#e4e4e7';
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Basic text
            ctx.fillStyle = "#71717a";
            ctx.font = "10px sans-serif";
            // ctx.fillText(node.id.substring(0,4), node.x + 6, node.y + 3); 
        });

        // Very dumb physics to drift them to center
        nodesData.forEach(node => {
            const dx = (canvas.width / 2) - node.x;
            const dy = (canvas.height / 2) - node.y;
            node.x += dx * 0.005;
            node.y += dy * 0.005;
        });

        graphSimulationReq = requestAnimationFrame(animate);
    }
    animate();
}

function handleExportAction(format) {
    const date = new Date().toISOString().split('T')[0];
    if (format === 'SINGLE_FILE') {
        let content = `# Deep Learning Notes\n\n`;
        notes.forEach(n => {
            content += `### ${n.title || 'Note'} (${formatTime(n.timestamp)})\n${n.content}\n\n`;
        });
        downloadFile(content, `notes_${date}.md`, 'text/markdown');
    } else if (format === 'JSON') {
        downloadFile(JSON.stringify(notes, null, 2), `notes_${date}.json`, 'application/json');
    } else if (format === 'ANKI') {
        // Simple CSV for Anki
        let csv = "";
        notes.forEach(n => {
            // cleanup text for CSV
            const front = (n.content || "").replace(/"/g, '""').replace(/\n/g, " ");
            const back = `${n.title} <br> ${n.aiAnalysis || ''}`.replace(/"/g, '""').replace(/\n/g, " ");
            csv += `"${front}","${back}"\n`;
        });
        downloadFile(csv, `anki_${date}.csv`, 'text/csv');
    }
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function startDistractionGuard() {
    // Simple idle checker
    setInterval(() => {
        const now = Date.now();
        const guard = document.getElementById('dl-guard');
        if (!guard) return;
        
        if (now - lastInteractionTime > 300000) { // 5 mins
            guard.classList.add('warning');
            guard.innerHTML = '<span>⚠️ Focus?</span>';
        } else {
            guard.classList.remove('warning');
            guard.innerHTML = '<span>Focus</span>';
        }
    }, 60000);
}

// Boot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
