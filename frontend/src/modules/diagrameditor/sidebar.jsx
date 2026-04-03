'use client';

import React, { useState, useEffect } from 'react';

/* ─── SVG Icon Components ─── */
const Icons = {
  cursor: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
  ),
  hand: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v4"/><path d="M14 10V5a2 2 0 0 0-4 0v5"/><path d="M10 10.5V4a2 2 0 0 0-4 0v9.5"/><path d="M6 14v-1.5a2 2 0 0 0-4 0v4C2 21 5 23 9 23h2.5c2.5 0 5-1.5 6.5-4l3-6a3 3 0 0 0-3-4V6z"/>
    </svg>
  ),
  nodeIcon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" /><circle cx="17" cy="17" r="4" fill="currentColor" />
    </svg>
  ),
  edgeIcon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h4a2 2 0 0 1 2 2v4" />
    </svg>
  ),
  textStyle: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
      <path d="M17 17l2 2m-2-2l-2 2m2-2v-4" strokeWidth="1.5" />
    </svg>
  ),
  palette: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2A10 10 0 0 0 2 12c0 5.5 4.5 10 10 10 2.2 0 4-1.8 4-4 0-.4-.1-.8-.3-1.1-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h1.3c2.4 0 4.4-1.9 4.4-4.2A9.8 9.8 0 0 0 12 2Z" />
      <circle cx="6.5" cy="12.5" r="1.5" /><circle cx="10" cy="7.5" r="1.5" /><circle cx="15.5" cy="9.5" r="1.5" />
    </svg>
  ),
  save: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  trash: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" />
    </svg>
  ),
  zoomFit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  ),
  bold: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
    </svg>
  ),
  italic: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  underline: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" /><line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  alignLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  ),
  alignCenter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
    </svg>
  ),
  box: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
  ),
  input: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </svg>
  ),
  output: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
    </svg>
  ),
  note: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
};

/* ─── Predefined Data ─── */
const NEON_GREEN = '#c4f042';
const NEON_PURPLE = '#b95cf2';

const TABS = [
  { id: 'select', icon: Icons.cursor, activeColor: NEON_GREEN, title: 'Select' },
  { id: 'pan', icon: Icons.hand, activeColor: NEON_GREEN, title: 'Pan Canvas' },
  { id: 'nodes', icon: Icons.nodeIcon, activeColor: NEON_GREEN, title: 'Node Library' },
  { id: 'edge', icon: Icons.edgeIcon, activeColor: NEON_GREEN, title: 'Edges' },
  { id: 'text', icon: Icons.textStyle, activeColor: NEON_GREEN, title: 'Text Formatting' },
  { id: 'palette', icon: Icons.palette, activeColor: NEON_PURPLE, title: 'Styles & Colors' },
];

const colorPalette = [
  '#c4f042', '#34d399', '#22d3ee', '#38bdf8', '#818cf8', '#b95cf2',
  '#f0abfc', '#f43f5e', '#fb923c', '#fbbf24', '#a3e635', '#4ade80',
  '#2dd4bf', '#0ea5e9', '#6366f1', '#d946ef', '#e11d48', '#ea580c',
];

const bgColorPalette = [
  '#1B1B29', '#2A2D3E', '#ffffff', '#f8fafc', '#fef3c7', '#dcfce7',
  '#dbeafe', '#ede9fe', '#fce7f3', '#fee2e2', '#e0e7ff', '#f0fdf4'
];

const edgeStyles = [
  { id: 'smoothstep', label: 'Smooth', preview: '─╮' },
  { id: 'bezier', label: 'Curve', preview: '∿' },
  { id: 'step', label: 'Sharp', preview: '┐' },
  { id: 'straight', label: 'Straight', preview: '─' },
];

const nodeLibrary = [
  { type: 'default', label: 'Rectangle', icon: Icons.box, color: NEON_GREEN },
  { type: 'input', label: 'Input Node', icon: Icons.input, color: '#38bdf8' },
  { type: 'output', label: 'Output Node', icon: Icons.output, color: '#fb923c' },
  { type: 'annotation', label: 'Note', icon: Icons.note, color: '#fbbf24' },
];

const fontSizes = [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32];

/* ─── Subcomponents ─── */
function Section({ title, children, theme }) {
  return (
    <div className="mb-6">
      <div className={`text-[13px] font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</div>
      {children}
    </div>
  );
}

function ToggleBtn({ active, onClick, children, title, theme }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
        ${active
          ? theme === 'dark' ? 'bg-white/10 text-white shadow-sm border border-white/20' : 'bg-gray-100 text-gray-900 shadow-sm border border-gray-300'
          : theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
        }
      `}
    >
      {children}
    </button>
  );
}

