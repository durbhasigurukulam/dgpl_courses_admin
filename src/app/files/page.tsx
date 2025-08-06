// app/files/page.tsx

import FilesClient from "./files-client";
import type { FileData, APIFile } from "@/lib/types";
import { authenticatedFetch } from "@/lib/api";

async function getFiles(): Promise<FileData[]> {
    try {
        console.log("🔍 Attempting to fetch files...");
        const res = await authenticatedFetch("https://api.courses.durbhasigurukulam.com/api/files", {
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Failed to fetch files:", res.status, errorText);
            return [];
        }

        const json = await res.json();

        if (!json.success) {
            console.error("❌ API returned success: false", json.message);
            return [];
        }

        return json.data.map((file: APIFile) => ({
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
    } catch (error) {
        console.error("🔥 Error fetching files:", error);
        return [];
    }
}

export default async function FilesPage() {
    const files = await getFiles();
    return <FilesClient initialFiles={files} />;
}
