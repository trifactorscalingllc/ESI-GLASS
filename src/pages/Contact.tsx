import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { toast } from "@/hooks/use-toast";
import {
  budgetRanges,
  contact,
  planStatusOptions,
  projectTypes,
  referralSources,
  roles,
  scopeOptions,
  sqftRanges,
  timelineOptions,
} from "@/lib/site-config";

type FormState = {
  // Step 1: Project
  projectType: string;
  projectName: string;
  projectLocation: string;
  // Step 2: Scope & scale
  scopes: string[];
  sqft: string;
  budget: string;
  // Step 3: Timeline
  timeline: string;
  planStatus: string;
  bidDate: string;
  // Step 4: Contact
  fullName: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  source: string;
  notes: string;
};

const initial: FormState = {
  projectType: "",
  projectName: "",
  projectLocation: "",
  scopes: [],
  sqft: "",
  budget: "",
  timeline: "",
  planStatus: "",
  bidDate: "",
  fullName: "",
  company: "",
  role: "",
  email: "",
  phone: "",
  source: "",
  notes: "",
};

const STEPS = [
  { id: 1, label: "Project" },
  { id: 2, label: "Scope" },
  { id: 3, label: "Timeline" },
  { id: 4, label: "Contact" },
];

export default function Contact() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);

  // Residential single-family is intentionally a "redirect" path — ESI
  // doesn't bid those and we don't want to waste either side's time.
  const isResidential = form.projectType === "residential";

  const stepValid = useMemo(() => {
    if (step === 1) return !!form.projectType && !!form.projectLocation;
    if (step === 2) return form.scopes.length > 0 && !!form.sqft && !!form.budget;
    if (step === 3) return !!form.timeline && !!form.planStatus;
    if (step === 4)
      return !!form.fullName && !!form.email && !!form.phone && !!form.role && !!form.company;
    return false;
  }, [step, form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleScope(value: string) {
    setForm((f) => ({
      ...f,
      scopes: f.scopes.includes(value)
        ? f.scopes.filter((s) => s !== value)
        : [...f.scopes, value],
    }));
  }

  function next() {
    if (!stepValid) return;
    if (step < 4) setStep((s) => s + 1);
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stepValid) return;
    // In production this would POST to a server / form service.
    // For now we log + show success state.
    console.info("ESI lead submitted:", form);
    setSubmitted(true);
    toast({
      title: "Thanks — we received your request.",
      description: "An estimator will reach out within two business days.",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <SiteLayout>
        <SuccessState
          onReset={() => {
            setForm(initial);
            setStep(1);
            setSubmitted(false);
          }}
        />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Left column — sidebar info */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <span className="eyebrow">Contact</span>
              <h1 className="display-2 mt-5">
                Tell us about
                <br />
                <span className="text-gradient">your project.</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                A few quick questions help us route your inquiry to the right
                estimator and prepare a meaningful response. Most fields take
                seconds.
              </p>

              <div className="mt-8 flex flex-col gap-3 text-sm">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${contact.address1}, ${contact.city}, ${contact.state} ${contact.zip}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-light flex items-start gap-3 rounded-2xl p-4 transition-colors hover:bg-white/[0.08]"
                >
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>
                    {contact.address1}
                    <br />
                    {contact.city}, {contact.state} {contact.zip}
                  </span>
                </a>
                <a
                  href={`tel:${contact.phoneHref}`}
                  className="glass-light flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-white/[0.08]"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  {contact.phone}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="glass-light flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-white/[0.08]"
                >
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                  {contact.email}
                </a>
                <div className="glass-light flex items-center gap-3 rounded-2xl p-4 text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                  {contact.hours}
                </div>
              </div>
            </div>
          </aside>

          {/* Right column — form */}
          <div className="md:col-span-8">
            <div className="glass-heavy glass-reflective rounded-[2rem] p-6 md:p-10">
              <Stepper current={step} />

              <form onSubmit={handleSubmit} className="mt-10">
                {step === 1 && (
                  <Step1
                    form={form}
                    update={update}
                    isResidential={isResidential}
                  />
                )}
                {step === 2 && (
                  <Step2 form={form} update={update} toggleScope={toggleScope} />
                )}
                {step === 3 && <Step3 form={form} update={update} />}
                {step === 4 && <Step4 form={form} update={update} />}

                {/* Nav buttons */}
                <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-foreground/80 transition-colors hover:bg-white/[0.05]"
                    >
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={!stepValid || isResidential}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsla(200,95%,55%,0.4)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!stepValid}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_hsla(200,95%,55%,0.4)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                    >
                      Submit Request
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            <p className="mt-4 px-2 text-xs text-muted-foreground">
              We respond to qualified inquiries within two business days. Your
              information is used only to respond to this request — we don't
              share it.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

/* ---------- Stepper ---------- */
function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const active = current === s.id;
        const complete = current > s.id;
        return (
          <li key={s.id} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : complete
                  ? "bg-primary/30 text-primary"
                  : "bg-white/[0.06] text-muted-foreground"
              }`}
            >
              {complete ? <CheckCircle2 className="h-4 w-4" /> : s.id}
            </div>
            <span
              className={`hidden text-xs font-medium uppercase tracking-[0.15em] sm:inline ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="ml-1 mr-1 h-px flex-1 bg-white/10" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Step 1 — Project Type & Location ---------- */
function Step1({
  form,
  update,
  isResidential,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  isResidential: boolean;
}) {
  return (
    <div className="grid gap-6">
      <FieldHeading
        label="What type of project is this?"
        helper="ESI specializes in commercial and institutional glazing. Residential inquiries (single-family homes, individual entry doors) are typically referred to a residential glass specialist."
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {projectTypes.map((t) => {
          const selected = form.projectType === t.value;
          const isRes = t.value === "residential";
          return (
            <button
              type="button"
              key={t.value}
              onClick={() => update("projectType", t.value)}
              className={`glass-light text-left rounded-2xl px-4 py-3 text-sm transition-all ${
                selected
                  ? "border-primary/60 bg-white/[0.10] text-foreground ring-2 ring-primary/40"
                  : "text-foreground/85 hover:bg-white/[0.06]"
              } ${isRes ? "opacity-80" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span>{t.label}</span>
                {selected && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {isResidential && <ResidentialNotice />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Project name (optional)"
          value={form.projectName}
          onChange={(v) => update("projectName", v)}
          placeholder="e.g. Upper-Merion HS Renovation"
        />
        <Field
          label="Project location *"
          value={form.projectLocation}
          onChange={(v) => update("projectLocation", v)}
          placeholder="City, State"
          required
        />
      </div>
    </div>
  );
}

function ResidentialNotice() {
  return (
    <div className="rounded-2xl border border-amber-400/30 bg-amber-400/[0.08] p-5 text-sm leading-relaxed">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
        <div className="text-foreground/90">
          <strong className="text-amber-300">
            We don't service single-family residential.
          </strong>
          <p className="mt-1 text-foreground/75">
            ESI is a commercial contract glazing firm — our minimums and
            insurance requirements don't fit residential entry doors,
            replacement windows, or shower enclosures. For those, we recommend
            calling a local residential glazier or your neighborhood Pella /
            Andersen dealer. Thank you for thinking of us.
          </p>
          <p className="mt-2 text-foreground/75">
            If your project is a multi-family residential building, please
            select <em>Multi-Family / Hospitality</em> instead.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 2 — Scope & Scale ---------- */
function Step2({
  form,
  update,
  toggleScope,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleScope: (v: string) => void;
}) {
  return (
    <div className="grid gap-6">
      <FieldHeading
        label="Which scopes are involved? *"
        helper="Select every scope that applies. We'll bid only what we're qualified for."
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {scopeOptions.map((s) => {
          const selected = form.scopes.includes(s.value);
          return (
            <button
              type="button"
              key={s.value}
              onClick={() => toggleScope(s.value)}
              className={`glass-light text-left rounded-2xl px-4 py-3 text-sm transition-all ${
                selected
                  ? "border-primary/60 bg-white/[0.10] ring-2 ring-primary/40"
                  : "text-foreground/85 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{s.label}</span>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/30"
                  }`}
                >
                  {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Approximate project size *"
          value={form.sqft}
          onChange={(v) => update("sqft", v)}
          options={sqftRanges}
        />
        <SelectField
          label="Budget range for glazing scope *"
          value={form.budget}
          onChange={(v) => update("budget", v)}
          options={budgetRanges}
        />
      </div>
    </div>
  );
}

/* ---------- Step 3 — Timeline ---------- */
function Step3({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="grid gap-6">
      <FieldHeading
        label="When does this need to happen?"
        helper="Even an estimate helps us prioritize and staff the bid."
      />
      <SelectField
        label="Project timeline *"
        value={form.timeline}
        onChange={(v) => update("timeline", v)}
        options={timelineOptions}
      />
      <SelectField
        label="Status of plans / specs *"
        value={form.planStatus}
        onChange={(v) => update("planStatus", v)}
        options={planStatusOptions}
      />
      <Field
        label="Bid due date (if known)"
        type="date"
        value={form.bidDate}
        onChange={(v) => update("bidDate", v)}
      />
    </div>
  );
}

/* ---------- Step 4 — Contact details ---------- */
function Step4({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="grid gap-6">
      <FieldHeading
        label="How do we reach you?"
        helper="We'll only use this to respond to your request."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name *"
          value={form.fullName}
          onChange={(v) => update("fullName", v)}
          required
        />
        <Field
          label="Company *"
          value={form.company}
          onChange={(v) => update("company", v)}
          required
        />
        <SelectField
          label="Your role *"
          value={form.role}
          onChange={(v) => update("role", v)}
          options={roles}
        />
        <Field
          label="Email *"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          required
        />
        <Field
          label="Phone *"
          type="tel"
          value={form.phone}
          onChange={(v) => update("phone", v)}
          required
        />
        <SelectField
          label="How did you hear about us?"
          value={form.source}
          onChange={(v) => update("source", v)}
          options={referralSources}
        />
      </div>
      <TextareaField
        label="Anything else we should know?"
        value={form.notes}
        onChange={(v) => update("notes", v)}
        placeholder="Project background, scope nuances, attachments coming via email, etc."
      />
    </div>
  );
}

/* ---------- Reusable field primitives ---------- */
function FieldHeading({
  label,
  helper,
}: {
  label: string;
  helper?: string;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{label}</h2>
      {helper && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {helper}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/70">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="glass-light mt-2 block h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/70">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-light mt-2 block h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-foreground focus:border-primary/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="" className="bg-[hsl(var(--background))]">
          Select…
        </option>
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            className="bg-[hsl(var(--background))]"
          >
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/70">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="glass-light mt-2 block w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

/* ---------- Success ---------- */
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <section className="container-x">
      <div className="glass-heavy glass-reflective relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] p-10 text-center md:p-16">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="glass-light mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="display-2 mt-6">Request received.</h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Thanks for reaching out. An ESI estimator will review your project
            and respond within two business days. If your timeline is shorter,
            give us a call directly at{" "}
            <a
              href={`tel:${contact.phoneHref}`}
              className="font-semibold text-primary hover:underline"
            >
              {contact.phone}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-foreground/80 transition-colors hover:bg-white/[0.05]"
          >
            Submit another request
          </button>
        </div>
      </div>
    </section>
  );
}
