'use client';

import React from 'react';

/* ─── SVG Icon Components ─── */
const Icons = {
  cursor: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  ),
  box: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
  ),
  input: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  ),
  output: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  ),
  group: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="9" height="9" rx="2" /><rect x="13" y="13" width="9" height="9" rx="2" />
      <rect x="13" y="2" width="9" height="9" rx="2" opacity="0.4" /><rect x="2" y="13" width="9" height="9" rx="2" opacity="0.4" />
    </svg>
  ),
  note: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  selectAll: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
    </svg>
  ),
  zoomFit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
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
};

/* ─── Node Library ─── */
const nodeLibrary = [
  {
    category: 'Basic Shapes',
    items: [
      { type: 'default', label: 'Rectangle', icon: Icons.box, color: '#6366f1' },
      { type: 'input', label: 'Input', icon: Icons.input, color: '#10b981' },
      { type: 'output', label: 'Output', icon: Icons.output, color: '#f97316' },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { type: 'group', label: 'Group', icon: Icons.group, color: '#8b5cf6' },
      { type: 'annotation', label: 'Note', icon: Icons.note, color: '#eab308' },
    ],
  },
];

/* ─── Edge Style Definitions ─── */
const edgeStyles = [
  { id: 'smoothstep', label: 'Smooth', preview: '─╮' },
  { id: 'bezier', label: 'Curve', preview: '∿' },
  { id: 'step', label: 'Sharp', preview: '┐' },
  { id: 'straight', label: 'Straight', preview: '─' },
];

const edgeLineStyles = [
  { id: 'solid', label: 'Solid', dasharray: '' },
  { id: 'dashed', label: 'Dashed', dasharray: '8 4' },
  { id: 'dotted', label: 'Dotted', dasharray: '2 3' },
];

/* ─── Text Color Palette ─── */
const colorPalette = [
  '#1f2937', '#6b7280', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7',
  '#ec4899', '#ffffff',
];

/* ─── Font Sizes ─── */
const fontSizes = [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32];

