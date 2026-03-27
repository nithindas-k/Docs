import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../features/store';
import { fetchItemsByCategory } from '../features/itemSlice';
import { Button } from '../components/ui/button';
import { Plus, Camera, Edit2, Trash2, ShieldCheck } from 'lucide-react';
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
import { ResourceCardsGrid } from '../components/ui/cards-grid';
import { api } from '../services/api';
import { API_ROUTES } from '../constants';
import type { Item } from '../features/itemSlice';

export function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
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
        <ResourceCardsGrid items={items.map(item => ({
          icon: <ShieldCheck className="w-5 h-5 text-primary" />,
          iconSrc: item.photoUrl,
          title: item.title,
          lastUpdated: new Date(item.createdAt).toLocaleDateString("en-GB", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
          }),
          href: `/item/${item._id}`,
          actions: (
            <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setEditingItem(item)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => setDeletingItem(item)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        }))} />
      )}

      <Dialog open={editingItem?._id !== undefined && editingItem?._id !== null} onOpenChange={(open) => !open && setEditingItem(null)}>
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
