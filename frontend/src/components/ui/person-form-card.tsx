import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ImageCropper } from "./image-cropper";
import { toast } from "sonner";

interface PersonFormCardProps {
  initialData?: {
    name: string;
    imageUrl?: string;
  };
  onSubmit: (data: { name: string; imageFile?: File }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export const PersonFormCard: React.FC<PersonFormCardProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}) => {
  const [name, setName] = React.useState(initialData?.name || "");
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(initialData?.imageUrl);
  const [imageFile, setImageFile] = React.useState<File | undefined>();
  const [tempImage, setTempImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large (Max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = async (croppedImageUrl: string) => {
    setImageUrl(croppedImageUrl);
    setTempImage(null);
    
    // Convert base64/blob URL to File object
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "profile.png", { type: "image/png" });
      setImageFile(file);
    } catch (e) {
      console.error("Failed to convert image:", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, imageFile });
  };

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className={cn(
        "relative w-full max-w-lg rounded-xl bg-background p-6 shadow-xl border border-border",
        className
      )}
    >
      {tempImage ? (
        <div className="mt-4">
            <h3 className="text-lg font-bold mb-4">Crop Profile Image</h3>
            <ImageCropper 
              imageSrc={tempImage} 
              onCropComplete={onCropComplete} 
              onCancel={() => setTempImage(null)} 
            />
        </div>
      ) : (
        <>
            <div className="flex items-center justify-between">
                <motion.h3 variants={FADE_IN_VARIANTS} className="text-xl font-semibold text-foreground">
                {initialData ? "Edit Person" : "Add Person"}
                </motion.h3>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
                <motion.div variants={FADE_IN_VARIANTS} className="flex flex-col items-center gap-3 md:col-span-1">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar className="h-24 w-24 border-2 border-dashed border-border bg-muted group-hover:border-primary/50 transition-colors">
                    <AvatarImage src={imageUrl} alt={name || "Person"} className="object-cover" />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                        <span className="text-xs">Image</span>
                    </AvatarFallback>
                    </Avatar>
                    <div
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Upload Image</p>
                    <p className="text-xs text-muted-foreground">Optional, Max 1MB</p>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    {imageUrl ? "Change Image" : "Add Image"}
                </Button>
                </motion.div>

                <div className="flex flex-col gap-4 md:col-span-2 justify-center">
                <motion.div variants={FADE_IN_VARIANTS} className="grid w-full items-center gap-1.5">
                    <Label htmlFor="person-name">
                    Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                    type="text"
                    id="person-name"
                    placeholder="E.g., Mom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </motion.div>
                </div>

                <motion.div variants={FADE_IN_VARIANTS} className="flex justify-end gap-3 md:col-span-3">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
                </motion.div>
            </form>
        </>
      )}
    </motion.div>
  );
};
