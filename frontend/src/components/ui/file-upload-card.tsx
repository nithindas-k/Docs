import * as React from "react";
import { UploadCloud, X, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface FileUploadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  files: UploadedFile[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  onClose?: () => void;
}

export const FileUploadCard = React.forwardRef<HTMLDivElement, FileUploadCardProps>(
  ({ className, files = [], onFilesChange, onFileRemove, onClose, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        onFilesChange(droppedFiles);
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        onFilesChange(selectedFiles);
      }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 KB";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const fileItemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    };

    return (
      <div
        ref={ref}
        className={cn("w-full min-w-0 rounded-xl border bg-background shadow-sm", className)}
        {...props}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Upload files</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select and upload the files of your choice
                </p>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={cn(
              "mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-200",
              isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-primary/50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="font-semibold text-foreground">Choose a file or drag and drop it here.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
            </p>
            <Button variant="outline" size="sm" className="mt-4 pointer-events-none">
              Browse File
            </Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="border-t p-6">
            <ul className="space-y-4">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.li
                    key={file.id}
                    variants={fileItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground">
                        {file.file.type.split("/")[1]?.toUpperCase().substring(0, 3) || "FILE"}
                      </div>
                      <div className="flex-1">
                        <p className="max-w-[150px] truncate text-sm font-medium text-foreground sm:max-w-xs">
                          {file.file.name}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {file.status === "uploading" && (
                            <span>
                              {formatFileSize((file.file.size * file.progress) / 100)} of{" "}
                              {formatFileSize(file.file.size)}
                            </span>
                          )}
                          {file.status === "completed" && <span>{formatFileSize(file.file.size)}</span>}
                          <span className="mx-1">•</span>
                          <span
                            className={cn(
                              { "text-primary": file.status === "uploading" },
                              { "text-green-500": file.status === "completed" }
                            )}
                          >
                            {file.status === "uploading" ? "Uploading..." : "Completed"}
                          </span>
                        </div>
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="mt-1 h-1.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => onFileRemove(file.id)}
                      >
                        {file.status === "completed" ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </div>
    );
  }
);

FileUploadCard.displayName = "FileUploadCard";
