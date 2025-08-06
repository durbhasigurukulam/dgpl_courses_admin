'use server';

import type { Testimonial } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

export async function addTestimonial(testimonialData: Omit<Testimonial, 'id'>) {
    try {
        const res = await authenticatedFetch(getApiUrl('/api/testimonials'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testimonialData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add testimonial');
        }

        const newTestimonial = await res.json();
        revalidatePath('/testimonials');
        revalidatePath('/dashboard');
        return { success: true, data: newTestimonial.data };

    } catch (error: any) {
        console.error("Error adding testimonial:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}

export async function updateTestimonial(testimonialData: Testimonial) {
    try {
        const { id, ...dataToUpdate } = testimonialData;
        const res = await authenticatedFetch(getApiUrl(`/api/testimonials/${id}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToUpdate),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update testimonial');
        }

        const updatedTestimonial = await res.json();
        revalidatePath('/testimonials');
        revalidatePath('/dashboard');
        return { success: true, data: updatedTestimonial.data };

    } catch (error: any) {
        console.error("Error updating testimonial:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}

export async function deleteTestimonial(testimonialId: string) {
    try {
        const res = await authenticatedFetch(getApiUrl(`/api/testimonials/${testimonialId}`), {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete testimonial');
        }

        revalidatePath('/testimonials');
        revalidatePath('/dashboard');
        return { success: true };

    } catch (error: any) {
        console.error("Error deleting testimonial:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}
