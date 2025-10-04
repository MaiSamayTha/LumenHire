import { useState } from "react";
import { ArrowLeft, UsersRound, CalendarClock } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import ApplicationList from "./applicationList";
import MeetingList from "./meeting";

interface Props {
  application: number;
  changeApplication: (id: number) => void;
}

export default function JobApplications({ application, changeApplication }: Props) {
  const [activeTab, setActiveTab] = useState("application");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => changeApplication(-1)}
          className="rounded-full border border-white/10 bg-white/[0.06] text-slate-200 hover:border-indigo-300/60 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to roles
        </Button>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Job ID: {application}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-2">
          <TabsList className="grid grid-cols-2 gap-2 bg-transparent">
            <TabsTrigger
              value="application"
              className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-white/40 data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=inactive]:text-slate-300"
            >
              <UsersRound className="mr-2 h-4 w-4" /> Applications
            </TabsTrigger>
            <TabsTrigger
              value="meetings"
              className="rounded-2xl border border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-white/40 data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=inactive]:text-slate-300"
            >
              <CalendarClock className="mr-2 h-4 w-4" /> Meetings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="relative mt-6 min-h-[340px] rounded-[26px] border border-white/10 bg-white/[0.03] p-6">
          <TabsContent value="application" className="space-y-4">
            <ApplicationList jobId={application} />
          </TabsContent>
          <TabsContent value="meetings" className="space-y-4">
            <MeetingList jobId={application} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}