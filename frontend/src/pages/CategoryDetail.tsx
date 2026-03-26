import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../features/store';
import { fetchItemsByCategory } from '../features/itemSlice';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Eye, EyeOff, Camera, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { AddItemForm } from '../components/AddItemForm';
import { EditItemForm } from '../components/EditItemForm';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { api } from '../services/api';
import { API_ROUTES } from '../constants';
import type { Item } from '../features/itemSlice';

export function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [showSensitive, setShowSensitive] = React.useState<Record<string, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  
  const { categories } = useSelector((state: RootState) => state.categories);
  const items = useSelector((state: RootState) => state.items.itemsByCategory[id || '']) || [];
  
  const category = categories.find(c => c._id === id);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemsByCategory(id));
    }
  }, [id, dispatch]);

  const toggleSensitive = (itemId: string, fieldKey: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [`${itemId}-${fieldKey}`]: !prev[`${itemId}-${fieldKey}`]
    }));
  };

  const handleAddItem = async (data: { title: string; fields: Array<{ key: string; value: string; isEncrypted: boolean }>; photoFile?: File }) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category', id);
      formData.append('title', data.title);
      formData.append('fields', JSON.stringify(data.fields));
      if (data.photoFile) {
        formData.append('photo', data.photoFile);
      }

      await api.postFormData(API_ROUTES.ITEM.BASE, formData);

      // Refresh items list
      dispatch(fetchItemsByCategory(id));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (data: { title: string; fields: Array<{ key: string; value: string; isEncrypted: boolean }>; photoFile?: File }) => {
    if (!editingItem) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('fields', JSON.stringify(data.fields));
      if (data.photoFile) {
        formData.append('photo', data.photoFile);
      }

      await api.putFormData(`${API_ROUTES.ITEM.BASE}/${editingItem._id}`, formData);

      // Refresh items list
      if (id) {
        dispatch(fetchItemsByCategory(id));
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('Failed to update item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem || !id) return;

    setIsSubmitting(true);
    try {
      await api.delete(`${API_ROUTES.ITEM.BASE}/${deletingItem._id}`);

      // Refresh items list
      dispatch(fetchItemsByCategory(id));
      setDeletingItem(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{category?.name || 'Category Options'}</h1>
          <p className="text-muted-foreground mt-1">Manage your {category?.name || 'items'} securely here.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New {category?.name}</DialogTitle>
              <DialogDescription>
                Add a new item to your {category?.name} collection. Sensitive fields will be encrypted.
              </DialogDescription>
            </DialogHeader>
            <AddItemForm
              categoryName={category?.name || 'Item'}
              onSubmit={handleAddItem}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-24 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-accent flex items-center justify-center text-muted-foreground mb-4">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No items added yet</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Get started by adding your first {category?.name || 'document'} to keep it securely in DB Locker.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-6 gap-2">
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New {category?.name}</DialogTitle>
                <DialogDescription>
                  Add a new item to your {category?.name} collection. Sensitive fields will be encrypted.
                </DialogDescription>
              </DialogHeader>
              <AddItemForm
                categoryName={category?.name || 'Item'}
                onSubmit={handleAddItem}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <Card key={item._id} className="overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => !open && setEditingItem(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </DialogTrigger>
                  {editingItem && (
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit {category?.name}</DialogTitle>
                        <DialogDescription>
                          Update your {category?.name} details securely.
                        </DialogDescription>
                      </DialogHeader>
                      <EditItemForm
                        categoryName={category?.name || 'Item'}
                        itemTitle={editingItem.title}
                        itemFields={editingItem.fields.map(f => ({
                          key: f.key,
                          value: f.value,
                          isEncrypted: f.isEncrypted ?? false,
                        }))}
                        itemPhotoUrl={editingItem.photoUrl}
                        onSubmit={handleUpdateItem}
                        isLoading={isSubmitting}
                      />
                    </DialogContent>
                  )}
                </Dialog>

                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeletingItem(item)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>

              <CardHeader className="bg-accent/30 border-b pb-4">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>Added on {new Date(item.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {item.photoUrl && (
                  <div className="rounded-lg overflow-hidden bg-accent/20">
                    <img 
                      src={item.photoUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {item.fields.map((field: any) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field.key}</label>
                    <div className="flex items-center justify-between bg-accent/20 rounded-md p-2">
                      <span className="text-sm font-mono truncate">
                        {field.isEncrypted && !showSensitive[`${item._id}-${field.key}`] 
                          ? '••••••••••••••••' 
                          : field.value}
                      </span>
                      {field.isEncrypted && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => toggleSensitive(item._id, field.key)}
                        >
                          {showSensitive[`${item._id}-${field.key}`] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        itemTitle={deletingItem?.title || ''}
        onConfirm={handleDeleteItem}
        isLoading={isSubmitting}
      />
    </div>
  );
}
