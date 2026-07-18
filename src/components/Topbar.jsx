import { ShareIcon, SettingsIcon } from '../icons.jsx'

export default function Topbar({ onMenuToggle }) {
  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-5 md:px-12 bg-cream">
      <div className="flex items-center gap-4 sm:gap-9">
        {/* Hamburger Menu Trigger - Visible only below lg breakpoint */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden flex flex-col justify-between w-6 h-[18px] text-maroon cursor-pointer focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <span className="w-full h-[2.5px] bg-maroon rounded-full" />
          <span className="w-full h-[2.5px] bg-maroon rounded-full" />
          <span className="w-full h-[2.5px] bg-maroon rounded-full" />
        </button>

        <div className="text-[22px] font-bold text-maroon font-display leading-none">DSCBooth</div>
        
        <nav className="hidden sm:flex gap-7 text-[15px]">
          <a href="#" className="border-b-2 border-terracotta pb-1.5 font-semibold text-terracotta transition-colors">
            Gallery
          </a>
          <a href="#" className="pb-1.5 text-[#7a7266] hover:text-maroon transition-colors">
            Community
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <ShareIcon className="h-5 w-5 text-ink opacity-75 hover:opacity-100 transition-opacity cursor-pointer" />
        <SettingsIcon className="h-5 w-5 text-ink opacity-75 hover:opacity-100 transition-opacity cursor-pointer" />
      </div>
    </header>
  )
}