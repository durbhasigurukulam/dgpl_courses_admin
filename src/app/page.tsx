import DashboardClient from "./dashboard-client";
import type { Course, Testimonial, FileData, APICourse, APITestimonial, APIFile } from "@/lib/types";
import { getApiUrl } from "@/lib/api-utils";

async function getDashboardData() {
  try {
    const [coursesRes, testimonialsRes, filesRes] = await Promise.all([
      fetch(getApiUrl('/api/courses'), { cache: 'no-store' }),
      fetch(getApiUrl('/api/testimonials'), { cache: 'no-store' }),
      fetch(getApiUrl('/api/files'), { cache: 'no-store' })
    ]);

    const courses: Course[] = [];
    const testimonials: Testimonial[] = [];
    const files: FileData[] = [];

    if (coursesRes.ok) {
      const coursesJson = await coursesRes.json();
      if (coursesJson.success) {
        courses.push(...coursesJson.data.map((course: APICourse) => ({ ...course, id: course._id })));
      }
    }

    if (testimonialsRes.ok) {
      const testimonialsJson = await testimonialsRes.json();
      if (testimonialsJson.success) {
        testimonials.push(...testimonialsJson.data.map((testimonial: APITestimonial) => ({ ...testimonial, id: testimonial._id })));
      }
    }

    if (filesRes.ok) {
      const filesJson = await filesRes.json();
      if (filesJson.success) {
        files.push(...filesJson.data.map((file: APIFile) => ({
          id: file._id,
          filename: file.filename,
          originalName: file.originalName,
          publicUrl: file.publicUrl,
          downloadUrl: file.publicUrl,
          size: file.size,
          mimetype: file.mimetype,
          category: file.category,
          description: file.description,
          isPublic: file.isPublic,
          tags: file.tags,
          createdAt: file.createdAt
        })));
      }
    }

    return { courses, testimonials, files };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { courses: [], testimonials: [], files: [] };
  }
}

export default async function Home() {
  const { courses, testimonials, files } = await getDashboardData();
  return <DashboardClient initialData={{ courses, testimonials, files }} />;
}
