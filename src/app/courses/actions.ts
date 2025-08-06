
'use server';

import type { Course } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

export async function addCourse(courseData: Omit<Course, 'id'>) {
    try {
        const res = await authenticatedFetch(getApiUrl('/api/courses'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(courseData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add course');
        }

        const newCourse = await res.json();
        revalidatePath('/courses');
        return { success: true, data: newCourse.data };

    } catch (error: any) {
        console.error("Error adding course:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}

export async function updateCourse(courseData: Course) {
    try {
        const { id, ...dataToUpdate } = courseData;
        const res = await authenticatedFetch(getApiUrl(`/api/courses/${id}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToUpdate),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update course');
        }

        const updatedCourse = await res.json();
        revalidatePath('/courses');
        revalidatePath('/dashboard');
        return { success: true, data: updatedCourse.data };

    } catch (error: any) {
        console.error("Error updating course:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}

export async function deleteCourse(courseId: string) {
    try {
        const res = await authenticatedFetch(getApiUrl(`/api/courses/${courseId}`), {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete course');
        }

        revalidatePath('/courses');
        revalidatePath('/dashboard');
        return { success: true };

    } catch (error: any) {
        console.error("Error deleting course:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}
