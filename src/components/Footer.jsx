export default function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-4 bg-ebony px-6 py-7 text-[13px] text-[#c9c1b4] sm:flex-row sm:items-start sm:justify-between md:px-12">
      <div>
        <div className="mb-2 font-mono text-[11px] tracking-[2px] text-[#8a8175]">
          RETROBOOTH
        </div>
        <div>© 2024 RetroBooth Digital Nostalgia. Built for the dreamers.</div>
      </div>
      <div>
        <a href="#" className="text-[#e8dfcf]">
          Terms of Service
        </a>
      </div>
    </footer>
  )
}