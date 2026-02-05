import CourseRequestsClient from "./course-requests-client";
import type { CourseRequest, APICourseRequest } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

async function getCourseRequests(): Promise<CourseRequest[]> {
    try {
        const res = await authenticatedFetch(getApiUrl('/api/course-requests'), {
            cache: 'no-store' 
        });
        if (!res.ok) {
            throw new Error('Failed to fetch course requests');
        }
        const json = await res.json();
        if (!json.success) {
            throw new Error('API returned success: false');
        }
        
        return json.data.map((request: APICourseRequest) => ({
            ...request,
            id: request._id
        }));

    } catch (error) {
        console.error("Error fetching course requests:", error);
        return [];
    }
}


export default async function CourseRequestsPage() {
    const courseRequests = await getCourseRequests();
    return <CourseRequestsClient initialCourseRequests={courseRequests} />;
}
