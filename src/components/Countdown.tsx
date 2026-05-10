import { useEffect, useState } from "react";
import { WEDDING_CONFIG } from "@/config/constants";

const WEDDING_DATE = WEDDING_CONFIG.weddingDate.getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, WEDDING_DATE - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export function Countdown() {
  const { days, hours, mins, secs } = useCountdown();
  const items = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: mins },
    { label: "Seconds", value: secs },
  ];
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5">
      {items.map((it) => (
        <div key={it.label} className="paper rounded-lg px-2 py-4 text-center">
          <div className="serif text-3xl font-light text-primary sm:text-4xl">
            {String(it.value).padStart(2, "0")}
          </div>
          <div className="label mt-1 text-muted-foreground">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
