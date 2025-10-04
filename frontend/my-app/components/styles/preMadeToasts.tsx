"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function jobAdded(jobTitle:string){
  toast("you Have created job", {
          description: jobTitle,
          action: {
            label: "Job Added",
            onClick: () => console.log("Undo"),
          },
        })
}
export function meetingCreated(time:string){
	toast("you Have created a meeting", {
          description: prettyDate(time),
          action: {
            label: "Created meeting",
            onClick: () => console.log("Undo"),
          },
        })
}
export function jobApplied(){
	toast.success("successfully applied",{
		description:"job Applied",
		action:{
			label:"job applied",
			onClick:()=>console.log("Undo")

		},
	})
}
export function jobSaved(){
	toast.success("successfully Saved",{
		description:"job Saved",
		action:{
			label:"job Saved",
			onClick:()=>console.log("Undo")

		},
	})
}
export function jobUnSaved(){
	toast("successfully UnSaved",{
		description:"job UnSaved",
		action:{
			label:"job UnSaved",
			onClick:()=>console.log("Undo")

		},
	})
}
export function alreadyApplied(){
	toast.warning("job Applied already",{
		description:"you have already applied for this job ",
		
	})
}
export function failed(error:string){
	toast.error("operation failed", {
          description: error,
          action: {
            label: "Failed operation",
            onClick: () => console.log("Undo"),
          },
        })
}
export function createUser(){
	toast.success("Create User",{
		description:"user created",
		action:{
			label:"Created User",
			 onClick: () => console.log("Undo"),
		}
	})
}
 
export function prettyDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
	hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  });
}