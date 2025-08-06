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

  useEffect(() => {
    if (file) {
      setDescription(file.description);
      setIsPublic(file.isPublic);
      setTags(file.tags.join(", "));
    }
  }, [file]);

  const handleSave = () => {
    const updatedFile: FileData = {
      ...file,
      description,
      isPublic,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };
    onSave(updatedFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File Metadata</DialogTitle>
          <DialogDescription>
            Editing metadata for: <span className="font-medium">{file.originalName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
