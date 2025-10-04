import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { jobAdded } from "../styles/preMadeToasts"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X ,CalendarIcon} from "lucide-react"
import { useState } from "react"
import { createNewJob} from "@/data/urlRecruiter"
import { JobPayload } from "@/data/common"
import { Badge } from "../ui/badge"
import { Popover ,PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
export function AddJob({ onSubmit }: { onSubmit: () => void }) {
  
  const [jobDescription,setJobDescription]=useState("");
  const [jobTitle,setJobTitle]=useState("");
  const [date, setDate] = useState<Date>()
  const [type,setType]=useState("");
  const [location,setLocation]=useState("");
  const [skill,setSkill]=useState("");
  const [skills,setSkills]=useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false)
  const [stipend,setStipend]= useState("");
  function addSkill(){
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()])
      setSkill("")
    }
  }
    const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setIsOpen(false)
  }
 
  const createJob =async ()=>{
    const request:JobPayload={
      skills:skills.join(','),
      jobDescription:jobDescription,
      jobTitle:jobTitle,
      deadline:date?date.toISOString().split('T')[0]:"",
      type:type,
      location:location,
      stipend:stipend,
      status:"open"
    }
    jobAdded(jobTitle);
  const response= await createNewJob(request);
    
  console.log(response,"hello");
    onSubmit();
  }
  return (
    <Dialog>
      <form>
         
        <DialogTrigger asChild>
      
          <Button variant="outline" >
            <Plus className="h-4 w-4 mr-2" />
            Create Job
            </Button>
         
          
        </DialogTrigger>
        <DialogContent className="md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Job</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Job Title</Label>
              <Input id="name-1" name="name" value={jobTitle} onChange={(e)=>{setJobTitle(e.target.value)}}  />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name-1">Job Description</Label>
              <Input id="name-1" name="name" value={jobDescription} onChange={(e)=>{setJobDescription(e.target.value)}}  />
            </div>
           <div className="grid gap-3">
              <Label htmlFor="name-1">Location</Label>
              <Input id="name-1" name="name" value={location} onChange={(e)=>{setLocation(e.target.value)}}  />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-3">type</Label>
              <Input id="username-1" name="username" value={type} onChange={(e)=>{setType(e.target.value)}}/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-4">stipend</Label>
              <Input id="username-4" name="username" value={stipend} onChange={(e)=>{setStipend(e.target.value)}}/>
            </div>
        <div className="space-y-2">
            <Label htmlFor="date-picker">Deadline</Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
    

            <div className="grid gap-3">
              <Label htmlFor="username-3">Skills</Label>
                    <div className="flex gap-2">
                        <Input   placeholder="Enter a skill..." value={skill} onChange={(e) => setSkill(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))} className="flex-1"/>
                        <Button onClick={addSkill} size="icon" variant="outline">
                        <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                   <div className="flex flex-wrap gap-2">
                     {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-3 py-1 text-sm flex items-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <span>{skill}</span>
              <button
                onClick={() => removeSkill(skill)}
                className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
            ))}
            </div>
            </div>
            
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
            <Button type="submit" onClick={createJob}>Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}


