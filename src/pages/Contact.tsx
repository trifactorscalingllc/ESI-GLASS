import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";

type FormState = {
  projectType: string;
  projectName: string;
  projectLocation: string;
  scopes: string[];
  sqft: string;
  budget: string;
  timeline: string;
  planStatus: string;
  bidDate: string;
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

  const isResidential = form.projectType === "residential";

  const stepValid = useMemo(() => {
    if (step === 1) return !!form.projectType && !!form.projectLocation && !isResidential;
    if (step === 2) return form.scopes.length > 0 && !!form.sqft && !!form.budget;
    if (step === 3) return !!form.timeline && !!form.planStatus;
    if (step === 4)
      return (
        !!form.fullName &&
        !!form.email &&
        !!form.phone &&
        !!form.role &&
        !!form.company
      );
    return false;
  }, [step, form, isResidential]);

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
    if (step < 4) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stepValid) return;
    console.info("ESI lead submitted:", form);
    setSubmitted(true);
    toast({
      title: "Request received.",
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
      <section className="pt-32 pb-16 md:pt-40">
        <div className="container-x">
          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <header className="md:col-span-7">
              <div className="chapter">Contact — Step {step} of {STEPS.length}</div>
              <h1 className="display-1 mt-8 max-w-[16ch] text-balance">
                Tell us about your project.
              </h1>
            </header>
            <p className="lede md:col-span-4 md:col-start-9 md:pt-14">
              A few quick questions help us route your inquiry to the right
              estimator and prepare a meaningful response.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-paper-3 py-16 md:py-24">
        <div className="container-x">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            {/* Sidebar — direct contact */}
            <aside className="md:col-span-4 md:sticky md:top-32 md:self-start">
              <div className="chapter">Direct</div>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${contact.address1}, ${contact.city}, ${contact.state} ${contact.zip}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block link-draw"
                  >
                    <span className="caption">Studio</span>
                    <span className="mt-1 block font-display text-lg">
                      {contact.address1}
                      <br />
                      {contact.city}, {contact.state} {contact.zip}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.phoneHref}`}
                    className="block link-draw"
                  >
                    <span className="caption">Telephone</span>
                    <span className="mt-1 block font-display text-lg">
                      {contact.phone}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="block link-draw"
                  >
                    <span className="caption">Email</span>
                    <span className="mt-1 block font-display text-lg">
                      {contact.email}
                    </span>
                  </a>
                </li>
                <li>
                  <span className="caption">Hours</span>
                  <span className="mt-1 block text-base">{contact.hours}</span>
                </li>
              </ul>
            </aside>

            {/* Form */}
            <div className="md:col-span-8">
              <Stepper current={step} />

              <form onSubmit={handleSubmit} className="mt-12">
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

                <div className="mt-16 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-paper-3 pt-8 sm:flex-row sm:items-center">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={back}
                      className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <span />
                  )}

                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={next}
                      disabled={!stepValid}
                      size="lg"
                      className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!stepValid}
                      size="lg"
                      className="rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
                    >
                      Submit Request
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>

              <p className="mt-6 text-xs text-ink-3">
                We respond to qualified inquiries within two business days. Your
                information is used only to respond to this request — we don't
                share it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

/* ---------- Stepper ---------- */
function Stepper({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2 border-b border-paper-3 pb-2">
      {STEPS.map((s) => {
        const active = current === s.id;
        const complete = current > s.id;
        return (
          <li key={s.id} className="flex flex-col gap-2">
            <div
              className={cn(
                "h-px transition-colors",
                active || complete ? "bg-ink" : "bg-paper-3"
              )}
            />
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.18em]",
                  active || complete ? "text-ink" : "text-ink-3"
                )}
              >
                {complete ? "✓" : `0${s.id}`}
              </span>
              <span
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.18em]",
                  active ? "text-ink" : "text-ink-3"
                )}
              >
                {s.label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Step 1 — Project ---------- */
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
    <div className="space-y-12">
      <FieldGroup
        label="What type of project is this?"
        helper="ESI specializes in commercial and institutional glazing. Residential single-family inquiries are typically referred to a residential glass specialist."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {projectTypes.map((t) => {
            const selected = form.projectType === t.value;
            return (
              <button
                type="button"
                key={t.value}
                onClick={() => update("projectType", t.value)}
                className={cn(
                  "group flex items-center justify-between border px-4 py-3 text-left text-sm transition-colors",
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-paper-3 bg-paper hover:border-ink/50"
                )}
              >
                <span>{t.label}</span>
                {selected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </FieldGroup>

      {isResidential && <ResidentialNotice />}

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldRow label="Project name" hint="Optional">
          <Input
            value={form.projectName}
            onChange={(e) => update("projectName", e.target.value)}
            placeholder="e.g. Upper-Merion HS Renovation"
            className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </FieldRow>
        <FieldRow label="Project location" required>
          <Input
            required
            value={form.projectLocation}
            onChange={(e) => update("projectLocation", e.target.value)}
            placeholder="City, State"
            className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </FieldRow>
      </div>
    </div>
  );
}

function ResidentialNotice() {
  return (
    <div className="flex items-start gap-4 border border-amber-700/30 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950">
      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
      <div>
        <strong className="font-semibold">
          We don't service single-family residential.
        </strong>
        <p className="mt-1.5">
          ESI is a commercial contract glazing firm — our minimums and insurance
          requirements don't fit residential entry doors, replacement windows,
          or shower enclosures. For those, we recommend calling a local
          residential glazier or your neighborhood Pella / Andersen dealer.
        </p>
        <p className="mt-2">
          If your project is a multi-family residential building, please select{" "}
          <em>Multi-Family / Hospitality</em> instead.
        </p>
      </div>
    </div>
  );
}

/* ---------- Step 2 — Scope ---------- */
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
    <div className="space-y-12">
      <FieldGroup
        label="Which scopes are involved?"
        helper="Select every scope that applies. We'll bid only what we're qualified for."
        required
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {scopeOptions.map((s) => {
            const selected = form.scopes.includes(s.value);
            return (
              <label
                key={s.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors",
                  selected
                    ? "border-ink bg-ink/[0.04]"
                    : "border-paper-3 hover:border-ink/50"
                )}
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => toggleScope(s.value)}
                  className="rounded-none border-ink/40 data-[state=checked]:border-ink data-[state=checked]:bg-ink"
                />
                {s.label}
              </label>
            );
          })}
        </div>
      </FieldGroup>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldRow label="Approximate project size" required>
          <EditorialSelect
            value={form.sqft}
            onChange={(v) => update("sqft", v)}
            options={sqftRanges}
            placeholder="Select range…"
          />
        </FieldRow>
        <FieldRow label="Budget range for glazing scope" required>
          <EditorialSelect
            value={form.budget}
            onChange={(v) => update("budget", v)}
            options={budgetRanges}
            placeholder="Select range…"
          />
        </FieldRow>
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
    <div className="space-y-10">
      <FieldGroup
        label="When does this need to happen?"
        helper="Even an estimate helps us prioritize and staff the bid."
      >
        <div className="space-y-6">
          <FieldRow label="Project timeline" required>
            <EditorialSelect
              value={form.timeline}
              onChange={(v) => update("timeline", v)}
              options={timelineOptions}
              placeholder="Select timeline…"
            />
          </FieldRow>
          <FieldRow label="Status of plans / specs" required>
            <EditorialSelect
              value={form.planStatus}
              onChange={(v) => update("planStatus", v)}
              options={planStatusOptions}
              placeholder="Select status…"
            />
          </FieldRow>
          <FieldRow label="Bid due date" hint="Optional">
            <Input
              type="date"
              value={form.bidDate}
              onChange={(e) => update("bidDate", e.target.value)}
              className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FieldRow>
        </div>
      </FieldGroup>
    </div>
  );
}

/* ---------- Step 4 — Contact ---------- */
function Step4({
  form,
  update,
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-10">
      <FieldGroup
        label="How do we reach you?"
        helper="We'll only use this to respond to your request."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FieldRow label="Full name" required>
            <Input
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FieldRow>
          <FieldRow label="Company" required>
            <Input
              required
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FieldRow>
          <FieldRow label="Your role" required>
            <EditorialSelect
              value={form.role}
              onChange={(v) => update("role", v)}
              options={roles}
              placeholder="Select role…"
            />
          </FieldRow>
          <FieldRow label="Email" required>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FieldRow>
          <FieldRow label="Phone" required>
            <Input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FieldRow>
          <FieldRow label="How did you hear about us?" hint="Optional">
            <EditorialSelect
              value={form.source}
              onChange={(v) => update("source", v)}
              options={referralSources}
              placeholder="Select source…"
            />
          </FieldRow>
        </div>
        <FieldRow label="Anything else we should know?" hint="Optional">
          <Textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Project background, scope nuances, attachments coming via email, etc."
            rows={4}
            className="rounded-none border-paper-3 bg-transparent focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </FieldRow>
      </FieldGroup>
    </div>
  );
}

/* ---------- Field primitives ---------- */
function FieldGroup({
  label,
  helper,
  required,
  children,
}: {
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-6">
      <legend>
        <h2 className="display-3">
          {label}
          {required && <span className="text-ink-3"> *</span>}
        </h2>
        {helper && <p className="mt-3 text-sm text-ink-2 max-w-xl">{helper}</p>}
      </legend>
      {children}
    </fieldset>
  );
}

function FieldRow({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
        {label}
        {required && <span className="text-ink"> *</span>}
        {hint && <span className="ml-2 normal-case tracking-normal text-ink-3/80">— {hint}</span>}
      </Label>
      {children}
    </div>
  );
}

function EditorialSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-none border-x-0 border-t-0 border-b border-paper-3 bg-transparent px-0 focus:border-ink focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-none border-paper-3">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} className="rounded-none">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ---------- Success ---------- */
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <section className="pt-32 pb-32 md:pt-40 md:pb-40">
      <div className="container-x">
        <div className="mx-auto max-w-2xl">
          <div className="chapter">Confirmation</div>
          <h1 className="display-1 mt-8 max-w-[14ch] text-balance">
            Request received.
          </h1>
          <p className="lede mt-8">
            Thanks for reaching out. An ESI estimator will review your project
            and respond within two business days. If your timeline is shorter,
            give us a call at{" "}
            <a
              href={`tel:${contact.phoneHref}`}
              className="link-underline font-medium"
            >
              {contact.phone}
            </a>
            .
          </p>
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="mt-12 rounded-none font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            Submit another request
          </Button>
        </div>
      </div>
    </section>
  );
}
