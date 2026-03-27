import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus, Files, ShieldCheck, Loader2, Search, ChevronRight, ArrowLeft } from "lucide-react";
import { ResourceCardsGrid } from "../components/ui/cards-grid";
import { InsuranceCard } from "../components/ui/insurance-card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AddItemForm } from "../components/AddItemForm";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { fetchItemsByPerson } from "../features/itemSlice";
import { setCurrentPerson } from "../features/authSlice";
import { api } from "../services/api";
import { API_ROUTES } from "../constants";
import { toast } from "sonner";

export function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { persons, loading: personsLoading } = useAppSelector((state) => state.persons);
  const itemsState = useAppSelector((state) => state.items);
  const categories = useAppSelector((state) => state.categories.categories);

  const person = persons.find(p => p._id === id);
  const personItems = itemsState.itemsByPerson[id || ""] || [];
  const personName = person?.name || "Family Member";

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, name: string } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemsByPerson(id));
      dispatch(setCurrentPerson(id));
    }
  }, [id, dispatch]);

  const groupedCategories = categories.filter(cat => 
    personItems.some(item => item.category === cat._id)
  );

  const activeCategoryItems = personItems.filter(item => 
    activeCategoryId ? item.category === activeCategoryId : false
  );
  const activeCategory = categories.find(c => c._id === activeCategoryId);

  const handleAddDocument = async (data: { title: string; fields: any[]; photoFiles?: File[] }) => {
    if (!selectedCategory || !id) return;
    setIsAdding(true);
    try {
      const formData = new FormData();
      formData.append("category", selectedCategory.id);
      formData.append("title", data.title);
      formData.append("fields", JSON.stringify(data.fields));
      formData.append("person", id);
      
      if (data.photoFiles && data.photoFiles.length > 0) {
        data.photoFiles.forEach(file => {
          formData.append("photos", file);
        });
      }

      await api.postFormData(API_ROUTES.ITEM.BASE, formData);

      toast.success(`${data.title} added to collection`);
      setIsAddModalOpen(false);
      setSelectedCategory(null);
      dispatch(fetchItemsByPerson(id));
    } catch (error) {
      toast.error("Failed to add document");
    } finally {
      setIsAdding(false);
    }
  };

  if (personsLoading) {
    return (
      <div className="flex justify-center p-20 w-full">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h2 className="text-xl font-bold">Person not found</h2>
        <Button onClick={() => navigate("/persons")} className="mt-4">Go Back to Family</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full pb-16">
      <InsuranceCard 
        clientName={personName}
        avatarSrc={person?.imageUrl || ""}
        onBack={() => navigate("/persons")}
        rightActions={
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder="Search archive..."
                className="w-48 bg-muted/40 border rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:ring-1 focus:outline-none focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl h-10 flex-1 sm:flex-none px-6 gap-2 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-[0.1em] transition-all hover:translate-y-[-2px] active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4" />
                    NEW DOC
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[92vw] sm:max-w-2xl bg-background border shadow-xl rounded-3xl p-5 sm:p-8">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight mb-1">Select Category</DialogTitle>
                    <p className="text-muted-foreground text-[11px] font-semibold opacity-80">Choose an archive for {personName}.</p>
                  </DialogHeader>
                  <div className="relative mt-6 sm:mt-8 mb-4 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      className="w-full bg-accent/30 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4 max-h-[45vh] sm:max-h-[400px] overflow-y-auto pr-2 scrollbar-hide py-2">
                    {categories.filter(cat => cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())).map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setSelectedCategory({ id: cat._id, name: cat.name });
                          setIsCategoryModalOpen(false);
                          setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border bg-card hover:bg-accent transition-all group text-left"
                      >
                        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                          <Files className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-[11px] sm:text-sm tracking-tight text-foreground/80 lowercase first-letter:uppercase truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="w-[92vw] sm:max-w-2xl bg-background border rounded-3xl p-5 sm:p-8 max-h-[85vh] overflow-y-auto scrollbar-hide">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight mb-1">
                      New {selectedCategory?.name}
                    </DialogTitle>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">
                      Adding Secure Data
                    </p>
                  </DialogHeader>
                  <div className="mt-6 sm:mt-8">
                    <AddItemForm 
                      categoryName={selectedCategory?.name || ""}
                      onSubmit={handleAddDocument}
                      onBack={() => {
                        setIsAddModalOpen(false);
                        setIsCategoryModalOpen(true);
                      }}
                      isLoading={isAdding}
                    />
                  </div>
                </DialogContent>
            </Dialog>
          </div>
        }
      >
        <div className="flex flex-col gap-10 w-full pt-4">
          <div className="flex items-baseline justify-between border-b pb-4">
            <h3 className="text-lg font-bold tracking-tight text-foreground/90 flex items-center gap-3">
              {activeCategoryId && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setActiveCategoryId(null)}
                  className="rounded-lg hover:bg-accent h-8 w-8 border"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {activeCategoryId ? activeCategory?.name : "Document Archive"}
            </h3>
            {activeCategoryId && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {activeCategoryItems.length} Records Saved
                </span>
            )}
          </div>

          <div className="w-full">
            {activeCategoryId ? (
                <ResourceCardsGrid items={activeCategoryItems.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())).map(item => ({
                  icon: <ShieldCheck className="w-5 h-5 text-muted-foreground" />,
                  iconSrc: item.photoUrl,
                  title: item.title,
                  lastUpdated: new Date(item.createdAt).toLocaleDateString("en-GB", { 
                    day: "numeric", 
                    month: "short", 
                    year: "numeric" 
                  }),
                  href: `/item/${item._id}`,
                }))} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupedCategories.length > 0 ? (
                      groupedCategories.map((cat) => (
                        <div 
                          key={cat._id}
                          onClick={() => setActiveCategoryId(cat._id)}
                          className="group relative cursor-pointer flex items-center justify-between p-4 rounded-2xl border bg-card hover:bg-accent transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                              <div className="h-11 w-11 rounded-xl border bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                <Files className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col group-hover:translate-x-1 transition-transform duration-200">
                                <h4 className="text-sm font-bold tracking-tight text-foreground/80 lowercase first-letter:uppercase">
                                  {cat.name}
                                </h4>
                                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tight mt-1">
                                  {personItems.filter(i => i.category === cat._id).length} Records
                                </p>
                              </div>
                          </div>
                          <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-4px] transition-all">
                              <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="col-span-full text-center p-16 rounded-3xl border-2 border-dashed border-border/80 flex flex-col items-center gap-4 bg-muted/5">
                        <div className="h-12 w-12 rounded-full border bg-muted flex items-center justify-center text-muted-foreground/40">
                          <Plus className="h-6 w-6" />
                        </div>
                        <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest text-center">Your private vault is currently empty.</p>
                    </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </InsuranceCard>
    </div>
  );
}
