
"use client";

import { useState } from "react";
import type { FileData } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Copy, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { FileEditDialog } from "@/components/file-edit-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { deleteFile, updateFile, uploadFile } from "./actions";

export default function FilesClient({ initialFiles }: { initialFiles: FileData[] }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleEditFile = (file: FileData) => {
    setEditingFile(file);
    setIsEditOpen(true);
  };

  const handleDeleteFile = async (fileId: string) => {
    const result = await deleteFile(fileId);
    if (result.success) {
      toast({
        title: "File Deleted",
        description: "The file has been successfully deleted.",
      });
      router.refresh();
    } else {
      toast({
        title: "Error Deleting File",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveFile = async (file: FileData) => {
    const result = await updateFile(file);
    if (result.success) {
      toast({ title: "File Updated", description: "File metadata updated successfully." });
      setIsEditOpen(false);
      setEditingFile(null);
      router.refresh();
    } else {
       toast({ title: "Error Updating File", description: result.message, variant: "destructive" });
    }
  };
  
  const handleUploadFile = async (formData: FormData) => {
    const result = await uploadFile(formData);
    if(result.success) {
        toast({ title: "File Uploaded", description: "New file uploaded successfully." });
        setIsUploadOpen(false);
        router.refresh();
    } else {
        toast({ title: "Error Uploading File", description: result.message, variant: "destructive" });
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "URL copied to clipboard." });
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Files"
        description="Upload, view, and manage your files and assets."
      >
        <Button onClick={() => setIsUploadOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 pt-0">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.originalName}</TableCell>
                  <TableCell className="max-w-xs truncate">{file.description}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>{format(new Date(file.createdAt), 'PP')}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(file.publicUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => handleEditFile(file)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete the file and its metadata permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteFile(file.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <FileUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadFile}
      />
      
      {editingFile && (
        <FileEditDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveFile}
          file={editingFile}
        />
      )}
    </div>
  );
}
