
"use client";

import { useState, useEffect, useRef } from "react";
import type { FileData } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2, Copy, Download } from "lucide-react";
import { clientAuthenticatedFetch } from "@/lib/client-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { FileEditDialog } from "@/components/file-edit-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { deleteFile, updateFile, uploadFile } from "./actions";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function FilesClient({
  initialFiles,
  initialPagination
}: {
  initialFiles: FileData[];
  initialPagination?: PaginationData;
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileData | null>(null);
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [pagination, setPagination] = useState<PaginationData | undefined>(initialPagination);
  const [currentPage, setCurrentPage] = useState(initialPagination?.page || 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleEditFile = (file: FileData) => {
    setEditingFile(file);
    setIsEditOpen(true);
  };

  const handleDeleteFile = async (fileId: string) => {
    const result = await deleteFile(fileId);
    if (result.success) {
      toast({
        title: "File Deleted",
        description: "The file has been successfully deleted.",
      });
      // Refresh the current page of files after deletion
      fetchFiles(currentPage, pagination?.limit || 10, searchTerm);
    } else {
      toast({
        title: "Error Deleting File",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveFile = async (file: FileData) => {
    const result = await updateFile(file);
    if (result.success) {
      toast({ title: "File Updated", description: "File metadata updated successfully." });
      setIsEditOpen(false);
      setEditingFile(null);
      // Refresh the current page of files after update
      fetchFiles(currentPage, pagination?.limit || 10, searchTerm);
    } else {
       toast({ title: "Error Updating File", description: result.message, variant: "destructive" });
    }
  };

  const handleUploadFile = async (formData: FormData) => {
    const result = await uploadFile(formData);
    if(result.success) {
        toast({ title: "File Uploaded", description: "New file uploaded successfully." });
        setIsUploadOpen(false);
        // Refresh the current page of files after upload - need to ensure we're on correct page
        // After upload, we should stay on the current page
        fetchFiles(currentPage, pagination?.limit || 10, searchTerm);
    } else {
        toast({ title: "Error Uploading File", description: result.message, variant: "destructive" });
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "URL copied to clipboard." });
  }

  // Fetch files with pagination
  const fetchFiles = async (page: number = 1, limit: number = 10, search: string = '') => {
    setIsLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);

      const queryString = params.toString();
      const apiUrl = `/api/files${queryString ? '?' + queryString : ''}`;

      const res = await clientAuthenticatedFetch(apiUrl);

      if (!res.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await res.json();

      if (data.success) {
        setFiles(data.data);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      // Update URL to reflect the current page
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', (pagination?.limit || 10).toString());
      if (searchTerm) params.append('search', searchTerm);

      router.push(`/files?${params.toString()}`);
      fetchFiles(page, pagination?.limit || 10, searchTerm);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchFiles(1, pagination?.limit || 10, searchTerm);
  };

  // Handle initial load and refresh when component mounts
  useEffect(() => {
    // If no pagination was provided from the server, fetch first page
    // Otherwise, we already have the correct page of files from the server
    if (!initialPagination) {
      fetchFiles(1, 10, '');
    } else {
      // We already have files from the server, update state to use them
      setFiles(initialFiles);
      setPagination(initialPagination);
      setCurrentPage(initialPagination.page);
    }
  }, []);

  // Handle search input change with debounce - skip on initial render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (pagination) { // Only run if pagination is already set
      const timeoutId = setTimeout(() => {
        fetchFiles(1, pagination?.limit || 10, searchTerm); // Always search first page
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  // Handle URL changes (e.g., when user uses browser back/forward or direct URL navigation)
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      const searchParam = urlParams.get('search');
      const limitParam = urlParams.get('limit');

      const newPage = pageParam ? parseInt(pageParam, 10) : 1;
      const newSearch = searchParam || '';
      const newLimit = limitParam ? parseInt(limitParam, 10) : (pagination?.limit || 10);

      if (newPage !== currentPage || newSearch !== searchTerm) {
        setSearchTerm(newSearch);
        fetchFiles(newPage, newLimit, newSearch);
      }
    };

    // Listen for browser navigation events
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [currentPage, searchTerm, pagination?.limit]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Files"
        description="Upload, view, and manage your files and assets."
      >
        <Button onClick={() => setIsUploadOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </PageHeader>
      <div className="flex-1 overflow-auto p-6 pt-0">
        {/* Search and filter controls */}
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading files...
                  </TableCell>
                </TableRow>
              ) : files.length > 0 ? (
                files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.originalName}</TableCell>
                    <TableCell className="max-w-xs truncate">{file.description}</TableCell>
                    <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                    <TableCell>{format(new Date(file.createdAt), 'PP')}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(file.publicUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button variant="ghost" size="icon" onClick={() => handleEditFile(file)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the file and its metadata permanently.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteFile(file.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No files found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} files
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>

                <div className="flex space-x-1 mx-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      // Show all pages if total is 5 or less
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If we're on early pages, show 1, 2, 3, 4, 5
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      // If we're on late pages, show last 5: totalPages-4 through totalPages
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      // For middle pages, center the current page: currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2
                      pageNum = Math.max(1, Math.min(currentPage - 2 + i, pagination.totalPages));
                    }

                    // Ensure pageNum is within valid range
                    pageNum = Math.max(1, Math.min(pageNum, pagination.totalPages));

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <FileUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadFile}
      />
      
      {editingFile && (
        <FileEditDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveFile}
          file={editingFile}
        />
      )}
    </div>
  );
}