/* ─── Mode Button ─── */
function ModeButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150
        ${active
          ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ─── Collapsible Section ─── */
function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-1 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors"
      >
        {title}
        <span className={`transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}>
          {Icons.chevronDown}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── Node Library Item (drag only) ─── */
function NodeItem({ item }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', item.type);
    event.dataTransfer.setData('application/reactflow-label', item.label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent cursor-grab active:cursor-grabbing hover:bg-gray-50 hover:border-gray-200 transition-all duration-150 group"
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150"
        style={{ backgroundColor: `${item.color}12`, color: item.color }}
      >
        {item.icon}
      </div>
      <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
      <span className="ml-auto text-[11px] text-gray-300 group-hover:text-gray-400 transition-colors">drag</span>
    </div>
  );
}

/* ─── Small Toggle Button ─── */
function ToggleBtn({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center w-8 h-8 rounded-lg text-[13px] transition-all duration-100
        ${active
          ? 'bg-indigo-100 text-indigo-600 ring-1 ring-indigo-200'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }
      `}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   MAIN SIDEBAR
   ═══════════════════════════════════════ */
export default function Sidebar({
  mode,
  setMode,
  onDeleteSelected,
  onSelectAll,
  onFitView,
  selectedCount = { nodes: 0, edges: 0 },
  edgeSourceNode,
  /* Edge style props */
  edgeType,
  setEdgeType,
  edgeLineStyle,
  setEdgeLineStyle,
  edgeAnimated,
  setEdgeAnimated,
  edgeColor,
  setEdgeColor,
  /* Node text formatting props */
  selectedNodeData,
  onUpdateNodeStyle,
}) {
  const totalSelected = selectedCount.nodes + selectedCount.edges;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[280px] flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-200/60 overflow-hidden z-10">

      {/* ─── Header ─── */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">Diagram Editor</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">Build your diagram visually</p>
      </div>

      {/* ─── Mode Switcher (Select & Edge only) ─── */}
      <div className="px-3 py-3 border-b border-gray-100">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl">
          <ModeButton icon={Icons.cursor} label="Select" active={mode === 'select'} onClick={() => setMode('select')} />
          <ModeButton icon={Icons.link} label="Edge" active={mode === 'add-edge'} onClick={() => setMode('add-edge')} />
        </div>
      </div>

      {/* ─── Scrollable Content ─── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">

        {/* ─── Edge Mode: Style Picker ─── */}
        {mode === 'add-edge' && (
          <>
            {/* Hint */}
            <div className="px-3 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl mb-3">
              <p className="text-[12px] font-medium text-indigo-700">
                {edgeSourceNode
                  ? '✓ Source selected — click the target node'
                  : '① Click the source node first'
                }
              </p>
              <p className="text-[11px] text-indigo-400 mt-0.5">
                {edgeSourceNode ? 'Click any other node to create an edge' : 'Select two nodes to connect them'}
              </p>
            </div>

            <Section title="Edge Shape">
              <div className="grid grid-cols-2 gap-1.5 pb-3">
                {edgeStyles.map((es) => (
                  <button
                    key={es.id}
                    onClick={() => setEdgeType(es.id)}
                    className={`
                      flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium transition-all duration-100 border
                      ${edgeType === es.id
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'text-gray-500 hover:bg-gray-50 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <span className="text-[15px] leading-none">{es.preview}</span>
                    {es.label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Line Style">
              <div className="flex gap-1.5 pb-3">
                {edgeLineStyles.map((ls) => (
                  <button
                    key={ls.id}
                    onClick={() => setEdgeLineStyle(ls.id)}
                    className={`
                      flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-[11px] font-medium transition-all duration-100 border
                      ${edgeLineStyle === ls.id
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'text-gray-500 hover:bg-gray-50 border-transparent hover:border-gray-200'
                      }
                    `}
                  >
                    <svg width="40" height="4" viewBox="0 0 40 4">
                      <line
                        x1="0" y1="2" x2="40" y2="2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={ls.dasharray || undefined}
                      />
                    </svg>
                    {ls.label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Options">
              <div className="space-y-2 pb-3">
                {/* Animated toggle */}
                <label className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className="text-[12px] font-medium text-gray-600">Animated</span>
                  <div
                    onClick={() => setEdgeAnimated(!edgeAnimated)}
                    className={`w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer flex items-center ${edgeAnimated ? 'bg-indigo-500' : 'bg-gray-200'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${edgeAnimated ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                  </div>
                </label>

                {/* Edge color */}
                <div className="px-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2">Edge Color</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['#6366f1', '#ef4444', '#22c55e', '#f97316', '#06b6d4', '#8b5cf6', '#ec4899', '#1f2937'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setEdgeColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-100 ${edgeColor === c ? 'border-gray-800 scale-110' : 'border-gray-200 hover:scale-105'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </>
        )}

        {/* ─── Select Mode: Node Library + Text Formatting ─── */}
        {mode === 'select' && (
          <>
            {/* Node Library */}
            {nodeLibrary.map((group) => (
              <Section key={group.category} title={group.category}>
                <div className="space-y-0.5 pb-2">
                  {group.items.map((item) => (
                    <NodeItem key={item.type + item.label} item={item} />
                  ))}
                </div>
              </Section>
            ))}

            {/* ─── Text Formatting (shown when a node is selected) ─── */}
            {selectedNodeData && (
              <Section title="Text Formatting" defaultOpen={true}>
                <div className="space-y-3 pb-3">
                  {/* Font size */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium w-10">Size</span>
                    <select
                      value={selectedNodeData.fontSize || 14}
                      onChange={(e) => onUpdateNodeStyle({ fontSize: Number(e.target.value) })}
                      className="flex-1 px-2 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    >
                      {fontSizes.map((s) => (
                        <option key={s} value={s}>{s}px</option>
                      ))}
                    </select>
                  </div>

                  {/* Bold, Italic, Underline, Alignment */}
                  <div className="flex items-center gap-1">
                    <ToggleBtn
                      active={selectedNodeData.fontWeight === 'bold'}
                      onClick={() => onUpdateNodeStyle({ fontWeight: selectedNodeData.fontWeight === 'bold' ? 'normal' : 'bold' })}
                      title="Bold"
                    >
                      {Icons.bold}
                    </ToggleBtn>
                    <ToggleBtn
                      active={selectedNodeData.fontStyle === 'italic'}
                      onClick={() => onUpdateNodeStyle({ fontStyle: selectedNodeData.fontStyle === 'italic' ? 'normal' : 'italic' })}
                      title="Italic"
                    >
                      {Icons.italic}
                    </ToggleBtn>
                    <ToggleBtn
                      active={selectedNodeData.textDecoration === 'underline'}
                      onClick={() => onUpdateNodeStyle({ textDecoration: selectedNodeData.textDecoration === 'underline' ? 'none' : 'underline' })}
                      title="Underline"
                    >
                      {Icons.underline}
                    </ToggleBtn>

                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    <ToggleBtn
                      active={selectedNodeData.textAlign === 'left' || !selectedNodeData.textAlign}
                      onClick={() => onUpdateNodeStyle({ textAlign: 'left' })}
                      title="Align Left"
                    >
                      {Icons.alignLeft}
                    </ToggleBtn>
                    <ToggleBtn
                      active={selectedNodeData.textAlign === 'center'}
                      onClick={() => onUpdateNodeStyle({ textAlign: 'center' })}
                      title="Align Center"
                    >
                      {Icons.alignCenter}
                    </ToggleBtn>
                  </div>

                  {/* Text color */}
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium block mb-1.5">Text Color</span>
                    <div className="flex flex-wrap gap-1.5">
                      {colorPalette.map((c) => (
                        <button
                          key={c}
                          onClick={() => onUpdateNodeStyle({ color: c })}
                          className={`w-6 h-6 rounded-full border-2 transition-all duration-100 ${selectedNodeData.color === c ? 'border-gray-800 scale-110' : 'border-gray-200 hover:scale-105'} ${c === '#ffffff' ? 'ring-1 ring-gray-200' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Background color */}
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium block mb-1.5">Node Background</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['#ffffff', '#f8fafc', '#fef3c7', '#dcfce7', '#dbeafe', '#ede9fe', '#fce7f3', '#fee2e2', '#e0e7ff', '#f0fdf4', '#1f2937', '#0f172a'].map((c) => (
                        <button
                          key={c}
                          onClick={() => onUpdateNodeStyle({ bgColor: c })}
                          className={`w-6 h-6 rounded-full border-2 transition-all duration-100 ${selectedNodeData.bgColor === c ? 'border-gray-800 scale-110' : 'border-gray-200 hover:scale-105'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Section>
            )}
          </>
        )}
      </div>

      {/* ─── Bottom Actions ─── */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-2">
        {totalSelected > 0 && (
          <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg">
            <span className="text-[12px] text-gray-500">
              {selectedCount.nodes > 0 && `${selectedCount.nodes} node${selectedCount.nodes > 1 ? 's' : ''}`}
              {selectedCount.nodes > 0 && selectedCount.edges > 0 && ', '}
              {selectedCount.edges > 0 && `${selectedCount.edges} edge${selectedCount.edges > 1 ? 's' : ''}`}
              {' '}selected
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {Icons.selectAll}
            Select All
          </button>
          <button
            onClick={onFitView}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {Icons.zoomFit}
            Fit View
          </button>
        </div>

        <button
          onClick={onDeleteSelected}
          disabled={totalSelected === 0}
          className={`
            w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
            ${totalSelected > 0
              ? 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.98] border border-red-200'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-transparent'
            }
          `}
        >
          {Icons.trash}
          Delete Selected{totalSelected > 0 ? ` (${totalSelected})` : ''}
        </button>
      </div>
    </div>
  );
}