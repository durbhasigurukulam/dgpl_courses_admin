"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Course } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { UploadDragDrop } from "./upload-drag-drop";

interface CourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  course: Course | null;
}

const emptyCourseTemplate: Omit<Course, "id"> = {
  title: "",
  path: "",
  description: "",
  shortDescription: "",
  instructor: "",
  duration: "",
  level: "Intermediate",
  price: 0,
  originalPrice: 0,
  category: "",
  syllabusDownloadLink: "",
  enrollLink: "",
  tags: [],
  image: "https://placehold.co/600x400",
  requirements: [],
  whatYouWillLearn: [],
  isFeatured: false,
};

export function CourseDialog({
  isOpen,
  onClose,
  onSave,
  course,
}: CourseDialogProps) {
  const [formData, setFormData] = useState<Omit<Course, "id">>(
    emptyCourseTemplate
  );
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (course) {
        // Make sure to properly set all fields including image and syllabusDownloadLink
        setFormData({
          ...emptyCourseTemplate,
          ...course,
          // Ensure we're properly handling potentially undefined syllabusDownloadLink
          syllabusDownloadLink: course.syllabusDownloadLink || '',
        });
      } else {
        setFormData(emptyCourseTemplate);
      }
    }
  }, [course, isOpen]);

  const handleSave = () => {
    // Basic validation
    if (!formData.title || !formData.instructor) {
      toast({
        title: "Validation Error",
        description: "Title and Instructor are required fields.",
        variant: "destructive",
      });
      return;
    }
    onSave({
      ...formData,
      id: course?.id || Date.now().toString(),
    });
  };

  const handleChange = (
    field: keyof Omit<Course, "id">,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: "tags" | "requirements" | "whatYouWillLearn",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value.split("\n") }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-w-full w-[90vw]">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {course
              ? "Edit the course details below."
              : "Enter the new course details."}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto overflow-x-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 min-w-full" style={{ minWidth: '600px' }}>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleChange("instructor", e.target.value)}
              />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleChange("shortDescription", e.target.value)
                }
              />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  handleChange("price", Number(e.target.value))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  handleChange("originalPrice", Number(e.target.value))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  handleChange(
                    "level",
                    value as "Beginner" | "Intermediate" | "Advanced" | "All Levels"
                  )
                }
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="All Levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
            </div>
             <div className="grid gap-2">
                <UploadDragDrop
                  label="Course Image"
                  type="image"
                  acceptedTypes="image/*"
                  currentValue={formData.image}
                  onFileUpload={(url) => handleChange("image", url)}
                />
              </div>
            <div className="md:col-span-2 grid gap-2">
                <Label htmlFor="path">Course Path (slug)</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => handleChange("path", e.target.value)}
                />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="enrollLink">Enroll Link</Label>
                <Input
                  id="enrollLink"
                  value={formData.enrollLink}
                  onChange={(e) => handleChange("enrollLink", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <UploadDragDrop
                  label="Syllabus File"
                  type="file"
                  acceptedTypes=".pdf,.doc,.docx"
                  currentValue={formData.syllabusDownloadLink || ''}
                  onFileUpload={(url) => handleChange("syllabusDownloadLink", url)}
                />
              </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (one per line)</Label>
              <Textarea
                id="tags"
                value={formData.tags.join("\n")}
                onChange={(e) => handleArrayChange("tags", e.target.value)}
                placeholder="tag1&#x0a;tag2&#x0a;tag3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                value={formData.requirements.join("\n")}
                onChange={(e) =>
                  handleArrayChange("requirements", e.target.value)
                }
                 placeholder="Requirement 1&#x0a;Requirement 2"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatYouWillLearn">
                What You'll Learn (one per line)
              </Label>
              <Textarea
                id="whatYouWillLearn"
                value={formData.whatYouWillLearn.join("\n")}
                onChange={(e) =>
                  handleArrayChange("whatYouWillLearn", e.target.value)
                }
                placeholder="Learning outcome 1&#x0a;Learning outcome 2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleChange("isFeatured", checked)}
              />
              <Label htmlFor="isFeatured">Featured Course</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
