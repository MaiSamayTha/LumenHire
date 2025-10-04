import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Building2, CalendarClock } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataLoader } from "@/data/common";
import { RegisterPayload, registerUser } from "@/data/urlRecruiter";

const MIN_PASSWORD_LENGTH = 8;

export default function Recruiter() {
  const router = useRouter();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState("");

  const addSkill = () => {
    const next = skill.trim();
    if (!next) {
      return;
    }
    if (skills.includes(next)) {
      toast.info("Skill already added.");
      return;
    }
    setSkills([...skills, next]);
    setSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((item) => item !== skillToRemove));
  };

  const registerRecruiter = async () => {
    if (!name || !email || !company || !currentPosition) {
      toast.error("Fill in all primary details.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error("Choose a password of at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const payload: RegisterPayload = {
      name,
      email,
      password,
      role: "RECRUITER",
      currentPosition,
      skills,
      linkedein: linkedinProfile,
      companyName: company,
    };

    setIsDataLoading(true);
    try {
      await registerUser(payload);
      toast.success("Workspace ready. Let us help you hire brilliantly.");
      router.push("/Jobmanagement");
    } catch (error) {
      console.error(error);
      toast.error("We could not complete sign-up. Please retry shortly.");
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isDataLoading && <DataLoader />}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-slate-200">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Team snapshot</h4>
        <p className="mt-2 text-sm text-slate-300">
          Shape the foundations of a repeatable hiring motion. You can invite collaborators once inside the workspace.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="recruiter-name" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Name
          </Label>
          <Input
            id="recruiter-name"
            placeholder="Amelia Chen"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recruiter-email" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Email
          </Label>
          <Input
            id="recruiter-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="recruiter-password" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Password
          </Label>
          <Input
            id="recruiter-password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recruiter-confirm" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Confirm password
          </Label>
          <Input
            id="recruiter-confirm"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company-name" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Company
          </Label>
          <Input
            id="company-name"
            placeholder="Northwind Labs"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-position" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Current position
          </Label>
          <Input
            id="current-position"
            placeholder="Head of Talent"
            value={currentPosition}
            onChange={(event) => setCurrentPosition(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin-profile" className="text-xs uppercase tracking-[0.18em] text-slate-400">
          LinkedIn profile (optional)
        </Label>
        <Input
          id="linkedin-profile"
          placeholder="https://linkedin.com/in/you"
          value={linkedinProfile}
          onChange={(event) => setLinkedinProfile(event.target.value)}
          className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-xs uppercase tracking-[0.18em] text-slate-400">Focus areas</Label>
        <div className="flex gap-3">
          <Input
            placeholder="Product design"
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
            className="h-12 flex-1 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
          <Button onClick={addSkill} type="button" variant="outline" className="h-12 border-white/20 text-slate-200 hover:border-indigo-300/80 hover:text-white">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((item) => (
            <Badge key={item} variant="secondary" className="bg-white/10 px-3 py-1 text-xs text-slate-100">
              <span className="mr-2">{item}</span>
              <button
                type="button"
                onClick={() => removeSkill(item)}
                className="rounded-full bg-white/5 p-0.5 hover:bg-red-500/40"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-200 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <Building2 className="mt-1 h-5 w-5 text-indigo-200" />
          <div>
            <p className="font-semibold text-white">Set the tone</p>
            <p className="text-xs text-slate-400">Publish role pages that speak in your brand voice and values.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-1 h-5 w-5 text-indigo-200" />
          <div>
            <p className="font-semibold text-white">Shorten the loop</p>
            <p className="text-xs text-slate-400">Align interviewers, track notes, and move faster without losing depth.</p>
          </div>
        </div>
      </div>

      <Button
        onClick={registerRecruiter}
        className="h-12 w-full bg-indigo-500 text-base font-medium text-white shadow-[0_20px_45px_rgba(99,102,241,0.35)] hover:bg-indigo-400"
      >
        Launch hiring workspace
      </Button>
    </div>
  );
}