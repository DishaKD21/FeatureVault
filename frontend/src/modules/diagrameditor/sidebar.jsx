'use client';

import React from 'react';

/* ─── SVG Icon Components ─── */
const Icons = {
  cursor: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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
  circle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  diamond: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 10-10 10L2 12z" />
    </svg>
  ),
  arrowRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
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
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
};

/* ─── Node definitions ─── */
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

/* ─── Mode Button ─── */
function ModeButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
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
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── Node Library Item ─── */
function NodeItem({ item, mode, onClickAdd }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', item.type);
    event.dataTransfer.setData('application/reactflow-label', item.label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable={mode === 'select'}
      onDragStart={onDragStart}
      onClick={() => mode === 'add-node' && onClickAdd(item.type, item.label)}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent
        transition-all duration-150 group
        ${mode === 'add-node'
          ? 'cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 active:scale-[0.97]'
          : 'cursor-grab active:cursor-grabbing hover:bg-gray-50 hover:border-gray-200'
        }
      `}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150"
        style={{ backgroundColor: `${item.color}12`, color: item.color }}
      >
        {item.icon}
      </div>
      <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
      {mode === 'add-node' && (
        <span className="ml-auto text-[11px] text-gray-300 group-hover:text-indigo-400 transition-colors">click</span>
      )}
      {mode === 'select' && (
        <span className="ml-auto text-[11px] text-gray-300 group-hover:text-gray-400 transition-colors">drag</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN SIDEBAR
   ═══════════════════════════════════════ */
export default function Sidebar({
  mode,
  setMode,
  onAddNode,
  onDeleteSelected,
  onSelectAll,
  onFitView,
  selectedCount = { nodes: 0, edges: 0 },
  edgeSourceNode,
}) {
  const totalSelected = selectedCount.nodes + selectedCount.edges;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-[280px] flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-200/60 overflow-hidden z-10">

      {/* ─── Header ─── */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">Diagram Editor</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">Build your diagram visually</p>
      </div>

      {/* ─── Mode Switcher ─── */}
      <div className="px-3 py-3 border-b border-gray-100">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl">
          <ModeButton icon={Icons.cursor} label="Select" active={mode === 'select'} onClick={() => setMode('select')} />
          <ModeButton icon={Icons.plus} label="Node" active={mode === 'add-node'} onClick={() => setMode('add-node')} />
          <ModeButton icon={Icons.link} label="Edge" active={mode === 'add-edge'} onClick={() => setMode('add-edge')} />
        </div>
      </div>

      {/* ─── Edge Mode Hint ─── */}
      {mode === 'add-edge' && (
        <div className="mx-3 mt-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-[12px] font-medium text-indigo-700">
            {edgeSourceNode
              ? '✓ Source selected — now click the target node'
              : '① Click the source node first'
            }
          </p>
          <p className="text-[11px] text-indigo-400 mt-0.5">
            {edgeSourceNode ? 'Click any other node to create an edge' : 'Select two nodes sequentially to connect them'}
          </p>
        </div>
      )}

      {/* ─── Scrollable Content ─── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">

        {/* Node Library */}
        {(mode === 'select' || mode === 'add-node') && (
          <>
            {nodeLibrary.map((group) => (
              <Section key={group.category} title={group.category}>
                <div className="space-y-0.5 pb-2">
                  {group.items.map((item) => (
                    <NodeItem
                      key={item.type + item.label}
                      item={item}
                      mode={mode}
                      onClickAdd={onAddNode}
                    />
                  ))}
                </div>
              </Section>
            ))}
          </>
        )}

      </div>

      {/* ─── Bottom Actions ─── */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-2">

        {/* Selection info */}
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

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            title="Select All"
          >
            {Icons.selectAll}
            Select All
          </button>
          <button
            onClick={onFitView}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            title="Fit View"
          >
            {Icons.zoomFit}
            Fit View
          </button>
        </div>

        {/* Delete */}
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