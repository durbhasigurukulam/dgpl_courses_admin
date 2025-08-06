
'use server';

import type { FileData } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { authenticatedFetch } from "@/lib/api";
import { getApiUrl } from "@/lib/api-utils";

export async function uploadFile(formData: FormData) {
    try {
        const res = await fetch(getApiUrl('/api/files'), {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to upload file');
        }

        const newFile = await res.json();
        revalidatePath('/files');
        revalidatePath('/dashboard');
        return { success: true, data: newFile.data };

    } catch (error: any) {
        console.error("Error uploading file:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}


export async function updateFile(fileData: FileData) {
    try {
        const { id, ...dataToUpdate } = fileData;
        const res = await fetch(getApiUrl(`/api/files/${id}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToUpdate),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update file');
        }

        const updatedFile = await res.json();
        revalidatePath('/files');
        return { success: true, data: updatedFile.data };

    } catch (error: any) {
        console.error("Error updating file:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}

export async function deleteFile(fileId: string) {
    try {
        const res = await fetch(getApiUrl(`/api/files/${fileId}`), {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete file');
        }

        revalidatePath('/files');
        revalidatePath('/dashboard');
        return { success: true };

    } catch (error: any) {
        console.error("Error deleting file:", error);
        return { success: false, message: error.message || "An unknown error occurred" };
    }
}
