"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader } from "@/components/loader/loader";
import { ProfileButton } from "@/components/Job/profile-button";

import { appliedJobList, applyJob, jobList, savedJobList, saveJob } from "@/data/urlJobseeker";
import { jobApplied, jobSaved } from "@/components/styles/preMadeToasts";
import { checkLogin, delay } from "@/data/common";

import AllJob from "./allJob";
import AllApplication from "./allApplication";

const JOBS_PER_PAGE = 3;

export default function JobSearchPage() {
  const router = useRouter();
  const [loaderActive, setLoaderActive] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [totalPages, setTotalPages] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(0);
  };

  const fetchJobs = async () => {
    setLoaderActive(true);
    try {
      let response;
      if (activeTab === "all") {
        response = await jobList(currentPage);
      } else if (activeTab === "saved") {
        response = await savedJobList(currentPage);
      } else {
        response = await appliedJobList(currentPage);
      }
      setJobs(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoaderActive(false);
    }
  };

  const handleApply = async (jobId: number) => {
    jobApplied();
    await applyJob(jobId);
    setRefresh((prev) => prev + 1);
  };

  const handleSave = async (jobId: number) => {
    jobSaved();
    await saveJob(jobId);
    setRefresh((prev) => prev + 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const verifySession = async () => {
      const loggedIn = await checkLogin();
      await delay(600);
      if (!loggedIn) {
        router.push("/");
      }
    };
    verifySession();
  }, [router]);

  useEffect(() => {
    fetchJobs();
  }, [activeTab, currentPage, refresh]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060A] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-18rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-indigo-500/25 blur-[200px]" />
        <div className="absolute right-[-12rem] top-[40%] h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-[200px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.35),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-14">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Lumenhire candidates</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Curated roles that respect your craft</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Glide through opportunities with transparent timelines, structured feedback, and interview prep that actually helps.
            </p>
          </div>
          <ProfileButton variant="minimal" className="h-11 rounded-full border border-white/10 bg-white/[0.08] text-slate-200 hover:text-white" />
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {[{ label: "Applications in play", value: "6" }, { label: "Interviews this week", value: "3" }, { label: "Offers pending", value: "1" }].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/[0.05] px-6 py-5 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </section>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur">
            <TabsList className="grid grid-cols-3 gap-2 bg-transparent">
              <TabsTrigger
                value="all"
                className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-white/40 data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=inactive]:text-slate-300"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger
                value="applied"
                className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-white/40 data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=inactive]:text-slate-300"
              >
                In review
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-white/40 data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=inactive]:text-slate-300"
              >
                Saved
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="relative mt-6 min-h-[420px] rounded-[28px] border border-white/10 bg-[#080A12]/80 p-6 backdrop-blur-xl">
            {loaderActive ? (
              <div className="flex h-[360px] items-center justify-center">
                <Loader />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {activeTab === "all" && (
                    <AllJob jobs={jobs} onApply={handleApply} onSave={handleSave} emptyMessage="No roles found just yet." />
                  )}
                  {activeTab === "applied" && (
                    <AllApplication jobs={jobs} onApply={handleApply} onSave={handleSave} emptyMessage="You have not applied to any roles yet." />
                  )}
                  {activeTab === "saved" && (
                    <AllApplication jobs={jobs} onApply={handleApply} onSave={handleSave} emptyMessage="Your saved list is waiting for its first role." />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </Tabs>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage > 0) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 0 ? "pointer-events-none opacity-50" : "text-slate-200 hover:text-white"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      isActive={currentPage === page - 1}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "text-slate-200 hover:text-white"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <footer className="mt-auto border-t border-white/10 pt-6 text-xs text-slate-400">
          <p>Lumenhire protects your data and keeps every hiring conversation purposeful.</p>
        </footer>
      </div>
    </div>
  );
}
