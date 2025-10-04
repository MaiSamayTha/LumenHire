"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { meetingCreated,prettyDate } from "../styles/preMadeToasts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Clock} from "lucide-react"
import {getMeetingList}from "@/data/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Application, Meeting } from "@/components/type/job"
import { SimpleTimeInput } from "@/components/Job/simple-time-input"
import { addMeeting } from "@/data/urlRecruiter"
interface MeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: number
  
}

export function MeetingDialog({ open, onOpenChange, application }: MeetingDialogProps) {
    const[timeSlot,setTimeSlot]=useState<any[]>([])
  const [formData, setFormData] = useState({
    job:application,
    date: "",
    time: "",
    
  })
  useEffect(()=>{
      getTimeSlot()
      console.log("open",timeSlot)
      },[open])
      const getTimeSlot=async()=>{
          let res;
          try{
         res=await getMeetingList(application)
         setTimeSlot(res)
          }
          catch(error){
              console.log(error)
          }
      }
  const Schedule= async(meeting:Meeting)=>{
    await addMeeting(meeting);
  }
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    if (!application) return
    meetingCreated(formData.date+"T"+formData.time+":00.000")
    console.log("date ",formData.date," time ",formData.time);
    const meeting: Omit<Meeting, "id"> = {
     
      recruiter:null,
      time: formData.date+"T"+formData.time+":00.000",
      job:application,
      candidate:null
      
    }
   await  Schedule(meeting)

   
    onOpenChange(false)

    setFormData({
    
      date: "",
      time: "",
      job:application 
    })
  }

  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        
       {timeSlot.length? <DialogHeader>
          <DialogTitle>Currently empty slots</DialogTitle>
          <div className="grid gap-4">
            {timeSlot.map((day) => (
              <>
                 <Button
          
          variant=  "secondary"
          disabled={false}
          className="h-auto p-3 flex flex-col items-start gap-1"
        >
        <div className="flex items-center gap-1 w-full">
            <Clock className="h-3 w-3" />
            <span className="font-medium">{prettyDate(day)}</span>
          </div>
              
              </Button>
              </>
            ))}
          </div>
       
        </DialogHeader>:<></>
}
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
          <DialogDescription>Schedule a meeting with candidate</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <SimpleTimeInput
                value={formData.time}
                onChange={(time) => setFormData({ ...formData, time })}
                placeholder="Select meeting time"
              />
            </div>
          </div>


          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Meeting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
