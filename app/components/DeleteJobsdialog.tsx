"use client"
import { toast } from "@/components/ui/toast"
import { Trash2, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { JobData } from "../dashboard/recruiter/jobs/new/page"
import { deleteJob } from "@/lib/actions/jobs"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface IDeleteJobsProps {
  job: JobData
}

export function DeleteJobsDialog({ job }: IDeleteJobsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const handleDelete = async () => {
    if (!job._id) return
    const res = await deleteJob(job._id)
    console.log("deleting", job._id, res)
    if (res.deletedCount) {
      setOpen(false)
      toast.add({
        title: "Jobs Deleted",
        description: "The job has been parmanently deleted",
      })
      router.refresh()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            title="Delete job listing"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-[#12131a] text-zinc-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete job listing?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{job.title}&quot;? This action
            cannot be undone and will permanently remove this job posting.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
