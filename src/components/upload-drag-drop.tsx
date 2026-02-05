"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, X, File, Image as ImageIcon } from "lucide-react";

interface UploadDragDropProps {
  onFileUpload: (publicUrl: string) => void;
  acceptedTypes?: string;
  label?: string;
  currentValue?: string;
  type: "image" | "file";
}

export function UploadDragDrop({
  onFileUpload,
  acceptedTypes = "image/*",
  label = "Upload file",
  currentValue,
  type,
}: UploadDragDropProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];

        // Validate file type
        if (acceptedTypes.includes("image/") && !file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please upload an image file.",
            variant: "destructive",
          });
          return;
        }

        handleFileUpload(file).catch(error => {
          console.error("Upload failed:", error);
        });
      }
    },
    [acceptedTypes, toast]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file).catch(error => {
        console.error("Upload failed:", error);
      });
    }
  };

  const handleFileUpload = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      // Prompt user for custom filename before upload
      const defaultName = file.name.substring(0, file.name.lastIndexOf('.'));
      const customFilename = prompt(
        `Enter a name for your ${type} (without extension):\n\nCurrent: ${file.name}\n\nNote: Alphanumeric characters, dots, hyphens only.`,
        defaultName
      );

      if (customFilename === null) {
        // User cancelled the upload
        toast({
          title: "Upload Cancelled",
          description: "File upload was cancelled by user.",
          variant: "default",
        });
        reject(new Error("Upload cancelled by user"));
        return;
      }

      if (customFilename === "") {
        toast({
          title: "Invalid Filename",
          description: "Filename cannot be empty. Using default name.",
          variant: "destructive",
        });
        // We'll continue with the original filename
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", type === "image" ? "course_images" : "syllabus");
      formData.append("description", type === "image" ? "Course Image" : "Syllabus File");

      // Add the custom filename to the form data
      if (customFilename && customFilename.trim() !== "") {
        formData.append("filename", customFilename);
      }

      setIsUploading(true);
      setUploadProgress(0);
      setFileName(file.name);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              setUploadProgress(100);
              setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
              }, 500);

              onFileUpload(response.data.publicUrl);
              toast({
                title: "Upload Successful",
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully.`,
              });
              resolve();
            } else {
              throw new Error(response.message || "Upload failed");
            }
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        setIsUploading(false);
        setUploadProgress(0);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading the file",
          variant: "destructive",
        });
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", "/api/client-upload");

      xhr.send(formData);
    });
  };

  const removeFile = () => {
    setFileName(null);
    onFileUpload("");
  };

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const isEditing = useRef(false);

  // Update urlValue when currentValue changes, but only when not editing
  useEffect(() => {
    if (!isEditing.current) {
      setUrlValue(currentValue || "");
    }
  }, [currentValue]);

  const startEditing = () => {
    isEditing.current = true;
    setUrlValue(currentValue || "");
    setShowUrlInput(true);
  };

  const stopEditing = () => {
    isEditing.current = false;
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!urlValue) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(urlValue);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for real URLs (avoiding CORS issues with HEAD requests from browser)
    // We'll skip validation for placeholder URLs but warn for potentially fake ones
    if (!urlValue.includes('placehold.co') &&
        !urlValue.includes('localhost') &&
        !urlValue.startsWith('data:')) {
      // Check for obvious fake URL patterns
      const fakeUrlPatterns = [
        /example\.com/,
        /fake/,
        /invalid/,
        /test/,
        /dummy/,
        /temp/,
        /temporary/,
        /\.temp$/,
        /\.fake$/,
        /127\.0\.0\.1/,
        /::1/
      ];

      const isPotentiallyFake = fakeUrlPatterns.some(pattern => pattern.test(urlValue));

      if (isPotentiallyFake) {
        toast({
          title: "Potential Issue",
          description: "This URL may be temporary or invalid. Please verify it's a real URL.",
          variant: "default",
        });
        // We still allow the URL but warn the user
      }
    }

    // For image type, validate if it's an image URL
    if (type === "image") {
      const lowerUrlValue = urlValue.toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
      const isImageUrl = imageExtensions.some(ext => lowerUrlValue.includes(ext)) ||
                        urlValue.includes('data:image') ||
                        urlValue.includes('placehold.co') ||
                        urlValue.includes('imgur.com') ||
                        urlValue.includes('unsplash.com') ||
                        urlValue.includes('picsum.photos') ||
                        urlValue.includes('images.unsplash.com');

      // If it doesn't match known image patterns, warn the user but still allow
      if (!isImageUrl) {
        toast({
          title: "Potential Issue",
          description: "This URL doesn't appear to be an image. Please verify it's a direct image URL.",
          variant: "default",
        });
      }
    }

    onFileUpload(urlValue);
    setUrlValue("");
    setShowUrlInput(false);
    stopEditing();
    toast({
      title: "URL Added",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} URL added successfully.`,
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      {currentValue ? (
        <div className="relative border rounded-lg p-4 bg-muted">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {type === "image" ? (
                <ImageIcon className="h-5 w-5" />
              ) : (
                <File className="h-5 w-5" />
              )}
              <span className="truncate max-w-xs">
                {currentValue.split('/').pop() || currentValue}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startEditing}
              >
                Edit URL
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : showUrlInput ? (
        <form onSubmit={handleUrlSubmit} className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder={type === "image"
                ? "Enter image URL (e.g., https://example.com/image.jpg)"
                : "Enter file URL (e.g., https://example.com/document.pdf)"
              }
              disabled={isUploading}
            />
            <Button type="submit" disabled={isUploading}>
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUrlInput(false);
                stopEditing();
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs"
            onClick={() => {
              setShowUrlInput(false);
              stopEditing();
            }}
          >
            Use file upload instead
          </Button>
        </form>
      ) : (
        <div className="space-y-2">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById(`file-input-${type}`)?.click()}
          >
            <input
              id={`file-input-${type}`}
              type="file"
              className="hidden"
              accept={acceptedTypes}
              onChange={handleFileInputChange}
              disabled={isUploading}
            />
            <CloudUpload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag and drop your {type} here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {type === "image"
                ? "Supports JPG, PNG, GIF (Max 5MB)"
                : "Supports PDF, DOC, DOCX (Max 10MB)"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={startEditing}
            disabled={isUploading}
          >
            Enter {type} URL
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Uploading: {fileName}</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
}