import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

const SCRATCH_THRESHOLD = 0.5;

type MultiCountdownScratchProps = {
  weddingDate: Date;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function shootConfetti(originX: number, originY: number) {
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    origin: { x: originX, y: originY },
    scalar: 0.9,
    ticks: 180,
    colors: ["#f43f5e", "#fb7185", "#ffffff", "#f9a8d4", "#fecdd3"],
  });
}

function ScratchCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasCelebratedRef = useRef(false);

  const [revealed, setRevealed] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const formattedValue = useMemo(
    () => value.toString().padStart(2, "0"),
    [value]
  );

  useEffect(() => {
    if (!wrapperRef.current || !canvasRef.current || revealed) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.style.opacity = "1";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#f43f5e");
    gradient.addColorStop(1, "#e11d48");

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255,255,255,0.16)";
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.textAlign = "center";
    ctx.font = "700 12px sans-serif";
    ctx.fillText("Scratch", w / 2, h / 2 - 4);
    ctx.font = "500 10px sans-serif";
    ctx.fillText("to reveal", w / 2, h / 2 + 12);

    ctx.globalCompositeOperation = "destination-out";
  }, [revealed]);

  const getPoint = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ("touches" in event && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    if ("changedTouches" in event && event.changedTouches.length > 0) {
      return {
        x: event.changedTouches[0].clientX - rect.left,
        y: event.changedTouches[0].clientY - rect.top,
      };
    }

    if ("clientX" in event) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    return null;
  };

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const radius = 18;

    if (!lastPointRef.current) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      lastPointRef.current = { x, y };
      return;
    }

    const last = lastPointRef.current;

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = radius * 2;
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    lastPointRef.current = { x, y };
  };

  const getScratchedPercent = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return 0;

    const { width, height } = canvas;
    const pixels = ctx.getImageData(0, 0, width, height).data;

    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparent++;
    }

    const total = pixels.length / 16;
    return (transparent / total) * 100;
  };

  const finishReveal = () => {
    if (finishing || revealed) return;

    setFinishing(true);

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (canvas) {
      canvas.style.transition = "opacity 220ms ease-out, transform 220ms ease-out";
      canvas.style.opacity = "0";
      canvas.style.transform = "scale(1.02)";
    }

    window.setTimeout(() => {
      setRevealed(true);
      setFinishing(false);

      if (wrapper && !hasCelebratedRef.current) {
        const rect = wrapper.getBoundingClientRect();
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;
        shootConfetti(originX, originY);
        hasCelebratedRef.current = true;
      }
    }, 220);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed || finishing) return;

    const handleStart = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      isDrawingRef.current = true;
      const point = getPoint(event);
      if (point) scratchAt(point.x, point.y);
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      event.preventDefault();
      const point = getPoint(event);
      if (point) scratchAt(point.x, point.y);

      const scratched = getScratchedPercent();
      if (scratched >= SCRATCH_THRESHOLD) {
        isDrawingRef.current = false;
        lastPointRef.current = null;
        finishReveal();
      }
    };

    const handleEnd = () => {
      if (!isDrawingRef.current) return;

      isDrawingRef.current = false;
      lastPointRef.current = null;

      const scratched = getScratchedPercent();
      if (scratched >= SCRATCH_THRESHOLD) {
        finishReveal();
      }
    };

    canvas.addEventListener("mousedown", handleStart as EventListener);
    canvas.addEventListener("mousemove", handleMove as EventListener);
    window.addEventListener("mouseup", handleEnd);

    canvas.addEventListener("touchstart", handleStart as EventListener, { passive: false });
    canvas.addEventListener("touchmove", handleMove as EventListener, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart as EventListener);
      canvas.removeEventListener("mousemove", handleMove as EventListener);
      window.removeEventListener("mouseup", handleEnd);

      canvas.removeEventListener("touchstart", handleStart as EventListener);
      canvas.removeEventListener("touchmove", handleMove as EventListener);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [revealed, finishing]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-24 min-w-0 overflow-hidden rounded-2xl bg-white shadow-md"
    >
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 px-1 text-center">
        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-rose-500 sm:text-[10px]">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold text-rose-700 sm:text-3xl">
          {formattedValue}
        </div>
      </div>

      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 h-full w-full touch-none rounded-2xl"
        />
      )}
    </div>
  );
}

export function MultiCountdownScratch({
  weddingDate,
  className = "",
}: MultiCountdownScratchProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      <ScratchCard value={timeLeft.days} label="Days" />
      <ScratchCard value={timeLeft.hours} label="Hours" />
      <ScratchCard value={timeLeft.minutes} label="Minutes" />
      <ScratchCard value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}