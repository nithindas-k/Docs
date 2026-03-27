import { useState } from "react";
import { MoreVertical, Edit2, Trash, Plus, Users } from "lucide-react";
import { PersonFormCard } from "../components/ui/person-form-card";
import { ResourceCardsGrid } from "../components/ui/cards-grid";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addPerson, updatePerson, deletePerson, Person } from "../features/personSlice";



export function Persons() {
  const dispatch = useAppDispatch();
  const { persons, loading, isAdding } = useAppSelector((state) => state.persons);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);



  const handleAddSubmit = async (data: { name: string; imageUrl?: string }) => {
    try {
      await dispatch(addPerson(data)).unwrap();
      setIsAddDialogOpen(false);
      toast.success(`${data.name} profile has been created!`);
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  const handleEditSubmit = async (data: { name: string; imageUrl?: string }) => {
    if (!editingPerson) return;
    try {
      await dispatch(updatePerson({ id: editingPerson._id, data })).unwrap();
      setEditingPerson(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s profile? All linked documents will remain but the profile association will be lost.`)) return;
    try {
      await dispatch(deletePerson(id)).unwrap();
      toast.success("Profile deleted successfully");
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Family Profiles
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Manage document profiles for your family members and loved ones.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shadow-sm gap-2 whitespace-nowrap">
              <Plus className="w-5 h-5" />
              Add Person
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg min-h-[0] items-center flex justify-center h-auto sm:h-auto overflow-hidden sm:overflow-visible my-auto focus:outline-none focus-visible:outline-none sm:rounded-none m-0">
            <div className="w-full overflow-y-auto max-h-[90vh] sm:max-h-none sm:overflow-visible scrollbar-hide flex flex-col justify-end sm:justify-center mt-auto sm:mt-0 pb-0 sm:pb-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Add Family Profile</DialogTitle>
              </DialogHeader>
              <PersonFormCard
                onSubmit={handleAddSubmit}
                onCancel={() => setIsAddDialogOpen(false)}
                isLoading={isAdding}
                className="w-full mx-auto md:w-[450px]"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPerson} onOpenChange={(open) => !open && setEditingPerson(null)}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none w-full max-w-lg min-h-[0] items-center flex justify-center h-auto sm:h-auto overflow-hidden sm:overflow-visible my-auto focus:outline-none focus-visible:outline-none sm:rounded-none m-0">
          <div className="w-full overflow-y-auto max-h-[90vh] sm:max-h-none sm:overflow-visible scrollbar-hide flex flex-col justify-end sm:justify-center mt-auto sm:mt-0 pb-0 sm:pb-0">
             <DialogHeader className="sr-only">
                <DialogTitle>Edit Family Profile</DialogTitle>
              </DialogHeader>
            {editingPerson && (
              <PersonFormCard
                initialData={{ name: editingPerson.name, imageUrl: editingPerson.imageUrl }}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingPerson(null)}
                isLoading={isAdding}
                className="w-full mx-auto md:w-[450px]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : persons.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 mt-8 text-center bg-card border border-dashed rounded-xl w-full max-w-full">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4 text-primary">
            <Users className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-foreground">No Family Profiles Yet</h2>
          <p className="text-muted-foreground max-w-[400px] mb-6">
            Create profiles for your family members to securely organize and store their sensitive documents.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Person
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <ResourceCardsGrid 
            items={persons.map(person => ({
               icon: (
                  <Avatar className="h-10 w-10 border-2 border-primary/20 bg-primary/5 shadow-sm">
                    <AvatarImage src={person.imageUrl} alt={person.name} />
                    <AvatarFallback className="font-bold text-primary">
                      {person.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
               ),
               title: person.name,
               lastUpdated: `Collection Ready`,
               href: `/persons/${person._id}`,
               actions: (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 backdrop-blur-md bg-background/80">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingPerson(person);
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(person._id, person.name);
                      }}
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
               )
            }))}
          />
        </div>
      )}
    </div>
  );
}
