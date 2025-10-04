"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Sparkles,
  Workflow,
  Gauge,
  ShieldCheck,
  Users2,
  BarChart3,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  hint: string;
}

interface Persona {
  title: string;
  description: string;
  actions: string[];
}

const featureCards: Feature[] = [
  {
    title: "Fluid hiring pipelines",
    description: "Design role-specific journeys, automate follow-ups, and surface priorities before the day even starts.",
    icon: Workflow,
    accent: "from-indigo-500/60 via-transparent to-transparent",
    hint: "Composable stages with built-in automations"
  },
  {
    title: "Adaptive candidate profiles",
    description: "Enrich every application with live skill scores, portfolio snapshots, and interviewer highlights in one stream.",
    icon: Users2,
    accent: "from-sky-500/60 via-transparent to-transparent",
    hint: "Context-aware, AI assisted profile rollups"
  },
  {
    title: "Realtime hiring intelligence",
    description: "Forecast hiring velocity, spot bottlenecks, and compare pipelines across teams without exporting a single sheet.",
    icon: BarChart3,
    accent: "from-emerald-500/60 via-transparent to-transparent",
    hint: "Forecasting models tuned for hiring ops"
  }
];

const personaCards: Persona[] = [
  {
    title: "Talent leads",
    description: "Plan headcount confidently with capacity dashboards, SLA alerts, and friction-free approvals.",
    actions: ["Live demand planning", "Pipeline quality scores", "One-click offer approvals"]
  },
  {
    title: "Hiring managers",
    description: "Review curated shortlists, share structured feedback, and align the panel before candidates join the call.",
    actions: ["Role blueprints", "Interview narratives", "Panel alignment"]
  },
  {
    title: "Candidates",
    description: "Experience a polished journey with status transparency, guided preparation, and smart scheduling windows.",
    actions: ["Instant status updates", "Interview prep spaces", "Time zone aware booking"]
  }
];

const timelineSteps = [
  {
    title: "Model the role",
    description: "Start from a calibrated role canvas, set target metrics, and publish a branded microsite in minutes.",
    icon: Sparkles
  },
  {
    title: "Activate the workflow",
    description: "Automate outreach, route resumes to the right reviewers, and tailor nudges based on pipeline health.",
    icon: LayoutDashboard
  },
  {
    title: "Run purposeful interviews",
    description: "Give every panel a shared script, auto-capture notes, and sync highlights back to the decision room.",
    icon: Gauge
  },
  {
    title: "Decide with clarity",
    description: "See offer-ready candidates at a glance, compare feedback signals, and commit with full context.",
    icon: ShieldCheck
  }
];

const metrics = [
  { label: "Average time-to-offer", value: "-37%" },
  { label: "Pipeline visibility", value: "98%" },
  { label: "Candidate satisfaction", value: "4.9/5" }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[#05060A] text-slate-100">
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[180px]" />
        <div className="pointer-events-none absolute bottom-[-18rem] left-[-10rem] h-[36rem] w-[36rem] rounded-full bg-sky-500/20 blur-[160px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
              <Sparkles className="h-5 w-5 text-indigo-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Lumenhire</p>
              <p className="text-sm text-slate-300">Talent operations, illuminated</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Button asChild variant="ghost" className="text-slate-300 hover:text-white">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="/register">Create workspace</Link>
            </Button>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs tracking-wide text-slate-300 backdrop-blur"
          >
            <Clock className="h-4 w-4 text-indigo-300" />
            Hiring systems for teams who refuse to rush decisions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="mt-8 max-w-3xl text-balance text-4xl font-semibold leading-tight md:text-6xl"
          >
            Build thoughtful hiring experiences without drowning in busywork.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >
            Lumenhire stitches sourcing, interviews, and decisions into a single canvas so modern teams stay aligned, responsive, and unmistakably human.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="bg-indigo-500 px-8 text-base font-medium text-white shadow-[0_20px_45px_rgba(99,102,241,0.35)] hover:bg-indigo-400">
              <Link href="/register" className="flex items-center gap-2">
                Launch pilot
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent px-8 text-base text-slate-200 hover:border-white/40">
              <Link href="/login">Take the product tour</Link>
            </Button>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            {metrics.map((metric) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/5 bg-white/5 px-6 py-5 backdrop-blur"
              >
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-sm text-slate-300">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur"
              >
                <div className={"absolute inset-x-0 top-0 h-px bg-gradient-to-r " + feature.accent} />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <feature.icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.28em] text-slate-400">{feature.hint}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-white/[0.07] p-10 backdrop-blur"
            >
              <h2 className="text-2xl font-semibold text-white">A hiring rhythm everyone can feel</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Rally the team around a living workflow. Loop in stakeholders exactly when they add the most value, keep candidates fully in the know, and close roles with confidence.
              </p>
              <div className="mt-8 space-y-6">
                {timelineSteps.map((step) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                      <step.icon className="h-5 w-5 text-indigo-200" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-[#080A12]/80 p-10 backdrop-blur"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">Operating system for modern talent teams</h3>
                <p className="mt-3 text-sm text-slate-300">
                  Lumenhire blends structured hiring discipline with the right dose of automation so recruiting keeps its human edge.
                </p>
              </div>
              <div className="space-y-4">
                {personaCards.map((persona) => (
                  <div key={persona.title} className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-white">{persona.title}</p>
                    <p className="mt-1 text-xs text-slate-300">{persona.description}</p>
                    <ul className="mt-3 space-y-2 text-xs text-slate-200">
                      {persona.actions.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="inline-flex h-2 w-2 rounded-full bg-indigo-300" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/50 via-white/5 to-transparent p-12 text-center backdrop-blur"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <h2 className="text-3xl font-semibold text-white">Ready to see your hiring in a new light?</h2>
            <p className="mt-4 text-base text-slate-200">
              Spin up a shared workspace, sync your roles, and ship a refined talent experience this week.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white px-8 text-base font-medium text-slate-900 hover:bg-slate-100">
                <Link href="/register">Start free trial</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-slate-200 hover:text-white">
                <Link href="/login">Explore dashboards</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <footer className="border-t border-white/5 bg-black/20 py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 text-xs text-slate-400 sm:flex-row">
            <p>{"\u00A9"} {new Date().getFullYear()} Lumenhire Labs. Crafted for thoughtful hiring teams.</p>
            <div className="flex gap-4">
              <Link href="/login" className="hover:text-white">Platform</Link>
              <Link href="/register" className="hover:text-white">Create workspace</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
