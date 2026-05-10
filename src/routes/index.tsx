import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EnvelopeCover } from "@/components/EnvelopeCover";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import {
  BackgroundMusic,
  type BackgroundMusicHandle,
} from "@/components/BackgroundMusic";
import { VenueMap } from "@/components/VenueMap";
import { RSVP } from "@/components/RSVP";
import { MultiCountdownScratch } from "@/components/MultiCountdownScratch";
import { DateScratchCard } from "@/components/DateScratchCard";
import { WEDDING_CONFIG } from "@/config/constants";

import couplePhoto1 from "../assets/images/img1.jpg";
import couplePhoto2 from "../assets/images/img2.jpg";
import couplePhoto3 from "../assets/images/img3.jpg";
import couplePhoto4 from "../assets/images/img4.jpg";
import couplePhoto5 from "../assets/images/img5.jpg";
import couplePhoto6 from "../assets/images/img6.jpg";
import mandapImg from "../assets/images/mandapam.png";
import mehendiImg from "../assets/images/mehendi.png";
import sangeetImg from "../assets/images/sangeet.png";
import weddingImg from "../assets/images/wedding.png";
import receptionImg from "../assets/images/reception.png";
import ganeshImg from "../assets/images/ganesh.png";

const galleryImages = [
  couplePhoto1,
  couplePhoto2,
  couplePhoto3,
  couplePhoto4,
  couplePhoto5,
  couplePhoto6,
];

export const Route = createFileRoute("/")({
  component: Index,
});

function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
  sectionRef,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  sectionRef?: React.RefObject<HTMLElement>;
}) {
  return (
    <section
      ref={sectionRef}
      id={id}
      className={`mx-auto w-full max-w-2xl px-5 py-20 ${className}`}
    >
      {eyebrow && <p className="label text-center text-gold">{eyebrow}</p>}
      {title && (
        <h2 className="script mt-2 text-center text-5xl text-primary sm:text-6xl">
          {title}
        </h2>
      )}
      <div className="divider my-6">
        <span className="flourish">❦</span>
      </div>
      {children}
    </section>
  );
}

