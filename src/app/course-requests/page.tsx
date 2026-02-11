import CourseRequestsClient from "./course-requests-client";
import type { CourseRequest, APICourseRequest } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

export default function CourseRequestsPage() {
    // Static export cannot fetch dynamic data on build.
    // Pass empty array and let Client Component fetch data.
    return <CourseRequestsClient initialCourseRequests={[]} />;
}
