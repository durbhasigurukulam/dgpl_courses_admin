"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { renameFile } from "@/app/files/actions";
import type { FileData } from "@/lib/types";

interface FileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: FileData) => void;
  file: FileData;
}

export function FileEditDialog({ isOpen, onClose, onSave, file }: FileEditDialogProps) {
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState("");
  const [filename, setFilename] = useState("");
  const [isUpdatingFilename, setIsUpdatingFilename] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      setDescription(file.description);
      setIsPublic(file.isPublic);
      setTags(file.tags.join(", "));
      // Extract filename without extension for editing
      setFilename(file.filename.replace(/\.[^/.]+$/, "")); // Remove extension
    }
  }, [file]);

  const handleSave = async () => {
    let currentFile = { ...file }; // Start with the original file

    // If filename has changed, update it first
    if (file.filename.replace(/\.[^/.]+$/, "") !== filename && filename.trim() !== "") {
      const renameResult = await renameFile(file.id, filename);
      if (renameResult.success) {
        // Update our local file reference with the new filename
        currentFile = { ...currentFile, filename: renameResult.data.filename, publicUrl: renameResult.data.publicUrl };
      } else {
        // If rename failed, show error and don't continue with save
        toast({
          title: "Error",
          description: renameResult.message || 'Failed to rename file',
          variant: "destructive",
        });
        return;
      }
    }

    const updatedFile: FileData = {
      ...currentFile,
      description,
      isPublic,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };
    onSave(updatedFile);
  };

  const updateFilename = async () => {
    if (!filename.trim()) {
      toast({
        title: "Error",
        description: "Filename cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingFilename(true);
    try {
      const result = await renameFile(file.id, filename);

      if (result.success) {
        toast({
          title: "Success",
          description: "Filename updated successfully",
        });
      } else {
        throw new Error(result.message || 'Failed to rename file');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to rename file',
        variant: "destructive",
      });
    } finally {
      setIsUpdatingFilename(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
          <DialogDescription>
            Editing file: <span className="font-medium">{file.originalName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">Filename (without extension)</Label>
            <div className="flex gap-2">
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter new filename"
              />
              <Button
                onClick={updateFilename}
                disabled={isUpdatingFilename}
                variant="outline"
              >
                {isUpdatingFilename ? "Renaming..." : "Rename"}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="is-public">Make file public</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
