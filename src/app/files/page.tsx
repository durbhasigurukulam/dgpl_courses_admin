// app/files/page.tsx

import FilesClient from "./files-client";
import type { FileData, APIFile } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

export default function FilesPage() {
    // Static export cannot fetch dynamic data on build.
    // Pass empty array and let Client Component fetch data.
    return <FilesClient initialFiles={[]} initialPagination={undefined} />;
}
