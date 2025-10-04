import { useRef, useState } from "react";
import { Upload, Plus, X, FileText } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataLoader } from "@/data/common";
import { RegisterPayload, registerUser } from "@/data/urlJobseeker";

const MIN_PASSWORD_LENGTH = 8;

export default function Candidate() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const fiveMb = 5 * 1024 * 1024;
    if (file.size > fiveMb) {
      toast.error("Please upload a resume under 5 MB.");
      return;
    }
    setResumeFile(file);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const addSkill = () => {
    const value = skill.trim();
    if (!value) {
      return;
    }
    if (skills.includes(value)) {
      toast.info("You already added that skill.");
      return;
    }
    setSkills([...skills, value]);
    setSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((item) => item !== skillToRemove));
  };

  const registerCandidate = async () => {
    if (!email || !name) {
      toast.error("Please complete the required fields.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!resumeFile) {
      toast.error("Upload your resume to continue.");
      return;
    }

    const payload: RegisterPayload = {
      name,
      email,
      password,
      role: "CANDIDATE",
      skills,
    };

    setIsDataLoading(true);
    try {
      await registerUser(payload, resumeFile);
      toast.success("Workspace created. Welcome to Lumenhire!");
    } catch (error) {
      console.error(error);
      toast.error("We could not finish sign-up. Try again in a moment.");
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isDataLoading && <DataLoader />}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-slate-200">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Profile essentials</h4>
        <p className="mt-2 text-sm text-slate-300">
          Spotlight your strengths and preferences. You can fine-tune everything once you land inside the workspace.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="candidate-name" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Name
          </Label>
          <Input
            id="candidate-name"
            placeholder="Jamie Lee"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="candidate-email" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Email
          </Label>
          <Input
            id="candidate-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="candidate-password" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Password
          </Label>
          <Input
            id="candidate-password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="candidate-confirm" className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Confirm password
          </Label>
          <Input
            id="candidate-confirm"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-12 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus-visible:ring-indigo-500/60"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-xs uppercase tracking-[0.18em] text-slate-400">Signature skills</Label>
        <div className="flex gap-3">
          <Input
            placeholder="Strategic facilitation"
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

      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-[0.18em] text-slate-400">Resume</Label>
        <div
          onClick={handleUploadClick}
          className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center transition hover:border-indigo-400/60 hover:bg-white/[0.06]"
        >
          <Upload className="h-6 w-6 text-indigo-200 group-hover:text-indigo-100" />
          <div>
            <p className="text-sm font-semibold text-white">Drop your resume or browse</p>
            <p className="text-xs text-slate-400">PDF or DOCX, up to 5 MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        {resumeFile && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <FileText className="h-4 w-4 text-indigo-200" />
            <div className="min-w-0 flex-1 truncate">
              <p className="truncate font-medium text-white">{resumeFile.name}</p>
              <p className="text-xs text-slate-400">{(resumeFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-3 text-sm text-slate-300 hover:text-white"
              onClick={() => setResumeFile(null)}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      <Button
        onClick={registerCandidate}
        className="h-12 w-full bg-indigo-500 text-base font-medium text-white shadow-[0_20px_45px_rgba(99,102,241,0.35)] hover:bg-indigo-400"
      >
        Activate candidate workspace
      </Button>
    </div>
  );
}