import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { api } from "../services/api";
import { API_ROUTES } from "../constants";
import { disconnectUser, fetchLinkedUsers } from "../features/connectionSlice";
import type { Item } from "../features/itemSlice";
import { ArrowLeft, ShieldCheck, Unlink, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { ResourceCardsGrid } from "../components/ui/cards-grid";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { toast } from "sonner";

export function LinkedVaultDetail() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { linkedUsers } = useAppSelector((state) => state.connections);
  const categories = useAppSelector((state) => state.categories.categories);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const linked = linkedUsers.find((u) => u.connectionId === connectionId);

  useEffect(() => {
    if (!linked) return;
    setLoading(true);
    api
      .get<{ data: Item[] }>(API_ROUTES.CONNECTION.LINKED_ITEMS(linked.user._id))
      .then((res) => setItems(res.data))
      .catch(() => toast.error("Failed to load vault"))
      .finally(() => setLoading(false));
  }, [linked]);

  const handleDisconnect = async () => {
    if (!connectionId) return;
    setIsDisconnecting(true);
    try {
      await dispatch(disconnectUser(connectionId)).unwrap();
      await dispatch(fetchLinkedUsers());
      toast.success("Disconnected successfully");
      navigate("/persons");
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setIsDisconnecting(false);
      setIsDisconnectOpen(false);
    }
  };

  if (!linked) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h2 className="text-xl font-bold">Connection not found</h2>
        <Button onClick={() => navigate("/persons")} className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  // Group items by category
  const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
    const catId = item.category;
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8 w-full pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border h-9 w-9"
            onClick={() => navigate("/persons")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            {linked.user.picture ? (
              <img
                src={linked.user.picture}
                alt={linked.user.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/10 flex items-center justify-center text-primary font-bold">
                {linked.user.name[0]}
              </div>
            )}
            <div>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                Linked Vault — Read Only
              </p>
              <h1 className="text-xl font-bold tracking-tight">{linked.user.name}</h1>
              <p className="text-xs text-muted-foreground">{linked.user.email}</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2 text-xs font-bold"
          onClick={() => setIsDisconnectOpen(true)}
        >
          <Unlink className="h-4 w-4" />
          Disconnect
        </Button>
      </div>

      {/* Read-Only Banner */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-3 flex items-center gap-3">
        <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          You are viewing {linked.user.name}'s vault in <strong>read-only mode</strong>. You can view documents but cannot add, edit, or modify their data.
        </p>
      </div>

      {/* Items grouped by category */}
      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-24 text-center flex flex-col items-center gap-3">
          <ShieldCheck className="h-10 w-10 text-muted-foreground/20" />
          <p className="text-sm font-semibold text-muted-foreground/50">
            {linked.user.name} has no documents in their vault yet.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([catId, catItems]) => {
            const cat = categories.find((c) => c._id === catId);
            return (
              <div key={catId} className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">
                    {cat?.name || "Documents"}
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    {catItems.length} records
                  </span>
                </div>
                <ResourceCardsGrid
                  items={catItems.map((item) => ({
                    icon: <ShieldCheck className="w-5 h-5 text-primary/60" />,
                    iconSrc: item.photoUrl,
                    title: item.title,
                    lastUpdated: new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }),
                    href: `/item/${item._id}`,
                  }))}
                />
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirmDialog
        open={isDisconnectOpen}
        onOpenChange={setIsDisconnectOpen}
        itemTitle={`${linked.user.name}'s vault link`}
        onConfirm={handleDisconnect}
        isLoading={isDisconnecting}
        type="Connection"
      />
    </div>
  );
}
