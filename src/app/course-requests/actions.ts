"use server";

import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";
import type { CourseRequest } from "@/lib/types";

export async function updateCourseRequest(courseRequest: CourseRequest) {
    try {
        const { id, name, email, phone, courseName, courseDescription, createdAt, updatedAt, ...updateData } = courseRequest;
        
        const res = await authenticatedFetch(getApiUrl(`/api/course-requests/${id}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            return {
                success: false,
                message: data.message || 'Failed to update course request'
            };
        }

        revalidatePath('/course-requests');
        return { success: true, message: 'Course request updated successfully' };
    } catch (error) {
        console.error('Error updating course request:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred'
        };
    }
}

export async function deleteCourseRequest(id: string) {
    try {
        const res = await authenticatedFetch(getApiUrl(`/api/course-requests/${id}`), {
            method: 'DELETE',
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            return {
                success: false,
                message: data.message || 'Failed to delete course request'
            };
        }

        revalidatePath('/course-requests');
        return { success: true, message: 'Course request deleted successfully' };
    } catch (error) {
        console.error('Error deleting course request:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred'
        };
    }
}
