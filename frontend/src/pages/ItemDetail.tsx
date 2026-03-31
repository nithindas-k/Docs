import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { fetchItemById, updateItem, deleteItem } from "../features/itemSlice";
import { EditItemForm } from "../components/EditItemForm";
import { 
  ArrowLeft, 
  Copy, 
  Check,
  Eye, 
  Loader2,
  Trash2,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { Button } from "../components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleCopy}
      className={cn(
        "h-8 w-8 ml-2 transition-colors",
        copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { itemsById, loadingItem } = useAppSelector((state) => state.items);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const categories = useAppSelector((state) => state.categories.categories);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const item = id ? itemsById[id] : null;
  const category = categories.find(c => c._id === item?.category);
  // If item.user doesn't match current user, it's a linked (read-only) item
  const isReadOnly = !!(item?.user && authUser?._id && item.user !== authUser._id);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (!id || !item) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteItem(id)).unwrap();
      toast.success(`${item.title} deleted successfully`);
      navigate(-1);
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };


  const handleEditSubmit = async (data: { title: string; fields: any[]; photoFiles?: File[] }) => {
    if (!id) return;
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('fields', JSON.stringify(data.fields));

      if (data.photoFiles && data.photoFiles.length > 0) {
        data.photoFiles.forEach(file => {
          formData.append('photos', file);
        });
      }

      await dispatch(updateItem({ id, data: formData })).unwrap();
      toast.success(`${data.title} updated successfully`);
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update item");
    }
  };


  if (loadingItem && !item) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!item) return null;

  let allPhotos = [...(item.photoUrls || [])];
  if (item.photoUrl && !allPhotos.includes(item.photoUrl)) {
    allPhotos.unshift(item.photoUrl);
  }
  allPhotos = [...allPhotos].reverse();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full border h-8 w-8 sm:h-9 sm:w-9 shrink-0 mt-1 sm:mt-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] truncate">{category?.name}</p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{item.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isReadOnly ? (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 uppercase tracking-widest">
              View Only
            </span>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 sm:h-9 flex-1 sm:flex-none px-3 sm:px-4 gap-2 text-[10px] sm:text-xs font-semibold rounded-lg"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-3.5 w-3.5" /> EDIT
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 sm:h-9 flex-1 sm:flex-none px-3 sm:px-4 gap-2 text-[10px] sm:text-xs font-semibold rounded-lg text-destructive hover:bg-destructive/5"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" /> DELETE
              </Button>
            </>
          )}

        </div>
      </div>

      {/* 1. Images First (Horizontal Listing) */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Document Scans {allPhotos.length > 0 && `(${allPhotos.length})`}</h3>
        {allPhotos.length > 0 ? (
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {allPhotos.map((url, idx) => (
              <div key={idx} className="relative group flex-shrink-0 bg-muted/30 border rounded-xl overflow-hidden h-40 sm:h-48 w-64 sm:w-72 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                <img src={url} alt="scan" className="h-full w-full object-contain p-3 sm:p-4" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-full h-8 sm:h-9 px-3 sm:px-4 text-[9px] sm:text-[10px] font-bold tracking-widest bg-background/80"
                    onClick={() => {
                      setActivePhotoIndex(idx);
                      setIsPhotoModalOpen(true);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 mr-2" /> VIEW
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 sm:h-48 w-full rounded-xl border border-dashed flex items-center justify-center bg-muted/5">
             <p className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest">No scans attached</p>
          </div>
        )}
      </div>

      {/* 2. Table Next */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Information Details</h3>
        <div className="border rounded-xl overflow-hidden bg-background">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-3 sm:py-4 px-3 sm:px-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-[30%] sm:w-1/4">Label</TableHead>
                <TableHead className="py-3 sm:py-4 px-3 sm:px-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {item.fields.map((field, i) => (
                <TableRow key={i} className="hover:bg-muted/5">
                  <TableCell className="py-3 sm:py-4 px-3 sm:px-6 text-[10px] sm:text-xs font-bold text-muted-foreground/70 uppercase break-words leading-relaxed">{field.key || 'Detail'}</TableCell>
                  <TableCell className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-start justify-between text-xs sm:text-sm font-semibold tracking-tight font-mono group gap-2">
                      <span className="text-foreground break-all sm:break-words leading-relaxed flex-1">{field.value}</span>
                      <CopyButton value={field.value} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Full Size Image Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 border-none bg-black/5 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img 
              src={allPhotos[activePhotoIndex]} 
              alt="Full Document Scan" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Form Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {category?.name || 'Item'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EditItemForm 
              categoryName={category?.name || 'Document'} 
              itemTitle={item.title} 
              itemFields={item.fields.map(f => ({ ...f, isEncrypted: !!f.isEncrypted }))}
              itemPhotoUrl={item.photoUrls?.[0] || item.photoUrl}
              onSubmit={handleEditSubmit}
              isLoading={loadingItem}
            />
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        itemTitle={item.title}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
