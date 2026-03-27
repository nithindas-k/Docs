import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { FileUploadCard, UploadedFile } from './ui/file-upload-card';
import { ImageCropper } from './ui/image-cropper';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from './ui/dialog';

interface Field {
  key: string;
  value: string;
  isEncrypted: boolean;
}

interface AddItemFormProps {
  categoryName: string;
  onSubmit: (data: { title: string; fields: Field[]; photoFiles?: File[] }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function AddItemForm({ categoryName, onSubmit, onBack, isLoading }: AddItemFormProps) {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([{ key: '', value: '', isEncrypted: false }]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [imageToCrop, setImageToCrop] = useState<{ file: File; src: string } | null>(null);

  const handleFilesChange = (files: File[]) => {
    // If only one image is picked, show cropper
    if (files.length === 1 && files[0].type.startsWith('image/')) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop({ file, src: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      // Add all files directly (multiple or non-image)
      const newFiles = files.map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 100,
        status: 'completed' as const,
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleCropDone = async (croppedImageUrl: string) => {
    if (!imageToCrop) return;

    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const croppedFile = new File([blob], imageToCrop.file.name, { type: 'image/png' });

      const normalized = {
        id: `${croppedFile.name}-${Date.now()}`,
        file: croppedFile,
        progress: 100,
        status: 'completed' as const,
      };

      setUploadedFiles(prev => [...prev, normalized]);
      setImageToCrop(null);
    } catch (e) {
      console.error('Cropping failed:', e);
    }
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
  };

  const handleFileRemove = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleAddField = () => {
    setFields([...fields, { key: '', value: '', isEncrypted: false }]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, part: keyof Field, val: string | boolean) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [part]: val };
    setFields(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const validFields = fields.filter((f) => f.key.trim() || f.value.trim());
    for (const field of validFields) {
      if (!field.key.trim() || !field.value.trim()) {
        alert('All fields must have both key and value');
        return;
      }
    }

    onSubmit({
      title: title.trim(),
      fields: validFields,
      photoFiles: uploadedFiles.map(f => f.file),
    });

    setTitle('');
    setFields([{ key: '', value: '', isEncrypted: false }]);
    setUploadedFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Dialog open={!!imageToCrop} onOpenChange={(open) => !open && setImageToCrop(null)}>
        <DialogContent className="max-w-lg border bg-background p-6 rounded-2xl shadow-xl overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {imageToCrop && (
            <ImageCropper 
              imageSrc={imageToCrop.src} 
              onCropComplete={handleCropDone} 
              onCancel={handleCropCancel} 
            />
          )}
        </DialogContent>
      </Dialog>

      <FileUploadCard
        files={uploadedFiles}
        onFilesChange={handleFilesChange}
        onFileRemove={handleFileRemove}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Item Title</label>
        <Input
          type="text"
          placeholder={`Enter ${categoryName} title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-accent/50"
        />
        <p className="text-xs text-muted-foreground">Give this item a descriptive name</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Details</label>
          <span className="text-xs text-muted-foreground">{fields.length} field(s)</span>
        </div>

        <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
          {fields.map((field, index) => (
            <div key={index} className="space-y-2 p-2.5 sm:p-3 rounded-xl bg-accent/20 border border-border">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Key</label>
                  <Input
                    type="text"
                    placeholder="e.g., Account Number"
                    value={field.key}
                    onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                    className="text-sm bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Value</label>
                  <Input
                    type="text"
                    placeholder="e.g., 1234567890"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                    className="text-sm bg-background"
                  />
                </div>
              </div>

              <div className="flex items-end justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.isEncrypted}
                    onChange={(e) => handleFieldChange(index, 'isEncrypted', e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-xs font-medium text-muted-foreground">Encrypt</span>
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveField(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" className="w-full gap-2 border-dashed" onClick={handleAddField}>
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </div>

      <div className="flex gap-2 pt-2">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="px-6 rounded-xl font-bold">
            Back
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl font-bold">
          {isLoading ? 'Saving...' : `Save ${categoryName}`}
        </Button>
      </div>
    </form>
  );
}
