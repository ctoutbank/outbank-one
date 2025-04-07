"use client";

import { UploadCloud, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progressUpload";
import { cn } from "@/lib/utils";

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onUpload?: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  disabled?: boolean;
}

export function FileUpload({
  onUpload,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = "image/*",
  disabled = false,
  className,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Clean up previews on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError(null);

    // Check if too many files are selected
    if (selectedFiles.length > maxFiles) {
      setError(
        `You can only upload ${maxFiles} file${
          maxFiles === 1 ? "" : "s"
        } at a time.`
      );
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        setError(
          `File "${file.name}" is too large. Maximum size is ${
            maxSize / 1024 / 1024
          }MB.`
        );
        return;
      }

      newFiles.push(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);
      } else {
        // Placeholder for non-image files
        newPreviews.push("");
      }
    });

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    handleFileChange(droppedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0 || !onUpload) return;

    try {
      setIsUploading(true);
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      await onUpload(files);

      // Complete progress
      clearInterval(interval);
      setProgress(100);

      // Reset after a short delay
      setTimeout(() => {
        setFiles([]);
        setPreviews([]);
        setProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch {

      setError("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    if (isUploading) return;

    const newFiles = [...files];
    const newPreviews = [...previews];

    // Revoke object URL to prevent memory leaks
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <div
        className={cn(
          "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          disabled && "cursor-not-allowed opacity-60"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && !isUploading && fileInputRef.current?.click()
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled || isUploading}
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              {isDragging ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {maxFiles > 1
              ? `Upload up to ${maxFiles} files (max ${
                  maxSize / 1024 / 1024
                }MB each)`
              : `Max file size: ${maxSize / 1024 / 1024}MB`}
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {files.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border bg-background"
            >
              {file.type.startsWith("image/") ? (
                <div className="relative aspect-square">
                  <img
                    src={previews[index] || "/placeholder.svg"}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center bg-muted/30">
                  <p className="text-sm font-medium">
                    {file.name.split(".").pop()?.toUpperCase()}
                  </p>
                </div>
              )}

              <div className="p-2">
                <p className="truncate text-xs font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {files.length > 0 && !isUploading && (
        <Button
          onClick={handleUpload}
          disabled={disabled || isUploading || files.length === 0}
        >
          Upload {files.length} file{files.length > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}
