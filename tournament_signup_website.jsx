import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  CalendarDays,
  MapPin,
  Users,
  Mail,
  Plus,
  CheckCircle2,
  Shield,
  ExternalLink,
  X,
} from "lucide-react";

export const createRosterEntry = (currentCount) => ({
  id: `${Date.now()}-${currentCount + 1}-${Math.random().toString(36).slice(2)}`,
});

export const removeRosterEntryById = (entries, idToRemove) =>
  entries.filter((entry) => entry.id !== idToRemove);

// Lightweight sanity checks for dynamic add/remove helpers.
if (typeof window !== "undefined") {
  const testEntries = [{ id: "entry-1" }, { id: "entry-2" }];

  console.assert(
    removeRosterEntryById(testEntries, "entry-1").length === 1,
    "removeRosterEntryById should remove exactly one matching entry"
  );

  console.assert(
    removeRosterEntryById(testEntries, "missing-id").length === 2,
    "removeRosterEntryById should leave the list unchanged when no ID matches"
  );

  console.assert(
    typeof createRosterEntry(2).id === "string",
    "createRosterEntry should return an object with a string ID"
  );

  console.assert(
    createRosterEntry(2).id.includes("-3-"),
    "createRosterEntry should include the next entry count in the generated ID"
  );
}

const Field = ({ label, required = true, placeholder, type = "text" }) => (
  <label className="block">
    <div className="mb-2 text-sm font-medium text-slate-200">
      {label} {required ? <span className="text-cyan-300">*</span> : null}
    </div>
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition invalid:border-red-400/40 focus:border-cyan-300/70 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/20"
    />
  </label>
);

const RemoveButton = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
  >
    <X size={16} />
  </button>
);

const PlayerCard = ({ title, playerId, required = true, onRemove, captainId, onCaptainToggle, captainLocked }) => {
  const isCaptain = captainId === playerId;
  const inactiveCaptainClass =
    "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10";
  const activeCaptainClass =
    "border-cyan-300/50 bg-cyan-300/15 text-cyan-100";
  const disabledCaptainClass =
    "cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            {title} {required ? <span className="text-cyan-300">*</span> : null}
          </h3>
          <p className="text-sm text-slate-400">Player registration information</p>
        </div>

        <div className="flex items-center gap-2">
          {onRemove ? <RemoveButton label={`Remove ${title}`} onClick={onRemove} /> : null}

          {isCaptain ? (
            <div className="flex items-center gap-2 rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
              <CheckCircle2 size={14} /> Captain
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" required placeholder="John Doe" />
        <Field label="Email" required placeholder="example@email.com" type="email" />
        <Field label="Discord" required placeholder="MyDiscordUser" />
        <Field label="Blizzard ID" required placeholder="Username#0000" />
        <Field label="Twitter" required placeholder="@FrostEsports" />
      </div>

      <button
        type="button"
        disabled={captainLocked && !isCaptain}
        onClick={() => onCaptainToggle(playerId)}
        className={
          "mt-5 rounded-xl border px-4 py-2 text-sm font-semibold transition " +
          (captainLocked && !isCaptain
            ? disabledCaptainClass
            : isCaptain
              ? activeCaptainClass
              : inactiveCaptainClass)
        }
      >
        {isCaptain ? "Captain Selected" : "Mark as Captain"}
      </button>
    </motion.div>
  );
};

const StaffCard = ({ title, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35 }}
    className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20"
  >
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">Team staff member information</p>
      </div>

      <RemoveButton label={`Remove ${title}`} onClick={onRemove} />
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Name" required placeholder="John Doe" />
      <Field label="Email" required placeholder="example@email.com" type="email" />
      <Field label="Discord" required placeholder="MyDiscordUser" />
      <Field label="Twitter" required placeholder="@FrostEsports" />
    </div>
  </motion.div>
);

const OptionalRole = ({ title, onAdd, disabled = false }) => (
  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">Optional team staff member</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className={
          "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition " +
          (disabled
            ? "cursor-not-allowed bg-white/10 text-slate-500"
            : "bg-white text-slate-950 hover:bg-cyan-100")
        }
      >
        <Plus size={16} /> Add
      </button>
    </div>
  </div>
);

const DetailCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
    <Icon className="mb-4 text-cyan-300" size={24} />
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-1 text-lg font-bold text-white">{value}</p>
  </div>
);

