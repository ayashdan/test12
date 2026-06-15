import { MUSCLE_COLORS } from '../data/exercises'

// Which muscles are primarily visible on back view
const BACK_PRIMARY = new Set(['Back', 'Glutes', 'Hamstrings'])

// ─── FRONT VIEW SVG ────────────────────────────────────────────────────────
function FrontFigure({ highlighted = [], color = '#f97316' }) {
  const h = (m) => highlighted.includes(m)
  const mc = (m) => MUSCLE_COLORS[m] || color
  const glow = (m) => `drop-shadow(0 0 6px ${mc(m)}cc)`

  return (
    <svg viewBox="0 0 200 340" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2d4a6e" />
          <stop offset="100%" stopColor="#162236" />
        </radialGradient>
      </defs>

      {/* ── HEAD ── */}
      <ellipse cx="100" cy="22" rx="18" ry="20" fill="#1e3a5a" />
      {/* neck */}
      <rect x="92" y="38" width="16" height="12" rx="4" fill="#1e3a5a" />

      {/* ── TRAPS ── */}
      <path d="M84 50 Q100 45 116 50 L118 58 Q100 54 82 58 Z"
        fill={h('Traps') ? mc('Traps') : '#243d5c'}
        style={h('Traps') ? { filter: glow('Traps') } : {}} />

      {/* ── SHOULDERS (deltoids) ── */}
      {/* Left delt */}
      <ellipse cx="72" cy="70" rx="14" ry="16"
        fill={h('Shoulders') ? mc('Shoulders') : '#1f3654'}
        style={h('Shoulders') ? { filter: glow('Shoulders') } : {}} />
      {/* Right delt */}
      <ellipse cx="128" cy="70" rx="14" ry="16"
        fill={h('Shoulders') ? mc('Shoulders') : '#1f3654'}
        style={h('Shoulders') ? { filter: glow('Shoulders') } : {}} />

      {/* ── CHEST ── */}
      {/* Left pec */}
      <path d="M86 60 Q100 58 114 60 L116 82 Q100 86 84 82 Z"
        fill={h('Chest') ? mc('Chest') : '#1d3454'}
        style={h('Chest') ? { filter: glow('Chest') } : {}} />
      {/* Chest center line */}
      <line x1="100" y1="60" x2="100" y2="86" stroke="#0f1f35" strokeWidth="1.5" />
      {/* Chest bottom curve */}
      <path d="M84 82 Q100 88 116 82" stroke="#0f1f35" strokeWidth="1" fill="none" />

      {/* ── UPPER ARMS ── */}
      {/* Left bicep */}
      <path d="M60 76 Q54 80 52 94 L54 108 Q60 112 66 110 L68 96 Q68 82 64 78 Z"
        fill={h('Biceps') ? mc('Biceps') : '#1a3050'}
        style={h('Biceps') ? { filter: glow('Biceps') } : {}} />
      {/* Right bicep */}
      <path d="M140 76 Q146 80 148 94 L146 108 Q140 112 134 110 L132 96 Q132 82 136 78 Z"
        fill={h('Biceps') ? mc('Biceps') : '#1a3050'}
        style={h('Biceps') ? { filter: glow('Biceps') } : {}} />

      {/* Left tricep (side) */}
      <path d="M64 78 Q70 82 70 96 L68 110 Q62 112 58 106 L56 94 Q56 80 60 76 Z"
        fill={h('Triceps') ? mc('Triceps') : '#162848'}
        style={h('Triceps') ? { filter: glow('Triceps') } : {}} />
      {/* Right tricep (side) */}
      <path d="M136 78 Q130 82 130 96 L132 110 Q138 112 142 106 L144 94 Q144 80 140 76 Z"
        fill={h('Triceps') ? mc('Triceps') : '#162848'}
        style={h('Triceps') ? { filter: glow('Triceps') } : {}} />

      {/* ── FOREARMS ── */}
      <path d="M54 108 Q50 114 50 128 L52 140 Q56 144 62 142 L66 130 L66 110 Z" fill="#1a3050" />
      <path d="M146 108 Q150 114 150 128 L148 140 Q144 144 138 142 L134 130 L134 110 Z" fill="#1a3050" />

      {/* ── ABS ── */}
      {/* Obliques */}
      <path d="M84 86 L80 130 Q84 136 90 136 L90 86 Z" fill="#172e4c" />
      <path d="M116 86 L120 130 Q116 136 110 136 L110 86 Z" fill="#172e4c" />
      {/* Abs grid - 3 rows of 2 */}
      {[0,1,2].map(row => (
        <g key={row}>
          <rect x="91" y={88 + row * 16} width="8" height="13" rx="3"
            fill={h('Abs') ? mc('Abs') : '#1e3a5c'} />
          <rect x="101" y={88 + row * 16} width="8" height="13" rx="3"
            fill={h('Abs') ? mc('Abs') : '#1e3a5c'} />
        </g>
      ))}

      {/* ── TORSO BODY ── */}
      <path d="M82 58 L80 136 Q84 140 92 142 L108 142 Q116 140 120 136 L118 58 Q110 62 100 62 Q90 62 82 58 Z"
        fill="url(#bodyGrad)" style={{ zIndex: -1 }} />
      {/* Re-draw chest on top */}
      <path d="M86 60 Q100 56 114 60 L116 83 Q100 87 84 83 Z"
        fill={h('Chest') ? mc('Chest') : '#1d3454'}
        style={h('Chest') ? { filter: glow('Chest') } : {}} />
      <line x1="100" y1="60" x2="100" y2="86" stroke="#0f1f35" strokeWidth="1.5" />
      <path d="M84 83 Q100 89 116 83" stroke="#0f1f35" strokeWidth="1" fill="none" />

      {/* ── HIPS ── */}
      <path d="M80 136 Q80 148 86 154 L114 154 Q120 148 120 136 Z" fill="#162840" />

      {/* ── QUADS ── */}
      {/* Left quad */}
      <path d="M86 154 Q80 158 78 174 L80 200 Q84 208 90 208 L94 206 Q98 200 96 174 Q94 160 90 154 Z"
        fill={h('Quads') ? mc('Quads') : '#1a3050'}
        style={h('Quads') ? { filter: glow('Quads') } : {}} />
      {/* Right quad */}
      <path d="M114 154 Q120 158 122 174 L120 200 Q116 208 110 208 L106 206 Q102 200 104 174 Q106 160 110 154 Z"
        fill={h('Quads') ? mc('Quads') : '#1a3050'}
        style={h('Quads') ? { filter: glow('Quads') } : {}} />
      {/* Quad separation lines */}
      <path d="M86 154 Q88 180 90 208" stroke="#0f1f35" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M114 154 Q112 180 110 208" stroke="#0f1f35" strokeWidth="1" fill="none" opacity="0.6" />

      {/* ── KNEES ── */}
      <ellipse cx="90" cy="212" rx="8" ry="7" fill="#162840" />
      <ellipse cx="110" cy="212" rx="8" ry="7" fill="#162840" />

      {/* ── CALVES ── */}
      {/* Left calf */}
      <path d="M84 218 Q80 228 80 248 L82 268 Q86 274 92 272 L94 268 Q96 252 94 232 Q92 222 88 218 Z"
        fill={h('Calves') ? mc('Calves') : '#162840'}
        style={h('Calves') ? { filter: glow('Calves') } : {}} />
      {/* Right calf */}
      <path d="M116 218 Q120 228 120 248 L118 268 Q114 274 108 272 L106 268 Q104 252 106 232 Q108 222 112 218 Z"
        fill={h('Calves') ? mc('Calves') : '#162840'}
        style={h('Calves') ? { filter: glow('Calves') } : {}} />

      {/* ── FEET ── */}
      <ellipse cx="88" cy="276" rx="9" ry="5" fill="#111e30" />
      <ellipse cx="112" cy="276" rx="9" ry="5" fill="#111e30" />

      {/* Muscle definition overlay lines */}
      <path d="M88 154 Q86 180 86 208" stroke="#0a1828" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M112 154 Q114 180 114 208" stroke="#0a1828" strokeWidth="0.8" fill="none" opacity="0.5" />
    </svg>
  )
}

