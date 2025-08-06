import CoursesClient from "./courses-client";
import type { Course, APICourse } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

async function getCourses(): Promise<Course[]> {
    try {
        const res = await authenticatedFetch(getApiUrl('/api/courses'), {
            cache: 'no-store' 
        });
        if (!res.ok) {
            throw new Error('Failed to fetch courses');
        }
        const json = await res.json();
        if (!json.success) {
            throw new Error('API returned success: false');
        }
        
        return json.data.map((course: APICourse) => ({
            ...course,
            id: course._id
        }));

    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}


export default async function CoursesPage() {
    const courses = await getCourses();
    return <CoursesClient initialCourses={courses} />;
}