export default function TournamentSignupWebsite() {
  const [submitted, setSubmitted] = useState(false);
  const [substitutes, setSubstitutes] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [captainId, setCaptainId] = useState(null);

  const addSubstitute = () => {
    setSubstitutes((current) => [...current, createRosterEntry(current.length)]);
  };

  const removeSubstitute = (id) => {
    setSubstitutes((current) => removeRosterEntryById(current, id));
  };

  const addCaptain = () => {
    if (captainId) return;

    setCaptains((current) => {
      if (current.length > 0) return current;
      const newCaptain = createRosterEntry(current.length);
      setCaptainId(newCaptain.id);
      return [newCaptain];
    });
  };

  const removeCaptain = (id) => {
    setCaptains((current) => removeRosterEntryById(current, id));
    setCaptainId((currentCaptainId) => (currentCaptainId === id ? null : currentCaptainId));
  };

  const addCoach = () => {
    setCoaches((current) => [...current, createRosterEntry(current.length)]);
  };

  const removeCoach = (id) => {
    setCoaches((current) => removeRosterEntryById(current, id));
  };

  const handleCaptainToggle = (id) => {
    setCaptainId((currentCaptainId) => (currentCaptainId === id ? null : id));
  };

  const hasSeparateCaptain = captains.length > 0;
  const hasCaptainSelected = Boolean(captainId);
  const separateCaptainDisabled = hasCaptainSelected && !hasSeparateCaptain;
  const playerCaptainLocked = hasSeparateCaptain;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/30"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-300">
            <CheckCircle2 size={36} />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Registration Submitted
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Your team is locked in.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
            Thanks for registering for the Frost Esports Overwatch tournament. Our staff will review your submission and reach out if anything needs to be corrected.
          </p>

          <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-left md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Next step</p>
              <p className="mt-1 font-bold text-white">Watch your email</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Need help?</p>
              <a
                href="https://discord.gg/frostesports"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-2 font-bold text-cyan-300 hover:text-cyan-200"
              >
                Join our Discord <ExternalLink size={15} />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            Back to registration
          </button>
        </motion.section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.22),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,1))]" />

        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <Trophy size={16} /> Overwatch Tournament Registration
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Frost Esports Team Signup
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Register your full roster, captain, coach, and substitute information in one place. Please make sure all Blizzard IDs, Discord handles, and emails are accurate before submitting.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <DetailCard icon={CalendarDays} label="Date" value="TBA" />
            <DetailCard icon={Users} label="Format" value="5v5 Overwatch" />
            <DetailCard icon={Shield} label="Roster" value="5 Players + Subs" />
            <DetailCard icon={MapPin} label="Region" value="Online" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Team
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Team Information <span className="text-cyan-300">*</span>
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Team Name" required placeholder="Team Name" />
                <Field label="Contact Email" required placeholder="example@email.com" type="email" />
                <div className="md:col-span-2">
                  <Field
                    label="Liquipedia Page"
                    required
                    placeholder="https://liquipedia.net/overwatch/Team_Name"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <OptionalRole title="Captain" onAdd={addCaptain} disabled={separateCaptainDisabled || hasSeparateCaptain} />
              <OptionalRole title="Coach" onAdd={addCoach} />
            </div>

            {captains.length > 0 || coaches.length > 0 ? (
              <div className="space-y-5">
                {captains.map((captain, index) => (
                  <StaffCard
                    key={captain.id}
                    title={`Captain ${index + 1}`}
                    onRemove={() => removeCaptain(captain.id)}
                  />
                ))}

                {coaches.map((coach, index) => (
                  <StaffCard
                    key={coach.id}
                    title={`Coach ${index + 1}`}
                    onRemove={() => removeCoach(coach.id)}
                  />
                ))}
              </div>
            ) : null}

            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((number) => (
                <PlayerCard
                  key={number}
                  playerId={`player-${number}`}
                  title={`Player ${number}`}
                  required
                  captainId={captainId}
                  onCaptainToggle={handleCaptainToggle}
                  captainLocked={playerCaptainLocked}
                />
              ))}

              {substitutes.map((substitute, index) => (
                <PlayerCard
                  key={substitute.id}
                  playerId={substitute.id}
                  title={`Substitute ${index + 1}`}
                  required={false}
                  onRemove={() => removeSubstitute(substitute.id)}
                  captainId={captainId}
                  onCaptainToggle={handleCaptainToggle}
                  captainLocked={playerCaptainLocked}
                />
              ))}

              <button
                type="button"
                onClick={addSubstitute}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-cyan-300/40 bg-cyan-300/10 px-5 py-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
              >
                <Plus size={18} /> Add Sub
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Acknowledgement
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Final Confirmation <span className="text-cyan-300">*</span>
              </h2>

              <div className="mt-6 space-y-4">
                {substitutes.length === 0 ? (
                  <label className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-cyan-300"
                    />
                    <span>
                      I acknowledge that my team may lose the right to an emergency substitute by not registering a substitute.
                    </span>
                  </label>
                ) : null}

                <label className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-cyan-300"
                  />
                  <span>
                    I consent to receiving emails from Frost Esports regarding tournament registration details.
                  </span>
                </label>

                <label className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-cyan-300"
                  />
                  <span>
                    I acknowledge and agree that Frost Esports may collect, store, and use the information submitted in this form, including names, emails, Discord usernames, Battle.net IDs, social handles, roster details, and related registration data, for tournament administration, communication, eligibility review, event operations, and recordkeeping purposes.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="mt-7 w-full rounded-2xl bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200"
              >
                Submit Tournament Registration
              </button>
            </div>
          </form>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-6">
            <h2 className="text-xl font-black">Registration Checklist</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Before submitting, double-check every required field and make sure your captain is clearly marked.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-300" size={18} /> Team name
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-300" size={18} /> Contact email
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-300" size={18} /> 5 player roster
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-300" size={18} /> Substitute info
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-300" size={18} /> Captain selected
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="flex items-center gap-2 font-bold text-cyan-100">
                <Mail size={18} /> Need help?
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Questions about registration, emergency substitutes, or tournament rules can be sent to tournament staff.
              </p>
              <a
                href="https://discord.gg/frostesports"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Join the Discord <ExternalLink size={15} />
              </a>
            </div>

            <a
              href="#"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200"
            >
              View tournament rules <ExternalLink size={15} />
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