// ─── BACK VIEW SVG ─────────────────────────────────────────────────────────
function BackFigure({ highlighted = [], color = '#f97316' }) {
  const h = (m) => highlighted.includes(m)
  const mc = (m) => MUSCLE_COLORS[m] || color
  const glow = (m) => `drop-shadow(0 0 6px ${mc(m)}cc)`

  return (
    <svg viewBox="0 0 200 340" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="bodyGradB" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2d4a6e" />
          <stop offset="100%" stopColor="#162236" />
        </radialGradient>
      </defs>

      {/* Head (back) */}
      <ellipse cx="100" cy="22" rx="18" ry="20" fill="#1e3a5a" />
      <rect x="92" y="38" width="16" height="12" rx="4" fill="#1e3a5a" />

      {/* ── TRAPS ── */}
      <path d="M82 50 Q100 44 118 50 L120 62 Q100 58 80 62 Z"
        fill={h('Traps') ? mc('Traps') : '#243d5c'}
        style={h('Traps') ? { filter: glow('Traps') } : {}} />

      {/* ── REAR DELTS ── */}
      <ellipse cx="72" cy="70" rx="14" ry="16"
        fill={h('Shoulders') ? mc('Shoulders') : '#1f3654'}
        style={h('Shoulders') ? { filter: glow('Shoulders') } : {}} />
      <ellipse cx="128" cy="70" rx="14" ry="16"
        fill={h('Shoulders') ? mc('Shoulders') : '#1f3654'}
        style={h('Shoulders') ? { filter: glow('Shoulders') } : {}} />

      {/* ── LATS / BACK ── */}
      {/* Left lat */}
      <path d="M82 62 Q72 72 70 90 L74 116 Q80 122 88 120 L90 100 L88 62 Z"
        fill={h('Back') ? mc('Back') : '#1d3454'}
        style={h('Back') ? { filter: glow('Back') } : {}} />
      {/* Right lat */}
      <path d="M118 62 Q128 72 130 90 L126 116 Q120 122 112 120 L110 100 L112 62 Z"
        fill={h('Back') ? mc('Back') : '#1d3454'}
        style={h('Back') ? { filter: glow('Back') } : {}} />
      {/* Mid back / rhomboids */}
      <path d="M88 62 L90 100 L110 100 L112 62 Q100 66 88 62 Z"
        fill={h('Back') ? mc('Back') : '#1a3050'}
        style={h('Back') ? { filter: glow('Back') } : {}} />
      {/* Spine line */}
      <line x1="100" y1="60" x2="100" y2="136" stroke="#0a1828" strokeWidth="1.5" opacity="0.8" />

      {/* ── ARMS (back) ── */}
      {/* Left tricep */}
      <path d="M60 76 Q52 84 50 100 L52 114 Q58 118 64 116 L66 100 Q68 84 64 78 Z"
        fill={h('Triceps') ? mc('Triceps') : '#1a3050'}
        style={h('Triceps') ? { filter: glow('Triceps') } : {}} />
      {/* Right tricep */}
      <path d="M140 76 Q148 84 150 100 L148 114 Q142 118 136 116 L134 100 Q132 84 136 78 Z"
        fill={h('Triceps') ? mc('Triceps') : '#1a3050'}
        style={h('Triceps') ? { filter: glow('Triceps') } : {}} />

      {/* Forearms */}
      <path d="M52 114 Q48 122 48 136 L50 148 Q56 152 62 148 L64 136 L64 116 Z" fill="#1a3050" />
      <path d="M148 114 Q152 122 152 136 L150 148 Q144 152 138 148 L136 136 L136 116 Z" fill="#1a3050" />

      {/* ── LOWER BACK ── */}
      <path d="M88 120 L86 136 Q90 142 100 142 Q110 142 114 136 L112 120 Q100 124 88 120 Z"
        fill="#162840" />

      {/* ── GLUTES ── */}
      <path d="M82 136 Q78 148 80 162 Q86 168 100 168 Q114 168 120 162 Q122 148 118 136 Q108 142 100 142 Q92 142 82 136 Z"
        fill={h('Glutes') ? mc('Glutes') : '#1a3050'}
        style={h('Glutes') ? { filter: glow('Glutes') } : {}} />
      {/* Glute separation */}
      <path d="M100 136 L100 168" stroke="#0a1828" strokeWidth="1.5" opacity="0.7" />

      {/* ── HAMSTRINGS ── */}
      {/* Left hamstring */}
      <path d="M82 162 Q78 172 78 192 L80 210 Q86 216 92 214 L94 196 Q96 174 90 162 Z"
        fill={h('Hamstrings') ? mc('Hamstrings') : '#1a3050'}
        style={h('Hamstrings') ? { filter: glow('Hamstrings') } : {}} />
      {/* Right hamstring */}
      <path d="M118 162 Q122 172 122 192 L120 210 Q114 216 108 214 L106 196 Q104 174 110 162 Z"
        fill={h('Hamstrings') ? mc('Hamstrings') : '#1a3050'}
        style={h('Hamstrings') ? { filter: glow('Hamstrings') } : {}} />
      {/* Ham line */}
      <path d="M90 162 L90 214" stroke="#0a1828" strokeWidth="0.8" opacity="0.5" />
      <path d="M110 162 L110 214" stroke="#0a1828" strokeWidth="0.8" opacity="0.5" />

      {/* Knees */}
      <ellipse cx="88" cy="216" rx="8" ry="7" fill="#162840" />
      <ellipse cx="112" cy="216" rx="8" ry="7" fill="#162840" />

      {/* ── CALVES (back) ── */}
      <path d="M82 222 Q78 234 78 252 L80 270 Q86 276 92 274 L94 268 Q96 250 94 232 Q92 224 86 222 Z"
        fill={h('Calves') ? mc('Calves') : '#162840'}
        style={h('Calves') ? { filter: glow('Calves') } : {}} />
      <path d="M118 222 Q122 234 122 252 L120 270 Q114 276 108 274 L106 268 Q104 250 106 232 Q108 224 114 222 Z"
        fill={h('Calves') ? mc('Calves') : '#162840'}
        style={h('Calves') ? { filter: glow('Calves') } : {}} />

      {/* Feet */}
      <ellipse cx="88" cy="278" rx="9" ry="5" fill="#111e30" />
      <ellipse cx="112" cy="278" rx="9" ry="5" fill="#111e30" />
    </svg>
  )
}

// ─── PUBLIC COMPONENT ──────────────────────────────────────────────────────
export default function MuscleSilhouette({ muscles = [], size = 160 }) {
  const backMuscles = muscles.filter(m => BACK_PRIMARY.has(m))
  const frontMuscles = muscles.filter(m => !BACK_PRIMARY.has(m))
  const useBack = backMuscles.length > 0 && frontMuscles.length === 0
  const primaryColor = MUSCLE_COLORS[muscles[0]] || '#f97316'

  const height = size * 1.7

  return (
    <div style={{ width: size, height, flexShrink: 0 }}>
      {useBack
        ? <BackFigure highlighted={backMuscles} color={primaryColor} />
        : <FrontFigure highlighted={muscles} color={primaryColor} />
      }
    </div>
  )
}