function NodeItem({ item, theme }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', item.type);
    event.dataTransfer.setData('application/reactflow-label', item.label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent cursor-grab active:cursor-grabbing transition-all duration-200 group ${theme === 'dark' ? 'hover:bg-white/5 hover:border-white/10' : 'hover:bg-gray-50 hover:border-gray-200'}`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}
        style={{ color: item.color }}
      >
        {item.icon}
      </div>
      <span className={`text-[14px] font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{item.label}</span>
      <span className="ml-auto text-[11px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">drag</span>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN SIDEBAR COMPONENT
   ═══════════════════════════════════════ */
export default function Sidebar({
  mode,
  setMode,
  onDeleteSelected,
  onSelectAll,
  onFitView,
  onSave,
  isSaving = false,
  selectedCount = { nodes: 0, edges: 0 },
  edgeSourceNode,
  edgeType,
  setEdgeType,
  edgeLineStyle,
  setEdgeLineStyle,
  edgeAnimated,
  setEdgeAnimated,
  edgeColor,
  setEdgeColor,
  selectedNodeData,
  onUpdateNodeStyle,
  theme = 'dark',
}) {
  const [activeTab, setActiveTab] = useState(null); // Default closed
  
  // Sync UI state when mode changes externally (e.g. hitting escape)
  useEffect(() => {
    if (mode === 'select' && ['edge', 'pan'].includes(activeTab)) setActiveTab('nodes');
    if (mode === 'add-edge' && activeTab !== 'edge') setActiveTab('edge');
    if (mode === 'pan' && activeTab !== 'pan') setActiveTab('pan');
  }, [mode]);

  const handleTabClick = (tabId) => {
    if (activeTab === tabId) {
      setActiveTab(null);
      return;
    }
    setActiveTab(tabId);
    
    // Switch modes based on selected tab
    if (['select', 'nodes', 'text', 'palette'].includes(tabId)) {
      if (mode !== 'select') setMode('select');
    } else if (tabId === 'edge') {
      if (mode !== 'add-edge') setMode('add-edge');
    } else if (tabId === 'pan') {
      if (mode !== 'pan') setMode('pan');
    }
  };

  const totalSelected = selectedCount.nodes + selectedCount.edges;
  const isDrawerOpen = activeTab && activeTab !== 'pan';

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-start z-10 pointer-events-none">
      
      {/* ─── Floating Vertical Toolbar ─── */}
      <div className={`w-[60px] flex flex-col items-center py-4 backdrop-blur-2xl rounded-[18px] border shadow-[0_8px_40px_rgba(0,0,0,0.2)] pointer-events-auto ${theme === 'dark' ? 'bg-[#1B1B29]/95 border-white/5' : 'bg-white/95 border-gray-200'}`}>
        <div className="flex flex-col gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                title={tab.title}
                className={`
                  relative w-[44px] h-[44px] flex items-center justify-center rounded-2xl transition-all duration-300
                  ${isActive 
                    ? `text-[${tab.activeColor}]` 
                    : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                style={{
                  color: isActive ? tab.activeColor : undefined,
                  backgroundColor: isActive ? `${tab.activeColor}1A` : undefined,
                  boxShadow: isActive ? `0 0 20px ${tab.activeColor}33` : undefined,
                }}
              >
                {tab.icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Expandable Drawer ─── */}
      <div 
        className={`
          ml-4 transition-all duration-400 ease-out origin-left pointer-events-auto
          ${isDrawerOpen ? 'w-[280px] opacity-100 scale-100 translate-x-0' : 'w-0 opacity-0 scale-95 -translate-x-4 pointer-events-none'}
        `}
      >
        <div className={`w-[280px] max-h-[85vh] overflow-y-auto custom-scrollbar backdrop-blur-2xl rounded-2xl border shadow-[0_8px_40px_rgba(0,0,0,0.2)] ${theme === 'dark' ? 'bg-[rgba(27,27,41,0.92)] border-white/5 text-white' : 'bg-white/95 border-gray-200 text-gray-800'}`}>
          <div className="p-5">
            
            {/* Drawer Header */}
            <div className="mb-6 flex items-center justify-between">
               <h2 className={`text-[16px] font-semibold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                 {TABS.find(t => t.id === activeTab)?.title || 'Settings'}
               </h2>
               <button onClick={() => setActiveTab(null)} className={`transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
            </div>

            {/* --- Content: SELECT / ACTIONS --- */}
            {activeTab === 'select' && (
              <div className="space-y-4">
                <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select nodes and edges on the canvas to move, edit, or delete them.
                </p>
                <div className="space-y-2">
                  <button onClick={onSelectAll} className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-200 hover:text-white' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900'}`}>
                    {Icons.zoomFit} Select All
                  </button>
                  <button onClick={onFitView} className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-200 hover:text-white' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:text-gray-900'}`}>
                    {Icons.zoomFit} Center View
                  </button>
                  <button onClick={onDeleteSelected} disabled={totalSelected === 0} className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${totalSelected > 0 ? (theme === 'dark' ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100') : (theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-500 opacity-50 cursor-not-allowed' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-50 cursor-not-allowed')}`}>
                    {Icons.trash} Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* --- Content: NODES --- */}
            {activeTab === 'nodes' && (
              <div className="space-y-1">
                {nodeLibrary.map((item) => (
                  <NodeItem key={item.type + item.label} item={item} theme={theme} />
                ))}
              </div>
            )}

            {/* --- Content: EDGES (Now also slightly simplified based on image) --- */}
            {(activeTab === 'edge') && (
              <div className="space-y-6">
                
                {edgeSourceNode && (
                  <div className="px-3 py-2.5 bg-[#c4f042]/10 border border-[#c4f042]/20 rounded-xl mb-4">
                    <p className="text-[12px] font-medium text-[#c4f042]">✓ Source selected</p>
                    <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Click target node to connect</p>
                  </div>
                )}

                <Section title="Connection Logic" theme={theme}>
                  <div className="grid grid-cols-2 gap-2">
                    {edgeStyles.map((es) => (
                      <button
                        key={es.id}
                        onClick={() => setEdgeType(es.id)}
                        className={`
                          flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 border
                          ${edgeType === es.id
                            ? 'bg-[#c4f042]/10 text-[#c4f042] border-[#c4f042]/30 shadow-[0_0_15px_rgba(196,240,66,0.1)]'
                            : theme === 'dark' ? 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <span className="text-[16px] leading-none">{es.preview}</span>
                        {es.label}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Line Style" theme={theme}>
                  <div className="flex flex-col gap-2 text-sm">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={edgeLineStyle === 'solid'} onChange={() => setEdgeLineStyle('solid')} className="accent-[#c4f042] w-4 h-4" />
                        <span className={`transition-colors ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>Solid</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={edgeLineStyle === 'dashed'} onChange={() => setEdgeLineStyle('dashed')} className="accent-[#c4f042] w-4 h-4" />
                        <span className={`transition-colors ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>Dashed</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={edgeLineStyle === 'dotted'} onChange={() => setEdgeLineStyle('dotted')} className="accent-[#c4f042] w-4 h-4" />
                        <span className={`transition-colors ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>Dotted</span>
                     </label>
                  </div>
                </Section>
              </div>
            )}

            {/* --- Content: TEXT FORMATTING --- */}
            {activeTab === 'text' && (
              <div className="space-y-6">
                {!selectedNodeData ? (
                  <div className={`text-sm italic p-4 text-center border rounded-xl ${theme === 'dark' ? 'text-gray-500 border-white/5 bg-white/5' : 'text-gray-400 border-gray-100 bg-gray-50'}`}>
                    Select a node to format its text.
                  </div>
                ) : (
                  <>
                    <Section title="Font Size" theme={theme}>
                      <select
                        value={selectedNodeData.fontSize || 14}
                        onChange={(e) => onUpdateNodeStyle({ fontSize: Number(e.target.value) })}
                        className={`w-full px-3 py-2.5 text-[13px] border rounded-xl focus:outline-none focus:border-[#c4f042] transition-colors appearance-none cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                      >
                        {fontSizes.map((s) => (
                          <option key={s} value={s} className={theme === 'dark' ? 'bg-[#1A1D2D] text-white' : 'bg-white text-gray-900'}>{s} px</option>
                        ))}
                      </select>
                    </Section>

                    <Section title="Styling" theme={theme}>
                      <div className={`flex items-center gap-2 p-1.5 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <ToggleBtn
                          active={selectedNodeData.fontWeight === 'bold'}
                          onClick={() => onUpdateNodeStyle({ fontWeight: selectedNodeData.fontWeight === 'bold' ? 'normal' : 'bold' })}
                          theme={theme}
                        >
                          {Icons.bold}
                        </ToggleBtn>
                        <ToggleBtn
                          active={selectedNodeData.fontStyle === 'italic'}
                          onClick={() => onUpdateNodeStyle({ fontStyle: selectedNodeData.fontStyle === 'italic' ? 'normal' : 'italic' })}
                          theme={theme}
                        >
                          {Icons.italic}
                        </ToggleBtn>
                        <ToggleBtn
                          active={selectedNodeData.textDecoration === 'underline'}
                          onClick={() => onUpdateNodeStyle({ textDecoration: selectedNodeData.textDecoration === 'underline' ? 'none' : 'underline' })}
                          theme={theme}
                        >
                          {Icons.underline}
                        </ToggleBtn>
                        <div className={`w-px h-6 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                        <ToggleBtn
                          active={selectedNodeData.textAlign === 'left' || !selectedNodeData.textAlign}
                          onClick={() => onUpdateNodeStyle({ textAlign: 'left' })}
                          theme={theme}
                        >
                          {Icons.alignLeft}
                        </ToggleBtn>
                        <ToggleBtn
                          active={selectedNodeData.textAlign === 'center'}
                          onClick={() => onUpdateNodeStyle({ textAlign: 'center' })}
                          theme={theme}
                        >
                          {Icons.alignCenter}
                        </ToggleBtn>
                      </div>
                    </Section>

                    <Section title="Text Color" theme={theme}>
                      <div className="grid grid-cols-6 gap-2">
                        {colorPalette.map((c) => (
                          <button
                            key={c}
                            onClick={() => onUpdateNodeStyle({ color: c })}
                            className={`w-7 h-7 rounded-lg transition-all duration-200 ${selectedNodeData.color === c ? `ring-2 scale-110 shadow-lg ${theme === 'dark' ? 'ring-white' : 'ring-gray-800'}` : 'ring-1 ring-black/20 hover:scale-105'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </Section>
                  </>
                )}
              </div>
            )}

            {/* --- Content: PALETTE (Colors & Options) --- */}
            {activeTab === 'palette' && (
              <div className="space-y-6">
                
                {/* Node Style Colors */}
                <Section title="Professional Color" theme={theme}>
                   <div className="grid grid-cols-6 gap-2">
                     {colorPalette.map((c) => (
                       <button
                         key={c}
                         onClick={() => {
                           if (selectedNodeData) onUpdateNodeStyle({ color: c, bgColor: `${c}1A` });
                           setEdgeColor(c);
                         }}
                         className={`w-8 h-8 rounded-lg shadow-sm transition-all duration-200 ${(selectedNodeData?.color === c || edgeColor === c) ? `ring-2 scale-110 z-10 ${theme === 'dark' ? 'ring-white' : 'ring-gray-800'}` : 'hover:scale-110 hover:z-10'}`}
                         style={{ backgroundColor: c }}
                         title="Applies to selected node or new edges"
                       />
                     ))}
                   </div>
                </Section>

                {/* Node Background Colors */}
                {selectedNodeData && (
                  <Section title="Node Fill Base" theme={theme}>
                    <div className="grid grid-cols-6 gap-2">
                      {bgColorPalette.map((bc) => (
                        <button
                          key={bc}
                          onClick={() => onUpdateNodeStyle({ bgColor: bc })}
                          className={`w-8 h-8 rounded-lg shadow-sm transition-all duration-200 ${selectedNodeData.bgColor === bc ? `ring-2 scale-110 z-10 ${theme === 'dark' ? 'ring-white' : 'ring-gray-800'}` : `ring-1 hover:scale-110 hover:z-10 ${theme === 'dark' ? 'ring-white/10' : 'ring-black/10'}`}`}
                          style={{ backgroundColor: bc }}
                        />
                      ))}
                    </div>
                  </Section>
                )}

                <div className={`flex items-center justify-between py-3 border-y ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
                   <span className={`text-[13px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Motion Edge Flow</span>
                   <div
                     onClick={() => setEdgeAnimated(!edgeAnimated)}
                     className={`w-11 h-6 rounded-full transition-all duration-300 cursor-pointer flex items-center p-1 ${edgeAnimated ? 'bg-[#b95cf2] shadow-[0_0_12px_rgba(185,92,242,0.4)]' : (theme === 'dark' ? 'bg-white/10' : 'bg-gray-200')}`}
                   >
                     <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${edgeAnimated ? 'translate-x-5' : 'translate-x-0'}`} />
                   </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
      
    </div>
  );
}