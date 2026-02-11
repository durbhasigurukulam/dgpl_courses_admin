import CoursesClient from "./courses-client";
import type { Course, APICourse } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

export default function CoursesPage() {
    // Static export cannot fetch dynamic data on build.
    // Pass empty array and let Client Component fetch data.
    return <CoursesClient initialCourses={[]} />;
}
