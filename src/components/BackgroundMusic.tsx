import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import music from "../assets/music/prettyjohn1-wedding-487335.mp3";

export type BackgroundMusicHandle = {
  playMusic: () => Promise<void>;
  toggleMute: () => void;
};

export const BackgroundMusic = forwardRef<BackgroundMusicHandle>(
  function BackgroundMusic(_, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const wasPlayingRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const musicUrl ={music}
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.loop = true;
      audio.volume = 0.3;
      audio.muted = true;

      const syncState = () => {
        const playing = !audio.paused && !audio.ended;
        setIsPlaying(playing);
        setIsMuted(audio.muted || audio.volume === 0);
        wasPlayingRef.current = playing;
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (!audio.paused) {
            wasPlayingRef.current = true;
            audio.pause();
          }
        } else {
          if (wasPlayingRef.current && audio.paused) {
            audio.play().catch(() => {});
          }
        }
      };

      audio.addEventListener("play", syncState);
      audio.addEventListener("pause", syncState);
      audio.addEventListener("ended", syncState);
      audio.addEventListener("volumechange", syncState);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      syncState();

      return () => {
        audio.removeEventListener("play", syncState);
        audio.removeEventListener("pause", syncState);
        audio.removeEventListener("ended", syncState);
        audio.removeEventListener("volumechange", syncState);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      playMusic: async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
          audio.muted = false;
          await audio.play();
        } catch (error) {
          console.error("Audio play failed:", error);
        }
      },
      toggleMute: () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
          audio.muted = false;
          audio.play().catch((error) => {
            console.error("Audio play failed:", error);
          });
          return;
        }

        audio.muted = !audio.muted;
      },
    }));

    const handleIconClick = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (audio.paused) {
        audio.muted = false;
        audio.play().catch(() => {});
      } else {
        audio.muted = !audio.muted;
      }
    };

    return (
      <div className="fixed bottom-5 right-5 z-40">
        <audio
          ref={audioRef}
          src={music}
          preload="auto"
          playsInline
          className="hidden"
        />

        <button
          type="button"
          onClick={handleIconClick}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleIconClick();
            }
          }}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isMuted || !isPlaying ? (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="m22 9-6 6" />
              <path d="m16 9 6 6" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 6a9 9 0 0 1 0 12" />
            </svg>
          )}
        </button>
      </div>
    );
  }
);