"use client";
import { useOrganization } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import useFetch from "@/Hooks/use-fetch";
import { deleteProject } from "@/actions/project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteProject = ({ projectId }) => {
  const router = useRouter();
  const { membership } = useOrganization();
  const {
    data: deleted,
    loading: isDeleting,
    error,

    fn: deleteProjectFn,
  } = useFetch(deleteProject);

  const handleDelete = () => {
    if (window.confirm("are you sure   you wanted to  delete this project")) {
      deleteProjectFn(projectId);
    }
  };

  useEffect(() => {
    if (deleted?.success) {
      toast.success("project deleted successfully");
      router.refresh();
    }
  }, [deleted]);

  const isAdmin = membership?.role === "org:admin";

  if (!isAdmin) {
    return null;
  }
  return (
    <>
      <Button
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`}
        variant="ghost"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
};

export default DeleteProject;
