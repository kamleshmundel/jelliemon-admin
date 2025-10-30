import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import { Users, BookOpen, Layers, BookMarked, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { MoreVertical } from "lucide-react";

const sideUrls = [
  { name: 'Users', url: ROUTES.users, icon: Users },
  { name: 'Subjects', url: ROUTES.subjects, icon: BookOpen },
  { name: 'Lessons', url: ROUTES.lessons, icon: BookMarked },
  { name: 'Units', url: ROUTES.units, icon: Layers },
  { name: 'Questions', url: ROUTES.questions, icon: HelpCircle },
].map((url, i) => ({ id: i + 1, ...url }))

const Sidebar = () => {
  const [open, setOpen] = useState(true)
  return (
    <aside className={`h-full transition-all duration-300 bg-gradient-to-b from-zinc-950 to-zinc-900 border-r border-zinc-800 ${open ? "w-64" : "w-20"} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-lg ${open ? "" : "mx-auto"}`} />
          <h1 className={`text-lg font-semibold text-white tracking-wide ${open ? "" : "hidden"}`}>Admin</h1>
        </div>
        <button onClick={() => setOpen(v => !v)} className="p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white">
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sideUrls.map(link => {
          const Icon = link.icon
          return (
            <NavLink
              to={link.url}
              key={link.id}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span className={`${open ? "" : "hidden"} truncate`}>{link.name}</span>
            </NavLink>
          )
        })}
      </nav>
      <AdminFooter open={open} />
    </aside>
  )
}

function AdminFooter({ open }:{ open: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const nav = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    localStorage.clear();
    nav(ROUTES.login);
  }

  return (
    <div className="relative p-4 border-t border-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-medium">A</div>
        <div className={`${open ? "" : "hidden"}`}>
          <div className="text-sm font-medium text-white">Admin User</div>
          <div className="text-xs text-zinc-500">admin@site.com</div>
        </div>
      </div>
      <div ref={ref} className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded hover:bg-zinc-700">
          <MoreVertical className="text-zinc-400" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 bottom-12 bg-zinc-900 border border-zinc-700 rounded-md overflow-hidden w-40">
            <button className="w-full text-left px-3 py-2 text-sm text-white hover:bg-zinc-800">Change Password</button>
            <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-zinc-800" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}


export default Sidebar
