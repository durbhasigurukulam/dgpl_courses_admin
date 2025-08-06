import TestimonialsClient from "./testimonials-client";
import type { Testimonial, APITestimonial } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const res = await authenticatedFetch(getApiUrl('/api/testimonials'), {
            cache: 'no-store' 
        });
        if (!res.ok) {
            throw new Error('Failed to fetch testimonials');
        }
        const json = await res.json();
        if (!json.success) {
            throw new Error('API returned success: false');
        }
        
        return json.data.map((testimonial: APITestimonial) => ({
            ...testimonial,
            id: testimonial._id
        }));

    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }
}


export default async function TestimonialsPage() {
    const testimonials = await getTestimonials();
    return <TestimonialsClient initialTestimonials={testimonials} />;
}
