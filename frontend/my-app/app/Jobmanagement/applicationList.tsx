import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { getApplicationByJob, selection } from "@/data/urlRecruiter";
import { DataLoader } from "@/data/common";
import { Meeting } from "@/components/type/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Mail, CalendarDays, Gauge, NotebookPen } from "lucide-react";

interface Props {
  jobId: number;
}

type ApplicationRecord = {
  id: number;
  applicationStatus: string;
  score: number;
  job: {
    id: number;
    deadline: string;
    skills: string;
  };
  jobseeker: {
    email: string;
    resume: string;
  };
};

const statusOptions = [
  { value: "NextRound", label: "Next round" },
  { value: "Selected", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

export default function ApplicationList({ jobId }: Props) {
  const [newStatus, setNewStatus] = useState("NextRound");
  const [statusNote, setStatusNote] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsDataLoading(true);
    try {
      const response = await getApplicationByJob(jobId, currentPage);
      setApplications(response.content ?? []);
      setTotalPages(response.totalPages ?? 1);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load applications. Please retry.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const openStatusDialog = (application: ApplicationRecord) => {
    setSelectedCandidate(application.jobseeker.email);
    setApplicationId(application.id);
    setNewStatus("NextRound");
    setStatusNote("");
    setIsStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!applicationId) return;
    const payload: Omit<Meeting, "id"> = {
      recruiter: null,
      time: null,
      job: jobId,
      candidate: selectedCandidate,
    };
    try {
      setIsDataLoading(true);
      await selection(payload, statusNote, newStatus, applicationId);
      toast.success("Status updated.");
      setIsStatusDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error(error);
      toast.error("Could not update status. Try again later.");
    } finally {
      setIsDataLoading(false);
    }
  };

  const statusBadge = useMemo(
    () =>
      new Map([
        ["NextRound", "border-indigo-300/40 bg-indigo-500/20 text-indigo-100"],
        ["Selected", "border-emerald-300/40 bg-emerald-500/20 text-emerald-100"],
        ["Rejected", "border-rose-300/40 bg-rose-500/20 text-rose-100"],
      ]),
    []
  );

  return (
    <div className="space-y-6">
      {isDataLoading && <DataLoader />}

      {applications.map((application, index) => (
        <motion.div
          key={application.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_90px_rgba(8,10,18,0.45)] backdrop-blur"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
                Candidate
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <Mail className="h-4 w-4 text-indigo-200" />
                <a href={`mailto:${application.jobseeker.email}`} className="underline-offset-2 hover:underline">
                  {application.jobseeker.email}
                </a>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-indigo-200" />
                  Resume score {application.score.toFixed(2)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-200" />
                  Applied {new Date(application.job.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Badge className={`border ${statusBadge.get(application.applicationStatus) ?? "border-white/20 bg-white/10 text-slate-100"}`}>
              {application.applicationStatus}
            </Badge>
          </div>

          <div className="mt-5 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Skills snapshot</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(application.job.skills || "")
                .split(",")
                .map((skill: string) => skill.trim())
                .filter(Boolean)
                .map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-white/10 px-3 py-1 text-xs text-slate-100">
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-11 rounded-full border border-white/15 bg-white/[0.02] px-5 text-sm text-slate-200 hover:border-indigo-300/60 hover:text-white"
                    onClick={() => setResumePreview(application.jobseeker.resume)}
                  >
                    View resume
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-[#0B0E18] text-slate-100">
                  <DialogHeader>
                    <DialogTitle>Candidate resume</DialogTitle>
                  </DialogHeader>
                  <div className="rounded-xl border border-white/10">
                    <iframe
                      src={`data:application/pdf;base64,${resumePreview ?? application.jobseeker.resume}`}
                      title="Resume preview"
                      className="h-[32rem] w-full rounded-xl"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="h-11 rounded-full border-indigo-400/40 px-6 text-sm text-indigo-100 hover:border-indigo-300 hover:text-white"
                onClick={() => openStatusDialog(application)}
              >
                Update status
              </Button>
            </div>
          </div>
        </motion.div>
      ))}

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

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-lg bg-[#0B0E18] text-slate-100">
          <DialogHeader>
            <DialogTitle>Edit application status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={newStatus}
                onChange={(event) => setNewStatus(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#0B0E18]">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Notes for the team</Label>
              <Textarea
                id="note"
                value={statusNote}
                onChange={(event) => setStatusNote(event.target.value)}
                placeholder="Summarise signal from this stage"
                className="min-h-[110px] rounded-xl border-white/15 bg-white/[0.06] text-sm text-slate-100 focus:border-indigo-400"
              />
            </div>
          </div>
          <DialogFooter className="mt-6 flex items-center justify-between">
            <DialogClose asChild>
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleStatusUpdate} className="bg-indigo-500 px-6 text-sm font-medium text-white hover:bg-indigo-400">
              Save update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
