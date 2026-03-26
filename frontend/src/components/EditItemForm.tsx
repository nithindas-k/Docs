import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, Upload, X } from 'lucide-react';

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
  const [photoPreview, setPhotoPreview] = useState<string | null>(itemPhotoUrl || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(itemTitle);
    setFields(itemFields.length > 0 ? itemFields : [{ key: '', value: '', isEncrypted: false }]);
    setPhotoPreview(itemPhotoUrl || null);
  }, [itemTitle, itemFields, itemPhotoUrl]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select an image file');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    // Validate fields: all filled fields must have both key and value
    const validFields = fields.filter(f => f.key.trim() || f.value.trim());
    for (const field of validFields) {
      if (!field.key.trim() || !field.value.trim()) {
        alert('All fields must have both key and value');
        return;
      }
    }

    onSubmit({
      title: title.trim(),
      fields: validFields,
      photoFile: photoFile || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Photo (Optional)</label>
        {photoPreview ? (
          <div className="relative w-full">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-border"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 bg-background/80 hover:bg-background text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/5 p-6 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-muted-foreground">Click to upload photo</span>
            <span className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      {/* Title Input */}
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

      {/* Dynamic Fields Section */}
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

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed"
          onClick={handleAddField}
        >
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
