import TestimonialsClient from "./testimonials-client";
import type { Testimonial, APITestimonial } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";


export default function TestimonialsPage() {
    // Static export cannot fetch dynamic data on build.
    // Pass empty array and let Client Component fetch data.
    return <TestimonialsClient initialTestimonials={[]} />;
}
