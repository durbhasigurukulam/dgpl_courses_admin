// app/files/page.tsx

import FilesClient from "./files-client";
import type { FileData, APIFile } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

interface APIResponse {
    success: boolean;
    data: APIFile[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

async function getFiles(page?: string, limit?: string, category?: string, search?: string): Promise<{ files: FileData[], pagination?: any }> {
    try {
        console.log("🔍 Attempting to fetch files with params:", { page, limit, category, search });

        // Build query string with pagination params
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (category) params.append('category', category);
        if (search) params.append('search', search);

        const queryString = params.toString();
        const apiUrl = queryString ? `${getApiUrl('/api/files')}?${queryString}` : getApiUrl('/api/files');

        const res = await authenticatedFetch(apiUrl, {
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Failed to fetch files:", res.status, errorText);
            return { files: [] };
        }

        const json: APIResponse = await res.json();

        if (!json.success) {
            console.error("❌ API returned success: false", json.message);
            return { files: [], pagination: json.pagination };
        }

        const files = json.data.map((file: APIFile) => ({
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
            createdAt: file.createdAt,
        }));

        return { files, pagination: json.pagination };
    } catch (error) {
        console.error("🔥 Error fetching files:", error);
        return { files: [], pagination: undefined };
    }
}

export default async function FilesPage({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string; category?: string; search?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const { files, pagination } = await getFiles(resolvedSearchParams.page, resolvedSearchParams.limit, resolvedSearchParams.category, resolvedSearchParams.search);
    return <FilesClient initialFiles={files} initialPagination={pagination} />;
}
