import { useState } from "react";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "@/config/constants";

// Google Sheets Web App URL from environment
const GOOGLE_SHEETS_URL = import.meta.env.DEV
  ? "/api/rsvp"
  : import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

interface RSVPData {
  name: string;
  phone: string;
  members: number;
  attend: string[];
  note: string;
  submittedAt: string;
  events: string[];
}

interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const EVENTS = WEDDING_CONFIG.rsvpEvents;

export function RSVP() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [members, setMembers] = useState(""); // changed from number to string
  const [attend, setAttend] = useState<string[]>(["wedding"]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const toggle = (id: string) =>
    setAttend((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const parsedMembers = members === "" ? NaN : Number(members);

  const validateForm = (): ValidationError | null => {
    const trimmedName = name.trim();
    const trimmedNote = note.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      return { field: "name", message: "Please tell us your name" };
    }
    if (trimmedName.length < WEDDING_CONFIG.validation.name.minLength) {
      return { field: "name", message: "Name must be at least 2 characters" };
    }
    if (trimmedName.length > WEDDING_CONFIG.validation.name.maxLength) {
      return { field: "name", message: "Name is too long (max 100 characters)" };
    }
    if (/^\d+$/.test(trimmedName)) {
      return { field: "name", message: "Please enter a valid name" };
    }

    if (trimmedPhone && !/^[+\d\s\-()]{7,15}$/.test(trimmedPhone)) {
      return { field: "phone", message: "Please enter a valid phone number" };
    }

    if (!Number.isInteger(parsedMembers)) {
      return { field: "members", message: "Please enter number of family members" };
    }
    if (parsedMembers < WEDDING_CONFIG.validation.members.min) {
      return { field: "members", message: "At least 1 member is required" };
    }
    if (parsedMembers > WEDDING_CONFIG.validation.members.max) {
      return { field: "members", message: "Maximum 20 members allowed" };
    }

    if (trimmedNote.length > WEDDING_CONFIG.validation.note.maxLength) {
      return { field: "note", message: "Message is too long (max 500 characters)" };
    }

    if (attend.length === 0) {
      return { field: "attend", message: "Please select at least one event" };
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const website = (
      document.querySelector('input[name="website"]') as HTMLInputElement
    )?.value;
    if (website) return;

    const now = Date.now();
    if (now - lastSubmit < 10000) {
      toast.error("Please wait before submitting again");
      return;
    }
    setLastSubmit(now);

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError.message);
      return;
    }

    if (!GOOGLE_SHEETS_URL) {
      toast.error("RSVP service is not configured. Please contact the couple.");
      return;
    }

    setLoading(true);

    try {
      const rsvpData: RSVPData = {
        name: name.trim(),
        phone: phone.trim(),
        members: Number(members),
        attend,
        note: note.trim(),
        submittedAt: new Date().toISOString(),
        events: EVENTS.filter((ev) => attend.includes(ev.id)).map((ev) => ev.label),
      };

      const formData = new FormData();
      formData.append("name", rsvpData.name);
      formData.append("phone", rsvpData.phone);
      formData.append("guests", String(rsvpData.members));
      formData.append("message", rsvpData.note);
      formData.append("submittedAt", rsvpData.submittedAt);
      formData.append("attend", JSON.stringify(rsvpData.attend));
      formData.append("events", JSON.stringify(rsvpData.events));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GoogleSheetsResponse = await response.json();

      if (result.success) {
        const firstName = name.trim().split(" ")[0];
        setSubmittedName(firstName);
        setSent(true);
        toast.success("RSVP confirmed — see you there!");

        setName("");
        setPhone("");
        setMembers("");
        setAttend(["wedding"]);
        setNote("");
      } else {
        if (result.error === "Unauthorized") {
          toast.error("Invalid request. Please try again.");
        } else {
          throw new Error(result.error || "Failed to save RSVP");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          toast.error("Request timed out. Please check your connection and try again.");
        } else if (error.message.includes("Failed to fetch")) {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          toast.error(error.message || "Failed to save RSVP. Please try again.");
        }
      } else {
        toast.error("Failed to save RSVP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="paper rounded-2xl p-8 text-center">
        <div className="flourish">~ ❦ ~</div>
        <h3 className="script mt-2 text-4xl text-primary">Thank you!</h3>
        <p className="mt-3 text-muted-foreground">
          Your blessings mean the world to us, {submittedName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="paper rounded-2xl p-6 sm:p-8">
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-5">
        <div>
          <label className="label text-muted-foreground">Your full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name & partner"
            aria-label="Your full name and partner's name"
            className="mt-1 w-full rounded-md border border-border bg-background/60 px-3 py-2 outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="label text-muted-foreground">
            Phone number (optional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            aria-label="Your phone number"
            className="mt-1 w-full rounded-md border border-border bg-background/60 px-3 py-2 outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="label text-muted-foreground">
            Family / Number of members
          </label>
          <input
            type="number"
            min={WEDDING_CONFIG.validation.members.min}
            max={WEDDING_CONFIG.validation.members.max}
            value={members}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setMembers("");
                return;
              }

              if (/^\d+$/.test(value)) {
                setMembers(value);
              }
            }}
            placeholder="Enter number of family members"
            aria-label="Number of family members"
            className="mt-1 w-full rounded-md border border-border bg-background/60 px-3 py-2 outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="label text-muted-foreground">
            Events you will join
          </label>
          <div className="mt-2 space-y-2">
            {EVENTS.map((ev) => (
              <label
                key={ev.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2 hover:border-gold"
              >
                <input
                  type="checkbox"
                  checked={attend.includes(ev.id)}
                  onChange={() => toggle(ev.id)}
                  className="h-4 w-4 accent-[oklch(0.32_0.06_150)]"
                />
                <span className="serif">{ev.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label text-muted-foreground block">
            Message & blessings (optional)
          </label>
          <p className="ml-2 mb-1 text-xs text-muted-foreground/60">
            {note.trim().length}/{WEDDING_CONFIG.validation.note.maxLength}
          </p>
          <textarea
            value={note}
            onChange={(e) =>
              setNote(e.target.value.slice(0, WEDDING_CONFIG.validation.note.maxLength))
            }
            rows={3}
            placeholder="Send your warmest wishes to the couple..."
            aria-label="Blessings message for the couple"
            maxLength={WEDDING_CONFIG.validation.note.maxLength}
            className="mt-1 w-full rounded-md border border-border bg-background/60 px-3 py-2 outline-none focus:border-gold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center border-1 rounded-full bg-primary px-6 py-3.5 text-sm font-medium tracking-wide text-black shadow-md transition-colors duration-300 hover:bg-gold hover:text-primary focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary"
        >
          <span className="label">
            {loading ? "Submitting..." : "Confirm RSVP"}
          </span>
        </button>
      </div>
    </form>
  );
}