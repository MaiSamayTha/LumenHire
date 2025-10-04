import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Clock, CalendarDays, Video } from "lucide-react";

import { getMeetingByJob } from "@/data/urlRecruiter";
import { DataLoader } from "@/data/common";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface Props {
  jobId: number;
}

export default function MeetingList({ jobId }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);

  const fetchMeetings = async () => {
    setIsDataLoading(true);
    try {
      const response = await getMeetingByJob(jobId, currentPage);
      setMeetings(response.content ?? []);
      setTotalPages(response.totalPages ?? 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="space-y-6">
      {isDataLoading && <DataLoader />}
      <div className="space-y-4">
        {meetings.map((meeting, index) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Interview</p>
                <h4 className="mt-2 text-lg font-semibold text-white">{meeting.candidate}</h4>
                <p className="text-sm text-slate-300">{meeting.note ?? "Structured conversation"}</p>
              </div>
              <Badge className="border border-white/15 bg-white/[0.08] text-xs text-slate-200">
                {meeting.applied ?? "Scheduled"}
              </Badge>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-200" />
                {meeting.time ? new Date(meeting.time).toLocaleString() : "To be confirmed"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-200" />
                {meeting.duration ?? 60} min session
              </span>
              <span className="inline-flex items-center gap-2">
                <Video className="h-4 w-4 text-indigo-200" />
                {meeting.type ?? "Virtual"}
              </span>
            </div>
          </motion.div>
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
    </div>
  );
}