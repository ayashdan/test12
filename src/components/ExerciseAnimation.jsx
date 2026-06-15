import { useEffect } from 'react'

// ─── CSS KEYFRAME INJECTOR ─────────────────────────────────────────────────

export function StyleInjector() {
  useEffect(() => {
    const id = 'tf-anim-styles'
    if (document.getElementById(id)) return
    const el = document.createElement('style')
    el.id = id
    el.textContent = `
      @keyframes tf-legraise{0%,15%{transform:rotate(0deg)}45%,55%{transform:rotate(-68deg)}85%,100%{transform:rotate(0deg)}}
      @keyframes tf-squat-up{0%,15%{transform:translateY(0px)}45%,55%{transform:translateY(36px)}85%,100%{transform:translateY(0px)}}
      @keyframes tf-pushup-body{0%,15%{transform:translateY(0px)}45%,55%{transform:translateY(22px)}85%,100%{transform:translateY(0px)}}
      @keyframes tf-pullup-body{0%,15%{transform:translateY(0px)}45%,55%{transform:translateY(-34px)}85%,100%{transform:translateY(0px)}}
      @keyframes tf-overhead-larm{0%,15%{transform:rotate(0deg)}45%,55%{transform:rotate(-130deg)}85%,100%{transform:rotate(0deg)}}
      @keyframes tf-overhead-rarm{0%,15%{transform:rotate(0deg)}45%,55%{transform:rotate(130deg)}85%,100%{transform:rotate(0deg)}}
      @keyframes tf-curl-arm{0%,15%{transform:rotate(0deg)}45%,55%{transform:rotate(-118deg)}85%,100%{transform:rotate(0deg)}}
      @keyframes tf-lateral-larm{0%,15%{transform:rotate(0deg)}45%,55%{transform:rotate(-72deg)}85%,100%{transform:rotate(0deg)}}
      @keyframes tf-lateral-rarm{0%,15%{transform:rotate(0deg)}45%,55%{transform:rotate(72deg)}85%,100%{transform:rotate(0deg)}}
      @keyframes tf-row-arms{0%,15%{transform:translateX(0px)}45%,55%{transform:translateX(-26px)}85%,100%{transform:translateX(0px)}}
      @keyframes tf-hipthrust-hips{0%,15%{transform:translateY(0px)}45%,55%{transform:translateY(-26px)}85%,100%{transform:translateY(0px)}}
      @keyframes tf-deadlift-upper{0%,15%{transform:rotate(48deg)}45%,55%{transform:rotate(0deg)}85%,100%{transform:rotate(48deg)}}
      @keyframes tf-calf-body{0%,15%{transform:translateY(0px)}45%,55%{transform:translateY(-13px)}85%,100%{transform:translateY(0px)}}
      @keyframes tf-pushdown-arms{0%,15%{transform:rotate(-105deg)}45%,55%{transform:rotate(-10deg)}85%,100%{transform:rotate(-105deg)}}
      @keyframes tf-bench-arms{0%,15%{transform:translateY(0px)}45%,55%{transform:translateY(-28px)}85%,100%{transform:translateY(0px)}}
      @keyframes tf-shrug-body{0%,15%{transform:translateY(0px)}45%,55%{transform:translateY(-13px)}85%,100%{transform:translateY(0px)}}
      @keyframes tf-glow{0%,100%{opacity:0.4}50%{opacity:0.9}}
    `
    document.head.appendChild(el)
  }, [])
  return null
}

// ─── SHARED CONSTANTS ─────────────────────────────────────────────────────

const FIG = '#c8d8ec'
const FIG2 = '#7a9ab8'
const EQ = '#3d5c7a'
const FLOOR = '#0d1e35'
const DUR = '2.6s'
const EASE = 'ease-in-out'
const INF = 'infinite'

const anim = (name) => ({ animation: `${name} ${DUR} ${EASE} ${INF}`, transformOrigin: '0px 0px' })

// ─── ANIMATION SVGs ───────────────────────────────────────────────────────

