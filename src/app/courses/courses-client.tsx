
"use client";

import { useState } from "react";
import type { Course } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CourseDialog } from "@/components/course-dialog";
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
import { addCourse, updateCourse, deleteCourse } from "./actions";
import { useRouter } from "next/navigation";

export default function CoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const router = useRouter();

  const { toast } = useToast();

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    const result = await deleteCourse(courseId);
    if (result.success) {
      toast({
        title: "Course Deleted",
        description: "The course has been successfully deleted.",
      });
      router.refresh(); // Refresh data from server
    } else {
      toast({
        title: "Error Deleting Course",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveCourse = async (course: Course) => {
    let result;
    if (editingCourse) {
      result = await updateCourse(course);
      if (result.success) {
        toast({ title: "Course Updated", description: "The course has been successfully updated." });
      }
    } else {
      result = await addCourse(course);
       if (result.success) {
        toast({ title: "Course Added", description: "A new course has been successfully added." });
      }
    }

    if (result.success) {
       // On success, close dialog & refresh data by re-routing
      setIsDialogOpen(false);
      setEditingCourse(null);
      router.refresh(); // Fetches new data from server
    } else {
      toast({ title: "Error", description: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Courses"
        description="Add, edit, or delete courses from your platform."
      >
        <Button onClick={handleAddCourse}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 pt-0">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.level}</Badge>
                  </TableCell>
                  <TableCell>₹{course.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
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
                            This action cannot be undone. This will permanently delete the course.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
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

      <CourseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCourse}
        course={editingCourse}
      />
    </div>
  );
}
