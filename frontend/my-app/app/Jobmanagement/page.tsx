"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { Briefcase, Users, Clock, CheckCircle2 } from "lucide-react";

import { ProfileButton } from "@/components/Job/profile-button";
import { checkLogin, delay } from "@/data/common";

import JobDetails from "./jobDetails";
import JobApplications from "./jobApplications";

export default function RecruiterWorkspace() {
  const router = useRouter();
  const [application, setApplication] = useState(-1);

  const changeApplication = (id: number) => {
    setApplication(id);
  };

  useEffect(() => {
    const validate = async () => {
      const loggedIn = await checkLogin();
      await delay(600);
      if (!loggedIn) {
        router.push("/");
      }
    };
    validate();
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060A] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-indigo-500/25 blur-[220px]" />
        <div className="absolute right-[-14rem] bottom-[-12rem] h-[32rem] w-[32rem] rounded-full bg-sky-500/20 blur-[220px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.32),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-14">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Lumenhire recruiters</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Run a purposeful hiring command centre</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Orchestrate role launches, panel choreography, and offer decisions in one luminous dashboard.
            </p>
          </div>
          <ProfileButton variant="compact" className="h-11 rounded-full border border-white/10 bg-white/[0.08] px-4 text-slate-200 hover:text-white" />
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{ icon: Briefcase, label: "Live roles", value: "12" }, { icon: Users, label: "Applicants in review", value: "324" }, { icon: CheckCircle2, label: "Offers delivered", value: "22" }, { icon: Clock, label: "Average time to offer", value: "18 days" }].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08]">
                  <metric.icon className="h-5 w-5 text-indigo-200" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={application === -1 ? "overview" : "applications"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 rounded-[30px] border border-white/10 bg-[#080A12]/80 p-8 backdrop-blur-xl"
          >
            {application === -1 ? (
              <JobDetails changeApplication={changeApplication} />
            ) : (
              <JobApplications changeApplication={changeApplication} application={application} />
            )}
          </motion.section>
        </AnimatePresence>

        <footer className="mt-auto border-t border-white/10 pt-6 text-xs text-slate-400">
          <p>Keep your team aligned. Lumenhire captures decisions, nudges follow-ups, and makes hiring measurable.</p>
        </footer>
      </div>
    </div>
  );
}