import DashboardClient from "./dashboard-client";
import type { Course, Testimonial, FileData, APICourse, APITestimonial, APIFile } from "@/lib/types";
import { getApiUrl } from "@/lib/api-utils";

export default function Home() {
  // Static export cannot fetch dynamic data on build.
  // Pass empty data and let Client Component fetch data.
  return <DashboardClient initialData={{ courses: [], testimonials: [], files: [] }} />;
}
