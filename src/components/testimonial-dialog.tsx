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
import type { Testimonial } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestimonialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testimonial: Testimonial) => void;
  testimonial: Testimonial | null;
}

const emptyTestimonialTemplate: Omit<Testimonial, 'id'> = {
  name: "",
  designation: "",
  company: "",
  message: "",
  rating: 5,
  image: "https://placehold.co/100x100",
};

export function TestimonialDialog({ isOpen, onClose, onSave, testimonial }: TestimonialDialogProps) {
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>(emptyTestimonialTemplate);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (testimonial) {
        setFormData(testimonial);
      } else {
        setFormData(emptyTestimonialTemplate);
      }
    }
  }, [testimonial, isOpen]);
  
  const handleChange = (field: keyof Omit<Testimonial, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Name and Message are required fields.",
        variant: "destructive",
      });
      return;
    }
    onSave({
        ...formData,
        id: testimonial?.id || Date.now().toString()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          <DialogDescription>
            {testimonial ? "Edit the testimonial details below." : "Enter the new testimonial details."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="designation" className="text-right">Designation</Label>
                    <Input id="designation" value={formData.designation} onChange={e => handleChange('designation', e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">Company</Label>
                    <Input id="company" value={formData.company} onChange={e => handleChange('company', e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="message" className="text-right">Message</Label>
                    <Textarea id="message" value={formData.message} onChange={e => handleChange('message', e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rating" className="text-right">Rating</Label>
                    <Input id="rating" type="number" min="1" max="5" value={formData.rating} onChange={e => handleChange('rating', Number(e.target.value))} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">Image URL</Label>
                    <Input id="image" value={formData.image} onChange={e => handleChange('image', e.target.value)} className="col-span-3" />
                </div>
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Testimonial</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
