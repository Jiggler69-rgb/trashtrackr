import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg tracking-tight flex items-center gap-2">
            <img src="/logo.png" alt="TrashTrackr logo" className="h-6 w-6" />
            <span>TrashTrackr</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1 text-sm p-1 rounded-lg border bg-white/60">
            <Link className="px-3 py-1.5 rounded-md hover:bg-gray-100" to="/">Home</Link>
            <Link className="px-3 py-1.5 rounded-md hover:bg-gray-100" to="/report">Report</Link>
            <Link className="px-3 py-1.5 rounded-md hover:bg-gray-100" to="/dashboard">Dashboard</Link>
          </nav>
          <button
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border bg-white/70"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block w-4 h-0.5 bg-black" />
            <span className="block w-4 h-0.5 bg-black mt-1" />
            <span className="block w-4 h-0.5 bg-black mt-1" />
          </button>
        </div>
        {menuOpen && (
          <div className="sm:hidden border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col">
              <Link className="px-3 py-2 rounded hover:bg-gray-50" to="/" onClick={()=>setMenuOpen(false)}>Home</Link>
              <Link className="px-3 py-2 rounded hover:bg-gray-50" to="/report" onClick={()=>setMenuOpen(false)}>Report</Link>
              <Link className="px-3 py-2 rounded hover:bg-gray-50" to="/dashboard" onClick={()=>setMenuOpen(false)}>Dashboard</Link>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t text-xs text-gray-500 py-4 text-center">
        © {new Date().getFullYear()} TrashTrackr · Made with <span aria-hidden="true" className="mx-1 text-red-500">&hearts;</span> by Shamant
      </footer>
    </div>
  )
}

export default App
