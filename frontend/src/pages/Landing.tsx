import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ScanLine,
  Target,
  GitBranch,
  ShieldCheck,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";

const FEATURES = [
  {
    icon: ScanLine,
    title: "Structured extraction",
    desc: "Parses skills, experience, education and projects straight out of PDF or DOCX, no manual tagging.",
  },
  {
    icon: Sparkles,
    title: "AI role matching",
    desc: "Gemini scores your resume against real role profiles and explains exactly why each one fits.",
  },
  {
    icon: Target,
    title: "Skill gap analysis",
    desc: "See precisely which skills are missing for your target roles, ranked by priority.",
  },
  {
    icon: GitBranch,
    title: "Career roadmap",
    desc: "A sequenced, actionable path from your current level to the role you are aiming for.",
  },
  {
    icon: FileText,
    title: "ATS scoring",
    desc: "Know how applicant tracking systems will read your resume before a recruiter ever sees it.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    desc: "Your resume and analysis history are scoped to your account with row-level security.",
  },
];

const STEPS = [
  { title: "Upload", desc: "Drop in a PDF or DOCX resume. We handle parsing and validation." },
  { title: "Analyze", desc: "Gemini reads the parsed content and scores it against real role profiles." },
  { title: "Act", desc: "Get ranked roles, missing skills and a roadmap you can start on today." },
];

const TESTIMONIALS = [
  {
    quote: "RoleLens surfaced three roles I had not considered, each with a concrete reason tied to my projects.",
    name: "Priyanka R.",
    role: "Backend Engineer",
  },
  {
    quote: "The skill gap view turned a vague job search into a two week study plan.",
    name: "Daniel O.",
    role: "Data Analyst",
  },
  {
    quote: "First tool that explained my ATS score instead of just showing a number.",
    name: "Wei Chen",
    role: "Product Designer",
  },
];

const FAQS = [
  {
    q: "What file formats are supported?",
    a: "PDF and DOCX, up to 10 MB per file.",
  },
  {
    q: "Is my resume data private?",
    a: "Yes. Files are stored in a private bucket and every analysis is scoped to your account only.",
  },
  {
    q: "How is the AI analysis generated?",
    a: "Your parsed resume text is sent to Google Gemini with a structured prompt that returns scoring, role matches and a roadmap as JSON.",
  },
  {
    q: "Can I revisit past analyses?",
    a: "Every analysis is saved to your history so you can track how your resume improves over time.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-grid-glow">
        <div className="container-page grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Resume analysis, structured as data
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              Your resume,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                read like a recruiter would.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-lg text-lg text-muted"
            >
              Upload a resume and get an AI-scored breakdown of your best-fit roles, missing
              skills, and a roadmap to close the gap, in under a minute.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link to="/register">
                <Button size="lg">
                  Analyze my resume <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="secondary">
                  See how it works
                </Button>
              </a>
            </motion.div>

            <div className="mt-10 flex items-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> Results in ~30 seconds
              </div>
            </div>
          </div>

          {/* Signature element: live resume-to-structured-JSON scan panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="text-xs font-medium text-muted">resume_scan.json</span>
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> analysis complete
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 p-5">
                <div className="rounded-lg border border-border bg-background/60 p-4">
                  <div className="label-eyebrow mb-3">Resume score</div>
                  <div className="text-3xl font-semibold">92</div>
                  <div className="mt-3">
                    <ProgressBar value={92} tone="success" />
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-background/60 p-4">
                  <div className="label-eyebrow mb-3">ATS score</div>
                  <div className="text-3xl font-semibold">88</div>
                  <div className="mt-3">
                    <ProgressBar value={88} tone="primary" />
                  </div>
                </div>
              </div>
              <div className="space-y-3 border-t border-border p-5">
                <div className="label-eyebrow">Top recommended roles</div>
                {[
                  { role: "Backend Developer", match: 94 },
                  { role: "Platform Engineer", match: 87 },
                  { role: "Data Engineer", match: 79 },
                ].map((r) => (
                  <div key={r.role} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{r.role}</span>
                    <span className="font-mono text-xs text-muted">{r.match}% match</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-border/60 py-24">
        <div className="container-page">
          <div className="max-w-xl">
            <span className="label-eyebrow">Platform</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything a job search needs, derived from one upload
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:border-primary/40 transition-colors">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-border/60 py-24">
        <div className="container-page">
          <div className="max-w-xl">
            <span className="label-eyebrow">Process</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Three steps, one upload
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <div key={step.title} className="relative">
                <div className="font-mono text-sm text-primary">{String(idx + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-b border-border/60 py-24">
        <div className="container-page">
          <span className="label-eyebrow">Feedback</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by people who need the next step, not a score
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <p className="text-sm leading-relaxed text-ink/90">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 text-sm">
                  <div className="font-medium text-ink">{t.name}</div>
                  <div className="text-muted">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-border/60 py-24">
        <div className="container-page max-w-3xl">
          <span className="label-eyebrow">FAQ</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Common questions
          </h2>
          <div className="mt-10 divide-y divide-border">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none text-base font-medium text-ink">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-24">
        <div className="container-page">
          <Card className="flex flex-col items-start justify-between gap-6 bg-gradient-to-br from-primary/10 to-transparent p-10 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">Ready to see your best-fit roles?</h3>
              <p className="mt-2 text-muted">Upload takes under a minute. No credit card needed.</p>
            </div>
            <Link to="/register">
              <Button size="lg">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
