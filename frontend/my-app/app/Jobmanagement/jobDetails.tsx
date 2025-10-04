import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, CalendarDays, PenSquare, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AddJob } from "@/components/Job/addJob";
import { MeetingDialog } from "@/components/Job/job-meeting-dialog";
import { jobList } from "@/data/urlRecruiter";

interface Props {
  changeApplication: (id: number) => void;
}

const statusStyles = new Map([
  ["Active", "border-emerald-300/40 bg-emerald-500/20 text-emerald-100"],
  ["Draft", "border-yellow-300/40 bg-yellow-500/20 text-yellow-100"],
  ["Closed", "border-rose-300/40 bg-rose-500/20 text-rose-100"],
]);

export default function JobDetails({ changeApplication }: Props) {
  const [showJobMeetingDialog, setShowJobMeetingDialog] = useState(false);
  const [selectedJobForMeeting, setSelectedJobForMeeting] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    try {
      const response = await jobList(currentPage);
      setJobs(response.content ?? []);
      setTotalPages(response.totalPages ?? 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, currentPage]);

  const statusBadge = useMemo(() => statusStyles, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Role overview</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Active requisitions</h2>
        </div>
        <AddJob onSubmit={() => setRefresh((prev) => prev + 1)} />
      </div>

      <div className="space-y-5">
        {jobs.map((job, index) => (
          <motion.article
            key={job.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_35px_90px_rgba(8,10,18,0.55)] backdrop-blur"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1 text-xs uppercase tracking-[0.26em] text-slate-300">
                  {job.department ?? "Open role"}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{job.jobTitle}</h3>
                  <p className="mt-1 text-sm text-slate-300">{job.jobDescription}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-200" />
                    {job.hiringManager ?? "Hiring squad"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-200" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-indigo-200" />
                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Rolling"}
                  </span>
                </div>
              </div>
              <Badge className={`border ${statusBadge.get(job.status) ?? "border-white/20 bg-white/10 text-slate-100"}`}>
                {job.status}
              </Badge>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
              {(job.skills || "")
                .split(",")
                .map((skill: string) => skill.trim())
                .filter(Boolean)
                .map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="bg-white/10 px-3 py-1 text-xs text-slate-100">
                    {skill}
                  </Badge>
                ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Last updated {job.updatedAt ? new Date(job.updatedAt).toLocaleDateString() : "recently"}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-white/20 px-6 text-sm text-slate-200 hover:border-indigo-300/60 hover:text-white"
                  onClick={() => changeApplication(job.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Review applications
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 rounded-full border border-white/20 bg-white/[0.02] px-6 text-sm text-slate-200 hover:border-indigo-300/60 hover:text-white"
                  onClick={() => {
                    setShowJobMeetingDialog(true);
                    setSelectedJobForMeeting(job.id);
                  }}
                >
                  <PenSquare className="mr-2 h-4 w-4" />
                  Schedule touchpoint
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
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
                      setCurrentPage(page - 1);
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
                    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
                  }}
                  className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "text-slate-200 hover:text-white"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <MeetingDialog
        open={showJobMeetingDialog}
        onOpenChange={setShowJobMeetingDialog}
        application={selectedJobForMeeting}
      />
    </div>
  );
}
