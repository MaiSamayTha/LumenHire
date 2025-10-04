"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { checkLogin, checkRole, getWelcome, delay } from "@/data/common";
import Candidate from "./candidate";
import Recruiter from "./recruiter";

const roleCards = [
  {
    id: "candidate" as const,
    title: "I'm exploring roles",
    description: "Craft a portfolio-grade profile, manage applications, and prepare for every interview.",
    meta: "For designers, engineers, strategists, and everyone in between"
  },
  {
    id: "interviewer" as const,
    title: "I'm hiring for a team",
    description: "Launch repeatable hiring rituals, sync with panels, and keep candidates feeling seen.",
    meta: "For recruiting leads, founders, and hiring managers"
  }
];

type RoleId = (typeof roleCards)[number]["id"] | "";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleId>("");
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const init = async () => {
      const loggedIn = await checkLogin();
      if (!loggedIn) {
        setIsBootstrapping(false);
        return;
      }
      const role = await checkRole();
      await getWelcome();
      await delay(400);
      if (role === "CANDIDATE") {
        router.replace("/Jobsearch");
      } else {
        router.replace("/Jobmanagement");
      }
    };
    init();
  }, [router]);

  const primaryCopy = useMemo(() => {
    if (selectedRole === "candidate") {
      return {
        title: "Design a magnetic candidate profile",
        blurb:
          "Curate your narrative, track feedback loops, and glide through interviews with confidence.",
      };
    }
    if (selectedRole === "interviewer") {
      return {
        title: "Build a distinctive hiring ritual",
        blurb:
          "Stand up role canvases, mobilise interview panels, and deliver offers candidates talk about.",
      };
    }
    return {
      title: "Choose how you will use Lumenhire",
      blurb:
        "Bring clarity to talent conversations. Whether you are searching or hiring, the system adapts to your rhythm.",
    };
  }, [selectedRole]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06070F]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-16rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-indigo-500/25 blur-[180px]" />
        <div className="absolute right-[-12rem] bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-[180px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Lumenhire onboarding</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">Create a workspace that feels bespoke</h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              Configure Lumenhire to match your perspective on hiring. Choose an entry point and we will tailor the rest.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-slate-300 hover:text-white">
            <Link href="/login">I already have access</Link>
          </Button>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[0.85fr,1.15fr]">
          <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/[0.05] p-10 backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Step 1</p>
              <h2 className="text-2xl font-semibold text-white">Select your starting point</h2>
              <p className="text-sm text-slate-300">We will adjust the workspace based on your focus today.</p>
            </div>
            <div className="space-y-4">
              {roleCards.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "w-full rounded-3xl border px-5 py-6 text-left transition",
                    "border-white/10 bg-white/[0.04] backdrop-blur",
                    selectedRole === role.id
                      ? "border-indigo-400/80 bg-indigo-500/15 text-white shadow-[0_20px_60px_rgba(99,102,241,0.35)]"
                      : "hover:border-white/30 hover:bg-white/[0.08] text-slate-200"
                  )}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{role.meta}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{role.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{role.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#090B14]/80 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="h-full w-full p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRole || "placeholder"}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex h-full flex-col"
                >
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Step 2</p>
                    <h3 className="text-2xl font-semibold text-white">{primaryCopy.title}</h3>
                    <p className="max-w-lg text-sm text-slate-300">{primaryCopy.blurb}</p>
                  </div>
                  <div className="mt-8 flex-1 overflow-y-auto pr-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedRole === "candidate" ? "candidate" : selectedRole === "interviewer" ? "interviewer" : "empty"}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        {selectedRole === "candidate" && <Candidate />}
                        {selectedRole === "interviewer" && <Recruiter />}
                        {!selectedRole && (
                          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-sm text-slate-400">
                            Choose a role to unlock a tailored setup checklist. You can switch roles later from your workspace settings.
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}