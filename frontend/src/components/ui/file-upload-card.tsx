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
  status: "uploading" | "scanning" | "completed" | "error";
  preview?: string; // Add this for existing remote images
  side?: 'front' | 'back' | null;
}

const FilePreview = ({ file, previewUrl }: { file: File, previewUrl?: string }) => {
  const [localPreview, setLocalPreview] = React.useState<string | null>(previewUrl || null);

  React.useEffect(() => {
    if (previewUrl) {
      setLocalPreview(previewUrl);
      return;
    }
    
    if (file && file.size > 0 && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setLocalPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, previewUrl]);

  return (
    <div className="flex h-10 w-10 flex-shrink-0 overflow-hidden items-center justify-center rounded-md bg-muted">
      {localPreview ? (
        <img src={localPreview} alt="preview" className="h-full w-full object-cover" />
      ) : (
        <div className="text-[10px] font-bold text-muted-foreground uppercase">
          {file.type ? file.type.split("/")[1]?.toUpperCase().substring(0, 3) : "IMG"}
        </div>
      )}
    </div>
  );
};


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

    const formatFileName = (name: string) => {
      const parts = name.split('.');
      const ext = parts.pop();
      const base = parts.join('.');
      if (base.length <= 8) return name;
      return `${base.substring(0, 5)}... .${ext}`;
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
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-muted shrink-0">
                <UploadCloud className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-foreground truncate">Upload files</h3>
                <p className="mt-0.5 text-[11px] sm:text-sm text-muted-foreground opacity-70">
                  Select and upload documents
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
              "mt-5 sm:mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 sm:p-8 text-center transition-colors duration-200",
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
            <UploadCloud className="mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground opacity-50" />
            <p className="text-sm sm:text-base font-bold text-foreground">Choose a file or drag it here.</p>
            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
              JPEG, PNG, PDF formats, up to 10 MB.
            </p>
            <Button variant="outline" size="sm" className="mt-4 pointer-events-none h-8 sm:h-9 text-[11px] sm:text-xs px-6">
              Browse File
            </Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="border-t p-3 sm:p-4">
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
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FilePreview file={file.file} previewUrl={file.preview} />
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="truncate text-sm font-medium text-foreground">
                          {formatFileName(file.file.name)}
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
                              { "text-primary": file.status === "uploading" || file.status === "scanning" },
                              { "text-green-500": file.status === "completed" },
                              { "text-amber-500 animate-pulse": file.status === "scanning" }
                            )}
                          >
                            {file.status === "uploading" ? "Uploading..." : (file.status === "scanning" ? "Scanning document..." : "Completed")}
                          </span>
                        </div>
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="mt-1 h-1.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
