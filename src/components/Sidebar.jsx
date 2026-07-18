import { HomeIcon, AboutIcon, PrivacyIcon, ContactIcon, HelpIcon } from '../icons.jsx'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'about', label: 'About', icon: AboutIcon },
  { id: 'privacy', label: 'Privacy', icon: PrivacyIcon },
  { id: 'contact', label: 'Contact', icon: ContactIcon },
]

export default function Sidebar({ currentView, onViewChange, isOpen, onClose }) {
  const handleNavClick = (id) => {
    onViewChange(id)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Desktop Sidebar (lg and up) */}
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-line bg-sidebar px-6 py-8 h-screen sticky top-0">
        <div>
          <div className="text-[28px] font-bold leading-none tracking-tight text-maroon">
            DSCBooth
          </div>
          <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[2px] text-[#a79c8c]">
            Vibe Check
          </div>
        </div>

        <nav className="mt-12 flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = currentView === id
            return (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`w-full flex items-center gap-3 rounded-pill px-4 py-3 text-[15px] font-medium transition-colors text-left cursor-pointer ${
                  active ? 'bg-coral text-white' : 'text-maroon hover:bg-[#e9e0d2]'
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3.5">
          <button 
            onClick={() => onViewChange('about')}
            className="flex items-center gap-2.5 px-4 py-1 text-sm text-[#a79c8c] hover:text-maroon transition-colors text-left cursor-pointer"
          >
            <HelpIcon className="h-4 w-4" />
            Help
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar (below lg) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer panel */}
          <div className="relative flex w-[280px] max-w-xs flex-col bg-sidebar px-6 py-8 shadow-2xl animate-slide-right h-full">
            {/* Close button inside drawer */}
            <div className="absolute top-6 right-6">
              <button 
                onClick={onClose}
                className="rounded-full p-2 text-maroon hover:bg-[#e9e0d2] cursor-pointer"
              >
                <span className="text-xl font-bold font-mono">✕</span>
              </button>
            </div>

            <div>
              <div className="text-[28px] font-bold leading-none tracking-tight text-maroon">
                DSCBooth
              </div>
              <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[2px] text-[#a79c8c]">
                Vibe Check
              </div>
            </div>

            <nav className="mt-12 flex flex-col gap-1.5">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const active = currentView === id
                return (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`w-full flex items-center gap-3 rounded-pill px-4 py-3 text-[15px] font-medium transition-colors text-left cursor-pointer ${
                      active ? 'bg-coral text-white' : 'text-maroon hover:bg-[#e9e0d2]'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {label}
                  </button>
                )
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-3.5">
              <button 
                onClick={() => handleNavClick('about')}
                className="flex items-center gap-2.5 px-4 py-1 text-sm text-[#a79c8c] hover:text-maroon transition-colors text-left cursor-pointer"
              >
                <HelpIcon className="h-4 w-4" />
                Help
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}