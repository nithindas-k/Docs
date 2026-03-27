import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { PersonFormCard } from "../components/ui/person-form-card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addPerson, updatePerson, deletePerson, Person } from "../features/personSlice";
import { ProfileSelector } from "../components/ui/profile-selector";

export function Persons() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { persons, loading, isAdding } = useAppSelector((state) => state.persons);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const handleAddSubmit = async (data: { name: string; imageFile?: File }) => {
    try {
      await dispatch(addPerson(data)).unwrap();
      setIsAddDialogOpen(false);
      toast.success(`${data.name} profile has been created!`);
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  const handleEditSubmit = async (data: { name: string; imageFile?: File }) => {
    if (!editingPerson) return;
    try {
      await dispatch(updatePerson({ id: editingPerson._id, data })).unwrap();
      setEditingPerson(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async (id: string) => {
    const person = persons.find(p => p._id === id);
    if (!person) return;
    if (!confirm(`Are you sure you want to delete ${person.name}'s profile? All linked documents will remain but the profile association will be lost.`)) return;
    try {
      await dispatch(deletePerson(id)).unwrap();
      toast.success("Profile deleted successfully");
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  // Format persons for the ProfileSelector
  const profiles = persons.map(p => ({
    id: p._id,
    label: p.name,
    icon: p.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}&backgroundColor=111,222,333&fontFamily=Inter&fontWeight=700&fontSize=40`
  }));

  return (
    <div className="flex flex-col gap-6 w-full py-4">
      {/* Header - Minimal and centered above profiles */}
      <div className="flex flex-col items-center mb-0 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm border-2 border-primary/5">
            <Users className="h-7 w-7" />
          </div>
          <p className="text-muted-foreground font-bold tracking-[0.2em] text-[10px] uppercase opacity-60">
            Secure Member Gate
          </p>
      </div>
      
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 gap-4">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary/30 border-t-2 border-t-primary" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Establishing Trust...</p>
        </div>
      ) : persons.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-700">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/30 border-4 border-dashed border-muted mb-8 text-muted-foreground/40">
            <Plus className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Empty Vault</h2>
          <p className="text-muted-foreground max-w-[360px] mb-10 text-sm font-medium leading-relaxed">
            Create your first family member profile to start organizing secure documents.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-2xl h-12 px-10 gap-2 font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg hover:translate-y-[-2px] transition-all duration-300">
            <Plus className="h-4 w-4" />
            Initialize Vault
          </Button>
        </div>
      ) : (
        <ProfileSelector 
          title="Choose a person"
          profiles={profiles}
          onProfileSelect={(id) => navigate(`/persons/${id}`)}
          onProfileEdit={(id) => setEditingPerson(persons.find(p => p._id === id) || null)}
          onProfileDelete={handleDelete}
          onAddProfile={() => setIsAddDialogOpen(true)}
          className="animate-in fade-in duration-1000 slide-in-from-bottom-6"
        />
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg items-center flex justify-center focus:outline-none focus-visible:outline-none">
          <div className="w-full">
            <DialogHeader className="sr-only">
              <DialogTitle>Add Family Profile</DialogTitle>
            </DialogHeader>
            <PersonFormCard
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAddDialogOpen(false)}
              isLoading={isAdding}
              className="w-full md:w-[450px]"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingPerson} onOpenChange={(open) => !open && setEditingPerson(null)}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg items-center flex justify-center focus:outline-none focus-visible:outline-none">
          <div className="w-full">
             <DialogHeader className="sr-only">
                <DialogTitle>Edit Family Profile</DialogTitle>
              </DialogHeader>
            {editingPerson && (
              <PersonFormCard
                initialData={{ name: editingPerson.name, imageUrl: editingPerson.imageUrl }}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingPerson(null)}
                isLoading={isAdding}
                className="w-full md:w-[450px]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
