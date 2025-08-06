"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TestimonialDialog } from "@/components/testimonial-dialog";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { addTestimonial, updateTestimonial, deleteTestimonial } from "./actions";


export default function TestimonialsClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const router = useRouter();

  const { toast } = useToast();

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setIsDialogOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    const result = await deleteTestimonial(testimonialId);
    if (result.success) {
      toast({
        title: "Testimonial Deleted",
        description: "The testimonial has been successfully deleted.",
      });
      router.refresh();
    } else {
       toast({
        title: "Error Deleting Testimonial",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveTestimonial = async (testimonial: Testimonial) => {
    let result;
    if (editingTestimonial) {
      result = await updateTestimonial(testimonial);
       if (result.success) {
        toast({ title: "Testimonial Updated", description: "The testimonial has been successfully updated." });
      }
    } else {
      const { id, ...newTestimonialData } = testimonial;
      result = await addTestimonial(newTestimonialData);
       if (result.success) {
        toast({ title: "Testimonial Added", description: "A new testimonial has been successfully added." });
      }
    }

    if (result.success) {
      setIsDialogOpen(false);
      setEditingTestimonial(null);
      router.refresh();
    } else {
      toast({ title: "Error", description: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Testimonials"
        description="Add, edit, or delete testimonials from your students."
      >
        <Button onClick={handleAddTestimonial}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 pt-0">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.designation} at {testimonial.company}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm truncate">{testimonial.message}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {testimonial.rating} <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditTestimonial(testimonial)}>
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
                            This action cannot be undone. This will permanently delete the testimonial.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTestimonial(testimonial.id)}>
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

      <TestimonialDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTestimonial}
        testimonial={editingTestimonial}
      />
    </div>
  );
}
