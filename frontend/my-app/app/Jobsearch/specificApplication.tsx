import { motion } from "framer-motion";
import { Building2, MapPin, Clock, Bookmark, BookmarkCheck, DollarSign, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  jobs: any[];
  onApply: (jobId: number) => void;
  onSave: (jobId: number) => void;
  emptyMessage: string;
}

const splitTags = (tags: unknown): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags as string[];
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

export default function SpecificApplication({ jobs, onApply, onSave, emptyMessage }: Props) {
  if (!jobs.length) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] text-center text-sm text-slate-300">
        <Building2 className="h-10 w-10 text-indigo-300" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job: any, index) => (
        <motion.article
          key={job.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.06 }}
          className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_35px_90px_rgba(8,10,18,0.55)] backdrop-blur"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1 text-xs uppercase tracking-[0.26em] text-slate-300">
                {job.type || "Flexible"}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{job.jobTitle}</h3>
                <p className="mt-1 text-sm text-slate-300">{job.jobDescription ?? job.description}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-200" />
                  {job.companyName ?? "Confidential team"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-200" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-200" />
                  {job.type ?? "Flexible"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-200" />
                  {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "Recently posted"}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSave(job.id)}
              className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] text-slate-200 hover:border-indigo-300/60 hover:text-white"
              aria-label="Save job"
            >
              {job.isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-indigo-200" />
              {job.salary ?? job.stipend ?? "Negotiable"}
            </span>
          </div>

          {splitTags(job.tags).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {splitTags(job.tags).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/10 px-3 py-1 text-xs text-slate-100">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              className="h-11 rounded-full border border-white/15 bg-white/[0.02] px-6 text-sm text-slate-200 hover:border-indigo-300/60 hover:text-white"
            >
              View details
            </Button>
            {job.isApplied ? (
              <Button
                disabled
                className="h-11 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-5 text-sm font-medium text-emerald-100"
              >
                You already applied
              </Button>
            ) : (
              <Button
                onClick={() => onApply(job.id)}
                className="h-11 rounded-full bg-indigo-500 px-6 text-sm font-medium text-white shadow-[0_20px_40px_rgba(99,102,241,0.35)] hover:bg-indigo-400"
              >
                Apply now
              </Button>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
