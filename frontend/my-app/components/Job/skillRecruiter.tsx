"use client"

import { useState, type KeyboardEvent } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SkillRecruiter() {
  const [skills, setSkills] = useState(["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"])
  const [inputValue, setInputValue] = useState("")

  const addSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      setSkills([...skills, inputValue.trim()])
      setInputValue("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkill()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-muted-foreground">Add your skills and remove them by clicking the X button</p>
      </div>

      {/* Add Skill Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter a skill..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={addSkill} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Skills Display */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Your Skills ({skills.length})</h3>
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

        {skills.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No skills added yet. Start by adding your first skill above.
          </p>
        )}
      </div>
    </div>
  )
}