function CeremonyCard({
  day,
  name,
  date,
  time,
  venue,
  accent,
  image,
  forceReveal,
}: {
  day: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  accent: string;
  image: string;
  forceReveal: boolean;
}) {
  return (
    <article
      tabIndex={0}
      className="group relative h-[420px] overflow-hidden rounded-[28px] focus:outline-none"
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
          forceReveal
            ? "scale-110"
            : "group-hover:scale-110 group-focus-visible:scale-110"
        }`}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to top, rgba(20,14,10,0.94) 8%, rgba(20,14,10,0.46) 46%, rgba(20,14,10,0.12) 100%),
            radial-gradient(circle at top right, ${accent}, transparent 40%)
          `,
        }}
      />

      <div className="absolute inset-0 rounded-[28px] border border-white/15 bg-black/10 shadow-[0_18px_60px_rgba(44,24,12,0.18)] backdrop-blur-[1px]" />

      <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between">
        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-white/90 backdrop-blur-md">
          {day}
        </span>
        <span
          className="h-3 w-3 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.35)]"
          style={{ background: accent }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
        <div
          className={`transition-all duration-500 ease-out ${
            forceReveal
              ? "-translate-y-28"
              : "group-hover:-translate-y-28 group-focus-visible:-translate-y-28"
          }`}
        >
          <h3 className="script text-4xl text-white sm:text-5xl">{name}</h3>
        </div>

        <div
          className={`mt-5 transition-all duration-500 ease-out ${
            forceReveal
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-10 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:pointer-events-auto group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          }`}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="label text-white/70">Date</p>
              <p className="serif mt-1 text-lg text-white">{date}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="label text-white/70">Time</p>
              <p className="serif mt-1 text-lg text-white">{time}</p>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <p className="label text-white/70">Venue</p>
            <p className="mt-1 text-sm leading-6 text-white/90">{venue}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Index() {
  const [opened, setOpened] = useState(false);
  const [showCeremonyDetails, setShowCeremonyDetails] = useState(false);

  const musicRef = useRef<BackgroundMusicHandle>(null);
  const ceremoniesRef = useRef<HTMLElement>(null);
  const revealTimerRef = useRef<number | null>(null);

  const ceremonyImages = {
    Mehendi: mehendiImg,
    Sangeet: sangeetImg,
    Wedding: weddingImg,
    Reception: receptionImg,
  } as const;

  useEffect(() => {
    const node = ceremoniesRef.current;
    if (!node || showCeremonyDetails) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealTimerRef.current) {
          revealTimerRef.current = window.setTimeout(() => {
            setShowCeremonyDetails(true);
          }, 15000);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [showCeremonyDetails]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {!opened && <EnvelopeCover onOpen={() => setOpened(true)} />}

      {opened && (
        <>
          <div className="petals-container">
            <div className="petals" />
          </div>
          <BackgroundMusic ref={musicRef} />
        </>
      )}

      <section className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-6 text-center">
        <div className="flourish">
          <img src={ganeshImg} alt="ganesh icon" className="icon" />
        </div>

        <p className="serif mt-6 max-w-md text-lg italic text-muted-foreground">
          "They alone are called husband and wife, who have one soul in two bodies."
        </p>
        <p className="label mt-2 text-muted-foreground">— Guru Amar Das Ji</p>

        <div className="divider my-10">
          <span className="flourish">❦</span>
        </div>

        <h1 className="script text-7xl text-primary sm:text-8xl">
          {WEDDING_CONFIG.couple.groom.name}
        </h1>
        <p className="label mt-2 text-muted-foreground">
          Son of {WEDDING_CONFIG.couple.groom.parents}
        </p>

        <p className="script my-4 text-5xl text-gold">&amp;</p>

        <h1 className="script text-7xl text-primary sm:text-8xl">
          {WEDDING_CONFIG.couple.bride.name}
        </h1>
        <p className="label mt-2 text-muted-foreground">
          Daughter of {WEDDING_CONFIG.couple.bride.parents}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href="#save"
            className="label inline-flex animate-bounce items-center gap-2 text-muted-foreground"
          >
            Scroll to reveal ↓
          </a>

          <nav className="flex flex-wrap justify-center gap-4 text-xs">
            <a
              href="#save"
              className="label text-muted-foreground transition-colors hover:text-primary"
            >
              Save the Date
            </a>
            <a
              href="#story"
              className="label text-muted-foreground transition-colors hover:text-primary"
            >
              Our Story
            </a>
            <a
              href="#ceremonies"
              className="label text-muted-foreground transition-colors hover:text-primary"
            >
              Ceremonies
            </a>
            <a
              href="#location"
              className="label text-muted-foreground transition-colors hover:text-primary"
            >
              Location
            </a>
            <a
              href="#rsvp"
              className="label text-muted-foreground transition-colors hover:text-primary"
            >
              RSVP
            </a>
          </nav>
        </div>
      </section>

      <Section id="save" eyebrow="The Date" title="Save the Date">
        <p className="mb-8 text-center text-muted-foreground">
          A lifetime of togetherness begins with one sacred step.
        </p>

        <DateScratchCard
          onReveal={() => {
            musicRef.current?.playMusic();
          }}
        >
          <div className="grid grid-cols-3 gap-4">
            {[
              { l: "Month", v: "May" },
              { l: "Day", v: "18" },
              { l: "Year", v: "2026" },
            ].map((d) => (
              <div key={d.l}>
                <p className="label text-muted-foreground">{d.l}</p>
                <p className="script text-5xl text-primary sm:text-6xl">
                  {d.v}
                </p>
              </div>
            ))}
          </div>
          <p className="label mt-6 text-muted-foreground">Monday · Evening</p>
        </DateScratchCard>

        <div className="mt-10">
          <p className="label mb-3 text-center text-gold">
            Counting down to the wedding
          </p>
          <MultiCountdownScratch weddingDate={WEDDING_CONFIG.weddingDate} />
        </div>
      </Section>

      <Section id="story" eyebrow="A Glimpse of Us" title="Our Beautiful Moments">
        <p className="mb-8 text-center text-muted-foreground">
          A moment captured in time, forever in our hearts.
        </p>

        <div className="gallery-slider-wrap">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={true}
            speed={900}
            autoplay={{
              delay: WEDDING_CONFIG.ui.swiper.autoplayDelay,
              disableOnInteraction: false,
            }}
            className="gallery-slider"
          >
            {galleryImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="gallery-slide-card">
                  <img
                    src={img}
                    alt={`Beautiful moment ${index + 1}`}
                    loading="lazy"
                    width={3072}
                    height={4096}
                    className="gallery-slide-img"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Section>

      <Section
        id="ceremonies"
        eyebrow="The Festivities"
        title="Sacred Ceremonies"
        sectionRef={ceremoniesRef}
      >
        <div className="space-y-5">
          {WEDDING_CONFIG.ceremonies.map((ceremony) => (
            <CeremonyCard
              key={ceremony.name}
              day={ceremony.day}
              name={ceremony.name}
              date={ceremony.date}
              time={ceremony.time}
              venue={ceremony.venue}
              accent={ceremony.accent}
              image={
                ceremonyImages[
                  ceremony.name as keyof typeof ceremonyImages
                ]
              }
              forceReveal={showCeremonyDetails}
            />
          ))}
        </div>
      </Section>

      <section className="relative">
        <div className="mx-auto max-w-2xl px-5">
          <div className="paper overflow-hidden rounded-2xl">
            <img
              src={mandapImg}
              alt="Wedding mandap decoration"
              loading="lazy"
              width={1024}
              height={768}
              className="block w-full"
            />
            <div className="px-6 py-5 text-center">
              <p className="script text-3xl text-primary">
                Where Two Souls Become One
              </p>
              <p className="label mt-2 text-muted-foreground">
                Mandap · 18 May 2026 · 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section id="schedule" eyebrow="Plan Ahead" title="Wedding Day Schedule">
        <div className="space-y-3">
          {WEDDING_CONFIG.weddingDaySchedule.map((schedule, i) => (
            <div
              key={i}
              className="paper flex items-center justify-between rounded-xl p-4"
            >
              <div className="serif text-lg text-primary">
                {schedule.item}
              </div>
              <div className="label text-gold">{schedule.time}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="location" eyebrow="Find Us Here" title="Venue Location">
        <p className="mb-8 text-center text-muted-foreground">
          Join us at {WEDDING_CONFIG.venue.name} for our grand celebration.
        </p>
        <VenueMap
          latitude={WEDDING_CONFIG.venue.latitude}
          longitude={WEDDING_CONFIG.venue.longitude}
          venueName={WEDDING_CONFIG.venue.name}
          address={WEDDING_CONFIG.venue.address}
        />
      </Section>

      <Section id="rsvp" eyebrow="Your Presence Matters" title="RSVP">
        <p className="mb-6 text-center text-muted-foreground">
          Kindly respond by {WEDDING_CONFIG.rsvpDeadline}
        </p>
        <RSVP />
      </Section>

      <footer className="px-6 pb-10 pt-6 text-center">
        <div className="mb-4 flex items-center justify-center gap-3 text-gold">
          <span className="h-px w-10 bg-current/30" />
          <span className="flourish text-2xl">~ ❦ ~</span>
          <span className="h-px w-10 bg-current/30" />
        </div>

        <p className="script text-3xl text-primary sm:text-4xl">
          {WEDDING_CONFIG.couple.groom.name} &amp;{" "}
          {WEDDING_CONFIG.couple.bride.name}
        </p>

        <p className="mx-auto mt-3 max-w-md serif text-base italic text-muted-foreground">
          Two hearts, one journey, and a lifetime of memories ahead.
        </p>

        <div className="mt-6 space-y-1">
          <p className="label text-muted-foreground">
            With love · 18 May 2026
          </p>
          <p className="label text-muted-foreground">
            {WEDDING_CONFIG.venue.name}
          </p>
        </div>
      </footer>
    </main>
  );
}