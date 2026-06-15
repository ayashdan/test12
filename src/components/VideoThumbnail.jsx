import { MUSCLE_COLORS } from '../data/exercises'

export default function VideoThumbnail({ url, name, muscle }) {
  const videoId = url.match(/[?&]v=([^&]+)/)?.[1] || url.split('/').pop()
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  const color = MUSCLE_COLORS[muscle] || '#f97316'

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{
        display: 'block',
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        textDecoration: 'none',
        flexShrink: 0,
        width: 100,
        height: 60,
      }}>
      <img src={thumbUrl} alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(2,8,23,0.7) 0%, transparent 50%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,0.65)',
          border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <span style={{ color, fontSize: 10, marginLeft: 2 }}>▶</span>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 4, left: 4,
        fontSize: 9, fontWeight: 700,
        color: '#020817',
        background: color,
        borderRadius: 3,
        padding: '1px 5px',
        letterSpacing: '0.05em',
      }}>{muscle.toUpperCase()}</div>
    </a>
  )
}
