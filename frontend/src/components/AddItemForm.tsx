import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, Home, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { FileUploadCard, UploadedFile } from './ui/file-upload-card';
import { ImageCropper } from './ui/image-cropper';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from './ui/dialog';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PHOTOS = 3;

interface Field {
  key: string;
  value: string;
  isEncrypted: boolean;
}

interface AddItemFormProps {
  categoryName: string;
  onSubmit: (data: { title: string; fields: Field[]; photoFiles?: File[] }) => void;
  isLoading?: boolean;
  onBack?: () => void;
}

export function AddItemForm({
  categoryName,
  onSubmit,
  isLoading,
  onBack,
}: AddItemFormProps) {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<Field[]>([{ key: '', value: '', isEncrypted: false }]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [imageToCrop, setImageToCrop] = useState<{ file: File; src: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScannable, setIsScannable] = useState(false);

  useEffect(() => {
    setIsScannable(['aadhaar', 'pan', 'driving', 'licence', 'passport', 'voter', 'sslc', 'identity'].some(kw => categoryName.toLowerCase().includes(kw)));
  }, [categoryName]);

  const handleFilesChange = async (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (uploadedFiles.length + validFiles.length > MAX_PHOTOS) {
      toast.error(`You can only upload a maximum of ${MAX_PHOTOS} photos`);
      return;
    }

    if (validFiles.length === 1 && validFiles[0].type.startsWith('image/')) {
      const file = validFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop({ file, src: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      const newFiles = validFiles.map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 100,
        status: 'completed' as const,
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleManualScan = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload an image first');
      return;
    }

    const scanFiles = uploadedFiles.filter(f => f.file && f.file.size > 0);
    if (scanFiles.length === 0) return;

    setIsScanning(true);
    toast.info(`Scanning document(s)...`);

    try {
      for (const fileItem of scanFiles) {
        setUploadedFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: 'scanning' as const } : f));
        await handleScanSingleFile(fileItem.file, fileItem.id);
      }

      setUploadedFiles(allFiles => {
        const hasFront = allFiles.some(f => f.side === 'front');
        const hasBack = allFiles.some(f => f.side === 'back');

        if (hasFront && !hasBack) {
          toast.warning('Front side detected. Upload the back side for address.', { icon: <User className="h-4 w-4 text-primary" /> });
        } else if (hasBack && !hasFront) {
          toast.warning('Back side detected. Upload the front side for identity.', { icon: <Home className="h-4 w-4 text-primary" /> });
        }
        return allFiles;
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanSingleFile = async (file: File, id: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', categoryName);

    try {
      const result = await api.postFormData<any>(`/scanner/scan`, formData);

      if (result.success && result.data) {
        const data = result.data;
        
        if (!data.documentId && !data.isFront && !data.isBack) {
           setUploadedFiles(prev => prev.map(item => item.id === id ? { ...item, status: 'error' as const } : item));
           toast.error(`This does not appear to be a valid ${categoryName} document.`);
           return;
        }

        setUploadedFiles(prev => prev.map(item => item.id === id ? { ...item, status: 'completed' as const, side: result.detectedSide } : item));

        const newFields = data.fields || [];

        if (data.documentType) {
          setTitle(data.documentType);
        }

        setFields(prev => {
          // 1. Start with non-empty existing fields
          let updated = prev.filter(f => f.key.trim() || f.value.trim());
          
          // 2. Merge new fields from AI
          newFields.forEach((newF: Field) => {
            const existingIdx = updated.findIndex(f => f.key.toLowerCase() === newF.key.toLowerCase());
            if (existingIdx !== -1) {
              // Update value if existing is empty
              if (!updated[existingIdx].value) {
                updated[existingIdx] = newF;
              }
            } else {
              // Add as new field
              updated.push(newF);
            }
          });
          
          // 3. Fallback: if totally empty, add one blank row
          if (updated.length === 0) {
            updated = [{ key: '', value: '', isEncrypted: false }];
          }
          
          return updated;
        });

        const docType = result.documentType || categoryName;
        toast.success(`${docType} verified and extracted!`, { icon: <ShieldCheck className="h-4 w-4 text-green-500" /> });
      }
    } catch (error: any) {
      console.error('Scan failed:', error);
      setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' as const } : f));
      toast.error(error.message || 'Scan failed. Please ensure the image is clear.');
    }
  };

  const handleCropDone = async (croppedImageUrl: string) => {
    if (!imageToCrop) return;
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const croppedFile = new File([blob], imageToCrop.file.name, { type: 'image/png' });
      setImageToCrop(null);
      setUploadedFiles(prev => [...prev, {
        id: `${croppedFile.name}-${Date.now()}`,
        file: croppedFile,
        progress: 100,
        status: 'completed' as const,
      }].slice(0, MAX_PHOTOS));
    } catch (e) {
      console.error('Cropping failed:', e);
    }
  };

  const handleCropCancel = () => setImageToCrop(null);
  const handleFileRemove = (id: string) => setUploadedFiles(prev => prev.filter(f => f.id !== id));
  const handleAddField = () => setFields([...fields, { key: '', value: '', isEncrypted: false }]);
  const handleRemoveField = (index: number) => setFields(fields.filter((_, i) => i !== index));
  const handleFieldChange = (index: number, part: keyof Field, val: string | boolean) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [part]: val } as Field;
    setFields(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    const validFields = fields.filter((f) => f.key.trim() || f.value.trim());
    const newFiles = uploadedFiles.filter(f => f.file && f.file.size > 0).map(f => f.file);
    onSubmit({ title: title.trim(), fields: validFields, photoFiles: newFiles });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Dialog open={!!imageToCrop} onOpenChange={(open) => !open && setImageToCrop(null)}>
        <DialogContent className="max-w-lg border bg-background p-6 rounded-2xl shadow-xl overflow-hidden">
          <DialogHeader className="sr-only"><DialogTitle>Crop Image</DialogTitle></DialogHeader>
          {imageToCrop && (
            <ImageCropper imageSrc={imageToCrop.src} onCropComplete={handleCropDone} onCancel={handleCropCancel} />
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        <FileUploadCard files={uploadedFiles} onFilesChange={handleFilesChange} onFileRemove={handleFileRemove} />
        <div className="flex gap-2">
          {onBack && (
            <Button type="button" onClick={onBack} variant="outline" className="px-3 rounded-xl border-primary/20 text-primary hover:bg-primary/5">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {isScannable && uploadedFiles.length > 0 && (
            <Button type="button" onClick={handleManualScan} disabled={isScanning} variant="secondary" className="flex-1 h-11 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold transition-all gap-2">
              {isScanning ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />Extracting...</span> : <span className="flex items-center gap-2"><Plus className="h-4 w-4" />Scan & Extract Data</span>}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Item Title</label>
        <Input type="text" placeholder={`Enter ${categoryName} title`} value={title} onChange={(e) => setTitle(e.target.value)} className="bg-accent/50" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Details</label>
          <span className="text-xs text-muted-foreground">{fields.length} field(s)</span>
        </div>
        <div className="w-full overflow-x-hidden space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="space-y-3 p-3 sm:p-4 rounded-xl bg-accent/20 border border-border">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="min-w-0 flex-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70 leading-none truncate block mb-1">Key</label>
                  <Input type="text" placeholder="e.g., Account Number" value={field.key} onChange={(e) => handleFieldChange(index, 'key', e.target.value)} className="text-sm bg-background w-full h-10 px-3 rounded-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70 leading-none truncate block mb-1">Value</label>
                  <Input type="text" placeholder="e.g., 1234567890" value={field.value} onChange={(e) => handleFieldChange(index, 'value', e.target.value)} className="text-sm bg-background w-full h-10 px-3 rounded-lg" />
                </div>
              </div>
              <div className="flex items-end justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={field.isEncrypted} onChange={(e) => handleFieldChange(index, 'isEncrypted', e.target.checked)} className="w-4 h-4 rounded border-border" />
                  <span className="text-xs font-medium text-muted-foreground">Encrypt</span>
                </label>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveField(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" className="w-full gap-2 border-dashed" onClick={handleAddField}>
          <Plus className="h-4 w-4" />Add Field
        </Button>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading || isScanning} className="flex-1 rounded-xl font-bold">
          {isLoading ? 'Saving...' : 'Add to Collection'}
        </Button>
      </div>
    </form>
  );
}
