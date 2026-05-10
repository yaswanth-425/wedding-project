import mehendiImg from "../assets/images/mehendi.png";
import sangeetImg from "../assets/images/sangeet.png";
import weddingImg from "../assets/images/wedding.png";
import receptionImg from "../assets/images/reception.png";

export const WEDDING_CONFIG = {
  couple: {
    groom: {
      name: "CHINNA",
      parents: "Mr. & Mrs. Sharma",
    },
    bride: {
      name: "VAISHU",
      parents: "Mr. & Mrs. Singh",
    },
  },

  weddingDate: new Date("2026-05-18T17:00:00"),
  weddingDateISO: "2026-05-18T17:00:00",
  rsvpDeadline: "May 1, 2026",

  venue: {
    name: "The Leela Palace",
    address: "Punjagutta, Hyderabad - 500082",
    latitude: 17.4065,
    longitude: 78.4772,
    area: "Punjagutta, Hyderabad",
  },

  ceremonies: [
    {
      day: "Day 1 · Saturday",
      name: "Mehendi",
      date: "May 16, 2026",
      time: "11:00 AM",
      venue: "Lawn, The Leela Palace",
      accent: "oklch(0.78 0.13 75)",
      image: mehendiImg,
    },
    {
      day: "Day 2 · Sunday",
      name: "Sangeet",
      date: "May 17, 2026",
      time: "7:00 PM",
      venue: "Grand Ballroom, The Leela Palace",
      accent: "oklch(0.62 0.18 25)",
      image: sangeetImg,
    },
    {
      day: "Day 3 · Monday",
      name: "Wedding",
      date: "May 19, 2026",
      time: "5:00 PM onwards",
      venue: "Mandap, The Leela Palace",
      accent: "oklch(0.55 0.12 150)",
      image: weddingImg,
    },
    {
      day: "Day 4 · Tuesday",
      name: "Reception",
      date: "May 19, 2026",
      time: "8:00 PM",
      venue: "Sky Terrace, The Leela Palace",
      accent: "oklch(0.72 0.14 70)",
      image: receptionImg,
    },
  ],

  weddingDaySchedule: [
    { time: "10:00 AM", item: "Haldi Ceremony" },
    { time: "12:00 PM", item: "Lunch" },
    { time: "3:00 PM", item: "Baraat Welcome" },
    { time: "5:00 PM", item: "Wedding Pheras" },
    { time: "8:00 PM", item: "Dinner & Music" },
  ],

  rsvpEvents: [
    { id: "mehendi", label: "Mehendi · May 16" },
    { id: "sangeet", label: "Sangeet · May 17" },
    { id: "wedding", label: "Wedding · May 18" },
    { id: "reception", label: "Reception · May 19" },
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
    metro: "Race Course Road (Yellow Line)",
    taxi: "30 mins from Airport",
    parking: "Valet available",
  },
} as const;

export type WeddingConfig = typeof WEDDING_CONFIG;