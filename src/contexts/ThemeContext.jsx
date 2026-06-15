import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

const DARK = `
  --bg:      #0b1120;
  --bg2:     #111827;
  --bg3:     #0a1628;
  --bg4:     #0f172a;
  --border:  #1e293b;
  --border2: #334155;
  --text1:   #f1f5f9;
  --text2:   #94a3b8;
  --text3:   #64748b;
  --text4:   #475569;
  --glass:   rgba(255,255,255,0.06);
  --glass2:  rgba(255,255,255,0.04);
`

const LIGHT = `
  --bg:      #f0f4f8;
  --bg2:     #ffffff;
  --bg3:     #e4eaf2;
  --bg4:     #f1f5f9;
  --border:  #dde3ea;
  --border2: #cbd5e1;
  --text1:   #0f172a;
  --text2:   #475569;
  --text3:   #64748b;
  --text4:   #94a3b8;
  --glass:   rgba(0,0,0,0.04);
  --glass2:  rgba(0,0,0,0.02);
`

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('blitz-theme') || 'dark')

  useEffect(() => {
    let style = document.getElementById('theme-vars')
    if (!style) {
      style = document.createElement('style')
      style.id = 'theme-vars'
      document.head.appendChild(style)
    }
    style.textContent = `:root { ${theme === 'dark' ? DARK : LIGHT} }`
    localStorage.setItem('blitz-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