function AnimLegRaise({ c }) {
  return (
    <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="320" height="180" fill="#0a1628" />
      <rect x="0" y="155" width="320" height="25" fill={FLOOR} />
      <line x1="0" y1="155" x2="320" y2="155" stroke="#1a3052" strokeWidth="1.5" />
      <rect x="20" y="148" width="220" height="10" rx="4" fill="#1a2e48" />
      <circle cx="55" cy="141" r="15" fill={FIG} />
      <line x1="70" y1="141" x2="168" y2="141" stroke={FIG} strokeWidth="16" strokeLinecap="round" />
      <line x1="110" y1="141" x2="95" y2="155" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(168,141)">
        <g style={anim('tf-legraise')}>
          <line x1="0" y1="0" x2="58" y2="0" stroke={FIG} strokeWidth="14" strokeLinecap="round" />
          <line x1="0" y1="4" x2="58" y2="4" stroke={FIG2} strokeWidth="10" strokeLinecap="round" />
          <g transform="translate(58,0)">
            <line x1="0" y1="0" x2="50" y2="6" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
            <line x1="0" y1="4" x2="50" y2="9" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
            <line x1="50" y1="6" x2="63" y2="3" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
          </g>
        </g>
      </g>
      <ellipse cx="200" cy="141" rx="35" ry="10" fill={c} opacity="0.12" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimSquat({ c }) {
  return (
    <svg viewBox="0 0 300 220" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="220" fill="#0a1628" />
      <rect x="0" y="188" width="300" height="32" fill={FLOOR} />
      <line x1="0" y1="188" x2="300" y2="188" stroke="#1a3052" strokeWidth="1.5" />
      <line x1="80" y1="85" x2="220" y2="85" stroke={EQ} strokeWidth="7" strokeLinecap="round" />
      <rect x="75" y="80" width="10" height="18" rx="3" fill={EQ} />
      <rect x="215" y="80" width="10" height="18" rx="3" fill={EQ} />
      <g style={{ ...anim('tf-squat-up'), transformOrigin: '150px 100px' }}>
        <circle cx="150" cy="50" r="16" fill={FIG} />
        <line x1="150" y1="66" x2="150" y2="76" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
        <line x1="106" y1="84" x2="194" y2="84" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="150" y1="76" x2="150" y2="118" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
        <line x1="128" y1="118" x2="172" y2="118" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="106" y1="84" x2="100" y2="88" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
        <line x1="194" y1="84" x2="200" y2="88" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      </g>
      <line x1="118" y1="118" x2="95" y2="162" stroke={FIG2} strokeWidth="12" strokeLinecap="round" />
      <line x1="95" y1="162" x2="90" y2="188" stroke={FIG2} strokeWidth="10" strokeLinecap="round" />
      <line x1="90" y1="188" x2="68" y2="188" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="182" y1="118" x2="205" y2="162" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
      <line x1="205" y1="162" x2="210" y2="188" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="210" y1="188" x2="232" y2="188" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="150" cy="155" rx="60" ry="20" fill={c} opacity="0.1" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimPushUp({ c }) {
  return (
    <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="320" height="180" fill="#0a1628" />
      <rect x="0" y="155" width="320" height="25" fill={FLOOR} />
      <line x1="0" y1="155" x2="320" y2="155" stroke="#1a3052" strokeWidth="1.5" />
      <g style={{ ...anim('tf-pushup-body'), transformOrigin: '160px 130px' }}>
        <circle cx="60" cy="118" r="14" fill={FIG} />
        <line x1="72" y1="120" x2="230" y2="130" stroke={FIG} strokeWidth="14" strokeLinecap="round" />
        <line x1="110" y1="122" x2="105" y2="148" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="160" y1="125" x2="155" y2="151" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
        <line x1="105" y1="148" x2="80" y2="154" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
        <line x1="155" y1="151" x2="130" y2="154" stroke={FIG2} strokeWidth="7" strokeLinecap="round" />
        <line x1="228" y1="130" x2="265" y2="152" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="272" cy="154" rx="8" ry="5" fill={FIG} />
      </g>
      <ellipse cx="150" cy="140" rx="70" ry="10" fill={c} opacity="0.1" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimPullUp({ c }) {
  return (
    <svg viewBox="0 0 300 220" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="220" fill="#0a1628" />
      <line x1="60" y1="25" x2="240" y2="25" stroke={EQ} strokeWidth="8" strokeLinecap="round" />
      <rect x="55" y="10" width="8" height="18" rx="3" fill={EQ} />
      <rect x="237" y="10" width="8" height="18" rx="3" fill={EQ} />
      <g style={{ ...anim('tf-pullup-body'), transformOrigin: '150px 55px' }}>
        <circle cx="115" cy="30" r="8" fill={FIG} /><circle cx="185" cy="30" r="8" fill={FIG} />
        <line x1="115" y1="30" x2="120" y2="68" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="185" y1="30" x2="180" y2="68" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="120" y1="68" x2="180" y2="68" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <circle cx="150" cy="52" r="16" fill={FIG} />
        <line x1="150" y1="68" x2="150" y2="130" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
        <line x1="125" y1="130" x2="175" y2="130" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="130" y1="130" x2="125" y2="185" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
        <line x1="170" y1="130" x2="175" y2="185" stroke={FIG2} strokeWidth="10" strokeLinecap="round" />
        <line x1="125" y1="185" x2="118" y2="210" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="175" y1="185" x2="182" y2="210" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
      </g>
      <ellipse cx="150" cy="90" rx="50" ry="20" fill={c} opacity="0.1" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimOverheadPress({ c }) {
  return (
    <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="230" fill="#0a1628" />
      <rect x="0" y="200" width="300" height="30" fill={FLOOR} />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#1a3052" strokeWidth="1.5" />
      <circle cx="150" cy="42" r="17" fill={FIG} />
      <line x1="150" y1="59" x2="150" y2="70" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <line x1="108" y1="78" x2="192" y2="78" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="150" y1="70" x2="150" y2="130" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="128" y1="130" x2="172" y2="130" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="132" y1="130" x2="122" y2="200" stroke={FIG2} strokeWidth="11" strokeLinecap="round" />
      <line x1="168" y1="130" x2="178" y2="200" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="122" y1="200" x2="100" y2="200" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="178" y1="200" x2="200" y2="200" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <g transform="translate(108,78)">
        <g style={anim('tf-overhead-larm')}>
          <line x1="0" y1="0" x2="0" y2="42" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
          <g transform="translate(0,42)">
            <line x1="0" y1="0" x2="0" y2="38" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
            <line x1="0" y1="38" x2="-10" y2="38" stroke={FIG2} strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>
      </g>
      <g transform="translate(192,78)">
        <g style={anim('tf-overhead-rarm')}>
          <line x1="0" y1="0" x2="0" y2="42" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
          <g transform="translate(0,42)">
            <line x1="0" y1="0" x2="0" y2="38" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
            <line x1="0" y1="38" x2="10" y2="38" stroke={FIG} strokeWidth="6" strokeLinecap="round" />
          </g>
        </g>
      </g>
      <ellipse cx="150" cy="78" rx="55" ry="15" fill={c} opacity="0.12" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimCurl({ c }) {
  return (
    <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="230" fill="#0a1628" />
      <rect x="0" y="200" width="300" height="30" fill={FLOOR} />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#1a3052" strokeWidth="1.5" />
      <circle cx="150" cy="42" r="17" fill={FIG} />
      <line x1="150" y1="59" x2="150" y2="70" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <line x1="108" y1="78" x2="192" y2="78" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="150" y1="70" x2="150" y2="130" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="128" y1="130" x2="172" y2="130" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="132" y1="130" x2="122" y2="200" stroke={FIG2} strokeWidth="11" strokeLinecap="round" />
      <line x1="168" y1="130" x2="178" y2="200" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="122" y1="200" x2="100" y2="200" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="178" y1="200" x2="200" y2="200" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <line x1="108" y1="78" x2="88" y2="125" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
      <line x1="88" y1="125" x2="82" y2="168" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="192" y1="78" x2="210" y2="125" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(210,125)">
        <g style={anim('tf-curl-arm')}>
          <line x1="0" y1="0" x2="0" y2="43" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
          <line x1="-6" y1="43" x2="6" y2="43" stroke={EQ} strokeWidth="10" strokeLinecap="round" />
          <rect x="-10" y="39" width="6" height="9" rx="2" fill={EQ} />
          <rect x="4" y="39" width="6" height="9" rx="2" fill={EQ} />
        </g>
      </g>
      <ellipse cx="200" cy="110" rx="30" ry="30" fill={c} opacity="0.1" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimLateralRaise({ c }) {
  return (
    <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="230" fill="#0a1628" />
      <rect x="0" y="200" width="300" height="30" fill={FLOOR} />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#1a3052" strokeWidth="1.5" />
      <circle cx="150" cy="42" r="17" fill={FIG} />
      <line x1="150" y1="59" x2="150" y2="70" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <line x1="108" y1="78" x2="192" y2="78" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="150" y1="70" x2="150" y2="130" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="128" y1="130" x2="172" y2="130" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="132" y1="130" x2="122" y2="200" stroke={FIG2} strokeWidth="11" strokeLinecap="round" />
      <line x1="168" y1="130" x2="178" y2="200" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="122" y1="200" x2="100" y2="200" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="178" y1="200" x2="200" y2="200" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <g transform="translate(108,78)">
        <g style={anim('tf-lateral-larm')}>
          <line x1="0" y1="0" x2="-42" y2="0" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
          <circle cx="-42" cy="0" r="7" fill={EQ} />
        </g>
      </g>
      <g transform="translate(192,78)">
        <g style={anim('tf-lateral-rarm')}>
          <line x1="0" y1="0" x2="42" y2="0" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
          <circle cx="42" cy="0" r="7" fill={EQ} />
        </g>
      </g>
      <ellipse cx="150" cy="78" rx="60" ry="20" fill={c} opacity="0.12" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimRow({ c }) {
  return (
    <svg viewBox="0 0 320 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="320" height="200" fill="#0a1628" />
      <rect x="0" y="170" width="320" height="30" fill={FLOOR} />
      <line x1="0" y1="170" x2="320" y2="170" stroke="#1a3052" strokeWidth="1.5" />
      <rect x="268" y="50" width="30" height="130" rx="5" fill={EQ} opacity="0.7" />
      <circle cx="90" cy="95" r="16" fill={FIG} />
      <line x1="102" y1="102" x2="180" y2="130" stroke={FIG} strokeWidth="14" strokeLinecap="round" />
      <line x1="185" y1="133" x2="175" y2="170" stroke={FIG2} strokeWidth="12" strokeLinecap="round" />
      <line x1="192" y1="135" x2="205" y2="170" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
      <line x1="175" y1="170" x2="155" y2="170" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="205" y1="170" x2="225" y2="170" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <g transform="translate(125,112)">
        <g style={anim('tf-row-arms')}>
          <line x1="0" y1="0" x2="80" y2="10" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
          <line x1="0" y1="4" x2="80" y2="14" stroke={FIG2} strokeWidth="7" strokeLinecap="round" />
          <circle cx="82" cy="11" r="7" fill={EQ} />
        </g>
      </g>
      <ellipse cx="155" cy="110" rx="50" ry="15" fill={c} opacity="0.12" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimHipThrust({ c }) {
  return (
    <svg viewBox="0 0 320 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="320" height="200" fill="#0a1628" />
      <rect x="0" y="170" width="320" height="30" fill={FLOOR} />
      <line x1="0" y1="170" x2="320" y2="170" stroke="#1a3052" strokeWidth="1.5" />
      <rect x="30" y="118" width="100" height="20" rx="6" fill={EQ} />
      <rect x="40" y="138" width="12" height="32" rx="3" fill={EQ} opacity="0.7" />
      <rect x="108" y="138" width="12" height="32" rx="3" fill={EQ} opacity="0.7" />
      <circle cx="75" cy="100" r="15" fill={FIG} />
      <line x1="75" y1="115" x2="120" y2="120" stroke={FIG} strokeWidth="13" strokeLinecap="round" />
      <line x1="100" y1="130" x2="260" y2="130" stroke={EQ} strokeWidth="6" strokeLinecap="round" />
      <rect x="97" y="120" width="8" height="20" rx="3" fill={EQ} />
      <rect x="254" y="120" width="8" height="20" rx="3" fill={EQ} />
      <g transform="translate(155,130)">
        <g style={{ ...anim('tf-hipthrust-hips'), transformOrigin: '0px 0px' }}>
          <line x1="-30" y1="0" x2="30" y2="0" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
          <line x1="-20" y1="0" x2="-35" y2="40" stroke={FIG2} strokeWidth="12" strokeLinecap="round" />
          <line x1="20" y1="0" x2="35" y2="40" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
        </g>
      </g>
      <line x1="116" y1="170" x2="90" y2="170" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="194" y1="170" x2="218" y2="170" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="155" cy="130" rx="50" ry="15" fill={c} opacity="0.14" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimDeadlift({ c }) {
  return (
    <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="230" fill="#0a1628" />
      <rect x="0" y="195" width="300" height="35" fill={FLOOR} />
      <line x1="0" y1="195" x2="300" y2="195" stroke="#1a3052" strokeWidth="1.5" />
      <line x1="135" y1="148" x2="120" y2="195" stroke={FIG2} strokeWidth="12" strokeLinecap="round" />
      <line x1="165" y1="148" x2="180" y2="195" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
      <line x1="120" y1="195" x2="96" y2="195" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
      <line x1="180" y1="195" x2="204" y2="195" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <line x1="60" y1="185" x2="240" y2="185" stroke={EQ} strokeWidth="7" strokeLinecap="round" />
      <circle cx="65" cy="185" r="14" fill="none" stroke={EQ} strokeWidth="6" />
      <circle cx="235" cy="185" r="14" fill="none" stroke={EQ} strokeWidth="6" />
      <g transform="translate(150,148)">
        <g style={anim('tf-deadlift-upper')}>
          <line x1="-15" y1="0" x2="15" y2="0" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="-80" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
          <line x1="-40" y1="-80" x2="40" y2="-80" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
          <circle cx="0" cy="-97" r="16" fill={FIG} />
          <line x1="-40" y1="-80" x2="-50" y2="10" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
          <line x1="40" y1="-80" x2="50" y2="10" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
        </g>
      </g>
      <ellipse cx="150" cy="165" rx="55" ry="14" fill={c} opacity="0.12" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimCalfRaise({ c }) {
  return (
    <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="230" fill="#0a1628" />
      <rect x="0" y="200" width="300" height="30" fill={FLOOR} />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#1a3052" strokeWidth="1.5" />
      <rect x="90" y="195" width="120" height="8" rx="3" fill={EQ} opacity="0.6" />
      <g style={{ ...anim('tf-calf-body'), transformOrigin: '150px 200px' }}>
        <circle cx="150" cy="38" r="17" fill={FIG} />
        <line x1="150" y1="55" x2="150" y2="66" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
        <line x1="106" y1="74" x2="194" y2="74" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="150" y1="66" x2="150" y2="128" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
        <line x1="128" y1="128" x2="172" y2="128" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="106" y1="74" x2="72" y2="100" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
        <line x1="194" y1="74" x2="228" y2="100" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
        <line x1="132" y1="128" x2="122" y2="180" stroke={FIG2} strokeWidth="12" strokeLinecap="round" />
        <line x1="168" y1="128" x2="178" y2="180" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
        <line x1="122" y1="180" x2="118" y2="200" stroke={FIG2} strokeWidth="10" strokeLinecap="round" />
        <line x1="178" y1="180" x2="182" y2="200" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="118" y1="200" x2="100" y2="196" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
        <line x1="182" y1="200" x2="200" y2="196" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      </g>
      <ellipse cx="150" cy="188" rx="50" ry="10" fill={c} opacity="0.14" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimPushdown({ c }) {
  return (
    <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="230" fill="#0a1628" />
      <rect x="0" y="200" width="300" height="30" fill={FLOOR} />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#1a3052" strokeWidth="1.5" />
      <rect x="130" y="0" width="40" height="30" rx="4" fill={EQ} opacity="0.8" />
      <line x1="150" y1="30" x2="150" y2="55" stroke={EQ} strokeWidth="3" strokeDasharray="4 2" />
      <circle cx="150" cy="42" r="17" fill={FIG} />
      <line x1="150" y1="59" x2="150" y2="70" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <line x1="108" y1="78" x2="192" y2="78" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="150" y1="70" x2="150" y2="130" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="128" y1="130" x2="172" y2="130" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      <line x1="132" y1="130" x2="122" y2="200" stroke={FIG2} strokeWidth="11" strokeLinecap="round" />
      <line x1="168" y1="130" x2="178" y2="200" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="122" y1="200" x2="100" y2="200" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="178" y1="200" x2="200" y2="200" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <line x1="108" y1="78" x2="112" y2="118" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
      <line x1="192" y1="78" x2="188" y2="118" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(112,118)"><g style={anim('tf-pushdown-arms')}>
        <line x1="0" y1="0" x2="0" y2="45" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      </g></g>
      <g transform="translate(188,118)"><g style={anim('tf-pushdown-arms')}>
        <line x1="0" y1="0" x2="0" y2="45" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
        <line x1="-18" y1="45" x2="18" y2="45" stroke={EQ} strokeWidth="7" strokeLinecap="round" />
      </g></g>
      <ellipse cx="150" cy="130" rx="45" ry="14" fill={c} opacity="0.12" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimBenchPress({ c }) {
  return (
    <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="320" height="180" fill="#0a1628" />
      <rect x="30" y="130" width="260" height="14" rx="5" fill={EQ} />
      <rect x="50" y="144" width="12" height="30" rx="3" fill={EQ} opacity="0.7" />
      <rect x="258" y="144" width="12" height="30" rx="3" fill={EQ} opacity="0.7" />
      <rect x="196" y="60" width="8" height="72" rx="3" fill={EQ} opacity="0.6" />
      <rect x="116" y="60" width="8" height="72" rx="3" fill={EQ} opacity="0.6" />
      <circle cx="272" cy="118" r="14" fill={FIG} />
      <line x1="258" y1="118" x2="82" y2="122" stroke={FIG} strokeWidth="16" strokeLinecap="round" />
      <g transform="translate(150,110)">
        <g style={{ ...anim('tf-bench-arms'), transformOrigin: '0px 0px' }}>
          <line x1="-55" y1="0" x2="-55" y2="-28" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
          <line x1="55" y1="0" x2="55" y2="-28" stroke={FIG2} strokeWidth="10" strokeLinecap="round" />
          <line x1="-55" y1="-28" x2="-38" y2="-48" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
          <line x1="55" y1="-28" x2="38" y2="-48" stroke={FIG2} strokeWidth="9" strokeLinecap="round" />
          <line x1="-80" y1="-52" x2="80" y2="-52" stroke={EQ} strokeWidth="7" strokeLinecap="round" />
          <rect x="-90" y="-62" width="12" height="20" rx="3" fill={EQ} />
          <rect x="78" y="-62" width="12" height="20" rx="3" fill={EQ} />
        </g>
      </g>
      <ellipse cx="150" cy="118" rx="65" ry="12" fill={c} opacity="0.12" style={anim('tf-glow')} />
    </svg>
  )
}

function AnimShrug({ c }) {
  return (
    <svg viewBox="0 0 300 230" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="300" height="230" fill="#0a1628" />
      <rect x="0" y="200" width="300" height="30" fill={FLOOR} />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#1a3052" strokeWidth="1.5" />
      <line x1="55" y1="150" x2="245" y2="150" stroke={EQ} strokeWidth="7" strokeLinecap="round" />
      <rect x="48" y="140" width="10" height="20" rx="3" fill={EQ} />
      <rect x="242" y="140" width="10" height="20" rx="3" fill={EQ} />
      <g style={{ ...anim('tf-shrug-body'), transformOrigin: '150px 130px' }}>
        <circle cx="150" cy="38" r="17" fill={FIG} />
        <line x1="150" y1="55" x2="150" y2="66" stroke={FIG} strokeWidth="9" strokeLinecap="round" />
        <line x1="106" y1="76" x2="194" y2="76" stroke={FIG} strokeWidth="12" strokeLinecap="round" />
        <line x1="150" y1="66" x2="150" y2="130" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
        <line x1="128" y1="130" x2="172" y2="130" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
        <line x1="106" y1="76" x2="88" y2="148" stroke={FIG2} strokeWidth="10" strokeLinecap="round" />
        <line x1="194" y1="76" x2="212" y2="148" stroke={FIG} strokeWidth="10" strokeLinecap="round" />
      </g>
      <line x1="132" y1="130" x2="122" y2="200" stroke={FIG2} strokeWidth="11" strokeLinecap="round" />
      <line x1="168" y1="130" x2="178" y2="200" stroke={FIG} strokeWidth="11" strokeLinecap="round" />
      <line x1="122" y1="200" x2="100" y2="200" stroke={FIG2} strokeWidth="8" strokeLinecap="round" />
      <line x1="178" y1="200" x2="200" y2="200" stroke={FIG} strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="150" cy="72" rx="55" ry="12" fill={c} opacity="0.14" style={anim('tf-glow')} />
    </svg>
  )
}

// ─── EXERCISE → ANIMATION TYPE ────────────────────────────────────────────

const ANIM_TYPE = {
  'bb-bench': 'bench', 'inc-db-press': 'bench', 'skull-crush': 'bench',
  'cable-fly': 'lateral', 'push-ups': 'pushup', 'dips': 'pushup',
  'ohp': 'overhead', 'lat-raise': 'lateral', 'face-pull': 'row',
  'arnold-press': 'overhead', 'tri-pushdown': 'pushdown', 'oh-tri-ext': 'overhead',
  'bb-row': 'row', 'pull-ups': 'pullup', 'lat-pulldown': 'pullup',
  'seated-row': 'row', 'sa-db-row': 'row',
  'bb-curl': 'curl', 'hammer-curl': 'curl', 'inc-db-curl': 'curl',
  'squat': 'squat', 'leg-press': 'squat', 'bss': 'squat', 'leg-ext': 'squat',
  'rdl': 'deadlift', 'leg-curl': 'legraise', 'nordic': 'legraise',
  'hip-thrust': 'hipthrust', 'cable-kick': 'hipthrust',
  'stand-calf': 'calf', 'seat-calf': 'calf', 'bb-shrug': 'shrug',
}

// ─── DISPATCHER ───────────────────────────────────────────────────────────

export default function ExerciseAnimation({ exerciseId, muscleColor = '#f97316' }) {
  const type = ANIM_TYPE[exerciseId] || 'lateral'
  const props = { c: muscleColor }
  switch (type) {
    case 'legraise':  return <AnimLegRaise {...props} />
    case 'squat':     return <AnimSquat {...props} />
    case 'pushup':    return <AnimPushUp {...props} />
    case 'pullup':    return <AnimPullUp {...props} />
    case 'overhead':  return <AnimOverheadPress {...props} />
    case 'curl':      return <AnimCurl {...props} />
    case 'lateral':   return <AnimLateralRaise {...props} />
    case 'row':       return <AnimRow {...props} />
    case 'hipthrust': return <AnimHipThrust {...props} />
    case 'deadlift':  return <AnimDeadlift {...props} />
    case 'calf':      return <AnimCalfRaise {...props} />
    case 'pushdown':  return <AnimPushdown {...props} />
    case 'bench':     return <AnimBenchPress {...props} />
    case 'shrug':     return <AnimShrug {...props} />
    default:          return <AnimLateralRaise {...props} />
  }
}
