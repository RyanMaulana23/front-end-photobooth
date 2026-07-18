import { useState } from 'react'
import { SparkleIcon } from '../icons.jsx'

export default function WhatsNewToast() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="absolute -bottom-2.5 right-0 lg:right-12 flex w-80 gap-3.5 rounded-2xl border border-coral bg-white p-5 shadow-toast">
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        className="absolute right-4 top-3.5 text-base leading-none text-[#b7ae9f]"
      >
        &times;
      </button>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-white">
        <SparkleIcon className="h-[18px] w-[18px]" />
      </div>

      <div>
        <h4 className="mb-1.5 mt-0.5 text-[15px] font-semibold">What's New</h4>
        <p className="mb-3 text-[13px] leading-relaxed text-[#6b6255]">
          We've added 12 new vintage film filters and a 3D Scrapbook view! Experience your magic
          in high-def nostalgia.
        </p>
        <button
          onClick={() => setVisible(false)}
          className="rounded-pill bg-[#4e5d46] px-4.5 py-2 text-[13px] font-semibold text-white"
        >
          Got it!
        </button>
      </div>
    </div>
  )
}