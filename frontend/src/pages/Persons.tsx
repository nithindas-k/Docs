import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Link2, Bell, Check, X, Unlink } from "lucide-react";
import { PersonFormCard } from "../components/ui/person-form-card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addPerson, updatePerson, deletePerson, Person } from "../features/personSlice";
import {
  sendLinkRequest,
  fetchPendingRequests,
  fetchLinkedUsers,
  respondToRequest,
  disconnectUser,
} from "../features/connectionSlice";
import { ProfileSelector } from "../components/ui/profile-selector";
import AnimatedShaderBackground from "../components/ui/animated-shader-background";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";

export function Persons() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { persons, loading, isAdding } = useAppSelector((state) => state.persons);
  const { linkedUsers, pendingRequests } = useAppSelector((state) => state.connections);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkEmail, setLinkEmail] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [showPendingPanel, setShowPendingPanel] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchLinkedUsers());
    dispatch(fetchPendingRequests());
  }, [dispatch]);

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

  const handleDelete = async () => {
    if (!deletingPerson) return;
    setIsDeleting(true);
    try {
      await dispatch(deletePerson(deletingPerson._id)).unwrap();
      toast.success(`${deletingPerson.name}'s profile deleted`);
      setDeletingPerson(null);
    } catch (error) {
      toast.error("Failed to delete profile");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendLinkRequest = async () => {
    if (!linkEmail.trim()) return;
    setIsSendingLink(true);
    try {
      await dispatch(sendLinkRequest(linkEmail.trim())).unwrap();
      toast.success("Link request sent!");
      setLinkEmail("");
      setIsLinkModalOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to send request");
    } finally {
      setIsSendingLink(false);
    }
  };

  const handleRespond = async (id: string, action: "accept" | "reject") => {
    try {
      await dispatch(respondToRequest({ id, action })).unwrap();
      if (action === "accept") {
        toast.success("Connection accepted! Their vault is now linked.");
        dispatch(fetchLinkedUsers());
      } else {
        toast.success("Request rejected.");
      }
    } catch {
      toast.error("Failed to respond to request");
    }
  };

  const handleDisconnect = async (connectionId: string, name: string) => {
    try {
      await dispatch(disconnectUser(connectionId)).unwrap();
      toast.success(`Disconnected from ${name}`);
      setDisconnectingId(null);
    } catch {
      toast.error("Failed to disconnect");
    }
  };

  const profiles = persons.map((p) => ({
    id: p._id,
    label: p.name,
    icon: p.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}&backgroundColor=111,222,333&fontFamily=Inter&fontWeight=700&fontSize=40`,
    badge: undefined as string | undefined,
  }));

  const linkedProfiles = linkedUsers.map((lu) => ({
    id: `linked-${lu.connectionId}`,
    label: lu.user.name,
    icon: lu.user.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${lu.user.name}&backgroundColor=001,030,060&fontFamily=Inter&fontWeight=700&fontSize=40`,
    badge: "Linked" as string | undefined,
    isLinked: true,
    connectionId: lu.connectionId,
  }));

  const allProfiles = [...profiles, ...linkedProfiles];

  return (
    <div className="flex flex-col gap-6 w-full py-4 relative z-10">
      <AnimatedShaderBackground />

      {/* Header */}
      <div className="flex flex-col items-center mb-0 transition-all duration-700 animate-in fade-in slide-in-from-top-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm border-2 border-primary/5">
          <Users className="h-7 w-7" />
        </div>
        <p className="text-muted-foreground font-bold tracking-[0.2em] text-[10px] uppercase opacity-60">
          Secure Member Gate
        </p>

        {/* Action Row: Link Vault + Notifications */}
        <div className="flex items-center gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-bold rounded-xl border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => setIsLinkModalOpen(true)}
          >
            <Link2 className="h-3.5 w-3.5" />
            Link Vault
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="relative gap-2 text-xs font-bold rounded-xl"
            onClick={() => setShowPendingPanel((p) => !p)}
          >
            <Bell className="h-3.5 w-3.5" />
            Invites
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Pending Requests Panel */}
      {showPendingPanel && (
        <div className="rounded-2xl border border-border bg-background shadow-md mx-auto w-full max-w-lg animate-in slide-in-from-top-3 duration-300">
          <div className="p-4 border-b">
            <h3 className="text-sm font-bold">Incoming Vault Link Requests</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review and respond to users who want to link with your vault.
            </p>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-xs font-medium">
              No pending requests 🎉
            </div>
          ) : (
            <ul className="divide-y">
              {pendingRequests.map((req) => (
                <li key={req._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-3">
                    {req.fromUser.picture ? (
                      <img src={req.fromUser.picture} className="h-9 w-9 rounded-full object-cover border" alt={req.fromUser.name} />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 border flex items-center justify-center font-bold text-primary text-sm">
                        {req.fromUser.name[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{req.fromUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{req.fromUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <Button
                      size="sm"
                      className="h-8 rounded-xl gap-1.5 text-xs font-bold flex-1 sm:flex-none"
                      onClick={() => handleRespond(req._id, "accept")}
                    >
                      <Check className="h-3.5 w-3.5" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-xl gap-1.5 text-xs font-bold text-destructive border-destructive/20 hover:bg-destructive/10 flex-1 sm:flex-none"
                      onClick={() => handleRespond(req._id, "reject")}
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary/30 border-t-2 border-t-primary" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
            Establishing Trust...
          </p>
        </div>
      ) : allProfiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-700">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/30 border-4 border-dashed border-muted mb-8 text-muted-foreground/40">
            <Plus className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Empty Vault</h2>
          <p className="text-muted-foreground max-w-[360px] mb-10 text-sm font-medium leading-relaxed">
            Create your first family member profile or link a friend's vault to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="rounded-2xl h-10 px-6 gap-2 font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg hover:translate-y-[-2px] transition-all duration-300 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsLinkModalOpen(true)}
              className="rounded-2xl h-10 px-6 gap-2 font-bold uppercase tracking-[0.15em] text-[10px] hover:translate-y-[-2px] transition-all border-primary/30 text-primary w-full sm:w-auto"
            >
              <Link2 className="h-4 w-4" />
              Link Vault
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-700">
          <ProfileSelector
            title="Choose a person"
            profiles={allProfiles}
            onProfileSelect={(id) => {
              const linkedProfile = linkedProfiles.find((lp) => lp.id === id);
              if (linkedProfile) {
                navigate(`/linked/${linkedProfile.connectionId}`);
              } else {
                navigate(`/persons/${id}`);
              }
            }}
            onProfileEdit={(id) => {
              const lp = linkedProfiles.find((lp) => lp.id === id);
              if (lp) return;
              setEditingPerson(persons.find((p) => p._id === id) || null);
            }}
            onProfileDelete={(id) => {
              const lp = linkedProfiles.find((lp) => lp.id === id);
              if (lp) {
                setDisconnectingId(lp.connectionId);
              } else {
                setDeletingPerson(persons.find((p) => p._id === id) || null);
              }
            }}
            onAddProfile={() => setIsAddDialogOpen(true)}
            className="animate-in fade-in duration-1000 slide-in-from-bottom-6"
          />

          {/* Linked Vaults separate section if any */}
          {linkedUsers.length > 0 && (
            <div className="mx-auto max-w-lg px-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
                🔗 Linked Vaults ({linkedUsers.length})
              </p>
              <div className="space-y-2">
                {linkedUsers.map((lu) => (
                  <div
                    key={lu.connectionId}
                    className="flex items-center justify-between rounded-2xl border p-3 bg-background hover:bg-muted/30 cursor-pointer transition-all group"
                    onClick={() => navigate(`/linked/${lu.connectionId}`)}
                  >
                    <div className="flex items-center gap-3">
                      {lu.user.picture ? (
                        <img
                          src={lu.user.picture}
                          className="h-9 w-9 rounded-full object-cover border-2 border-primary/10"
                          alt={lu.user.name}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-primary/10 border flex items-center justify-center font-bold text-primary text-sm">
                          {lu.user.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold">{lu.user.name}</p>
                        <p className="text-xs text-muted-foreground">{lu.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-primary/60 bg-primary/10 border border-primary/10 rounded-full px-2 py-0.5 uppercase tracking-widest">
                        View Vault
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDisconnectingId(lu.connectionId);
                        }}
                      >
                        <Unlink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Family Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none w-[92vw] sm:max-w-lg items-center flex justify-center focus:outline-none focus-visible:outline-none">
          <div className="w-full">
            <DialogHeader className="sr-only">
              <DialogTitle>Add Family Profile</DialogTitle>
            </DialogHeader>
            <PersonFormCard
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAddDialogOpen(false)}
              isLoading={isAdding}
              className="w-full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingPerson} onOpenChange={(open) => !open && setEditingPerson(null)}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none w-[92vw] sm:max-w-lg items-center flex justify-center focus:outline-none focus-visible:outline-none">
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
                className="w-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Vault Dialog */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Link2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Link a Vault</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Enter a friend's Gmail address. If they're on Docs, they'll receive a link request and can accept or reject it. Once accepted, you can view their shared documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="friend@gmail.com"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendLinkRequest()}
              className="rounded-xl"
            />
            <Button
              className="w-full rounded-xl font-bold"
              disabled={!linkEmail.trim() || isSendingLink}
              onClick={handleSendLinkRequest}
            >
              {isSendingLink ? "Sending..." : "Send Link Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Local Person */}
      <DeleteConfirmDialog
        open={!!deletingPerson}
        onOpenChange={(open) => !open && setDeletingPerson(null)}
        itemTitle={deletingPerson?.name || ""}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        type="Profile"
      />

      {/* Disconnect Linked User */}
      {disconnectingId && (() => {
        const lu = linkedUsers.find((u) => u.connectionId === disconnectingId);
        return (
          <DeleteConfirmDialog
            open={!!disconnectingId}
            onOpenChange={(open) => !open && setDisconnectingId(null)}
            itemTitle={lu ? `${lu.user.name}'s vault link` : "this connection"}
            onConfirm={() => handleDisconnect(disconnectingId, lu?.user.name || "")}
            isLoading={false}
            type="Connection"
          />
        );
      })()}
    </div>
  );
}


