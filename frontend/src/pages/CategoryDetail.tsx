import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../features/store';
import { fetchItemsByCategory, updateItem } from '../features/itemSlice';
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
import { toast } from 'sonner';
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
  const { persons } = useSelector((state: RootState) => state.persons);
  const rawItems = useSelector((state: RootState) => state.items.itemsByCategory[id || '']) || [];
  
  
  const items = rawItems.filter(item => !item.person);
  
  const category = categories.find(c => c._id === id);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemsByCategory(id));
    }
  }, [id, dispatch]);

  const handleAddItem = async (data: { title: string; fields: Array<{ key: string; value: string; isEncrypted: boolean }>; photoFiles?: File[] }) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category', id);
      formData.append('title', data.title);
      formData.append('fields', JSON.stringify(data.fields));
      


      if (data.photoFiles && data.photoFiles.length > 0) {
        data.photoFiles.forEach(file => {
          formData.append('photos', file);
        });
      }

      await api.postFormData(API_ROUTES.ITEM.BASE, formData);

     
      dispatch(fetchItemsByCategory(id));
      setIsDialogOpen(false);
      toast.success('Document added successfully');
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (data: { title: string; fields: Array<{ key: string; value: string; isEncrypted: boolean }>; photoFiles?: File[] }) => {
    if (!editingItem) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('fields', JSON.stringify(data.fields));
      
      if (data.photoFiles && data.photoFiles.length > 0) {
        data.photoFiles.forEach(file => {
          formData.append('photos', file);
        });
      }

      await dispatch(updateItem({ id: editingItem._id, data: formData })).unwrap();

      // Refresh items list
      if (id) {
        dispatch(fetchItemsByCategory(id));
      }
      setEditingItem(null);
      toast.success('Document updated successfully');
    } catch (error) {
      console.error('Failed to update item:', error);
      toast.error('Failed to update item. Please try again.');
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
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const groupedItems = items.reduce((acc: Record<string, Item[]>, item: Item) => {
    const personId = item.person || 'common';
    if (!acc[personId]) acc[personId] = [];
    acc[personId].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{category?.name || 'Category Options'}</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your {category?.name || 'items'} securely here.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 rounded-2xl px-8 gap-2 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-[0.1em] transition-all hover:translate-y-[-2px] active:scale-[0.98]">
              <Plus className="h-4 w-4" />
              Add {category?.name || 'Item'}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[92vw] sm:max-w-md bg-background border shadow-xl rounded-3xl p-5 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight mb-1">Add New {category?.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">
                Adding to your private collection
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 sm:mt-8">
              <AddItemForm
                categoryName={category?.name || 'Item'}
                onSubmit={handleAddItem}
                isLoading={isSubmitting}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-24 text-center bg-muted/5 flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 mb-2">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground/80 lowercase first-letter:uppercase">No items added yet</h3>
          <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest max-w-xs mx-auto">
            Your private {category?.name || 'document'} archive is currently empty.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.keys(groupedItems).sort((a, b) => (a === 'common' ? 1 : b === 'common' ? -1 : 0)).map((personId) => {
            const member = persons.find(p => p._id === personId);
            const memberItems = groupedItems[personId];
            
            return (
              <div key={personId} className="space-y-6">
                <div className="flex items-center gap-4 border-b pb-4">
                  {member ? (
                    <div className="flex items-center gap-3">
                       <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          {member.imageUrl ? (
                             <img src={member.imageUrl} className="h-full w-full object-cover rounded-full" />
                          ) : (
                             <span className="text-[10px] font-bold text-primary">{member.name[0]}</span>
                          )}
                       </div>
                       <h3 className="text-sm font-bold tracking-tight text-foreground/90 lowercase first-letter:uppercase flex items-center gap-2">
                         {member.name}'s Archive
                         <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest ml-2">
                            {memberItems.length} Records
                         </span>
                       </h3>
                    </div>
                  ) : (
                    <h3 className="text-sm font-bold tracking-tight text-foreground/90 lowercase first-letter:uppercase flex items-center gap-2">
                      Common Archive
                      <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest ml-2">
                         {memberItems.length} Records
                      </span>
                    </h3>
                  )}
                </div>

                <ResourceCardsGrid items={memberItems.map((item: Item) => ({
                  icon: <ShieldCheck className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />,
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
                        className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground/60" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors border"
                        onClick={() => setDeletingItem(item)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground/60" />
                      </Button>
                    </div>
                  )
                }))} />
              </div>
            );
          })}
        </div>
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
