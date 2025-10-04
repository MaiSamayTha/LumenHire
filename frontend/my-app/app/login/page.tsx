"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataLoader, checkLogin, checkRole, loginUser, type LoginPayload } from "@/data/common";

const insights = [
  "Structured interviews stay on-script",
  "Offer conversations feel intentional",
  "Stakeholders act on the same signal"
];

export default function LoginPage() {
  const router = useRouter();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!checkLogin()) {
      return;
    }
    const role = checkRole();
    if (role === "CANDIDATE") {
      router.push("/Jobsearch");
    } else {
      router.push("/Jobmanagement");
    }
  }, [router]);

  const onSubmit = async () => {
    const payload: LoginPayload = {
      email,
      password,
    };
    try {
      setIsDataLoading(true);
      await loginUser(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
    const role = checkRole();
    if (role === "CANDIDATE") {
      router.push("/Jobsearch");
    } else {
      router.push("/Jobmanagement");
    }
  };

  return (
    <>
      {isDataLoading && <DataLoader />}
      <div className="relative min-h-screen overflow-hidden bg-[#05060A]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-18rem] top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-indigo-500/25 blur-[140px]" />
          <div className="absolute right-[-10rem] top-[20%] h-[22rem] w-[22rem] rounded-full bg-sky-500/20 blur-[150px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.4),transparent_55%)]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_60px_120px_rgba(3,7,18,0.65)] backdrop-blur-xl md:grid-cols-[0.95fr,1fr]"
          >
            <div className="hidden flex-col justify-between border-r border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-12 text-slate-200 md:flex">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-xs tracking-[0.24em] uppercase">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Lumenhire access
                </div>
                <h1 className="mt-10 text-3xl font-semibold text-white">Welcome back to your hiring cockpit</h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
                  Resume insights, interview rituals, and offer decisions live here so every teammate stays in sync.
                </p>
              </div>
              <div className="space-y-4">
                {insights.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-1 inline-flex h-1.5 w-6 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
                    <p className="text-slate-200/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative bg-[#070910]/80 p-10">
              <div className="absolute left-0 top-0 h-full w-px bg-white/5" />
              <div className="relative">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Lumenhire</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Sign in to your workspace</h2>
                    <p className="mt-2 text-sm text-slate-300">
                      Continue orchestrating thoughtful hiring moments.
                    </p>
                  </div>
                  <Button asChild variant="ghost" className="text-slate-300 hover:text-white">
                    <Link href="/">Back home</Link>
                  </Button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@lumenhire.com"
                      className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-slate-200">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="********"
                      className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <Button onClick={onSubmit} className="h-12 bg-indigo-500 text-base font-medium text-white shadow-[0_25px_45px_rgba(99,102,241,0.35)] hover:bg-indigo-400">
                    Enter workspace
                  </Button>
                  <p className="text-center text-sm text-slate-400">
                    New to Lumenhire?
                    <Link href="/register" className="ml-2 text-indigo-300 hover:text-indigo-200">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
