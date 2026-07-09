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
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/cards/GlassCard";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

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
  { q: "What file formats are supported?", a: "PDF and DOCX, up to 10 MB per file." },
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
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-glass-border">
        <div className="pointer-events-none absolute inset-0 bg-mesh-bg" />
        <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 animate-float-slow rounded-full bg-brand-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 animate-float rounded-full bg-brand-accent/15 blur-[120px]" />

        <div className="container-page relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-bg px-3 py-1 text-xs text-text-secondary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Resume analysis, structured as data
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              Your resume,
              <br />
              <span className="text-gradient">read like a recruiter would.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-lg text-lg text-text-secondary"
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
                <Button size="lg" className="bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
                  Analyze my resume <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="secondary" className="bg-glass-bg text-text-primary hover:bg-glass-border">
                  See how it works
                </Button>
              </a>
            </motion.div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> Results in ~30 seconds
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <GlassCard hover={false} className="relative overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-glass-border px-5 py-3">
                <span className="text-xs font-medium text-text-secondary">resume_scan.json</span>
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> analysis complete
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 p-5">
                <div className="rounded-xl border border-glass-border bg-glass-bg p-4">
                  <div className="label-eyebrow mb-3">Resume score</div>
                  <div className="font-display text-3xl font-bold text-text-primary">92</div>
                  <div className="mt-3">
                    <Progress value={92} className="h-1.5 bg-glass-border [&>div]:bg-success" />
                  </div>
                </div>
                <div className="rounded-xl border border-glass-border bg-glass-bg p-4">
                  <div className="label-eyebrow mb-3">ATS score</div>
                  <div className="font-display text-3xl font-bold text-text-primary">88</div>
                  <div className="mt-3">
                    <Progress value={88} className="h-1.5 bg-glass-border [&>div]:bg-brand-primary" />
                  </div>
                </div>
              </div>
              <div className="space-y-3 border-t border-glass-border p-5">
                <div className="label-eyebrow">Top recommended roles</div>
                {[
                  { role: "Backend Developer", match: 94 },
                  { role: "Platform Engineer", match: 87 },
                  { role: "Data Engineer", match: 79 },
                ].map((r) => (
                  <div key={r.role} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{r.role}</span>
                    <span className="font-mono text-xs text-text-secondary">{r.match}% match</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-glass-border py-24">
        <div className="container-page">
          <div className="max-w-xl">
            <span className="label-eyebrow">Platform</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Everything a job search needs, derived from one upload
            </h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer(0.08)}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={fadeInUp}>
                <GlassCard glow="primary">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-text-primary">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-glass-border py-24">
        <div className="container-page">
          <div className="max-w-xl">
            <span className="label-eyebrow">Process</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Three steps, one upload
            </h2>
          </div>
          <div className="glow-divider my-10" />
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative"
              >
                <div className="font-mono text-sm text-brand-primary">{String(idx + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-b border-glass-border py-24">
        <div className="container-page">
          <span className="label-eyebrow">Feedback</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Trusted by people who need the next step, not a score
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <GlassCard key={t.name} hover={false}>
                <p className="text-sm leading-relaxed text-text-primary/90">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 text-sm">
                  <div className="font-medium text-text-primary">{t.name}</div>
                  <div className="text-text-secondary">{t.role}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-glass-border py-24">
        <div className="container-page max-w-3xl">
          <span className="label-eyebrow">FAQ</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Common questions
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-glass-border">
                <AccordionTrigger className="text-base font-medium text-text-primary hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-text-secondary">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24">
        <div className="container-page">
          <GlassCard hover={false} glow="primary" className="flex flex-col items-start justify-between gap-6 bg-gradient-to-br from-brand-primary/10 to-transparent p-10 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-2xl font-bold text-text-primary">Ready to see your best-fit roles?</h3>
              <p className="mt-2 text-text-secondary">Upload takes under a minute. No credit card needed.</p>
            </div>
            <Link to="/register">
              <Button size="lg" className="bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>
    </MarketingLayout>
  );
}
