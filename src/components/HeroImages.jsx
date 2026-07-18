export default function HeroImages() {
  return (
    <div className="relative hidden lg:flex justify-end gap-5">
      <div className="flex w-[220px] flex-col gap-3.5 self-start rounded-[22px] bg-ebony p-3.5">
        <div className="rounded-[10px] bg-white p-2 text-[9px] text-[#444]">
          <div className="px-0.5 pb-1 text-[8px] text-[#888]">
            Welcome back! Ready for new memories?
          </div>
          <img
            className="mb-1.5 h-[100px] w-full rounded-md object-cover"
            src="https://picsum.photos/seed/friends1/300/200"
            alt="friends photo preview"
          />
          <div className="mx-0.5 rounded-pill bg-terracotta py-1 text-center text-[8px] text-white">
            Begin Your Session
          </div>
        </div>

        <img
          className="h-[148px] w-full rounded-[10px] object-cover"
          src="https://picsum.photos/seed/camera2/300/200"
          alt="vintage camera"
        />

        <div className="rounded-[10px] bg-white p-2 text-[9px] text-[#444]">
          <img
            className="mb-1.5 h-[100px] w-full rounded-md object-cover"
            src="https://picsum.photos/seed/sunset3/300/200"
            alt="sunset frame preview"
          />
          <div className="px-0.5 pb-1 text-[8px] text-[#888]">Start Your Session</div>
        </div>
      </div>

      <div className="mt-10 flex w-[220px] flex-col gap-3.5 self-start rounded-[22px] bg-ebony p-3.5">
        <img
          className="h-[158px] w-full rounded-[10px] object-cover"
          src="https://picsum.photos/seed/album4/300/220"
          alt="photo album"
        />
        <img
          className="h-[158px] w-full rounded-[10px] object-cover"
          src="https://picsum.photos/seed/filmstrip5/300/230"
          alt="film strip"
        />
        <img
          className="h-[158px] w-full rounded-[10px] object-cover"
          src="https://picsum.photos/seed/flowers6/300/220"
          alt="flowers"
        />
      </div>
    </div>
  )
}