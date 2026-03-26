import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { FileUploadCard, UploadedFile } from './ui/file-upload-card';

interface Field {
  key: string;
  value: string;
  isEncrypted: boolean;
}

interface EditItemFormProps {
  categoryName: string;
  itemTitle: string;
  itemFields: Field[];
  itemPhotoUrl?: string;
  onSubmit: (data: { title: string; fields: Field[]; photoFile?: File }) => void;
  isLoading?: boolean;
}

export function EditItemForm({
  categoryName,
  itemTitle,
  itemFields,
  itemPhotoUrl,
  onSubmit,
  isLoading,
}: EditItemFormProps) {
  const [title, setTitle] = useState(itemTitle);
  const [fields, setFields] = useState<Field[]>(
    itemFields.length > 0 ? itemFields : [{ key: '', value: '', isEncrypted: false }]
  );

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    itemPhotoUrl
      ? [
          {
            id: `existing-${Date.now()}`,
            file: new File([], 'existing-image', { type: 'image/*' }),
            progress: 100,
            status: 'completed',
          },
        ]
      : []
  );

  useEffect(() => {
    setTitle(itemTitle);
    setFields(itemFields.length > 0 ? itemFields : [{ key: '', value: '', isEncrypted: false }]);
    if (itemPhotoUrl) {
      setUploadedFiles([
        {
          id: `existing-${Date.now()}`,
          file: new File([], 'existing-image', { type: 'image/*' }),
          progress: 100,
          status: 'completed',
        },
      ]);
    } else {
      setUploadedFiles([]);
    }
  }, [itemTitle, itemFields, itemPhotoUrl]);

  const handleFilesChange = (files: File[]) => {
    const normalized = files.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadedFiles(normalized);
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
      photoFile: uploadedFiles[0]?.file,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FileUploadCard
        files={uploadedFiles}
        onFilesChange={handleFilesChange}
        onFileRemove={handleFileRemove}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Item Title</label>
        <Input
          type="text"
          placeholder={`Edit ${categoryName} title`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-accent/50"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Details</label>
          <span className="text-xs text-muted-foreground">{fields.length} field(s)</span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {fields.map((field, index) => (
            <div key={index} className="space-y-2 p-3 rounded-lg bg-accent/20 border border-border">
              <div className="grid grid-cols-2 gap-2">
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

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
