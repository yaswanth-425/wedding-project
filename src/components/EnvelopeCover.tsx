import { useEffect, useRef, useState } from "react";

export function EnvelopeCover({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleOpen = () => {
    if (open) return;

    setOpen(true);

    timeoutRef.current = window.setTimeout(() => {
      onOpen();
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      className="env-bg fixed inset-0 z-50 grid place-items-center overflow-hidden transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ height: "100vh", opacity: open ? 0 : 1 }}
    >
      <svg
        aria-hidden={true}
        className="absolute inset-0 h-full w-full opacity-25 mix-blend-overlay"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="floral" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="oklch(0.9 0.05 80)" strokeWidth="1.2">
              <path d="M30 40 Q15 -25 35 -10 Q5 25 -35 10z" />
              <path d="M40 60 Q20 5 25 30" />
              <path d="M40 60 Q-8 10 -2 25" />
              <path d="M40 60 Q8 10 2 25" />
              <path d="M70 110 Q25 -10 50 10" />
              <circle cx="110" cy="50" r="6" />
              <path d="M110 56 Q-8 10 -2 25" />
              <path d="M110 56 Q8 10 2 25" />
              <path d="M70 110 Q25 -10 50 10" />
              <circle cx="95" cy="115" r="3" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#floral)" />
      </svg>

      <div className="relative h-[78vh] w-[88vw] max-w-md">
        <div className="absolute left-1/2 top-[8%] z-10 -translate-x-1/2 text-center">
  <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-[oklch(0.95_0.04_80)]">
    Wedding Invitation From
  </p>

  <p className="script mt-2 text-5xl md:text-3xl text-[oklch(0.98_0.05_80)]">
    Chavva Family
  </p>

   
</div>

        <div className="absolute bottom-[14%] left-1/2 z-10 -translate-x-1/2 text-center">
          <p className="script text-2xl text-[oklch(0.95_0.04_80)] drop-shadow-[0_2px_8px_oklch(0.2_0.1_25_/_0.6)]">
            To new beginnings!
          </p>
        </div>

        <div className={`env-flap ${open ? "open" : ""}`} />
        <div className="env-pocket" />

        <button
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          aria-label="Open invitation"
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 disabled:pointer-events-none focus:outline-none focus:ring-4 focus:ring-primary/50"
          style={{ filter: open ? "blur(1px)" : "none", opacity: open ? 0.92 : 1 }}
          disabled={open}
        >
          <div className="wax-seal float">
            <span className="relative">
              P<span className="align-super text-2xl opacity-70">❤️</span>V
            </span>
          </div>
        </button>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-40 bg-[oklch(0.99_0.01_80)] transition-opacity duration-[450ms] ease-out"
        style={{ opacity: open ? 1 : 0 }}
      />
    </div>
  );
}