import mehendiImg from "../assets/images/mehendi.png";
import sangeetImg from "../assets/images/sangeet.png";
import weddingImg from "../assets/images/wedding.png";
import receptionImg from "../assets/images/reception.png";

export const WEDDING_CONFIG = {
  couple: {
    groom: {
      name: "PRIYATHAM",
      parents: "Mr. & Mrs. MADDU",
    },
    bride: {
      name: "VASAVI",
      parents: "Mr. & Mrs. CHAVVA",
    },
  },

  weddingDate: new Date("2026-05-18T17:00:00"),
  weddingDateISO: "2026-05-18T17:00:00",
  rsvpDeadline: "May 1, 2026",

  venue: {
    name: "Mandap, T.V.A Chinna Rajanna Arya vysya",
    address: "Kothuru, Kamavarapu Kota - 534449",
    latitude: 17.012809336490204,
    longitude: 81.20487668693482,
    area: "Kothuru, Kamavarapu Kota",
  },

  ceremonies: [
    {
      day: "Day 1 · Wednesday",
      name: "Mehendi",
      date: "June 17, 2026",
      time: "10:00 AM",
      venue: "Hometown",
      accent: "oklch(0.78 0.13 75)",
      image: mehendiImg,
    },
    {
      day: "Day 2 · Wednesday",
      name: "Sangeet",
      date: "June 17, 2026",
      time: "7:00 PM",
      venue: "Hometown",
      accent: "oklch(0.62 0.18 25)",
      image: sangeetImg,
    },
    {
      day: "Day 3 · Monday",
      name: "Wedding",
      date: "June 19, 2026",
      time: "09:15 PM onwards",
      venue: "Mandap, T.V.A Chinna Rajanna Arya vysya",
      accent: "oklch(0.55 0.12 150)",
      image: weddingImg,
    },
    {
      day: "Day 4 · Tuesday",
      name: "Reception",
      date: "June 21, 2026",
      time: "7:00 PM",
      venue: "Dandamudi AC Kalyana Mandapam Karatam Y Juntion Narsannapalem",
      accent: "oklch(0.72 0.14 70)",
      image: receptionImg,
    },
  ],

  weddingDaySchedule: [
    { time: "10:00 AM", item: "Ceremony" },
    { time: "12:00 PM", item: "Lunch" },
    { time: "5:00 PM", item: "Baraat Welcome" },
    { time: "7:00 PM", item: "Wedding Pheras" },
    { time: "7:00 PM", item: "Dinner & Music" },
  ],

  rsvpEvents: [
    { id: "mehendi", label: "Mehendi · June 17" },
    { id: "sangeet", label: "Sangeet · June 17" },
    { id: "wedding", label: "Wedding · June 19" },
    { id: "reception", label: "Reception · June 21" },
  ],

  validation: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    members: {
      min: 1,
      max: 20,
    },
    note: {
      maxLength: 500,
    },
  },

  ui: {
    swiper: {
      autoplayDelay: 5000,
      speed: 900,
    },
    scratchThreshold: 5,
    confettiColors: ["#f43f5e", "#fb7185", "#ffffff", "#fecdd3", "#f9a8d4"],
  },

  transportation: {
    metro: "Kamavarapu Kota Bus Stand ",
    taxi: "10 mins from Bus Stand",
    parking: "Valet available",
  },
} as const;

export type WeddingConfig = typeof WEDDING_CONFIG;